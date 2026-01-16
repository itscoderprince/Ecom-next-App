"use client";

import React from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const UploadMedia = ({ isMultiple = true, queryClient }) => {
  const auth = useSelector((state) => state.authStore?.auth);

  // Refs to hold uploaded file info and saving state between renders.
  const uploaded = React.useRef([]);
  const isSaving = React.useRef(false);

  // Fired for each successfully uploaded file.
  const handleSuccess = (result) => {
    const file = result?.info;
    if (file?.public_id && file?.asset_id) {
      uploaded.current.push(file);
    }
  };

  // Fired when the upload queue is finished (user clicks "Done").
  const handleQueueEnd = async () => {
    if (isSaving.current || uploaded.current.length === 0) return;

    isSaving.current = true;

    const filesToSave = uploaded.current.map((f) => ({
      asset_id: f.asset_id,
      public_id: f.public_id,
      path: f.path,
      thumbnail_url: f.thumbnail_url,
      secure_url: f.secure_url,
      alt: f.original_filename || f.display_name || "",
      title: f.original_filename || f.display_name || "",
    }));

    try {
      const { data } = await axios.post(
        "/api/media/create",
        { files: filesToSave },
        { withCredentials: true },
      );

      if (!data.success) throw new Error(data.message);
      toast.success(`${filesToSave.length} file(s) uploaded successfully!`);
      queryClient.invalidateQueries({ queryKey: ["media-data"] });
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    }

    // Reset for the next upload session.
    uploaded.current = [];
    isSaving.current = false;
  };

  return (
    <CldUploadWidget
      signatureEndpoint="/api/cloudinary-signature"
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}
      onSuccess={handleSuccess}
      onQueuesEnd={handleQueueEnd}
      options={{
        multiple: isMultiple,
        sources: ["local", "url", "unsplash", "google_drive"],
      }}
      config={{
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      }}
    >
      {({ open }) => (
        <Button
          onClick={() => {
            if (!auth) return toast.error("Please sign in first.");
            uploaded.current = [];
            isSaving.current = false;
            open();
          }}
        >
          {/* Updated Icon Component */}
          <PlusCircle className="mr-2 h-4 w-4" />
          Upload Media
        </Button>
      )}
    </CldUploadWidget>
  );
};

export default UploadMedia;
