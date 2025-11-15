import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export function ButtonLoading({
    type = "button",
    className,
    text,
    loading = false,
    onClick,
    ...props
}) {
    return (
        <Button
            size="sm"
            type={type}
            variant="default"
            onClick={onClick}
            disabled={loading}
            className={cn("flex items-center gap-2 cursor-pointer", className)}
            {...props}
        >
            {loading && <Spinner className="h-4 w-4" />}
            {text}
        </Button>

    );
}
