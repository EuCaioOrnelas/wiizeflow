
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Copy, Share2, AlertTriangle } from 'lucide-react';

interface ShareFunnelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  funnelId: string;
  funnelName: string;
}

export const ShareFunnelDialog = ({ isOpen, onClose, funnelId, funnelName }: ShareFunnelDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [allowDownload, setAllowDownload] = useState(false);
  const [hasExistingShare, setHasExistingShare] = useState(false);
  const { toast } = useToast();

  // Verificar se já existe um compartilhamento quando o dialog abrir
  useEffect(() => {
    if (isOpen && funnelId) {
      checkExistingShare();
    }
  }, [isOpen, funnelId]);

  const checkExistingShare = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) return;

      const { data: existingShare, error } = await supabase
        .from('funnel_shares')
        .select('share_token, allow_download')
        .eq('funnel_id', funnelId)
        .eq('owner_id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking existing share:', error);
        return;
      }

      if (existingShare) {
        setHasExistingShare(true);
        setAllowDownload(existingShare.allow_download);
        const url = `${window.location.origin}/shared/${existingShare.share_token}`;
        setShareUrl(url);
      } else {
        setHasExistingShare(false);
        setShareUrl('');
        setAllowDownload(false);
      }
    } catch (error) {
      console.error('Error checking existing share:', error);
    }
  };

  const generateShareToken = () => {
    return 'share_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  };

  const createOrUpdateShare = async () => {
    setLoading(true);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user) {
        console.error('Session error:', sessionError);
        toast({
          title: "Erro",
          description: "Você precisa estar logado para compartilhar funis.",
          variant: "destructive",
        });
        return;
      }

      console.log('Creating/updating share for funnel:', funnelId, 'user:', session.user.id);

      if (hasExistingShare) {
        // Atualizar compartilhamento existente
        const { error: updateError } = await supabase
          .from('funnel_shares')
          .update({ allow_download: allowDownload })
          .eq('funnel_id', funnelId)
          .eq('owner_id', session.user.id);

        if (updateError) {
          console.error('Error updating share:', updateError);
          toast({
            title: "Erro",
            description: "Erro ao atualizar compartilhamento.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Atualizado!",
          description: "Configurações de compartilhamento atualizadas com sucesso.",
        });
      } else {
        // Criar novo compartilhamento
        const shareToken = generateShareToken();
        console.log('Creating new share with token:', shareToken);
        
        const { error: insertError } = await supabase
          .from('funnel_shares')
          .insert({
            funnel_id: funnelId,
            owner_id: session.user.id,
            share_token: shareToken,
            allow_download: allowDownload
          });

        if (insertError) {
          console.error('Error creating share:', insertError);
          toast({
            title: "Erro",
            description: "Erro ao criar compartilhamento.",
            variant: "destructive",
          });
          return;
        }

        const url = `${window.location.origin}/shared/${shareToken}`;
        setShareUrl(url);
        setHasExistingShare(true);
        console.log('Generated share URL:', url);

        toast({
          title: "Link criado!",
          description: "Link de compartilhamento gerado com sucesso.",
        });
      }

    } catch (error) {
      console.error('Error creating/updating share:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao gerenciar compartilhamento.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Copiado!",
        description: "Link copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao copiar link.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    // Não limpar o estado ao fechar, manter para próxima abertura
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Compartilhar Funil
          </DialogTitle>
          <DialogDescription>
            Gere um link para compartilhar "{funnelName}" com outras pessoas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Aviso de segurança */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <strong>Atenção:</strong> Este link permitirá que qualquer pessoa visualize seu funil. 
                Compartilhe apenas com pessoas de confiança.
              </div>
            </div>
          </div>

          {/* Opção de permitir download */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-download">Permitir download como template</Label>
              <p className="text-sm text-gray-500">
                Pessoas com conta no WiizeFlow poderão usar como template
              </p>
            </div>
            <Switch
              id="allow-download"
              checked={allowDownload}
              onCheckedChange={setAllowDownload}
            />
          </div>

          {/* Campo do link gerado */}
          {shareUrl && (
            <div className="space-y-2">
              <Label>Link de compartilhamento</Label>
              <div className="flex gap-2">
                <Input value={shareUrl} readOnly className="font-mono text-sm" />
                <Button size="sm" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={createOrUpdateShare} disabled={loading}>
            {loading ? 'Processando...' : hasExistingShare ? (shareUrl ? 'Atualizar' : 'Gerar Link') : 'Gerar Link'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
