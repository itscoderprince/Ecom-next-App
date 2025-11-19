"use client";

import React from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { FiPlusCircle } from "react-icons/fi";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const UploadMedia = ({ isMultiple = true }) => {
  const auth = useSelector((state) => state.authStore?.auth);
  const uploadedFilesRef = React.useRef([]); // Collect files as they upload
  const savingRef = React.useRef(false); // Prevent duplicate saves

  // Fires for every single uploaded file
  const handleSuccess = (result) => {
    const f = result?.info;
    if (f?.public_id && f?.asset_id) {
      uploadedFilesRef.current.push(f);
    }
  };

  // Fires when user clicks DONE (very important)
  const handleQueueEnd = async () => {
    if (savingRef.current) return; 
    const files = uploadedFilesRef.current;
    console.log(files);
    
    if (files.length === 0) return;

    savingRef.current = true;

    // Convert to DB format
    const mapped = files.map((f) => ({
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
        { files: mapped },
        { withCredentials: true }
      );

      if (!data.success) throw new Error(data.message);

      toast.success(`${mapped.length} file(s) uploaded successfully!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    }

    // Reset for next session
    uploadedFilesRef.current = [];
    savingRef.current = false;
  };

  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}
      signatureEndpoint="/api/cloudinary-signature"
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
            uploadedFilesRef.current = []; // start fresh
            savingRef.current = false;
            open();
          }}
        >
          <FiPlusCircle className="mr-2" />
          Upload Media
        </Button>
      )}
    </CldUploadWidget>
  );
};

export default UploadMedia;
