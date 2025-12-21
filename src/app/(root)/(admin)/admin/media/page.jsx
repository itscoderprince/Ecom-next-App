"use client";

import Media from "@/components/Application/Admin/Media";
import UploadMedia from "@/components/Application/Admin/UploadMedia";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from "@/routes/AdminPanel.route";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LuTrash, LuRecycle } from "react-icons/lu";
import { MdOutlinePermMedia } from "react-icons/md";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import useDeleteMutation from "@/hooks/useDeleteMutation";
import { Loader2 } from "lucide-react";
import { ButtonLoading } from "@/components/Application/ButtonLoading";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import ConfirmDialog from "@/components/Application/ConfirmDialog";

const MediaPage = () => {
  const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: "Home" },
    { href: "", label: "Media" },
  ];

  // =======================
  // Component State
  // =======================
  const [deleteType, setDeleteType] = useState("SD");
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState({ ids: [], deleteType: "" });

  // =======================
  // Hooks
  // =======================
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { mutateAsync: deleteMedia, isPending: isDeleting } = useDeleteMutation(
    "media-data",
    "/api/media/delete"
  );

  // ===========================
  // API: Fetch Media (Infinite)
  // ===========================
  const fetchMedia = async (page, deleteType) => {
    const { data } = await axios.get(
      `/api/media?page=${page}&&limit=10&&deleteType=${deleteType}`
    );
    return data;
  };

  const {
    data,
    error,
    status,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["media-data", deleteType],
    queryFn: async ({ pageParam }) => fetchMedia(pageParam, deleteType),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length : undefined,
  });

  // =======================
  // Effects
  // =======================

  // Switch Media/Trash view based on URL
  useEffect(() => {
    const trashOf = searchParams.get("trashof");
    setSelectedMedia([]);
    setDeleteType(trashOf ? "PD" : "SD");
  }, [searchParams]);

  // Select all media items
  useEffect(() => {
    if (selectAll) {
      const allMediaIds =
        data?.pages.flatMap((page) =>
          page.mediaData.map((media) => media._id)
        ) || [];
      setSelectedMedia(allMediaIds);
    } else {
      setSelectedMedia([]);
    }
  }, [selectAll, data]);

  // =======================
  // Event Handlers
  // =======================
  const handleSelectAll = () => setSelectAll(!selectAll);

  // Handle delete/restore actions
  const handleDelete = (ids, type) => {
    if (type === "PD") {
      setDeleteInfo({ ids, deleteType: type });
      setDialogOpen(true);
      return;
    }
    deleteMedia({ ids, deleteType: type });
    setSelectAll(false);
    setSelectedMedia([]);
  };

  // Final permanent delete
  const executePermanentDelete = () => {
    if (deleteInfo.ids.length > 0 && deleteInfo.deleteType === "PD") {
      deleteMedia(deleteInfo);
      setSelectAll(false);
      setSelectedMedia([]);
    }
  };

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0 rounded shadow-sm relative">
        {/* Loader Overlay */}
        {isDeleting && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/40 flex items-center justify-center z-30 rounded-lg">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        )}

        {/* Header */}
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-1">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-xl uppercase">
              {deleteType === "SD" ? (
                <div className="flex gap-3 items-center">
                  Media <MdOutlinePermMedia />
                </div>
              ) : (
                <div className="flex gap-3 items-center">
                  Media Trash <LuRecycle />
                </div>
              )}
            </h4>

            {/* Header Actions */}
            <div className="flex items gap-5">
              {deleteType === "SD" && (
                <UploadMedia isMultiple={true} queryClient={queryClient} />
              )}

              <div className="flex gap-3">
                {deleteType === "SD" ? (
                  <Button variant="destructive">
                    <LuTrash />
                    <Link href={`${ADMIN_MEDIA_SHOW}?trashof=media`}>
                      Trash
                    </Link>
                  </Button>
                ) : (
                  <Button>
                    <Link href={ADMIN_MEDIA_SHOW}>Back To Media</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="mb-5">
          {/* Bulk Action Bar */}
          {selectedMedia.length > 0 && (
            <div className="py-2 px-3 bg-violet-200 mb-2 rounded flex justify-between items-center">
              <Label>
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                  className="border-primary"
                />
                Select All
              </Label>

              <div className="flex gap-2">
                {deleteType === "SD" ? (
                  <Button
                    onClick={() => handleDelete(selectedMedia, deleteType)}
                  >
                    Move Into Trash
                  </Button>
                ) : (
                  <>
                    <Button
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => handleDelete(selectedMedia, "RSD")}
                    >
                      Restore
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(selectedMedia, deleteType)}
                    >
                      Delete Permanently
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Media Grid */}
          {status === "pending" ? (
            <div>Loading...</div>
          ) : status === "error" ? (
            <div className="text-red-500 text-sm">{error.message}</div>
          ) : (
            <>
              {data.pages.flatMap((page) => page.mediaData).length === 0 && (
                <div className="text-center">
                  <h2 className="font-semibold text-2xl">Media not found ❌</h2>
                </div>
              )}

              <div className="grid lg:grid-cols-6 sm:grid-cols-4 grid-cols-2 gap-2 mb-5">
                {data?.pages?.map((page, index) => (
                  <React.Fragment key={index}>
                    {page?.mediaData?.map((media) => (
                      <Media
                        key={media._id}
                        media={media}
                        handleDelete={handleDelete}
                        deleteType={deleteType}
                        selectMedia={selectedMedia}
                        setSelectMedia={setSelectedMedia}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </div>

              {/* Load More */}
              {hasNextPage && (
                <ButtonLoading
                  className="mx-auto"
                  loading={isFetchingNextPage}
                  onClick={() => fetchNextPage()}
                  text="Load more"
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete the selected item(s)."
        confirmText="Continue"
        cancelText="Cancel"
        destructive={true}
        confirmAction={executePermanentDelete}
      />
    </div>
  );
};

export default MediaPage;
