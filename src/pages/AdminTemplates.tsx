
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Plus,
  Search,
  ArrowLeft,
  LogOut,
  Eye,
  Trash2
} from "lucide-react";
import { useAdminTemplates } from "@/hooks/useAdminTemplates";
import { CreateTemplateDialog } from "@/components/CreateTemplateDialog";
import { supabase } from "@/integrations/supabase/client";
import { AdminTemplate } from "@/types/adminTemplates";

const AdminTemplates = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const { templates, loading, deleteTemplate } = useAdminTemplates();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin-auth');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin-auth');
  };

  const handleDeleteTemplate = async (template: AdminTemplate) => {
    if (window.confirm(`Tem certeza que deseja excluir o template "${template.name}"?`)) {
      await deleteTemplate(template.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Target className="w-12 h-12 mx-auto mb-4 animate-spin" style={{ color: 'rgb(6, 214, 160)' }} />
          <p className="text-gray-600 dark:text-gray-400">Carregando templates...</p>
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
              Admin - Templates
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => setShowCreateDialog(true)}
              style={{ backgroundColor: 'rgb(6, 214, 160)' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Template
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Admin
            </Button>
            <Button variant="destructive" onClick={handleLogout} size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gerenciar Templates
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Crie e gerencie templates de funis para os usuários
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
              {searchTerm ? 'Nenhum template encontrado' : 'Nenhum template criado ainda'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'Tente ajustar sua pesquisa' : 'Comece criando seu primeiro template'}
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => setShowCreateDialog(true)}
                style={{ backgroundColor: 'rgb(6, 214, 160)' }}
              >
                <Plus className="w-5 h-5 mr-2" />
                Criar Primeiro Template
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
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
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {template.description || 'Sem descrição'}
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Criado em {new Date(template.created_at).toLocaleDateString('pt-BR')}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {template.preview_url && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(template.preview_url, '_blank')}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Visualizar
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteTemplate(template)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Create Template Dialog */}
      <CreateTemplateDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />
    </div>
  );
};

export default AdminTemplates;
