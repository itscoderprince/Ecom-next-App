import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreVertical, Pencil, Link as LinkIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { ADMIN_MEDIA_EDIT } from "@/routes/AdminPanel.route";
import { toast } from "sonner";

const Media = ({
  media,
  handleDelete,
  deleteType,
  selectMedia,
  setSelectMedia,
}) => {
  const handleCheck = () => {
    let newSelectedMedia = [];

    if (selectMedia.includes(media._id)) {
      newSelectedMedia = selectMedia.filter((m) => m !== media._id);
    } else {
      newSelectedMedia = [...selectMedia, media._id];
    }
    setSelectMedia(newSelectedMedia);
  };

  return (
    <div className="border border-gray-200 dark:border-gray-800 relative group rounded overflow-hidden">
      {/* Checkbox on top-left */}
      <div className="absolute top-2 left-2 z-20">
        <Checkbox
          checked={selectMedia.includes(media._id)}
          onCheckedChange={handleCheck}
        />
      </div>

      {/* Dropdown menu on top-right */}
      <div className="absolute top-2 right-2 z-20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 transition-colors cursor-pointer outline-none">
              <MoreVertical className="h-4 w-4 text-white" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {deleteType === "SD" && (
              <>
                <DropdownMenuItem asChild className="cursor-pointer gap-2">
                  <Link href={ADMIN_MEDIA_EDIT(media._id)}>
                    <Pencil className="h-4 w-4" /> Edit
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer gap-2"
                  onSelect={() => {
                    navigator.clipboard.writeText(media.secure_url);
                    toast.success("Link Copied");
                  }}
                >
                  <LinkIcon className="h-4 w-4" /> Copy Link
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuItem
              onClick={() => handleDelete([media._id], deleteType)}
              className="cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30 transition-all duration-200 ease-in-out"
            >
              <Trash2 className="h-4 w-4" />
              {deleteType === "SD" ? "Move Into Trash" : "Delete Permanently"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dark hover overlay */}
      <div className="w-full h-full absolute z-10 transition-all duration-150 ease-in group-hover:bg-black/30 pointer-events-none"></div>

      {/* Image Container */}
      <div className="aspect-square relative">
        <Image
          src={media?.secure_url}
          alt={media.alt || "Image"}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default Media;
