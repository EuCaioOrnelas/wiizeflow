import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Target, 
  Search,
  ArrowLeft,
  LogOut,
  Eye,
  User
} from "lucide-react";
import { useAdminTemplates } from "@/hooks/useAdminTemplates";
import { supabase } from "@/integrations/supabase/client";

const TemplatesProntos = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [displayLimit, setDisplayLimit] = useState(9);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { templates, loading } = useAdminTemplates();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/auth');
          return;
        }
        
        setUser(session.user);
        
        // Buscar o perfil do usuário para verificar o plano
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('name, plan_type')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Erro ao buscar perfil:', error);
          // Se não conseguir buscar o perfil, redirecionar para upgrade por segurança
          navigate('/templates-upgrade');
          return;
        }
        
        setUserProfile(profile);
        
        // Verificar se o usuário tem plano pago
        if (!profile || profile.plan_type === 'free' || !profile.plan_type) {
          console.log('Usuário com plano gratuito, redirecionando para upgrade');
          navigate('/templates-upgrade');
          return;
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Erro na verificação de autenticação:', error);
        navigate('/templates-upgrade');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedTemplates = filteredTemplates.slice(0, displayLimit);
  const hasMoreTemplates = filteredTemplates.length > displayLimit;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleLoadMore = () => {
    setDisplayLimit(prev => prev + 9);
  };

  const handleViewTemplate = (template: any) => {
    if (template.preview_url) {
      window.open(template.preview_url, '_blank');
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Target className="w-12 h-12 mx-auto mb-4 animate-spin" style={{ color: 'rgb(6, 214, 160)' }} />
          <p className="text-gray-600">Carregando templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white border-b transition-colors duration-300">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Target className="w-8 h-8 text-green-600" style={{ color: 'rgb(6, 214, 160)' }} />
            <span className="text-2xl font-bold text-gray-900">WiizeFlow</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              Olá, {userProfile?.name || user?.email?.split('@')[0] || 'Usuário'}!
            </span>
            <Button variant="outline" onClick={() => navigate('/account')} size="sm">
              <User className="w-4 h-4 mr-2" />
              Conta
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')} size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="outline" onClick={handleLogout} size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Templates Prontos
          </h1>
          <p className="text-gray-600">
            Explore templates de funis prontos para usar. Clique em "Visualizar" para ver o funil e baixá-lo.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchTerm && (
            <p className="text-sm text-gray-600 mt-2">
              {filteredTemplates.length} template(s) encontrado(s) para "{searchTerm}"
            </p>
          )}
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-16">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? 'Nenhum template encontrado' : 'Nenhum template disponível'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'Tente ajustar sua pesquisa' : 'Novos templates serão adicionados em breve'}
            </p>
            {searchTerm && (
              <Button 
                onClick={() => setSearchTerm("")}
                variant="outline"
              >
                Limpar Busca
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                      {template.cover_image_url ? (
                        <img 
                          src={template.cover_image_url} 
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Target className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {template.description || 'Template de funil pronto para uso'}
                    </p>
                    
                    <div className="flex justify-center">
                      {template.preview_url ? (
                        <Button 
                          onClick={() => handleViewTemplate(template)}
                          className="w-full text-white hover:text-white"
                          style={{ backgroundColor: 'rgb(6, 214, 160)' }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Visualizar & Baixar Template
                        </Button>
                      ) : (
                        <Button 
                          disabled
                          variant="outline"
                          className="w-full"
                        >
                          Template em breve
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More Button */}
            {hasMoreTemplates && (
              <div className="text-center mt-8">
                <Button 
                  onClick={handleLoadMore}
                  variant="outline"
                  className="px-8"
                >
                  Ver mais Templates ({filteredTemplates.length - displayLimit} restantes)
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default TemplatesProntos;
