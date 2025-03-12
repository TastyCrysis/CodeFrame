"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CloudUpload, WandSparkles, X } from "lucide-react";
import Image from "next/image";
import React, { ChangeEvent, useState } from "react";

function ImageUpload() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      console.log(files[0]);
      const imageUrl = URL.createObjectURL(files[0]);
      setPreviewUrl(imageUrl);
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
          <h2 className="text-lg font-bold">
            Enter Description about your webpage
          </h2>
          <Textarea
            className="mt-3 h-[300px]"
            placeholder="Write about your webpage"
          />
        </div>
      </div>
      <div className="mt-10 flex justify-center">
        <Button>
          <WandSparkles />
          Convert to Code
        </Button>
      </div>
    </div>
  );
}

export default ImageUpload;
