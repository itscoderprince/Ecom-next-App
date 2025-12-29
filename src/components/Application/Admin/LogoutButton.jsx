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
import { Button } from "@/components/ui/button";

const LogoutButton = ({
  variant = "dropdown", // "dropdown", "outline", "ghost", "icon"
  className = ""
}) => {
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

  if (variant === "dropdown") {
    return (
      <DropdownMenuItem
        onClick={handleLogout}
        className={`hover:bg-red-100 hover:text-red-600 focus:bg-red-100 focus:text-red-600 cursor-pointer ${className}`}
      >
        <MdLogout className="h-4 w-4 mr-2" />
        Logout
      </DropdownMenuItem>
    );
  }

  return (
    <Button
      variant={variant === "icon" ? "ghost" : variant}
      size={variant === "icon" ? "icon" : "sm"}
      onClick={handleLogout}
      className={`text-muted-foreground hover:text-red-600 hover:bg-red-50 ${className}`}
    >
      <MdLogout className={variant === "icon" ? "h-5 w-5" : "h-4 w-4 mr-2"} />
      {variant !== "icon" && "Logout"}
    </Button>
  );
};

export default LogoutButton;
