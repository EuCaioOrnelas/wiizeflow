
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Aviso {
  id: string;
  titulo: string;
  descricao: string;
  data_criacao: string;
  ativo: boolean;
}

const NotificationBell = () => {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadAvisos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('avisos')
        .select('*')
        .eq('ativo', true)
        .gte('data_criacao', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('data_criacao', { ascending: false });

      if (error) {
        console.error('Error loading avisos:', error);
        return;
      }

      setAvisos(data || []);
    } catch (error) {
      console.error('Error loading avisos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar avisos automaticamente ao montar o componente
  useEffect(() => {
    loadAvisos();
  }, []);

  // Configurar realtime para novos avisos
  useEffect(() => {
    const channel = supabase
      .channel('avisos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'avisos'
        },
        (payload) => {
          console.log('Aviso change detected:', payload);
          // Recarregar avisos quando houver mudanças
          loadAvisos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleBellClick = () => {
    setShowPopup(!showPopup);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Hoje';
    } else if (diffDays === 2) {
      return 'Ontem';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} dias atrás`;
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  };

  // Fechar popup ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showPopup && !target.closest('.notification-bell-container')) {
        setShowPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPopup]);

  return (
    <div className="relative notification-bell-container">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBellClick}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {avisos.length > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs animate-pulse"
            style={{ backgroundColor: 'rgb(6, 214, 160)', color: 'white' }}
          >
            {avisos.length > 9 ? '9+' : avisos.length}
          </Badge>
        )}
      </Button>

      {showPopup && (
        <Card className="absolute right-0 top-full mt-2 w-80 max-w-sm z-50 shadow-lg border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Avisos</span>
              {loading && (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-4">
                <p className="text-gray-500">Carregando avisos...</p>
              </div>
            ) : avisos.length === 0 ? (
              <div className="text-center py-4">
                <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Nenhum aviso recente</p>
              </div>
            ) : (
              <div className="space-y-3">
                {avisos.map((aviso) => (
                  <div 
                    key={aviso.id} 
                    className="border-b border-gray-100 last:border-b-0 pb-3 last:pb-0"
                  >
                    <h4 className="font-medium text-gray-900 mb-1">
                      {aviso.titulo}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                      {aviso.descricao}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(aviso.data_criacao)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationBell;
