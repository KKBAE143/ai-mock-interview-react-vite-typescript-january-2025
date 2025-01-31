import { Interview } from "@/types";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TooltipButton } from "./tooltip-button";
import { Eye, Newspaper, Sparkles, Trash2 } from "lucide-react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { toast } from "sonner";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface InterviewPinProps {
  interview: Interview;
  onMockPage?: boolean;
  onDelete?: () => void;
}

export const InterviewPin = ({
  interview,
  onMockPage = false,
  onDelete,
}: InterviewPinProps) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteDoc(doc(db, "interviews", interview.id));
      toast.success("Interview deleted successfully");
      onDelete?.();
    } catch (error) {
      console.error("Error deleting interview:", error);
      toast.error("Failed to delete interview");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the interview
              "{interview.position}" and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete Interview"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="p-4 rounded-md shadow-none hover:shadow-md shadow-gray-100 cursor-pointer transition-all space-y-4">
        <CardTitle className="text-lg">{interview?.position}</CardTitle>
        <CardDescription>{interview?.description}</CardDescription>
        <div className="w-full flex items-center gap-2 flex-wrap">
          {interview?.techStack.split(",").map((word, index) => (
            <Badge
              key={index}
              variant={"outline"}
              className="text-xs text-muted-foreground hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-900"
            >
              {word}
            </Badge>
          ))}
        </div>

        <CardFooter
          className={cn(
            "w-full flex items-center p-0",
            onMockPage ? "justify-end" : "justify-between"
          )}
        >
          <p className="text-[12px] text-muted-foreground truncate whitespace-nowrap">
            {`${new Date(interview?.createdAt.toDate()).toLocaleDateString(
              "en-US",
              { dateStyle: "long" }
            )} - ${new Date(interview?.createdAt.toDate()).toLocaleTimeString(
              "en-US",
              { timeStyle: "short" }
            )}`}
          </p>

          {!onMockPage && (
            <div className="flex items-center justify-center">
              <TooltipButton
                content="View"
                buttonVariant={"ghost"}
                onClick={() => {
                  navigate(`/generate/${interview?.id}`, { replace: true });
                }}
                disbaled={false}
                buttonClassName="hover:text-sky-500"
                icon={<Eye />}
                loading={false}
              />

              <TooltipButton
                content="Feedback"
                buttonVariant={"ghost"}
                onClick={() => {
                  navigate(`/generate/feedback/${interview?.id}`, {
                    replace: true,
                  });
                }}
                disbaled={false}
                buttonClassName="hover:text-yellow-500"
                icon={<Newspaper />}
                loading={false}
              />

              <TooltipButton
                content="Start"
                buttonVariant={"ghost"}
                onClick={() => {
                  navigate(`/generate/interview/${interview?.id}`, {
                    replace: true,
                  });
                }}
                disbaled={false}
                buttonClassName="hover:text-sky-500"
                icon={<Sparkles />}
                loading={false}
              />

              <TooltipButton
                content="Delete"
                buttonVariant={"ghost"}
                onClick={() => setShowDeleteDialog(true)}
                disbaled={isDeleting}
                buttonClassName="hover:text-red-500"
                icon={<Trash2 />}
                loading={isDeleting}
              />
            </div>
          )}
        </CardFooter>
      </Card>
    </>
  );
};
