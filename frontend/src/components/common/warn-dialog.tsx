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
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex">
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleClose(false)}
          >
            Continue Editing
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={async () => {
              await onConfirm(true);
              handleClose(false);
            }}
          >
            Contiue to record
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WarningDialog;
