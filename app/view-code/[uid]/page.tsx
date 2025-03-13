"use client";

import axios from "axios";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";

function ViewCode() {
  const { uid } = useParams();

  useEffect(() => {
    uid && GetRecordInfo();
  }, [uid]);

  const GetRecordInfo = async () => {
    const result = await axios.get(`/api/wireframe-to-code?uid=${uid}`);
    console.log(result.data);
  };

  return (
    <div>
      <div>Test</div>
    </div>
  );
}

export default ViewCode;
