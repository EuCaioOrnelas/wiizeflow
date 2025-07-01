
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, Plus, Loader2 } from 'lucide-react';
import { useAdminTemplates } from '@/hooks/useAdminTemplates';

interface CreateTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTemplateDialog: React.FC<CreateTemplateDialogProps> = ({
  isOpen,
  onClose
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    preview_url: ''
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  
  const { createTemplate, uploadFile } = useAdminTemplates();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsCreating(true);
    setUploadProgress('Iniciando...');

    try {
      let coverImageUrl = '';

      console.log('Starting template creation process...');

      if (coverImage) {
        setUploadProgress('Fazendo upload da imagem de capa...');
        console.log('Uploading cover image...');
        coverImageUrl = await uploadFile(coverImage, 'template-covers');
        console.log('Cover image uploaded:', coverImageUrl);
      }

      setUploadProgress('Salvando template no banco de dados...');
      console.log('Creating template record...');
      await createTemplate({
        name: formData.name,
        description: formData.description,
        preview_url: formData.preview_url,
        cover_image_url: coverImageUrl
      });

      console.log('Template created successfully!');
      setUploadProgress('Template criado com sucesso!');

      // Reset form
      setFormData({ name: '', description: '', preview_url: '' });
      setCoverImage(null);
      setUploadProgress('');
      onClose();
    } catch (error) {
      console.error('Error creating template:', error);
      setUploadProgress('');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Cover image selected:', file.name, file.size);
      setCoverImage(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Criar Novo Template</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Template *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Digite o nome do template"
              required
              disabled={isCreating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva o template"
              rows={3}
              disabled={isCreating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preview_url">Link de Visualização do Funil *</Label>
            <Input
              id="preview_url"
              type="url"
              value={formData.preview_url}
              onChange={(e) => setFormData({ ...formData, preview_url: e.target.value })}
              placeholder="https://exemplo.com/shared/token-do-funil"
              required
              disabled={isCreating}
            />
            <p className="text-xs text-gray-500">
              Cole aqui o link de compartilhamento do funil (com download habilitado)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover_image">Imagem de Capa (Retangular)</Label>
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer">
                <Button type="button" variant="outline" size="sm" asChild disabled={isCreating}>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Selecionar Imagem
                  </span>
                </Button>
                <input
                  id="cover_image"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="hidden"
                  disabled={isCreating}
                />
              </label>
              {coverImage && (
                <span className="text-sm text-gray-600">{coverImage.name}</span>
              )}
            </div>
          </div>

          {uploadProgress && (
            <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-sm text-blue-700">{uploadProgress}</span>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isCreating}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isCreating || !formData.name.trim() || !formData.preview_url.trim()}
              style={{ backgroundColor: 'rgb(6, 214, 160)' }}
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Template
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
