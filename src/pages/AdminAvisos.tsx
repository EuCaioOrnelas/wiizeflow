
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Plus, 
  ArrowLeft, 
  LogOut, 
  Crown,
  Trash2,
  Calendar,
  Eye,
  EyeOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Aviso {
  id: string;
  titulo: string;
  descricao: string;
  data_criacao: string;
  ativo: boolean;
  created_by: string | null;
}

const AdminAvisos = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [creating, setCreating] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin-auth');
        return;
      }

      // Verificar se é admin
      const { data: profileData } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', session.user.id)
        .single();

      const isAdminUser = profileData?.email === 'adminwiize@wiizeflow.com.br' || 
                         profileData?.email === 'admin@wiizeflow.com.br';
      
      setIsAdmin(isAdminUser);
      
      if (isAdminUser) {
        loadAvisos();
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  const loadAvisos = async () => {
    try {
      const { data, error } = await supabase
        .from('avisos')
        .select('*')
        .order('data_criacao', { ascending: false });

      if (error) {
        console.error('Error loading avisos:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar avisos.",
          variant: "destructive",
        });
        return;
      }

      setAvisos(data || []);
    } catch (error) {
      console.error('Error loading avisos:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar avisos.",
        variant: "destructive",
      });
    }
  };

  const createAviso = async () => {
    if (!titulo.trim() || !descricao.trim()) {
      toast({
        title: "Erro",
        description: "Título e descrição são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('avisos')
        .insert({
          titulo: titulo.trim(),
          descricao: descricao.trim(),
          created_by: user?.id || null
        });

      if (error) {
        console.error('Error creating aviso:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar aviso.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso!",
        description: "Aviso criado com sucesso.",
      });

      setTitulo("");
      setDescricao("");
      setShowForm(false);
      loadAvisos();

    } catch (error) {
      console.error('Error creating aviso:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar aviso.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const toggleAvisoStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('avisos')
        .update({ ativo: !currentStatus })
        .eq('id', id);

      if (error) {
        console.error('Error updating aviso:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar status do aviso.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso!",
        description: `Aviso ${!currentStatus ? 'ativado' : 'desativado'} com sucesso.`,
      });

      loadAvisos();

    } catch (error) {
      console.error('Error updating aviso:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao atualizar aviso.",
        variant: "destructive",
      });
    }
  };

  const deleteAviso = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este aviso?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('avisos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting aviso:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir aviso.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso!",
        description: "Aviso excluído com sucesso.",
      });

      loadAvisos();

    } catch (error) {
      console.error('Error deleting aviso:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao excluir aviso.",
        variant: "destructive",
      });
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/admin-auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Target className="w-12 h-12 mx-auto mb-4 animate-spin" style={{ color: 'rgb(6, 214, 160)' }} />
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Acesso Negado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Você não tem permissão para acessar esta área.
          </p>
          <Button onClick={() => navigate('/admin-auth')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ir para Login Admin
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Target className="w-8 h-8" style={{ color: 'rgb(6, 214, 160)' }} />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">WiizeFlow</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800" style={{ backgroundColor: 'rgba(6, 214, 160, 0.1)', color: 'rgb(6, 214, 160)' }}>
              <Crown className="w-3 h-3 mr-1" />
              Admin - Avisos
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/admin')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Painel
            </Button>
            <Button variant="destructive" onClick={logout} size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Gerenciar Avisos
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Crie e gerencie avisos para os usuários da plataforma
              </p>
            </div>
            
            <Button 
              onClick={() => setShowForm(!showForm)}
              style={{ backgroundColor: 'rgb(6, 214, 160)' }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Novo Aviso
            </Button>
          </div>

          {/* Formulário de Criação */}
          {showForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Criar Novo Aviso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título *
                  </label>
                  <Input
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Digite o título do aviso"
                    maxLength={100}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descrição *
                  </label>
                  <Textarea
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Digite a descrição do aviso"
                    rows={4}
                    maxLength={500}
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowForm(false);
                      setTitulo("");
                      setDescricao("");
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={createAviso}
                    disabled={creating || !titulo.trim() || !descricao.trim()}
                    style={{ backgroundColor: 'rgb(6, 214, 160)' }}
                  >
                    {creating ? 'Criando...' : 'Criar Aviso'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Lista de Avisos */}
        <div className="space-y-4">
          {avisos.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Nenhum aviso criado ainda
              </h3>
              <p className="text-gray-500 mb-6">
                Comece criando seu primeiro aviso para os usuários
              </p>
            </div>
          ) : (
            avisos.map((aviso) => (
              <Card key={aviso.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center space-x-2">
                        <span>{aviso.titulo}</span>
                        <Badge variant={aviso.ativo ? "default" : "secondary"}>
                          {aviso.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </CardTitle>
                      <div className="flex items-center text-sm text-gray-500 mt-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(aviso.data_criacao).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAvisoStatus(aviso.id, aviso.ativo)}
                      >
                        {aviso.ativo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteAviso(aviso.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {aviso.descricao}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminAvisos;
