"use client";

import { WEBSITE_LOGIN } from "@/routes/Website.route";
import { logout } from "@/store/reducer/authReducer";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { UIButton } from "../UIButton";

const LogoutButton = ({
  variant = "dropdown", // "dropdown", "outline", "ghost", "icon"
  className = "",
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(
        "/api/auth/logout",
        {},
        { withCredentials: true },
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
        error?.response?.data?.message || error?.message || "Logout error";

      toast.error(message);
    }
  };

  if (variant === "dropdown") {
    return (
      <DropdownMenuItem
        onClick={handleLogout}
        className={`hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive hover:text-destructive cursor-pointer ${className}`}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </DropdownMenuItem>
    );
  }

  return (
    <UIButton
      variant={variant === "icon" ? "ghost" : variant}
      size={variant === "icon" ? "icon" : "sm"}
      onClick={handleLogout}
      className={`text-muted-foreground hover:text-destructive ${className}`}
    >
      <LogOut
        className={
          variant === "icon hover:text-destructive"
            ? "h-5 w-5 hover:text-destructive"
            : "h-4 w-4 mr-2 hover:text-destructive"
        }
      />
      {variant !== "icon" && "Logout"}
    </UIButton>
  );
};

export default LogoutButton;
