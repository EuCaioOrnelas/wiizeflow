
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "lucide-react";

interface UnsavedChangesDialogProps {
  isOpen: boolean;
  onSaveAndNavigate: () => void;
  onDiscardAndNavigate: () => void;
  onCancel: () => void;
}

export const UnsavedChangesDialog = ({
  isOpen,
  onSaveAndNavigate,
  onDiscardAndNavigate,
  onCancel,
}: UnsavedChangesDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Alterações não salvas</DialogTitle>
          <DialogDescription>
            Você tem alterações não salvas no seu funil. O que deseja fazer?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            variant="outline"
            onClick={onDiscardAndNavigate}
            className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Descartar alterações
          </Button>
          <Button
            onClick={onSaveAndNavigate}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar e continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
