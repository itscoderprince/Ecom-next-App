"use client";

import { WEBSITE_LOGIN } from "@/routes/Website.route";
import { logout } from "@/store/reducer/authReducer";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { MdLogout } from "react-icons/md";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(
        "/api/auth/logout",
        {},
        { withCredentials: true }
      );

      if (!data) {
        toast.error("Logout failed");
        return;
      }

      dispatch(logout());
      toast.success(data.message);

      router.push(WEBSITE_LOGIN);
    } catch (error) {
      console.log(error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Logout error";

      toast.error(message);
    }
  };

  return (
    <DropdownMenuItem
      onClick={handleLogout}
      className="hover:bg-red-100 hover:text-red-600 focus:bg-red-100 focus:text-red-600 cursor-pointer"
    >
      <MdLogout className="h-4 w-4 mr-2 hover:text-red-600" />
      Logout
    </DropdownMenuItem>
  );
};

export default LogoutButton;
