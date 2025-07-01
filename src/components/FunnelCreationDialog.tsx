
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Plus,
  FileUp,
  Save,
  Upload,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTemplateOperations } from '@/hooks/useTemplateOperations';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Template } from '@/types/canvas';

interface FunnelCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBlankFunnel: () => void;
  onCreateFromTemplate: (template: Template) => void;
}

export const FunnelCreationDialog: React.FC<FunnelCreationDialogProps> = ({
  isOpen,
  onClose,
  onCreateBlankFunnel,
  onCreateFromTemplate
}) => {
  const [userTemplates, setUserTemplates] = useState<Template[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);
  const { toast } = useToast();
  const { loadTemplates, importTemplate, deleteTemplate } = useTemplateOperations();

  React.useEffect(() => {
    if (isOpen) {
      const templates = loadTemplates();
      setUserTemplates(templates);
    }
  }, [isOpen, loadTemplates]);

  const handleCreateBlank = () => {
    onCreateBlankFunnel();
    onClose();
  };

  const handleUseTemplate = (template: Template) => {
    onCreateFromTemplate(template);
    onClose();
  };

  const handleDeleteTemplate = (template: Template) => {
    setTemplateToDelete(template);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteTemplate = () => {
    if (templateToDelete) {
      deleteTemplate(templateToDelete.id);
      setUserTemplates(prev => prev.filter(t => t.id !== templateToDelete.id));
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
    }
  };

  const handleImportTemplate = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedTemplate = await importTemplate(file);
      onCreateFromTemplate(importedTemplate);
      onClose();
    } catch (error) {
      console.error('Error importing template:', error);
    }
    
    // Reset the input
    event.target.value = '';
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Novo Funil</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Opção de Funil em Branco */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleCreateBlank}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5 text-green-600" />
                  <span>Funil em Branco</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Comece do zero com um funil vazio</p>
              </CardContent>
            </Card>

            {/* Opção de Importar Template */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-blue-600" />
                  <span>Importar Template</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">Importe um template de arquivo JSON</p>
                <label className="cursor-pointer">
                  <Button variant="outline" size="sm" asChild>
                    <span>
                      <FileUp className="w-4 h-4 mr-2" />
                      Selecionar Arquivo
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportTemplate}
                    className="hidden"
                  />
                </label>
              </CardContent>
            </Card>

            {/* Templates Salvos */}
            {userTemplates.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center space-x-2">
                  <Save className="w-5 h-5 text-purple-600" />
                  <span>Meus Templates Salvos</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userTemplates.map((template) => (
                    <Card key={template.id} className="relative">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center justify-between">
                          <span>{template.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTemplate(template);
                            }}
                            className="p-1 h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 text-sm mb-2">
                          {template.description || 'Sem descrição'}
                        </p>
                        {template.createdAt && (
                          <p className="text-xs text-gray-500 mb-3">
                            Criado em {new Date(template.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleUseTemplate(template)}
                        >
                          Usar Template
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {userTemplates.length === 0 && (
              <div className="text-center py-8">
                <Save className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Nenhum template salvo
                </h3>
                <p className="text-gray-500">
                  Você pode salvar templates dentro do editor de funis para reutilizá-los aqui
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Template</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o template "{templateToDelete?.name}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteTemplate}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
