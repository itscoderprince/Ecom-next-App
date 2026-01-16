"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export function UIButton({
  type = "button",
  className,
  loading = false,
  disabled,
  icon: Icon,
  text,
  children,
  ...props
}) {
  const content = children ?? text;

  return (
    <Button
      type={type}
      disabled={loading || disabled}
      className={cn(
        "flex items-center gap-2",
        loading && "cursor-not-allowed opacity-90",
        className,
      )}
      {...props}
    >
      {!loading && Icon && <Icon className="h-4 w-4 mr-2" />}
      {loading && <Spinner className="h-4 w-4 animate-spin" />}
      <span>{content}</span>
    </Button>
  );
}
