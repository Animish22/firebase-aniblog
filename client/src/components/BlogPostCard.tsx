import { cn } from "@/lib/utils";
import { Pencil1Icon } from '@radix-ui/react-icons';
import { Link } from "react-router-dom";

interface BlogPostCardProps {
  imageUrl: string;
  title: string;
  content: string;
  id: string;
  canEdit?: boolean
}

export default function BlogPostCard({ id, imageUrl, title, content, canEdit = false }: BlogPostCardProps) {
  const cardBackgroundStyle = {
    backgroundImage: `url('${imageUrl}')`, // Use the imageUrl here
  };
  return (
    <div className="max-w-xs w-full group/card m-2" id={id}>
      <div
        className={cn(
          " cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl  max-w-sm mx-auto backgroundImage flex flex-col justify-between p-4",
          `bg-cover bg-center`
        )}
        style={cardBackgroundStyle}
      >
        <div className="absolute inset-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>

        {canEdit && (
          <Link to={`/blog/${id}/edit`} className="absolute top-2 right-2 z-20">
            <button
              className="flex items-center justify-center p-1 bg-gray-800/50 text-gray-50 rounded-md transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Edit blog post "${title}"`} // Accessibility
            >
            <Pencil1Icon className="w-5 h-5" />
            </button>
          </Link>
        )}
        
        <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
        <div className="text content">
          <h1 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10">
            {title}
          </h1>
          <p className="font-normal text-sm text-gray-50 relative z-10 my-4">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}
