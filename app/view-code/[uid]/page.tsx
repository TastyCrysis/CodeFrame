"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import Constants from "@/data/Constants";
import SelectionDetail from "../_components/SelectionDetail";
import CodeEditor from "../_components/CodeEditor";
import AppHeader from "@/app/_components/AppHeader";

export interface RECORD {
  id: number;
  description: string;
  code: any;
  imageUrl: string;
  model: string;
  createdBy: string;
}

function ViewCode() {
  const { uid } = useParams();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [record, setRecord] = useState<RECORD | null>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    uid && GetRecordInfo();
  }, [uid]);

  const GetRecordInfo = async () => {
    setLoading(true);
    const result = await axios.get(`/api/wireframe-to-code?uid=${uid}`);
    console.log(result.data);
    const response = result?.data;
    setRecord(result?.data);
    if (
      response?.code == null ||
      (response?.code && Object.keys(response.code).length === 0)
    ) {
      GenerateCode(response);
    }
    if (response?.error) {
      console.log("No Record Found");
    }
    setLoading(false);
  };

  const GenerateCode = async (record: RECORD) => {
    setLoading(true);
    console.log("Generating code with:", {
      description: record?.description,
      imageUrl: record?.imageUrl,
      model: record?.model,
    });

    const response = await fetch("/api/ai-model", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: record?.description + " " + Constants.PROMPT,
        imageUrl: record?.imageUrl,
        model: "google/gemini-2.0-pro-exp-02-05:free", // Immer Gemini-Modell verwenden
      }),
    });

    if (!response.body) return;

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder
        .decode(value)
        .replace("```typescript", "")
        .replace("typescript", "")
        .replace("javascript", "")
        .replace("```", "")
        .replace("```javascript", "")
        .replace("jsx", "");
      setCode((prev) => prev + text);
      console.log(text);
    }
    setIsReady(true);
    setLoading(false);
  };

  return (
    <div>
      <AppHeader hideSideBar={true} />
      <div className="grid grid-cols-1 md:grid-cols-5 p-5 gap-10">
        <div>
          <SelectionDetail record={record} />
        </div>
        <div className="col-span-4">
          <CodeEditor code={code} isReady={isReady} />
        </div>
      </div>
    </div>
  );
}

export default ViewCode;
