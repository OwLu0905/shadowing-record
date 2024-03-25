import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic2, MicIcon, Pencil } from "lucide-react";

type WarningDialogProps = {
  show: boolean;
  handleClose: any;
  label: string;
  title: string;
  description: string;
  onConfirm: (sync: boolean) => Promise<void>;
};

const WarningDialog = ({
  show,
  handleClose,
  title,
  description,
  onConfirm,
}: WarningDialogProps) => {
  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">{title}</DialogTitle>
          <DialogDescription className="pb-2">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex">
          <Button
            size="sm"
            type="button"
            variant="secondary"
            onClick={() => handleClose(false)}
          >
            <Pencil className="mr-2 h-4 w-4" /> Keep Editing
          </Button>
          <Button
            size="sm"
            type="button"
            variant="destructive"
            onClick={async () => {
              await onConfirm(true);
              handleClose(false);
            }}
          >
            <MicIcon className="mr-2 h-4 w-4" /> Start New
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WarningDialog;
