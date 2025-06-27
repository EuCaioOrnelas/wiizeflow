
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Download, Eye } from 'lucide-react';
import { InfiniteCanvas } from '@/components/canvas/InfiniteCanvas';
import { supabase } from '@/integrations/supabase/client';
import { CustomNodeData } from '@/types/canvas';
import { Node, Edge } from '@xyflow/react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

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
          // First convert to unknown, then to our expected type
          const parsedData = funnel.canvas_data as unknown as { nodes: Node<CustomNodeData>[]; edges: Edge[] };
          if (parsedData && typeof parsedData === 'object' && 'nodes' in parsedData && 'edges' in parsedData) {
            if (Array.isArray(parsedData.nodes) && Array.isArray(parsedData.edges)) {
              canvasData = parsedData;
            }
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
        allow_download: shareData.allow_download // Usar o valor real do banco
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
    if (!funnelData) {
      toast({
        title: "Erro",
        description: "Dados do funil não encontrados.",
        variant: "destructive",
      });
      return;
    }

    setDownloading(true);

    try {
      // Se o usuário estiver logado, salvar como funil na conta dele
      if (currentUser) {
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
      } else {
        // Se não estiver logado, fazer download do arquivo JSON
        const templateData = {
          id: `template-${Date.now()}`,
          name: funnelData.name,
          description: `Template importado de ${funnelData.owner_name || 'WiizeFlow'}`,
          nodes: funnelData.canvas_data.nodes,
          edges: funnelData.canvas_data.edges,
          createdAt: new Date().toISOString()
        };

        const dataStr = JSON.stringify(templateData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${funnelData.name}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
          title: "Template baixado!",
          description: "Arquivo JSON baixado com sucesso. Você pode importá-lo após fazer login.",
        });
      }

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Carregando funil...
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Aguarde enquanto carregamos o funil compartilhado.
          </p>
        </div>
      </div>
    );
  }

  if (!funnelData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Funil não encontrado
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4">
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
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      {/* Header com informações do funil */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 md:px-6 py-3 md:py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-1">
            <Button variant="ghost" size={isMobile ? "sm" : "default"} onClick={() => navigate('/')} className="flex-shrink-0">
              <ArrowLeft className="w-4 h-4 mr-1 md:mr-2" />
              {!isMobile && "Voltar"}
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm md:text-lg font-medium text-gray-900 dark:text-white flex items-center gap-1 md:gap-2 truncate">
                <Eye className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                <span className="truncate">{funnelData.name}</span>
              </h1>
              {funnelData.owner_name && !isMobile && (
                <p className="text-xs md:text-sm text-gray-500 truncate">
                  Criado por {funnelData.owner_name}
                </p>
              )}
            </div>
          </div>

          {/* Botão de download - apenas se permitido */}
          {funnelData.allow_download && (
            <Button 
              onClick={downloadAsTemplate}
              disabled={downloading}
              variant="outline"
              size={isMobile ? "sm" : "default"}
              className="flex-shrink-0 ml-2"
              style={{ backgroundColor: 'rgb(6, 214, 160)', color: 'white' }}
            >
              <Download className="w-4 h-4 mr-1 md:mr-2" />
              {isMobile ? 'Baixar' : (downloading ? 'Baixando...' : 'Baixar Template')}
            </Button>
          )}
        </div>
        
        {/* Nome do proprietário em mobile */}
        {funnelData.owner_name && isMobile && (
          <p className="text-xs text-gray-500 mt-1 truncate">
            Criado por {funnelData.owner_name}
          </p>
        )}
      </div>

      {/* Canvas em modo somente leitura */}
      <div className="flex-1 overflow-hidden">
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
