import { Sidebar } from "@/components/layout/sidebar";
import { DocumentList } from "@/components/documents/document-list";

interface SpacePageProps {
  params: Promise<{ id: string }>;
}

export default async function SpacePage({ params }: SpacePageProps) {
  const { id } = await params;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Space: {id}</h1>
          <p className="text-gray-500 mt-1">Documents in this space</p>
        </div>
        <DocumentList documents={[]} spaceId={id} />
      </div>
    </div>
  );
}
