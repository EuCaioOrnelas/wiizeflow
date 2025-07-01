
-- Create a table for dashboard shares
CREATE TABLE public.dashboard_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funnel_id UUID NOT NULL REFERENCES public.funnels(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL,
  share_token TEXT NOT NULL UNIQUE,
  allow_download BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.dashboard_shares ENABLE ROW LEVEL SECURITY;

-- Create policy that allows owners to manage their dashboard shares
CREATE POLICY "Users can manage their own dashboard shares" 
  ON public.dashboard_shares 
  FOR ALL 
  USING (auth.uid() = owner_id);

-- Create policy that allows public access to shared dashboards for viewing
CREATE POLICY "Public can view shared dashboards" 
  ON public.dashboard_shares 
  FOR SELECT 
  USING (true);

-- Add trigger to update updated_at column
CREATE TRIGGER update_dashboard_shares_updated_at
  BEFORE UPDATE ON public.dashboard_shares
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
