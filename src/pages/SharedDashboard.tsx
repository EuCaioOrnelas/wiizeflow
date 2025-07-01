import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingDown, TrendingUp, Users, Download, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { FunnelDashboardData } from '@/types/metrics';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export const SharedDashboard = () => {
  const { token } = useParams<{ token: string }>();
  const [dashboardData, setDashboardData] = useState<FunnelDashboardData>({
    visitantes: 0,
    leads: 0,
    oportunidades: 0,
    vendas: 0,
    conversao_leads: 0,
    conversao_oportunidades: 0,
    conversao_vendas: 0
  });
  const [loading, setLoading] = useState(true);
  const [funnelName, setFunnelName] = useState('');
  const [allowDownload, setAllowDownload] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      loadSharedDashboard();
    }
  }, [token]);

  const loadSharedDashboard = async () => {
    setLoading(true);
    try {
      console.log('Loading shared dashboard for token:', token);
      
      // Primeiro, buscar informações do compartilhamento
      const { data: shareData, error: shareError } = await supabase
        .from('dashboard_shares')
        .select('funnel_id, allow_download')
        .eq('share_token', token)
        .maybeSingle();

      console.log('Share query result:', { shareData, shareError });

      if (shareError) {
        console.error('Share error:', shareError);
        setError(`Erro ao buscar compartilhamento: ${shareError.message}`);
        return;
      }

      if (!shareData) {
        console.error('No share data found for token:', token);
        setError('Dashboard compartilhado não encontrado');
        return;
      }

      console.log('Share data found:', shareData);
      setAllowDownload(shareData.allow_download);

      // Buscar dados do funil
      const { data: funnelData, error: funnelError } = await supabase
        .from('funnels')
        .select('name')
        .eq('id', shareData.funnel_id)
        .maybeSingle();

      console.log('Funnel query result:', { funnelData, funnelError });

      if (funnelError) {
        console.error('Funnel error:', funnelError);
        setError(`Erro ao buscar funil: ${funnelError.message}`);
        return;
      }

      if (!funnelData) {
        console.error('No funnel data found for id:', shareData.funnel_id);
        setError('Funil não encontrado');
        return;
      }

      console.log('Funnel data found:', funnelData);
      setFunnelName(funnelData.name);

      // Buscar métricas do funil
      const { data: metricsData, error: metricsError } = await supabase
        .from('node_metrics')
        .select('metric_category, metric_value')
        .eq('funnel_id', shareData.funnel_id);

      console.log('Metrics query result:', { metricsData, metricsError, funnelId: shareData.funnel_id });

      if (metricsError) {
        console.error('Metrics error:', metricsError);
        toast.error(`Erro ao carregar métricas: ${metricsError.message}`);
        // Continuar com dados vazios em caso de erro
      }

      // Verificar se temos dados de métricas
      if (!metricsData || metricsData.length === 0) {
        console.log('No metrics data found for funnel:', shareData.funnel_id);
        // Manter dados zerados mas não mostrar erro, pois pode ser um funil sem métricas
      }

      // Processar métricas
      const groupedMetrics = (metricsData || []).reduce((acc: any, metric) => {
        console.log('Processing metric:', metric);
        if (!acc[metric.metric_category]) {
          acc[metric.metric_category] = 0;
        }
        acc[metric.metric_category] += Number(metric.metric_value) || 0;
        return acc;
      }, {});

      console.log('Grouped metrics:', groupedMetrics);

      const visitantes = groupedMetrics.visitantes_unicos || 0;
      const leads = (groupedMetrics.cliques || 0) + (groupedMetrics.lead_capturado || 0);
      const oportunidades = groupedMetrics.oportunidades || 0;
      const vendas = groupedMetrics.vendas_realizadas || 0;

      const conversao_leads = visitantes > 0 ? (leads / visitantes) * 100 : 0;
      const conversao_oportunidades = leads > 0 ? (oportunidades / leads) * 100 : 0;
      const conversao_vendas = oportunidades > 0 ? (vendas / oportunidades) * 100 : 0;

      const processedData = {
        visitantes,
        leads,
        oportunidades,
        vendas,
        conversao_leads: Math.round(conversao_leads * 100) / 100,
        conversao_oportunidades: Math.round(conversao_oportunidades * 100) / 100,
        conversao_vendas: Math.round(conversao_vendas * 100) / 100
      };

      console.log('Final processed dashboard data:', processedData);
      setDashboardData(processedData);

      // Feedback para o usuário sobre o status dos dados
      if (processedData.visitantes === 0 && processedData.leads === 0 && processedData.oportunidades === 0 && processedData.vendas === 0) {
        console.log('Dashboard loaded but no metrics found');
        toast.info('Dashboard carregado, mas ainda não há métricas registradas para este funil.');
      } else {
        console.log('Dashboard loaded successfully with data');
        toast.success('Dashboard carregado com sucesso!');
      }

    } catch (error) {
      console.error('Unexpected error loading shared dashboard:', error);
      setError(`Erro inesperado: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      toast.error('Erro inesperado ao carregar dashboard');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    const csvData = [
      ['Métrica', 'Valor', 'Taxa de Conversão'],
      ['Visitantes', dashboardData.visitantes.toString(), ''],
      ['Leads', dashboardData.leads.toString(), `${dashboardData.conversao_leads}%`],
      ['Oportunidades', dashboardData.oportunidades.toString(), `${dashboardData.conversao_oportunidades}%`],
      ['Vendas', dashboardData.vendas.toString(), `${dashboardData.conversao_vendas}%`]
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `dashboard-${funnelName}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download iniciado!');
    }
  };

  const maxValue = Math.max(dashboardData.visitantes, dashboardData.leads, dashboardData.oportunidades, dashboardData.vendas);

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard não encontrado</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Dashboard - {funnelName}
            </h1>
            <p className="text-gray-600">Dashboard compartilhado publicamente</p>
          </div>
          {allowDownload && (
            <Button onClick={downloadCSV}>
              <Download className="w-4 h-4 mr-2" />
              Download CSV
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {/* Funil Visual */}
          <Card>
            <CardHeader>
              <CardTitle>Visualização do Funil</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gradient-to-b from-blue-50 to-green-50 p-8 rounded-lg">
                <div className="space-y-4">
                  {/* Visitantes */}
                  <div className="flex flex-col items-center">
                    <div 
                      className="bg-sky-400 text-white rounded-t-lg flex items-center justify-center text-center transition-all duration-300 hover:bg-sky-500"
                      style={{ 
                        width: getFunnelSectionWidth(dashboardData.visitantes),
                        height: `${getFunnelSectionHeight(0)}px`
                      }}
                    >
                      <div>
                        <Users className="w-6 h-6 mx-auto mb-1" />
                        <p className="font-bold text-lg">{dashboardData.visitantes.toLocaleString()}</p>
                        <p className="text-sm opacity-90">Visitantes</p>
                      </div>
                    </div>
                    {dashboardData.conversao_leads > 0 && (
                      <div className="text-xs text-gray-600 mt-1">
                        ↓ {dashboardData.conversao_leads.toFixed(2)}%
                      </div>
                    )}
                  </div>

                  {/* Leads */}
                  <div className="flex flex-col items-center">
                    <div 
                      className="bg-purple-400 text-white flex items-center justify-center text-center transition-all duration-300 hover:bg-purple-500"
                      style={{ 
                        width: getFunnelSectionWidth(dashboardData.leads),
                        height: `${getFunnelSectionHeight(1)}px`
                      }}
                    >
                      <div>
                        <TrendingUp className="w-6 h-6 mx-auto mb-1" />
                        <p className="font-bold text-lg">{dashboardData.leads.toLocaleString()}</p>
                        <p className="text-sm opacity-90">Leads</p>
                      </div>
                    </div>
                    {dashboardData.conversao_oportunidades > 0 && (
                      <div className="text-xs text-gray-600 mt-1">
                        ↓ {dashboardData.conversao_oportunidades.toFixed(2)}%
                      </div>
                    )}
                  </div>

                  {/* Oportunidades */}
                  <div className="flex flex-col items-center">
                    <div 
                      className="bg-orange-500 text-white flex items-center justify-center text-center transition-all duration-300 hover:bg-orange-600"
                      style={{ 
                        width: getFunnelSectionWidth(dashboardData.oportunidades),
                        height: `${getFunnelSectionHeight(2)}px`
                      }}
                    >
                      <div>
                        <TrendingDown className="w-6 h-6 mx-auto mb-1" />
                        <p className="font-bold text-lg">{dashboardData.oportunidades.toLocaleString()}</p>
                        <p className="text-sm opacity-90">Oportunidades</p>
                      </div>
                    </div>
                    {dashboardData.conversao_vendas > 0 && (
                      <div className="text-xs text-gray-600 mt-1">
                        ↓ {dashboardData.conversao_vendas.toFixed(2)}%
                      </div>
                    )}
                  </div>

                  {/* Vendas */}
                  <div className="flex flex-col items-center">
                    <div 
                      className="bg-green-500 text-white rounded-b-lg flex items-center justify-center text-center transition-all duration-300 hover:bg-green-600"
                      style={{ 
                        width: getFunnelSectionWidth(dashboardData.vendas),
                        height: `${getFunnelSectionHeight(3)}px`
                      }}
                    >
                      <div>
                        <BarChart3 className="w-6 h-6 mx-auto mb-1" />
                        <p className="font-bold text-lg">{dashboardData.vendas.toLocaleString()}</p>
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
                <p className="text-2xl font-bold text-sky-700">{dashboardData.visitantes.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Visitantes únicos</p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-purple-600">Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-700">{dashboardData.leads.toLocaleString()}</p>
                <p className="text-xs text-gray-500">
                  {dashboardData.conversao_leads > 0 && `${dashboardData.conversao_leads.toFixed(2)}% dos visitantes`}
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-orange-600">Oportunidades</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-700">{dashboardData.oportunidades.toLocaleString()}</p>
                <p className="text-xs text-gray-500">
                  {dashboardData.conversao_oportunidades > 0 && `${dashboardData.conversao_oportunidades.toFixed(2)}% dos leads`}
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-green-600">Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-700">{dashboardData.vendas.toLocaleString()}</p>
                <p className="text-xs text-gray-500">
                  {dashboardData.conversao_vendas > 0 && `${dashboardData.conversao_vendas.toFixed(2)}% das oportunidades`}
                </p>
              </CardContent>
            </Card>
          </div>

          {dashboardData.visitantes === 0 && dashboardData.leads === 0 && dashboardData.oportunidades === 0 && dashboardData.vendas === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhum dado disponível</h3>
                <p className="text-gray-500">
                  Este funil ainda não possui métricas registradas.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
