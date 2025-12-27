import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format, isPast, isToday } from "date-fns";
import userIcon from "../../public/assets/images/user.png";
import { Chip } from "@mui/material";

// Category
export const DT_CATEGORY_COLUMN = [
  {
    accessorKey: "name",
    header: "Category Name",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
];

// Products
export const DT_PRODUCT_COLUMN = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "mrp",
    header: "MRP",
  },
  {
    accessorKey: "sellingPrice",
    header: "Selling Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "discountPercentage",
    header: "Discount",
  },
];

// Products Variants
export const DT_PRODUCT_VARIANT_COLUMN = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "color",
    header: "Color",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "sku",
    header: "Sku",
  },
  {
    accessorKey: "mrp",
    header: "MRP",
  },
  {
    accessorKey: "sellingPrice",
    header: "Selling Price",
  },
  {
    accessorKey: "discountPercentage",
    header: "Discount",
  },
];

// Coupon
export const DT_COUPON_COLUMN = [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => (
      <span className="font-mono font-bold">{row.getValue("code")}</span>
    ),
  },
  {
    accessorKey: "discountPercentage",
    header: "Discount",
    cell: ({ row }) => <span>{row.getValue("discountPercentage")}% Off</span>,
  },
  {
    accessorKey: "minShoppingAmount",
    header: "Min. Spend",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("minShoppingAmount"));
      return (
        <div className="font-medium">
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
          }).format(amount)}
        </div>
      );
    },
  },
  {
    accessorKey: "validity",
    header: "Validity",
    cell: ({ row }) => {
      const dateValue = row.getValue("validity");

      if (!dateValue)
        return <span className="text-muted-foreground italic">No date</span>;

      const expiryDate = new Date(dateValue);
      const isExpired = isPast(expiryDate) && !isToday(expiryDate);
      const formattedDate = format(expiryDate, "dd MMM yyyy");

      return (
        <Badge
          variant={isExpired ? "destructive" : "outline"}
          className={isExpired ? "" : "border-green-500 text-green-600"}
        >
          {isExpired ? `Expired: ${formattedDate}` : `Valid: ${formattedDate}`}
        </Badge>
      );
    },
  },
];

// customers
export const DT_CUSTOMERS_COLUMN = [
  {
    accessorKey: "avatar",
    header: "Avatar",
    Cell: ({ renderedCellValue }) => (
      <Avatar>
        <AvatarImage src={renderedCellValue?.url || userIcon.src} />
      </Avatar>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "isEmailVerified",
    header: "Is Verified",
    Cell: ({ renderedCellValue }) =>
      renderedCellValue ? (
        <Chip color="success" label="Verified" />
      ) : (
        <Chip color="error" label="Not Verified" />
      ),
  },
];

// customers
export const DT_REVIEW_COLUMN = [
  {
    accessorKey: "product",
    header: "Product",
  },
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "rating",
    header: "Rating",
  },
  {
    accessorKey: "review",
    header: "Review",
  },
];
