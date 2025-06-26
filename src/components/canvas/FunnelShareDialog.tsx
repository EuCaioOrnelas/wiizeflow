
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Share2, Trash2, AlertTriangle, Eye } from "lucide-react";
import { useFunnelShare } from "@/hooks/useFunnelShare";
import { useToast } from "@/hooks/use-toast";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";

interface FunnelShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  funnelId: string;
  funnelName: string;
}

export const FunnelShareDialog = ({ 
  isOpen, 
  onClose, 
  funnelId, 
  funnelName 
}: FunnelShareDialogProps) => {
  const [allowDownload, setAllowDownload] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const { 
    loading, 
    shareData, 
    createShare, 
    getShare, 
    deleteShare 
  } = useFunnelShare();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && funnelId) {
      loadExistingShare();
    }
  }, [isOpen, funnelId]);

  useEffect(() => {
    if (shareData) {
      const baseUrl = window.location.origin;
      setShareUrl(`${baseUrl}/shared/${shareData.share_token}`);
      setAllowDownload(shareData.allow_download);
    } else {
      setShareUrl('');
      setAllowDownload(false);
    }
  }, [shareData]);

  const loadExistingShare = async () => {
    await getShare(funnelId);
  };

  const handleCreateShare = async () => {
    const result = await createShare(funnelId, allowDownload);
    if (result) {
      const baseUrl = window.location.origin;
      setShareUrl(`${baseUrl}/shared/${result.share_token}`);
    }
  };

  const handleCopyLink = async () => {
    if (shareUrl) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copiado!",
          description: "O link foi copiado para a área de transferência.",
        });
      } catch (error) {
        console.error('Failed to copy:', error);
        toast({
          title: "Erro",
          description: "Erro ao copiar link.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteShare = async () => {
    if (shareData && await deleteShare(shareData.id)) {
      setShareUrl('');
    }
  };

  const handleUpdateDownloadPermission = async (checked: boolean) => {
    setAllowDownload(checked);
    if (shareData) {
      // Atualizar permissão existente
      await createShare(funnelId, checked);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Compartilhar Funil
          </DialogTitle>
          <DialogDescription>
            Gere um link para compartilhar "{funnelName}" em modo de visualização.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Atenção:</strong> Qualquer pessoa com este link poderá visualizar seu funil. 
              Compartilhe apenas com pessoas de confiança.
            </AlertDescription>
          </Alert>

          {shareUrl ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="share-url">Link de Compartilhamento</Label>
                <div className="flex space-x-2">
                  <Input
                    id="share-url"
                    value={shareUrl}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleCopyLink}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allow-download"
                  checked={allowDownload}
                  onCheckedChange={(checked) => handleUpdateDownloadPermission(checked === true)}
                  disabled={loading}
                />
                <Label htmlFor="allow-download" className="text-sm">
                  Permitir que visualizadores baixem este funil como template
                </Label>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => window.open(shareUrl, '_blank')}
                  variant="outline"
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar
                </Button>
                <Button
                  onClick={handleDeleteShare}
                  variant="destructive"
                  disabled={loading}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remover Link
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allow-download"
                  checked={allowDownload}
                  onCheckedChange={(checked) => setAllowDownload(checked === true)}
                  disabled={loading}
                />
                <Label htmlFor="allow-download" className="text-sm">
                  Permitir que visualizadores baixem este funil como template
                </Label>
              </div>

              <Button
                onClick={handleCreateShare}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Gerando..." : "Gerar Link de Compartilhamento"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
