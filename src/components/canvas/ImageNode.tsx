import { memo, useState, useRef, useCallback } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, Image as ImageIcon, X, Settings } from 'lucide-react';

export interface ImageNodeData extends Record<string, unknown> {
  label: string;
  type: 'image';
  imageUrl?: string;
  imageFile?: File;
  width?: number;
  height?: number;
}

interface ImageNodeProps extends NodeProps {
  data: ImageNodeData;
  onUpdateNode?: (nodeId: string, updates: Partial<ImageNodeData>) => void;
  isReadOnly?: boolean;
}

export const ImageNode = memo(({ id, data, selected, onUpdateNode, isReadOnly = false }: ImageNodeProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onUpdateNode) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${id}_${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error } = await supabase.storage
        .from('canvas-images')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('canvas-images')
        .getPublicUrl(fileName);

      // Create image to get dimensions
      const img = new Image();
      img.onload = () => {
        // Calculate scaled dimensions (max 300px width/height)
        const maxSize = 300;
        let { width, height } = img;
        
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        onUpdateNode(id, {
          imageUrl: publicUrl,
          width: Math.round(width),
          height: Math.round(height),
        });

        toast({
          title: "Sucesso",
          description: "Imagem carregada com sucesso!",
        });
      };

      img.src = publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar a imagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [id, onUpdateNode, toast]);

  const handleUploadClick = () => {
    if (!isReadOnly) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveImage = () => {
    if (onUpdateNode) {
      onUpdateNode(id, {
        imageUrl: undefined,
        width: 200,
        height: 150,
      });
    }
  };

  const selectedClass = selected ? 'ring-2 ring-blue-500 ring-opacity-50' : '';
  const nodeWidth = data.width || 200;
  const nodeHeight = data.height || 150;

  return (
    <div className={`relative ${selectedClass}`}>
      {/* Resizer - only show when selected and not read-only */}
      {selected && !isReadOnly && (
        <NodeResizer 
          minWidth={100}
          minHeight={75}
          maxWidth={500}
          maxHeight={400}
          keepAspectRatio={false}
          onResize={(event, { width, height }) => {
            if (onUpdateNode) {
              onUpdateNode(id, { width, height });
            }
          }}
        />
      )}
      
      {/* Handles for connections */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-1.5 h-1.5 !bg-gray-400 !border-gray-600 opacity-0 hover:opacity-60"
        style={{ top: -3 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-1.5 h-1.5 !bg-gray-400 !border-gray-600 opacity-0 hover:opacity-60"
        style={{ bottom: -3 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-1.5 h-1.5 !bg-gray-400 !border-gray-600 opacity-0 hover:opacity-60"
        style={{ left: -3 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-1.5 h-1.5 !bg-gray-400 !border-gray-600 opacity-0 hover:opacity-60"
        style={{ right: -3 }}
      />

      <div 
        className={`
          relative rounded-lg border-2 shadow-md bg-white border-gray-300
          transition-all duration-200 hover:shadow-lg overflow-hidden
          ${selectedClass}
        `}
        style={{ width: nodeWidth, height: nodeHeight }}
      >
        {data.imageUrl ? (
          <>
            <img
              src={data.imageUrl}
              alt={data.label}
              className="w-full h-full object-cover"
              draggable={false}
            />
            
            {/* Controls overlay */}
            {!isReadOnly && (
              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-6 w-6 p-0 bg-white/80 hover:bg-white"
                  onClick={handleUploadClick}
                  disabled={isUploading}
                >
                  <Upload className="w-3 h-3" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-6 w-6 p-0 bg-white/80 hover:bg-white text-red-600"
                  onClick={handleRemoveImage}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div 
            className={`w-full h-full flex flex-col items-center justify-center text-gray-400 transition-colors ${
              !isReadOnly ? 'cursor-pointer hover:text-gray-600' : 'cursor-default'
            }`}
            onClick={!isReadOnly ? handleUploadClick : undefined}
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mb-2"></div>
                <span className="text-sm">Carregando...</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-12 h-12 mb-2" />
                <span className="text-sm text-center px-2">
                  {isReadOnly ? 'Imagem não carregada' : 'Clique para adicionar imagem'}
                </span>
              </>
            )}
          </div>
        )}

        {/* Label overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
          {data.label}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
});

ImageNode.displayName = 'ImageNode';