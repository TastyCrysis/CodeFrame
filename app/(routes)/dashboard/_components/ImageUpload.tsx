"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CloudUpload, Loader2Icon, WandSparkles, X } from "lucide-react";
import Image from "next/image";
import React, { ChangeEvent, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/configs/firebaseConfig";
import { auth } from "@/configs/firebaseConfig";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useAuthContext } from "@/app/provider";
import { useRouter } from "next/navigation";

function ImageUpload() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<any>();
  const [model, setModel] = useState<string>();
  const [description, setDescription] = useState<string>();
  const { user } = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      console.log(files[0]);
      const imageUrl = URL.createObjectURL(files[0]);
      setFile(files[0]);
      setPreviewUrl(imageUrl);
    }
  };

  const OnConvertToCode = async () => {
    try {
      if (!file || !model || !description) {
        console.log("Please select an image, model, and description");
        return;
      }
      setLoading(true);
      const fileName = Date.now() + ".png";
      const imageRef = ref(storage, "Wireframe_To_Code/" + fileName);
      await uploadBytes(imageRef, file).then((resp) => {
        console.log("Image Uploaded Successfully");
      });

      const imageUrl = await getDownloadURL(imageRef);
      const uid = uuidv4();
      const response = await axios.post(
        "http://localhost:3000/api/wireframe-to-code",
        {
          uid: uid,
          imageUrl: imageUrl,
          model: model,
          description: description,
          email: user?.email,
        }
      );
      console.log("Response:", response.data);
      setLoading(false);
      router.push(`/view-code/${uid}`);
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {!previewUrl ? (
          <div className="p-7 border border-dashed rounded-md shadow-md flex flex-col items-center justify-center">
            <CloudUpload className="h-10 w-10" />
            <h2 className="font-bold text-lg">Upload Image</h2>
            <p className="text-gray-400 mt-3">
              Click Button Select Wireframe Image
            </p>
            <div className="p-5 border border-dashed w-full flex mt-7 justify-center">
              <label
                htmlFor="imageSelect"
                className="cursor-pointer bg-primary text-white px-4 py-2 rounded-md"
              >
                Select Image
              </label>
              <input
                type="file"
                id="imageSelect"
                className="hidden"
                multiple={false}
                onChange={onImageSelect}
              />
            </div>
          </div>
        ) : (
          <div className="p-5 border border-dashed rounded-md shadow-md">
            <Image
              src={previewUrl}
              alt="wireframe"
              width={500}
              height={500}
              className="w-full object-content"
            />
            <X
              className="mt-4 cursor-pointer flex justify-end w-full"
              onClick={() => setPreviewUrl(null)}
            />
          </div>
        )}
        <div className="p-7 border shadow-md rounded-lg">
          <h2 className="text-lg font-bold">Select AI Model</h2>
          <Select onValueChange={(value) => setModel(value)}>
            <SelectTrigger className="w-full my-3">
              <SelectValue placeholder="Select AI Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini-google">Gemini Google</SelectItem>
              <SelectItem value="llama-by-meta">Llama by Meta</SelectItem>
            </SelectContent>
          </Select>
          <h2 className="text-lg font-bold mt-7">
            Enter Description about your webpage
          </h2>
          <Textarea
            className="mt-3 h-[300px]"
            placeholder="Write about your webpage"
            onChange={(event) => setDescription(event?.target.value)}
          />
        </div>
      </div>
      <div className="mt-10 flex justify-center">
        <Button onClick={OnConvertToCode} disabled={loading}>
          {loading ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <WandSparkles />
          )}
          Convert to Code
        </Button>
      </div>
    </div>
  );
}

export default ImageUpload;
