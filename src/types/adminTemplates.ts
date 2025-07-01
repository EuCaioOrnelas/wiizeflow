
export interface AdminTemplate {
  id: string;
  name: string;
  description?: string;
  cover_image_url?: string;
  template_file_url?: string;
  preview_url?: string;
  canvas_data?: any;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}
