"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface DocumentEditorProps {
  initialTitle?: string;
  initialContent?: string;
  onSave?: (title: string, content: string) => void;
}

export function DocumentEditor({
  initialTitle = "",
  initialContent = "",
  onSave,
}: DocumentEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Document title"
        className="w-full text-2xl font-bold border-0 focus:outline-none placeholder:text-gray-400"
      />
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your document in Markdown..."
        className="min-h-[400px] font-mono text-sm"
      />
      {onSave && (
        <Button onClick={() => onSave(title, content)}>Save</Button>
      )}
    </div>
  );
}
