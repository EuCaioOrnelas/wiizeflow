
import { Button } from '@/components/ui/button';
import { Save, Share2 } from 'lucide-react';

interface CanvasToolbarProps {
  onExportAsImage: () => void;
  onExportAsPDF: () => void;
  onSave: () => void;
}

export const CanvasToolbar = ({
  onSave
}: CanvasToolbarProps) => {
  return (
    <>
      <Button variant="outline" size="sm">
        <Share2 className="w-4 h-4 mr-2" />
        Compartilhar
      </Button>
      <Button onClick={onSave} className="bg-green-600 hover:bg-green-700">
        <Save className="w-4 h-4 mr-2" />
        Salvar
      </Button>
    </>
  );
};
