
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { BarChart3, TrendingDown, TrendingUp, Users, Share2, Filter, X, CalendarIcon } from 'lucide-react';
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
  
  // Estados para filtros de data
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>();
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>();

  useEffect(() => {
    if (isOpen) {
      loadDashboardData();
    }
  }, [isOpen, funnelId, startDate, endDate]);

  // Funções para filtros rápidos
  const setQuickFilter = (filterType: string) => {
    const now = new Date();
    let start = '';
    let end = '';

    switch (filterType) {
      case 'current-year':
        start = `${now.getFullYear()}-01-01`;
        end = `${now.getFullYear()}-12-31`;
        break;
      case 'current-month':
        start = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        end = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${lastDay}`;
        break;
      case 'last-month':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
        start = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}-01`;
        const lastMonthLastDay = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0).getDate();
        end = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}-${lastMonthLastDay}`;
        break;
       case 'last-3-months':
         const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2);
         start = `${threeMonthsAgo.getFullYear()}-${String(threeMonthsAgo.getMonth() + 1).padStart(2, '0')}-01`;
         end = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()}`;
         break;
     }

     setStartDate(start);
     setEndDate(end);
     setSelectedStartDate(start ? new Date(start) : undefined);
     setSelectedEndDate(end ? new Date(end) : undefined);
     setActiveFilter(filterType);
   };

   const clearFilters = () => {
     setStartDate('');
     setEndDate('');
     setSelectedStartDate(undefined);
     setSelectedEndDate(undefined);
     setActiveFilter(null);
   };

   const handleStartDateSelect = (date: Date | undefined) => {
     setSelectedStartDate(date);
     setStartDate(date ? format(date, 'yyyy-MM-dd') : '');
     setActiveFilter(null);
   };

   const handleEndDateSelect = (date: Date | undefined) => {
     setSelectedEndDate(date);
     setEndDate(date ? format(date, 'yyyy-MM-dd') : '');
     setActiveFilter(null);
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('node_metrics')
        .select('metric_category, metric_value, metric_date')
        .eq('funnel_id', funnelId);

      // Aplicar filtros de data se definidos
      if (startDate) {
        query = query.gte('metric_date', startDate);
      }
      if (endDate) {
        query = query.lte('metric_date', endDate);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

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
              {/* Filtros de Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filtros por Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Filtros Rápidos */}
                  <div>
                    <Label className="text-sm font-medium">Filtros Rápidos</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button
                        variant={activeFilter === 'current-year' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setQuickFilter('current-year')}
                      >
                        Ano Atual
                      </Button>
                      <Button
                        variant={activeFilter === 'current-month' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setQuickFilter('current-month')}
                      >
                        Mês Atual
                      </Button>
                      <Button
                        variant={activeFilter === 'last-month' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setQuickFilter('last-month')}
                      >
                        Mês Passado
                      </Button>
                      <Button
                        variant={activeFilter === 'last-3-months' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setQuickFilter('last-3-months')}
                      >
                        Últimos 3 Meses
                      </Button>
                      {(startDate || endDate || activeFilter) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearFilters}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Limpar
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Campos de Data Customizados */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">
                        Data Inicial
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal mt-1"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedStartDate ? format(selectedStartDate, "dd/MM/yyyy") : "Selecionar data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedStartDate}
                            onSelect={handleStartDateSelect}
                            className="pointer-events-auto"
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Data Final
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal mt-1"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedEndDate ? format(selectedEndDate, "dd/MM/yyyy") : "Selecionar data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedEndDate}
                            onSelect={handleEndDateSelect}
                            className="pointer-events-auto"
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Indicador de Filtro Ativo */}
                  {(startDate || endDate) && (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        Filtro ativo: {startDate || 'Início'} até {endDate || 'Fim'}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

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
