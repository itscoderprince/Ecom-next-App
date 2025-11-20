"use client";

import BreadCrumb1 from "@/components/Application/Admin/BreadCrumb1";
import Media from "@/components/Application/Admin/Media";
import UploadMedia from "@/components/Application/Admin/UploadMedia";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from "@/routes/AdminPanel.route";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LuTrash } from "react-icons/lu";
import { MdOutlinePermMedia } from "react-icons/md";
import { LuRecycle } from "react-icons/lu";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import useDeleteMutation from "@/hooks/useDeleteMutation";

const MediaPage = () => {
  const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: "Home" },
    { href: "", label: "Media" },
  ];

  const searchParams = useSearchParams();

  // ----------------------------------------
  // STATES
  // ----------------------------------------
  const [deleteType, setDeleteType] = useState("SD"); // SD = Standard, PD = Trash
  const [selectedMedia, setSelectedMedia] = useState([]); // Selected media IDs
  const [selectAll, setSelectAll] = useState(false); // Checkbox select all

  // ----------------------------------------
  // STEP 1: Detect URL query param "trashof"
  // If available → show Trash view (PD)
  // If not → show Standard view (SD)
  // ----------------------------------------
  useEffect(() => {
    if (searchParams) {
      const trashOf = searchParams.get("trashof");

      if (trashOf) {
        setSelectedMedia([]); // reset selection
        setDeleteType("PD"); // switch to trash mode
      } else {
        setDeleteType("SD"); // default mode
      }
    }
  }, [searchParams]);

  // ----------------------------------------
  // STEP 2: Fetch API for pagination
  // ----------------------------------------
  const fetchMedia = async (page, deleteType) => {
    const { data } = await axios.get(
      `/api/media?page=${page}&&limit=10&&deleteType=${deleteType}`
    );

    return data;
  };

  // ----------------------------------------
  // STEP 3: React Query Infinite Scroll
  // This automatically:
  // - Sends API request
  // - Manages pages
  // - Returns media list
  // ----------------------------------------
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["media-data", deleteType], // refetch on deleteType change
    queryFn: async ({ pageParam }) => fetchMedia(pageParam, deleteType),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const nextPage = pages.length;
      return lastPage.hasMore ? nextPage : undefined;
    },
  });

  // ----------------------------------------
  // STEP 4: Bulk Delete / Restore
  // (EMPTY NOW — YOU WILL CODE LATER)
  // ----------------------------------------

  const deleteMutation = useDeleteMutation("media-data", "/api/media/delete");

  const handleDelete = (ids, deleteType) => {
    let c = true;
    if (deleteType === "PD") {
      c = confirm(
        "Are you sure you want to permanently delete the selected items?"
      );
    }

    if (c) {
      deleteMutation.mutateAsync({ ids, deleteType });
    }

    setSelectAll(false);
    setSelectedMedia([]);
  };

  // ----------------------------------------
  // STEP 5: Select All Checkboxes
  // (EMPTY NOW — YOU WILL CODE LATER)
  // ----------------------------------------
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    if (selectAll) {
      const ids = data.pages.flatMap((page) =>
        page.mediaData.map((media) => media._id)
      );
      setSelectedMedia(ids);
    } else {
      setSelectedMedia([]);
    }
  }, [selectAll]);

  return (
    <div>
      <BreadCrumb1 breadcrumbData={breadcrumbData} />

      <Card className="py-0 rounded shadow-sm">
        {/* HEADER */}
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <div className="flex justify-between items-center">
            {/* TITLE */}
            <h4 className="font-semibold text-xl uppercase">
              {deleteType === "SD" ? (
                <div className="flex gap-3 items-center justify-center">
                  Media <MdOutlinePermMedia />
                </div>
              ) : (
                <div className="flex gap-3 items-center justify-center">
                  Media Trash <LuRecycle />
                </div>
              )}
            </h4>

            {/* BUTTONS */}
            <div className="flex items gap-5">
              {/* Upload only in Standard Mode */}
              {deleteType === "SD" && <UploadMedia />}

              {/* Trash / Back Button */}
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

        {/* CONTENT */}
        <CardContent>
          {/* STEP 6: Bulk Action Bar (Visible only if items selected) */}
          {selectedMedia.length > 0 && (
            <div className="py-2 px-3 bg-violet-200 mb-2 rounded flex justify-between items-center">
              {/* Select All Checkbox */}
              <Label>
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                  className="border-primary"
                />
                Select All
              </Label>

              {/* Buttons */}
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

          {/* STATUS: Loading / Error / Data */}
          {status === "pending" ? (
            <div>Loading...</div>
          ) : status === "error" ? (
            <div className="text-red-500 text-sm">{error.message}</div>
          ) : (
            <>
            {
              data.pages.flatMap((page) => page.mediaData.map((media) => media._id)).length === 0 && <div className="text-center items-center" ><h2 className="font-semibold text-2xl">Media not found ❌</h2></div>
            }
            <div className="grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-2 mb-5">
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaPage;
