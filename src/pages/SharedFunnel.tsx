import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Download, Eye } from 'lucide-react';
import { InfiniteCanvas } from '@/components/canvas/InfiniteCanvas';
import { supabase } from '@/integrations/supabase/client';
import { CustomNodeData } from '@/types/canvas';
import { Node, Edge } from '@xyflow/react';

interface SharedFunnelData {
  id: string;
  name: string;
  canvas_data: {
    nodes: Node<CustomNodeData>[];
    edges: Edge[];
  };
  owner_name?: string;
  allow_download: boolean;
}

const SharedFunnel = () => {
  const { shareToken } = useParams();
  const [funnelData, setFunnelData] = useState<SharedFunnelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadSharedFunnel();
    checkCurrentUser();
  }, [shareToken]);

  const checkCurrentUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setCurrentUser(session?.user || null);
  };

  const loadSharedFunnel = async () => {
    if (!shareToken) {
      toast({
        title: "Erro",
        description: "Token de compartilhamento inválido.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    try {
      console.log('Loading shared funnel with token:', shareToken);

      // Buscar dados do compartilhamento com join das tabelas relacionadas
      const { data: shareData, error: shareError } = await supabase
        .from('funnel_shares')
        .select(`
          funnel_id,
          allow_download,
          funnels!inner (
            id,
            name,
            canvas_data,
            user_id
          )
        `)
        .eq('share_token', shareToken)
        .single();

      if (shareError) {
        console.error('Error loading shared funnel:', shareError);
        toast({
          title: "Funil não encontrado",
          description: "O link de compartilhamento pode ter expirado ou não existe.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      if (!shareData || !shareData.funnels) {
        console.error('No funnel data found');
        toast({
          title: "Funil não encontrado",
          description: "O funil compartilhado não foi encontrado.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      const funnel = shareData.funnels;
      console.log('Funnel data loaded:', funnel);

      // Buscar informações do proprietário
      let ownerName = '';
      if (funnel.user_id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', funnel.user_id)
          .single();
        
        ownerName = profileData?.name || '';
      }

      // Safely parse canvas_data with proper type checking
      let canvasData = { nodes: [], edges: [] };
      if (funnel.canvas_data && typeof funnel.canvas_data === 'object') {
        try {
          // Type assertion since we know the structure from our database
          const parsedData = funnel.canvas_data as { nodes: Node<CustomNodeData>[]; edges: Edge[] };
          if (Array.isArray(parsedData.nodes) && Array.isArray(parsedData.edges)) {
            canvasData = parsedData;
          }
        } catch (error) {
          console.error('Error parsing canvas data:', error);
        }
      }

      setFunnelData({
        id: funnel.id,
        name: funnel.name,
        canvas_data: canvasData,
        owner_name: ownerName,
        allow_download: shareData.allow_download
      });

    } catch (error) {
      console.error('Error loading shared funnel:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar funil compartilhado.",
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const downloadAsTemplate = async () => {
    if (!funnelData || !currentUser) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para baixar templates.",
        variant: "destructive",
      });
      return;
    }

    setDownloading(true);

    try {
      // Criar uma cópia do funil como template para o usuário atual
      const { error } = await supabase
        .from('funnels')
        .insert({
          user_id: currentUser.id,
          name: `Template: ${funnelData.name}`,
          canvas_data: funnelData.canvas_data as any
        });

      if (error) {
        console.error('Error downloading template:', error);
        toast({
          title: "Erro",
          description: "Erro ao baixar template.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Template baixado!",
        description: "O template foi salvo em seus funis.",
      });

    } catch (error) {
      console.error('Error downloading template:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao baixar template.",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Carregando funil...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Aguarde enquanto carregamos o funil compartilhado.
          </p>
        </div>
      </div>
    );
  }

  if (!funnelData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Funil não encontrado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            O funil que você está tentando visualizar não foi encontrado.
          </p>
          <Button onClick={() => navigate('/')}>
            Ir para Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header com informações do funil */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Eye className="w-5 h-5" />
                {funnelData.name}
              </h1>
              {funnelData.owner_name && (
                <p className="text-sm text-gray-500">
                  Criado por {funnelData.owner_name}
                </p>
              )}
            </div>
          </div>

          {/* Botão de download (apenas se permitido e usuário logado) */}
          {funnelData.allow_download && currentUser && (
            <Button 
              onClick={downloadAsTemplate}
              disabled={downloading}
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              {downloading ? 'Baixando...' : 'Baixar Template'}
            </Button>
          )}
        </div>
      </div>

      {/* Canvas em modo somente leitura */}
      <div className="flex-1 h-[calc(100vh-80px)]">
        <InfiniteCanvas
          funnelId={funnelData.id}
          funnelName={funnelData.name}
          onFunnelNameChange={() => {}} // Não permite alteração
          initialCanvasData={funnelData.canvas_data}
          onSave={() => {}} // Não permite salvamento
          isReadOnly={true} // Modo somente leitura
        />
      </div>
    </div>
  );
};

export default SharedFunnel;
