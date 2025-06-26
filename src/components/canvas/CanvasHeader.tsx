import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Save, 
  Undo2, 
  Redo2, 
  Download, 
  FileText, 
  Layers,
  Share2
} from 'lucide-react';
import { FunnelShareDialog } from './FunnelShareDialog';

interface CanvasHeaderProps {
  funnelName: string;
  onFunnelNameChange: (name: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onExportAsImage: () => void;
  onExportAsPDF: () => void;
  onSave: () => void;
  onOpenTemplateManager?: () => void;
  funnelId?: string;
}

export const CanvasHeader = ({
  funnelName,
  onFunnelNameChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onExportAsImage,
  onExportAsPDF,
  onSave,
  onOpenTemplateManager,
  funnelId
}: CanvasHeaderProps) => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Input
              value={funnelName}
              onChange={(e) => onFunnelNameChange(e.target.value)}
              className="text-lg font-semibold bg-transparent border-none focus:ring-0 focus:border-none p-0 h-auto"
              placeholder="Nome do funil"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onUndo}
              disabled={!canUndo}
              title="Desfazer (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onRedo}
              disabled={!canRedo}
              title="Refazer (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </Button>

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

            <Button
              variant="outline"
              size="sm"
              onClick={onExportAsImage}
              title="Exportar como PNG"
            >
              <Download className="w-4 h-4 mr-2" />
              PNG
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onExportAsPDF}
              title="Exportar como PDF"
            >
              <FileText className="w-4 h-4 mr-2" />
              PDF
            </Button>

            {onOpenTemplateManager && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenTemplateManager}
                title="Gerenciar Templates"
              >
                <Layers className="w-4 h-4 mr-2" />
                Templates
              </Button>
            )}

            {funnelId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsShareDialogOpen(true)}
                title="Compartilhar funil"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
            )}

            <Button
              onClick={onSave}
              className="bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </div>

      {/* Dialog de compartilhamento */}
      {funnelId && (
        <FunnelShareDialog
          isOpen={isShareDialogOpen}
          onClose={() => setIsShareDialogOpen(false)}
          funnelId={funnelId}
          funnelName={funnelName}
        />
      )}
    </>
  );
};
