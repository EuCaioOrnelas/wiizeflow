
export interface ContentItem {
  id: string;
  type: 'h1' | 'h2' | 'subtitle' | 'paragraph' | 'list' | 'checklist' | 'link';
  content: string;
  style?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    color?: string;
    highlight?: boolean;
  };
  url?: string; // For links
  items?: { id: string; text: string; checked?: boolean }[]; // For lists and checklists
}

export interface ContentEditorState {
  title: string;
  description: string;
  metrics: string;
  contentItems: ContentItem[];
}
