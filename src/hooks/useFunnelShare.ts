
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FunnelShare {
  id: string;
  funnel_id: string;
  owner_id: string;
  share_token: string;
  allow_download: boolean;
  created_at: string;
  updated_at: string;
}

export const useFunnelShare = () => {
  const [loading, setLoading] = useState(false);
  const [shareData, setShareData] = useState<FunnelShare | null>(null);
  const { toast } = useToast();

  const generateShareToken = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  };

  const createShare = async (funnelId: string, allowDownload: boolean = false) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error('Usuário não autenticado');
      }

      // Verificar se já existe um compartilhamento para este funil
      const { data: existingShare } = await supabase
        .from('funnel_shares')
        .select('*')
        .eq('funnel_id', funnelId)
        .eq('owner_id', session.user.id)
        .single();

      if (existingShare) {
        // Atualizar compartilhamento existente
        const { data, error } = await supabase
          .from('funnel_shares')
          .update({ allow_download: allowDownload })
          .eq('id', existingShare.id)
          .select()
          .single();

        if (error) throw error;
        
        setShareData(data);
        toast({
          title: "Compartilhamento atualizado!",
          description: "As configurações do link foram atualizadas com sucesso.",
        });
        
        return data;
      } else {
        // Criar novo compartilhamento
        const shareToken = generateShareToken();
        
        const { data, error } = await supabase
          .from('funnel_shares')
          .insert({
            funnel_id: funnelId,
            owner_id: session.user.id,
            share_token: shareToken,
            allow_download: allowDownload
          })
          .select()
          .single();

        if (error) throw error;
        
        setShareData(data);
        toast({
          title: "Link de compartilhamento criado!",
          description: "Seu funil agora pode ser visualizado através do link gerado.",
        });
        
        return data;
      }
    } catch (error) {
      console.error('Error creating share:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar link de compartilhamento.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getShare = async (funnelId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) return null;

      const { data, error } = await supabase
        .from('funnel_shares')
        .select('*')
        .eq('funnel_id', funnelId)
        .eq('owner_id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error getting share:', error);
        return null;
      }

      setShareData(data);
      return data;
    } catch (error) {
      console.error('Error getting share:', error);
      return null;
    }
  };

  const deleteShare = async (shareId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('funnel_shares')
        .delete()
        .eq('id', shareId);

      if (error) throw error;
      
      setShareData(null);
      toast({
        title: "Compartilhamento removido!",
        description: "O link de compartilhamento foi desativado.",
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting share:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover compartilhamento.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getSharedFunnel = async (shareToken: string) => {
    try {
      const { data: shareData, error: shareError } = await supabase
        .from('funnel_shares')
        .select(`
          *,
          funnels:funnel_id (
            id,
            name,
            canvas_data,
            created_at,
            updated_at
          )
        `)
        .eq('share_token', shareToken)
        .single();

      if (shareError) {
        console.error('Error getting shared funnel:', shareError);
        return null;
      }

      return shareData;
    } catch (error) {
      console.error('Error getting shared funnel:', error);
      return null;
    }
  };

  return {
    loading,
    shareData,
    createShare,
    getShare,
    deleteShare,
    getSharedFunnel
  };
};
