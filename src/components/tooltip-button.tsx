import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "./ui/button";
import { ReactNode } from "react";

// assuming the button variants types are something like following
type ButtonVariant =
  | "ghost"
  | "link"
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | null
  | undefined;

interface TooltipButtonProps {
  content: string;
  icon: ReactNode;
  onClick?: () => void;
  buttonVariant?: ButtonVariant;
  buttonClassName?: string;
  delay?: number;
  disbaled?: boolean;
  loading?: boolean;
}

export const TooltipButton = ({
  content,
  icon,
  onClick,
  buttonVariant = "ghost",
  buttonClassName = "",
  delay = 0,
  disbaled = false,
  loading = false,
}: TooltipButtonProps) => {
  return (
    <TooltipProvider delayDuration={delay}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant={buttonVariant}
            size="icon"
            disabled={disbaled}
            className={`${disbaled ? "cursor-not-allowed" : "cursor-pointer"} ${buttonClassName} hover:bg-transparent`}
            onClick={onClick}
          >
            {loading ? (
              <Loader className="min-w-4 min-h-4 animate-spin text-emerald-400" />
            ) : (
              icon
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{loading ? "Loading..." : content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
