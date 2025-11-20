import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { ADMIN_MEDIA_EDIT } from "@/routes/AdminPanel.route";

import { MdOutlineEdit } from "react-icons/md";
import { IoIosLink } from "react-icons/io";
import { AiOutlineDelete } from "react-icons/ai";
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
          {/* Trigger button (3-dots) */}
          <DropdownMenuTrigger asChild>
            <span className="w-7 h-7 flex items-center justify-center rounded-full bg-black/30 cursor-pointer">
              <MoreVerticalIcon color="#fff" />
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {/* Options only for Standard (SD) items */}
            {deleteType === "SD" && (
              <>
                {/* Edit option */}
                <DropdownMenuItem asChild className="cursor-pointer gap-2">
                  <Link href={ADMIN_MEDIA_EDIT(media._id)}>
                    <MdOutlineEdit /> Edit
                  </Link>
                </DropdownMenuItem>

                {/* Copy media link */}
                <DropdownMenuItem
                  className="cursor-pointer gap-2"
                  onSelect={() => {
                    navigator.clipboard.writeText(media.secure_url);
                    toast.success("Link Copied");
                  }}
                >
                  <IoIosLink /> Copy Link
                </DropdownMenuItem>
              </>
            )}

            {/* Trash or permanent delete */}
            <DropdownMenuItem
              onClick={() => handleDelete([media._id], deleteType)}
              className="cursor-pointer gap-2 hover:text-red-600! hover:bg-red-100! transition-all duration-200 ease-in-out"
            >
              <AiOutlineDelete className="hover:text-red-600" />
              {deleteType === "SD" ? "Move Into Trash" : "Delete Permanently"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dark hover overlay */}
      <div className="w-full h-full absolute z-10 transition-all duration-150 ease-in group-hover:bg-black/30"></div>

      {/* Image */}
      <div>
        <Image
          src={media?.secure_url}
          alt={media.alt || "Image"}
          height={300}
          width={300}
          className="object-cover w-full sm:h-[200px] h-[150px]"
        />
      </div>
    </div>
  );
};

export default Media;
