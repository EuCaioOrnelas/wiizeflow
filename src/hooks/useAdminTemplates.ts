
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AdminTemplate } from '@/types/adminTemplates';

export const useAdminTemplates = () => {
  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading admin templates:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar templates.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async (templateData: Partial<AdminTemplate>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Garantir que name é obrigatório
      if (!templateData.name) {
        throw new Error('Template name is required');
      }

      console.log('Creating template with data:', templateData);

      const { data, error } = await supabase
        .from('admin_templates')
        .insert({
          name: templateData.name,
          description: templateData.description || null,
          cover_image_url: templateData.cover_image_url || null,
          preview_url: templateData.preview_url || null,
          canvas_data: templateData.canvas_data || null,
          created_by: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Database error creating template:', error);
        throw error;
      }

      toast({
        title: "Sucesso!",
        description: "Template criado com sucesso.",
      });

      await loadTemplates();
      return data;
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar template.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTemplate = async (id: string, updates: Partial<AdminTemplate>) => {
    try {
      const { error } = await supabase
        .from('admin_templates')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Template atualizado com sucesso.",
      });

      await loadTemplates();
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar template.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('admin_templates')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Template excluído!",
        description: "Template foi excluído com sucesso.",
      });

      await loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir template.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const uploadFile = async (file: File, folder: string) => {
    try {
      console.log('Starting file upload:', { 
        fileName: file.name, 
        folder, 
        fileSize: file.size,
        fileType: file.type 
      });
      
      // Verificar se o usuário está autenticado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      console.log('User authenticated for upload:', user.email);

      // Verificar se o usuário é admin
      const { data: isAdminData, error: adminError } = await supabase
        .rpc('is_admin', { user_id: user.id });

      if (adminError) {
        console.error('Error checking admin status:', adminError);
        throw new Error('Erro ao verificar permissões de administrador');
      }

      if (!isAdminData) {
        throw new Error('Usuário não tem permissão de administrador');
      }

      console.log('User confirmed as admin, proceeding with upload');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      console.log('Upload path:', filePath);
      console.log('File MIME type:', file.type);

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      console.log('File uploaded successfully');

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('Public URL generated:', publicUrl);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Erro",
        description: `Erro ao fazer upload do arquivo: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  return {
    templates,
    loading,
    loadTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    uploadFile
  };
};
