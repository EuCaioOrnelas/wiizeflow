
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline } from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export const RichTextEditor = ({ content, onChange, placeholder, className = '' }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState<Selection | null>(null);

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content || '';
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleSelectionChange = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
        setSelection(sel);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  const applyFormat = (command: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      
      // Restore selection if it exists
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const newSelection = window.getSelection();
        if (newSelection) {
          newSelection.removeAllRanges();
          newSelection.addRange(range);
        }
      }

      document.execCommand(command, false);
      handleInput();
    }
  };

  const isCommandActive = (command: string) => {
    try {
      return document.queryCommandState(command);
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-1 border-b pb-2">
        <Button
          size="sm"
          variant={isCommandActive('bold') ? "default" : "outline"}
          onClick={() => applyFormat('bold')}
          type="button"
        >
          <Bold className="w-3 h-3" />
        </Button>
        <Button
          size="sm"
          variant={isCommandActive('italic') ? "default" : "outline"}
          onClick={() => applyFormat('italic')}
          type="button"
        >
          <Italic className="w-3 h-3" />
        </Button>
        <Button
          size="sm"
          variant={isCommandActive('underline') ? "default" : "outline"}
          onClick={() => applyFormat('underline')}
          type="button"
        >
          <Underline className="w-3 h-3" />
        </Button>
      </div>
      
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className={`min-h-[80px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rich-text-editor ${className}`}
        style={{ whiteSpace: 'pre-wrap' }}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
      />
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .rich-text-editor:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            pointer-events: none;
          }
        `
      }} />
    </div>
  );
};
