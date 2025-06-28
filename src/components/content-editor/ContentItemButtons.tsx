
import { Button } from '@/components/ui/button';
import {
  Type,
  List,
  CheckSquare,
} from 'lucide-react';
import { ContentItem } from '@/types/contentEditor';

interface ContentItemButtonsProps {
  onAddItem: (type: ContentItem['type']) => void;
}

export const ContentItemButtons = ({ onAddItem }: ContentItemButtonsProps) => {
  return (
    <div className="flex space-x-2">
      <Button size="sm" variant="outline" onClick={() => onAddItem('h1')}>
        <Type className="w-4 h-4 mr-2" />
        H1
      </Button>
      <Button size="sm" variant="outline" onClick={() => onAddItem('h2')}>
        <Type className="w-4 h-4 mr-2" />
        H2
      </Button>
      <Button size="sm" variant="outline" onClick={() => onAddItem('paragraph')}>
        <Type className="w-4 h-4 mr-2" />
        Parágrafo
      </Button>
      <Button size="sm" variant="outline" onClick={() => onAddItem('list')}>
        <List className="w-4 h-4 mr-2" />
        Lista
      </Button>
      <Button size="sm" variant="outline" onClick={() => onAddItem('checklist')}>
        <CheckSquare className="w-4 h-4 mr-2" />
        Checklist
      </Button>
    </div>
  );
};
