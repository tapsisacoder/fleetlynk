-- Create storage bucket for receipts and documents
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('receipts', 'receipts', false, 10485760);

-- Create RLS policies for receipts bucket
CREATE POLICY "Users can upload receipts for their company"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'receipts' 
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = (SELECT company_id::text FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can view receipts for their company"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'receipts'
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = (SELECT company_id::text FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can delete receipts for their company"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'receipts'
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = (SELECT company_id::text FROM public.profiles WHERE user_id = auth.uid())
);