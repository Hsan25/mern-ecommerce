"use client";
import {
  AlertDialog as DialogWrapper,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
interface Props {
  open: boolean;
  description?: string;
  title?: string;
  onOpen?: () => void;
  onContinue?: () => void;
  onCancel?: () => void;
  label?: { cancel?: string; continue?: string };
}
const AlertDialog = ({ open, onOpen, onCancel, label, onContinue, title, description }: Props) => {
  return (
    <DialogWrapper open={open} onOpenChange={onOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{label?.cancel || "Cancel"}</AlertDialogCancel>
          <AlertDialogAction onClick={onContinue}>
            {label?.continue || "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </DialogWrapper>
  );
};

export default AlertDialog;
