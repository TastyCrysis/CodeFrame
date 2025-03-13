import React from "react";
import Image from "next/image";

function SelectionDetail({ record }: any) {
  return (
    record && (
      <div className="p-5 bg-gray-100 rounded-lg h-[80vh]">
        <h2 className="text-lg font-bold my-2">Wireframe:</h2>
        <Image
          src={record?.imageUrl}
          alt="Wireframe"
          width={300}
          height={400}
          className="rounded-lg object-contain h-[230px] w-full border border-gray-300 border-dashed p-2 bg-white"
        />
        <h2 className="text-lg font-bold mt-6 mb-2">AI Model:</h2>
        <p className="px-2 py-1 bg-white border rounded-md">{record?.model}</p>
        <h2 className="text-lg font-bold mt-6 mb-2">Description:</h2>
        <p className="px-2 py-1 bg-white border rounded-md">
          {record?.description}
        </p>
      </div>
    )
  );
}

export default SelectionDetail;
