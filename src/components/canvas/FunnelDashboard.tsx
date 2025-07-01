
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingDown, TrendingUp, Users, Share2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { FunnelDashboardData } from '@/types/metrics';
import { ShareDashboardDialog } from './ShareDashboardDialog';

interface FunnelDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  funnelId: string;
  funnelName: string;
}

export const FunnelDashboard = ({ isOpen, onClose, funnelId, funnelName }: FunnelDashboardProps) => {
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
  const [showShareDialog, setShowShareDialog] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadDashboardData();
    }
  }, [isOpen, funnelId]);

  const loadDashboardData = async () => {
    setLoading(true);
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

      setDashboardData({
        visitantes,
        leads,
        oportunidades,
        vendas,
        conversao_leads: Math.round(conversao_leads * 100) / 100,
        conversao_oportunidades: Math.round(conversao_oportunidades * 100) / 100,
        conversao_vendas: Math.round(conversao_vendas * 100) / 100
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
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

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Dashboard do Funil - {funnelName}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowShareDialog(true)}
                className="ml-2"
              >
                <Share2 className="w-4 h-4 mr-1" />
                Compartilhar
              </Button>
            </DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Carregando dados do dashboard...</p>
              </div>
            </div>
          ) : (
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
                      Adicione métricas aos elementos do seu funil para visualizar o dashboard.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ShareDashboardDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        funnelId={funnelId}
        funnelName={funnelName}
      />
    </>
  );
};
