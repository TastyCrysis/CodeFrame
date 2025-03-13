"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";

interface RECORD {
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

  useEffect(() => {
    uid && GetRecordInfo();
  }, [uid]);

  const GetRecordInfo = async () => {
    setLoading(true);
    const result = await axios.get(`/api/wireframe-to-code?uid=${uid}`);
    console.log(result.data);
    const response = result?.data;
    if (response?.code == null) {
      GenerateCode(response);
    }
    if (response?.error) {
      console.log("No Record Found");
    }
    setLoading(false);
  };

  const GenerateCode = async (record: RECORD) => {
    setLoading(true);
    const response = await fetch("/api/ai-model", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: record?.description,
        imageUrl: record?.imageUrl,
        model: record?.model,
      }),
    });
    if (!response.body) return;
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value);
      console.log(text);
    }
    setLoading(false);
  };

  return (
    <div>
      Test
      {loading && <LoaderCircle className="animate-spin" />}
    </div>
  );
}

export default ViewCode;
