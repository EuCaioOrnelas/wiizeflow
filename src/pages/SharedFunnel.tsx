
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ReadOnlyCanvas } from '@/components/canvas/ReadOnlyCanvas';
import { useFunnelShare } from '@/hooks/useFunnelShare';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';

const SharedFunnel = () => {
  const { shareToken } = useParams<{ shareToken: string }>();
  const [funnelData, setFunnelData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getSharedFunnel } = useFunnelShare();

  useEffect(() => {
    if (shareToken) {
      console.log('Loading shared funnel with token:', shareToken);
      loadSharedFunnel();
    } else {
      console.log('No share token provided');
      setError('Token de compartilhamento não fornecido.');
      setLoading(false);
    }
  }, [shareToken]);

  const loadSharedFunnel = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching shared funnel...');
      const data = await getSharedFunnel(shareToken!);
      
      console.log('Received data:', data);
      
      if (!data) {
        console.log('No data returned from getSharedFunnel');
        setError('Funil não encontrado ou link inválido.');
        return;
      }
      
      if (!data.funnels) {
        console.log('No funnel data in response');
        setError('Dados do funil não encontrados.');
        return;
      }
      
      console.log('Setting funnel data:', data);
      setFunnelData(data);
    } catch (error) {
      console.error('Error loading shared funnel:', error);
      setError('Erro ao carregar funil compartilhado.');
    } finally {
      setLoading(false);
    }
  };

  const goToHome = () => {
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
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

  if (error || !funnelData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Funil não encontrado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'O link de compartilhamento pode ter expirado ou sido removido.'}
          </p>
          <Button onClick={goToHome} className="bg-green-600 hover:bg-green-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ir para a Página Inicial
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ReadOnlyCanvas
      funnelName={funnelData.funnels.name}
      initialCanvasData={funnelData.funnels.canvas_data || { nodes: [], edges: [] }}
      allowDownload={funnelData.allow_download}
      shareToken={shareToken!}
    />
  );
};

export default SharedFunnel;
