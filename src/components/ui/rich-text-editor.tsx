"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// Import react-quill dinamicamente para evitar SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "color",
  "background",
];

export function RichTextEditor({ value, onChange, placeholder, label }: Props) {
  const [mounted, setMounted] = useState(false);

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-text">{label}</label>
      )}
      <div className="rich-editor-container">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="bg-surface rounded-xl border border-border"
        />
      </div>
      <style jsx global>{`
        .rich-editor-container .ql-toolbar {
          border-radius: 0.75rem 0.75rem 0 0;
          border-color: #e5e7eb;
          background: #f9fafb;
        }
        .rich-editor-container .ql-container {
          border-radius: 0 0 0.75rem 0.75rem;
          border-color: #e5e7eb;
          min-height: 120px;
          font-size: 1rem;
        }
        .rich-editor-container .ql-editor {
          min-height: 120px;
        }
      `}</style>
    </div>
  );
}
