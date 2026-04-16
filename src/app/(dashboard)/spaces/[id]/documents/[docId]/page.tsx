import { Sidebar } from "@/components/layout/sidebar";
import { DocumentEditor } from "@/components/documents/document-editor";

interface DocumentPageProps {
  params: Promise<{ id: string; docId: string }>;
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  const { id, docId } = await params;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <DocumentEditor
            initialTitle={`Document ${docId}`}
            initialContent="# Start writing here\n\nThis is your document in space **{id}**."
          />
        </div>
      </div>
    </div>
  );
}
