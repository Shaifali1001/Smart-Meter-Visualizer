import React, { useRef } from "react";

interface FileUploaderProps {
  onFileRead: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileRead }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileRead(file);
  };

  return (
    <div className="my-8 flex flex-col items-center">
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Upload NEM12 CSV File
      </button>
    </div>
  );
};

export default FileUploader;
