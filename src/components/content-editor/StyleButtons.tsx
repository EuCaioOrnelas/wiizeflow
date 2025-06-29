
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Underline,
} from 'lucide-react';
import { ContentItem } from '@/types/contentEditor';

interface StyleButtonsProps {
  style: ContentItem['style'];
  onStyleChange: (style: ContentItem['style']) => void;
}

export const StyleButtons = ({ style, onStyleChange }: StyleButtonsProps) => {
  const toggleStyle = (styleKey: keyof NonNullable<ContentItem['style']>) => {
    const currentStyle = style || {};
    const newStyle = {
      ...currentStyle,
      [styleKey]: !currentStyle[styleKey]
    };
    onStyleChange(newStyle);
  };

  return (
    <div className="flex items-center space-x-1">
      <Button
        size="sm"
        variant={style?.bold ? "default" : "outline"}
        onClick={() => toggleStyle('bold')}
      >
        <Bold className="w-3 h-3" />
      </Button>
      <Button
        size="sm"
        variant={style?.italic ? "default" : "outline"}
        onClick={() => toggleStyle('italic')}
      >
        <Italic className="w-3 h-3" />
      </Button>
      <Button
        size="sm"
        variant={style?.underline ? "default" : "outline"}
        onClick={() => toggleStyle('underline')}
      >
        <Underline className="w-3 h-3" />
      </Button>
    </div>
  );
};
