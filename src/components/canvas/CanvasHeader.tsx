
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, 
  Undo, 
  Redo, 
  Download, 
  FileText,
  Edit3,
  Check,
  X,
  FolderOpen
} from 'lucide-react';

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
  onOpenTemplateManager: () => void;
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
  onOpenTemplateManager
}: CanvasHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(funnelName);
  const { toast } = useToast();

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditingName(funnelName);
  };

  const handleSaveEdit = () => {
    if (editingName.trim()) {
      onFunnelNameChange(editingName.trim());
      setIsEditing(false);
      toast({
        title: "Nome atualizado!",
        description: "O nome do funil foi atualizado com sucesso.",
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingName(funnelName);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Funnel name */}
        <div className="flex items-center space-x-4">
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="text-lg font-medium w-64"
                placeholder="Nome do funil"
                autoFocus
              />
              <Button size="sm" onClick={handleSaveEdit}>
                <Check className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-medium text-gray-900 dark:text-white">
                {funnelName}
              </h1>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleStartEdit}
                className="p-1 h-auto"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2">
          {/* Undo/Redo */}
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant="outline"
              onClick={onUndo}
              disabled={!canUndo}
              title="Desfazer (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onRedo}
              disabled={!canRedo}
              title="Refazer (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>

          {/* Templates */}
          <Button
            size="sm"
            variant="outline"
            onClick={onOpenTemplateManager}
            title="Gerenciar Templates"
          >
            <FolderOpen className="w-4 h-4" />
            Templates
          </Button>

          {/* Export */}
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant="outline"
              onClick={onExportAsImage}
              title="Exportar como PNG"
            >
              <Download className="w-4 h-4" />
              PNG
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onExportAsPDF}
              title="Exportar como PDF"
            >
              <FileText className="w-4 h-4" />
              PDF
            </Button>
          </div>

          {/* Save */}
          <Button
            size="sm"
            onClick={onSave}
            title="Salvar (Ctrl+S)"
          >
            <Save className="w-4 h-4" />
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};
