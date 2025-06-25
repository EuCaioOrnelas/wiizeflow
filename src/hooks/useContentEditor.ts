
import { useState, useEffect, useCallback } from 'react';
import { Node } from '@xyflow/react';
import { CustomNodeData, NodeContent } from '@/types/canvas';
import { ContentItem, ContentEditorState } from '@/types/contentEditor';

interface UseContentEditorProps {
  node: Node<CustomNodeData>;
  onSave: (content: NodeContent) => void;
}

export const useContentEditor = ({ node, onSave }: UseContentEditorProps) => {
  const [state, setState] = useState<ContentEditorState>({
    title: '',
    description: '',
    contentItems: [],
  });

  useEffect(() => {
    if (node.data.content) {
      const content = node.data.content as NodeContent;
      setState({
        title: content.title || '',
        description: content.description || '',
        contentItems: content.items || [],
      });
    }
  }, [node]);

  const setTitle = useCallback((title: string) => {
    setState(prev => ({ ...prev, title }));
  }, []);

  const setDescription = useCallback((description: string) => {
    setState(prev => ({ ...prev, description }));
  }, []);

  const addContentItem = useCallback((type: ContentItem['type']) => {
    const newItem: ContentItem = {
      id: Date.now().toString(),
      type,
      content: '',
      style: {},
    };

    if (type === 'list' || type === 'checklist') {
      newItem.items = [];
    }

    setState(prev => ({
      ...prev,
      contentItems: [...prev.contentItems, newItem]
    }));
  }, []);

  const updateContentItem = useCallback((id: string, updates: Partial<ContentItem>) => {
    setState(prev => ({
      ...prev,
      contentItems: prev.contentItems.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  }, []);

  const removeContentItem = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      contentItems: prev.contentItems.filter(item => item.id !== id)
    }));
  }, []);

  const addListItem = useCallback((itemId: string) => {
    setState(prev => ({
      ...prev,
      contentItems: prev.contentItems.map(item => {
        if (item.id === itemId && (item.type === 'list' || item.type === 'checklist')) {
          return {
            ...item,
            items: [
              ...(item.items || []),
              { 
                id: Date.now().toString(), 
                text: '', 
                checked: item.type === 'checklist' ? false : undefined 
              }
            ]
          };
        }
        return item;
      })
    }));
  }, []);

  const updateListItem = useCallback((itemId: string, listItemId: string, text: string) => {
    setState(prev => ({
      ...prev,
      contentItems: prev.contentItems.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            items: item.items?.map(listItem => 
              listItem.id === listItemId ? { ...listItem, text } : listItem
            )
          };
        }
        return item;
      })
    }));
  }, []);

  const toggleChecklistItem = useCallback((itemId: string, listItemId: string) => {
    setState(prev => ({
      ...prev,
      contentItems: prev.contentItems.map(item => {
        if (item.id === itemId && item.type === 'checklist') {
          return {
            ...item,
            items: item.items?.map(listItem => 
              listItem.id === listItemId ? { ...listItem, checked: !listItem.checked } : listItem
            )
          };
        }
        return item;
      })
    }));
  }, []);

  const handleSave = useCallback(() => {
    const content: NodeContent = {
      title: state.title,
      description: state.description,
      items: state.contentItems,
    };
    
    onSave(content);
  }, [state, onSave]);

  return {
    ...state,
    setTitle,
    setDescription,
    addContentItem,
    updateContentItem,
    removeContentItem,
    addListItem,
    updateListItem,
    toggleChecklistItem,
    handleSave,
  };
};
