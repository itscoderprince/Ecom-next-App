import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import LogoutButton from "./LogoutButton";
import { Handbag, ShoppingCart } from "lucide-react";

const UserDropdown = () => {
  const { auth } = useSelector((store) => store.authStore);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="p-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={auth?.avatar} alt="User Avatar" />
            <AvatarFallback className="bg-gray-200">
              {auth?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {auth?.name?.toUpperCase() || "ACCOUNT"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <ShoppingCart className="h-4 w-4 mr-1" />
          New product
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Handbag className="h-4 w-4 mr-1" />
          Order
        </DropdownMenuItem>
        {auth === null ? "" : <LogoutButton />}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
