
import { Button } from '@/components/ui/button';
import { Save, Download, Share2 } from 'lucide-react';

interface CanvasToolbarProps {
  onExportAsImage: () => void;
  onExportAsPDF: () => void;
  onSave: () => void;
}

export const CanvasToolbar = ({
  onExportAsImage,
  onExportAsPDF,
  onSave
}: CanvasToolbarProps) => {
  return (
    <>
      <Button variant="outline" size="sm" onClick={onExportAsImage}>
        <Download className="w-4 h-4 mr-2" />
        PNG
      </Button>
      <Button variant="outline" size="sm" onClick={onExportAsPDF}>
        <Download className="w-4 h-4 mr-2" />
        PDF
      </Button>
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
