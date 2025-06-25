
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { InfiniteCanvas } from "@/components/canvas/InfiniteCanvas";
import { supabase } from "@/integrations/supabase/client";

interface Funnel {
  id: string;
  name: string;
  canvas_data: any;
  created_at: string;
  updated_at: string;
  user_id: string;
}

const Builder = () => {
  const { id: funnelId } = useParams();
  const [funnel, setFunnel] = useState<Funnel | null>(null);
  const [funnelName, setFunnelName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (funnelId) {
      loadFunnel(funnelId);
    }
  }, [funnelId]);

  const loadFunnel = async (id: string) => {
    try {
      // Verificar se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate('/auth');
        return;
      }

      // Carregar funil do Supabase
      const { data: funnelData, error } = await supabase
        .from('funnels')
        .select('*')
        .eq('id', id)
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        console.error('Error loading funnel:', error);
        toast({
          title: "Erro",
          description: "Funil não encontrado ou você não tem permissão para acessá-lo.",
          variant: "destructive",
        });
        navigate('/dashboard');
        return;
      }

      setFunnel(funnelData);
      setFunnelName(funnelData.name);
      
    } catch (error) {
      console.error('Error loading funnel:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar funil.",
        variant: "destructive",
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleFunnelNameChange = async (newName: string) => {
    if (!funnel || saving) return;

    setFunnelName(newName);
    setSaving(true);

    try {
      const { error } = await supabase
        .from('funnels')
        .update({ name: newName })
        .eq('id', funnel.id);

      if (error) {
        console.error('Error updating funnel name:', error);
        toast({
          title: "Erro",
          description: "Erro ao salvar nome do funil.",
          variant: "destructive",
        });
        return;
      }

      // Atualizar estado local
      setFunnel(prev => prev ? { ...prev, name: newName } : null);

    } catch (error) {
      console.error('Error updating funnel name:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao salvar nome do funil.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const saveFunnelData = async (canvasData: any) => {
    if (!funnel || saving) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from('funnels')
        .update({ canvas_data: canvasData })
        .eq('id', funnel.id);

      if (error) {
        console.error('Error saving funnel data:', error);
        toast({
          title: "Erro",
          description: "Erro ao salvar dados do funil.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Salvo!",
        description: "Funil salvo com sucesso.",
      });

    } catch (error) {
      console.error('Error saving funnel data:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao salvar funil.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const goBack = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Carregando funil...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Aguarde enquanto carregamos seu funil.
          </p>
        </div>
      </div>
    );
  }

  if (!funnel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Funil não encontrado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            O funil que você está tentando acessar não foi encontrado.
          </p>
          <Button onClick={goBack}>
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Back button - positioned absolutely to not interfere with canvas */}
      <Button 
        variant="ghost" 
        onClick={goBack} 
        className="absolute top-4 left-4 z-50 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg"
        disabled={saving}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {saving ? 'Salvando...' : 'Voltar'}
      </Button>

      <InfiniteCanvas
        funnelId={funnel.id}
        funnelName={funnelName}
        onFunnelNameChange={handleFunnelNameChange}
        initialCanvasData={funnel.canvas_data}
        onSave={saveFunnelData}
      />
    </div>
  );
};

export default Builder;
