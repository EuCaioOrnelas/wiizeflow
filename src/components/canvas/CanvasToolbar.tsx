
import { Button } from '@/components/ui/button';
import { Save, Share2 } from 'lucide-react';

// Interface para as propriedades do componente
interface CanvasToolbarProps {
  onExportAsImage: () => void;  // Função para exportar como imagem
  onExportAsPDF: () => void;    // Função para exportar como PDF
  onSave: () => void;           // Função para salvar o canvas
}

/**
 * Componente de barra de ferramentas do Canvas
 * 
 * Funcionalidades:
 * - Botão para compartilhar (futuro)
 * - Botão para salvar canvas
 * - Interface minimalista e responsiva
 * 
 * Nota: As funções de exportação estão nas props mas não são usadas
 * atualmente na interface (podem ser implementadas futuramente)
 */
export const CanvasToolbar = ({
  onSave  // Apenas a função de salvar é utilizada atualmente
}: CanvasToolbarProps) => {
  return (
    <>
      {/* Botão de Compartilhar */}
      <Button variant="outline" size="sm">
        <Share2 className="w-4 h-4 mr-2" />
        Compartilhar
      </Button>
      
      {/* Botão de Salvar */}
      <Button onClick={onSave} className="bg-green-600 hover:bg-green-700">
        <Save className="w-4 h-4 mr-2" />
        Salvar
      </Button>
    </>
  );
};
