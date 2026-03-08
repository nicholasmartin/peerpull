"use client";

import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type CloseProjectButtonProps = {
  projectId: string;
  action: (formData: FormData) => void;
  size?: "sm" | "default";
};

export function CloseProjectButton({ projectId, action, size = "sm" }: CloseProjectButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size={size}
          className="text-red-400 hover:text-red-300 border-red-400/30 hover:border-red-400/50"
        >
          <XCircle className="h-3.5 w-3.5 mr-1" />
          Close
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-dark-border bg-dark-card">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-dark-text">Close this project?</AlertDialogTitle>
          <AlertDialogDescription className="text-dark-text-muted">
            This will remove the project from the review queue. It will not be re-queued automatically. You can still view all feedback and stats for this project after closing it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-dark-border text-dark-text hover:bg-dark-surface">
            Cancel
          </AlertDialogCancel>
          <form action={action}>
            <input type="hidden" name="id" value={projectId} />
            <AlertDialogAction
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Close Project
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
