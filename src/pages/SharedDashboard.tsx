
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Eye, BarChart3, TrendingDown, TrendingUp, Users, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { FunnelDashboardData } from '@/types/metrics';

interface SharedDashboardData {
  id: string;
  name: string;
  owner_name?: string;
  allow_download: boolean;
}

const SharedDashboard = () => {
  const { shareToken } = useParams();
  const [dashboardData, setDashboardData] = useState<SharedDashboardData | null>(null);
  const [metricsData, setMetricsData] = useState<FunnelDashboardData>({
    visitantes: 0,
    leads: 0,
    oportunidades: 0,
    vendas: 0,
    conversao_leads: 0,
    conversao_oportunidades: 0,
    conversao_vendas: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    console.log('SharedDashboard mounted with shareToken:', shareToken);
    loadSharedDashboard();
  }, [shareToken]);

  const loadSharedDashboard = async () => {
    if (!shareToken) {
      console.error('No share token provided');
      toast({
        title: "Erro",
        description: "Token de compartilhamento inválido.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    try {
      console.log('Loading shared dashboard with token:', shareToken);

      // Buscar dados do compartilhamento com join das tabelas relacionadas
      const { data: shareData, error: shareError } = await supabase
        .from('dashboard_shares')
        .select(`
          funnel_id,
          allow_download,
          funnels!inner (
            id,
            name,
            user_id
          )
        `)
        .eq('share_token', shareToken)
        .single();

      if (shareError) {
        console.error('Error loading shared dashboard:', shareError);
        toast({
          title: "Dashboard não encontrado",
          description: "O link de compartilhamento pode ter expirado ou não existe.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      if (!shareData || !shareData.funnels) {
        console.error('No dashboard data found');
        toast({
          title: "Dashboard não encontrado",
          description: "O dashboard compartilhado não foi encontrado.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      const funnel = shareData.funnels;
      console.log('Dashboard data loaded:', funnel);

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

      setDashboardData({
        id: funnel.id,
        name: funnel.name,
        owner_name: ownerName,
        allow_download: shareData.allow_download
      });

      // Carregar métricas do dashboard
      await loadDashboardMetrics(funnel.id);

    } catch (error) {
      console.error('Error loading shared dashboard:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dashboard compartilhado.",
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardMetrics = async (funnelId: string) => {
    try {
      const { data, error } = await supabase
        .from('node_metrics')
        .select('metric_category, metric_value')
        .eq('funnel_id', funnelId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Agrupar métricas por categoria e somar valores
      const groupedMetrics = (data || []).reduce((acc: any, metric) => {
        if (!acc[metric.metric_category]) {
          acc[metric.metric_category] = 0;
        }
        acc[metric.metric_category] += metric.metric_value;
        return acc;
      }, {});

      const visitantes = groupedMetrics.visitantes_unicos || 0;
      const leads = (groupedMetrics.cliques || 0) + (groupedMetrics.lead_capturado || 0);
      const oportunidades = groupedMetrics.oportunidades || 0;
      const vendas = groupedMetrics.vendas_realizadas || 0;

      // Calcular conversões
      const conversao_leads = visitantes > 0 ? (leads / visitantes) * 100 : 0;
      const conversao_oportunidades = leads > 0 ? (oportunidades / leads) * 100 : 0;
      const conversao_vendas = oportunidades > 0 ? (vendas / oportunidades) * 100 : 0;

      setMetricsData({
        visitantes,
        leads,
        oportunidades,
        vendas,
        conversao_leads: Math.round(conversao_leads * 100) / 100,
        conversao_oportunidades: Math.round(conversao_oportunidades * 100) / 100,
        conversao_vendas: Math.round(conversao_vendas * 100) / 100
      });
    } catch (error) {
      console.error('Error loading dashboard metrics:', error);
    }
  };

  const handleDownload = () => {
    if (!dashboardData) return;

    const dataToDownload = {
      funnel_name: dashboardData.name,
      owner: dashboardData.owner_name,
      metrics: metricsData,
      generated_at: new Date().toISOString()
    };

    const dataStr = JSON.stringify(dataToDownload, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `dashboard-${dashboardData.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Download iniciado",
      description: "Os dados do dashboard foram baixados com sucesso.",
    });
  };

  const maxValue = Math.max(metricsData.visitantes, metricsData.leads, metricsData.oportunidades, metricsData.vendas);

  const getFunnelSectionWidth = (value: number) => {
    if (maxValue === 0) return '100%';
    return `${Math.max((value / maxValue) * 100, 20)}%`;
  };

  const getFunnelSectionHeight = (index: number) => {
    const baseHeight = 80;
    return baseHeight + (index * 20);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Carregando dashboard...
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Aguarde enquanto carregamos o dashboard compartilhado.
          </p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Dashboard não encontrado
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4">
            O dashboard que você está tentando visualizar não foi encontrado.
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
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-1">
            <Button variant="ghost" size={isMobile ? "sm" : "default"} onClick={() => navigate('/')} className="flex-shrink-0">
              <ArrowLeft className="w-4 h-4 mr-1 md:mr-2" />
              {!isMobile && "Voltar"}
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm md:text-lg font-medium text-gray-900 dark:text-white flex items-center gap-1 md:gap-2 truncate">
                <Eye className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                <span className="truncate">Dashboard - {dashboardData.name}</span>
              </h1>
              {dashboardData.owner_name && (
                <p className="text-xs md:text-sm text-gray-500 truncate">
                  Criado por {dashboardData.owner_name}
                </p>
              )}
            </div>
          </div>
          {dashboardData.allow_download && (
            <Button
              onClick={handleDownload}
              variant="outline"
              size={isMobile ? "sm" : "default"}
              className="flex-shrink-0"
            >
              <Download className="w-4 h-4 mr-1 md:mr-2" />
              {!isMobile && "Download"}
            </Button>
          )}
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-4 md:p-6 space-y-6">
        {/* Funil Visual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Visualização do Funil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gradient-to-b from-blue-50 to-green-50 p-8 rounded-lg">
              <div className="space-y-4">
                {/* Visitantes */}
                <div className="flex flex-col items-center">
                  <div 
                    className="bg-sky-400 text-white rounded-t-lg flex items-center justify-center text-center transition-all duration-300"
                    style={{ 
                      width: getFunnelSectionWidth(metricsData.visitantes),
                      height: `${getFunnelSectionHeight(0)}px`
                    }}
                  >
                    <div>
                      <Users className="w-6 h-6 mx-auto mb-1" />
                      <p className="font-bold text-lg">{metricsData.visitantes.toLocaleString()}</p>
                      <p className="text-sm opacity-90">Visitantes</p>
                    </div>
                  </div>
                  {metricsData.conversao_leads > 0 && (
                    <div className="text-xs text-gray-600 mt-1">
                      ↓ {metricsData.conversao_leads.toFixed(2)}%
                    </div>
                  )}
                </div>

                {/* Leads */}
                <div className="flex flex-col items-center">
                  <div 
                    className="bg-purple-400 text-white flex items-center justify-center text-center transition-all duration-300"
                    style={{ 
                      width: getFunnelSectionWidth(metricsData.leads),
                      height: `${getFunnelSectionHeight(1)}px`
                    }}
                  >
                    <div>
                      <TrendingUp className="w-6 h-6 mx-auto mb-1" />
                      <p className="font-bold text-lg">{metricsData.leads.toLocaleString()}</p>
                      <p className="text-sm opacity-90">Leads</p>
                    </div>
                  </div>
                  {metricsData.conversao_oportunidades > 0 && (
                    <div className="text-xs text-gray-600 mt-1">
                      ↓ {metricsData.conversao_oportunidades.toFixed(2)}%
                    </div>
                  )}
                </div>

                {/* Oportunidades */}
                <div className="flex flex-col items-center">
                  <div 
                    className="bg-orange-500 text-white flex items-center justify-center text-center transition-all duration-300"
                    style={{ 
                      width: getFunnelSectionWidth(metricsData.oportunidades),
                      height: `${getFunnelSectionHeight(2)}px`
                    }}
                  >
                    <div>
                      <TrendingDown className="w-6 h-6 mx-auto mb-1" />
                      <p className="font-bold text-lg">{metricsData.oportunidades.toLocaleString()}</p>
                      <p className="text-sm opacity-90">Oportunidades</p>
                    </div>
                  </div>
                  {metricsData.conversao_vendas > 0 && (
                    <div className="text-xs text-gray-600 mt-1">
                      ↓ {metricsData.conversao_vendas.toFixed(2)}%
                    </div>
                  )}
                </div>

                {/* Vendas */}
                <div className="flex flex-col items-center">
                  <div 
                    className="bg-green-500 text-white rounded-b-lg flex items-center justify-center text-center transition-all duration-300"
                    style={{ 
                      width: getFunnelSectionWidth(metricsData.vendas),
                      height: `${getFunnelSectionHeight(3)}px`
                    }}
                  >
                    <div>
                      <BarChart3 className="w-6 h-6 mx-auto mb-1" />
                      <p className="font-bold text-lg">{metricsData.vendas.toLocaleString()}</p>
                      <p className="text-sm opacity-90">Vendas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Métricas Detalhadas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-sky-200 bg-sky-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-sky-600">Visitantes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-sky-700">{metricsData.visitantes.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Visitantes únicos</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-purple-600">Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-700">{metricsData.leads.toLocaleString()}</p>
              <p className="text-xs text-gray-500">
                {metricsData.conversao_leads > 0 && `${metricsData.conversao_leads.toFixed(2)}% dos visitantes`}
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-orange-600">Oportunidades</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-orange-700">{metricsData.oportunidades.toLocaleString()}</p>
              <p className="text-xs text-gray-500">
                {metricsData.conversao_oportunidades > 0 && `${metricsData.conversao_oportunidades.toFixed(2)}% dos leads`}
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-green-600">Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-700">{metricsData.vendas.toLocaleString()}</p>
              <p className="text-xs text-gray-500">
                {metricsData.conversao_vendas > 0 && `${metricsData.conversao_vendas.toFixed(2)}% das oportunidades`}
              </p>
            </CardContent>
          </Card>
        </div>

        {metricsData.visitantes === 0 && metricsData.leads === 0 && metricsData.oportunidades === 0 && metricsData.vendas === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhum dado disponível</h3>
              <p className="text-gray-500">
                Este dashboard ainda não possui métricas para exibir.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SharedDashboard;
