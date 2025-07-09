
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Save, 
  Undo2, 
  Redo2, 
  FolderOpen,
  Share2,
  BarChart3,
  PanelLeftOpen,
  Home
} from "lucide-react";

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
  onShareFunnel?: () => void;
  onOpenDashboard?: () => void;
  isReadOnly?: boolean;
  hasUnsavedChanges?: boolean;
  navigateWithGuard?: (path: string) => void;
  isSidebarVisible?: boolean;
  onToggleSidebar?: () => void;
}

export const CanvasHeader = ({
  funnelName,
  onFunnelNameChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onSave,
  onOpenTemplateManager,
  onShareFunnel,
  onOpenDashboard,
  isReadOnly = false,
  hasUnsavedChanges = false,
  navigateWithGuard,
  isSidebarVisible = true,
  onToggleSidebar
}: CanvasHeaderProps) => {
  const handleDashboardClick = () => {
    console.log('Dashboard button clicked');
    if (onOpenDashboard) {
      console.log('Calling onOpenDashboard');
      onOpenDashboard();
    } else {
      console.log('onOpenDashboard not available');
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Botões quando sidebar estiver fechado */}
          {!isSidebarVisible && onToggleSidebar && !isReadOnly && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWithGuard ? navigateWithGuard('/dashboard') : window.location.href = '/dashboard'}
                title="Voltar para o Dashboard"
              >
                <Home className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleSidebar}
                title="Mostrar menu lateral"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </Button>
            </>
          )}
          
          <Input
            value={funnelName}
            onChange={(e) => onFunnelNameChange(e.target.value)}
            className="font-medium text-lg border-none shadow-none focus:shadow-sm max-w-xs"
            placeholder="Nome do funil"
            readOnly={isReadOnly}
          />
          
          {hasUnsavedChanges && !isReadOnly && (
            <span className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded">
              Não salvo
            </span>
          )}
          
          {!isReadOnly && (
            <>
              <Separator orientation="vertical" className="h-6" />
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onUndo}
                  disabled={!canUndo}
                  title="Desfazer"
                >
                  <Undo2 className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRedo}
                  disabled={!canRedo}
                  title="Refazer"
                >
                  <Redo2 className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDashboardClick}
            title="Métricas Gerais do Funil"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Métricas Gerais
          </Button>
          
          <Separator orientation="vertical" className="h-6" />

          {onOpenTemplateManager && !isReadOnly && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenTemplateManager}
              title="Gerenciar Templates"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Templates
            </Button>
          )}

          {onShareFunnel && !isReadOnly && (
            <Button
              variant="outline"
              size="sm"
              onClick={onShareFunnel}
              title="Compartilhar Funil"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
          )}

          {!isReadOnly && (
            <Button
              size="sm"
              onClick={onSave}
              title="Salvar Funil"
              className={hasUnsavedChanges ? "bg-orange-600 hover:bg-orange-700" : ""}
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
