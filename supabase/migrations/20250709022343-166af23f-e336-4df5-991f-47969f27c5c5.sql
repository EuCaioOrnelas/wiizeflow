-- Create storage bucket for canvas images
INSERT INTO storage.buckets (id, name, public) VALUES ('canvas-images', 'canvas-images', true);

-- Create policies for canvas images
CREATE POLICY "Public access for canvas images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'canvas-images');

CREATE POLICY "Users can upload canvas images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'canvas-images');

CREATE POLICY "Users can update their canvas images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'canvas-images');

CREATE POLICY "Users can delete canvas images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'canvas-images');