
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Copy, Download, Share2, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ShareDashboardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  funnelId: string;
  funnelName: string;
}

export const ShareDashboardDialog = ({ isOpen, onClose, funnelId, funnelName }: ShareDashboardDialogProps) => {
  const [shareUrl, setShareUrl] = useState('');
  const [allowDownload, setAllowDownload] = useState(true);
  const [loading, setLoading] = useState(false);
  const [shareToken, setShareToken] = useState('');

  const generateShareLink = async () => {
    setLoading(true);
    try {
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      console.log('Generated token:', token);
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast.error('Usuário não autenticado');
        return;
      }

      console.log('Creating dashboard share for funnel:', funnelId);
      const { error } = await supabase
        .from('dashboard_shares')
        .insert({
          funnel_id: funnelId,
          owner_id: user.user.id,
          share_token: token,
          allow_download: allowDownload
        });

      if (error) {
        console.error('Error creating dashboard share:', error);
        throw error;
      }

      const url = `${window.location.origin}/shared-dashboard/${token}`;
      console.log('Generated share URL:', url);
      setShareUrl(url);
      setShareToken(token);
      toast.success('Link de compartilhamento gerado com sucesso!');
    } catch (error) {
      console.error('Error generating share link:', error);
      toast.error('Erro ao gerar link de compartilhamento');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copiado para a área de transferência!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Erro ao copiar link');
    }
  };

  const updateShareSettings = async () => {
    if (!shareToken) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('dashboard_shares')
        .update({ allow_download: allowDownload })
        .eq('share_token', shareToken);

      if (error) throw error;
      toast.success('Configurações atualizadas!');
    } catch (error) {
      console.error('Error updating share settings:', error);
      toast.error('Erro ao atualizar configurações');
    } finally {
      setLoading(false);
    }
  };

  const openSharedDashboard = () => {
    if (shareUrl) {
      console.log('Opening shared dashboard:', shareUrl);
      window.open(shareUrl, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Compartilhar Dashboard - {funnelName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="allow-download">Permitir download dos dados</Label>
            <Switch
              id="allow-download"
              checked={allowDownload}
              onCheckedChange={setAllowDownload}
            />
          </div>

          {!shareUrl ? (
            <Button 
              onClick={generateShareLink} 
              disabled={loading}
              className="w-full"
            >
              <Share2 className="w-4 h-4 mr-2" />
              {loading ? 'Gerando...' : 'Gerar Link de Compartilhamento'}
            </Button>
          ) : (
            <div className="space-y-3">
              <div>
                <Label htmlFor="share-url">Link de Compartilhamento</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="share-url"
                    value={shareUrl}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={openSharedDashboard}
                  className="flex-1"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visualizar
                </Button>
                <Button
                  onClick={updateShareSettings}
                  disabled={loading}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {loading ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
