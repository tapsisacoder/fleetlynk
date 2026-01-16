import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, FileImage, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ReceiptUploadProps {
  onUpload: (url: string) => void;
  existingUrl?: string | null;
  label?: string;
}

export function ReceiptUpload({ onUpload, existingUrl, label = "Receipt/Document" }: ReceiptUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { company } = useAuth();
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !company?.id) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({ 
        title: 'Invalid file type', 
        description: 'Please upload an image (JPG, PNG, WebP) or PDF',
        variant: 'destructive' 
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({ 
        title: 'File too large', 
        description: 'Maximum file size is 10MB',
        variant: 'destructive' 
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${company.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(fileName);

      // For private buckets, we need to create a signed URL instead
      const { data: signedData } = await supabase.storage
        .from('receipts')
        .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year

      const finalUrl = signedData?.signedUrl || publicUrl;
      
      setPreviewUrl(file.type.startsWith('image/') ? URL.createObjectURL(file) : null);
      onUpload(fileName); // Store the file path, not the signed URL
      
      toast({ title: 'Receipt uploaded successfully' });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ 
        title: 'Upload failed', 
        description: 'Could not upload the file. Please try again.',
        variant: 'destructive' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          onChange={handleFileSelect}
          className="hidden"
          id="receipt-upload"
        />
        
        {previewUrl ? (
          <div className="relative w-24 h-24 border rounded-lg overflow-hidden">
            <img 
              src={previewUrl} 
              alt="Receipt preview" 
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 w-6 h-6"
              onClick={handleRemove}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="h-24 w-full border-dashed"
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-6 h-6" />
                <span className="text-xs">Click to upload</span>
                <span className="text-xs text-muted-foreground">JPG, PNG, PDF (max 10MB)</span>
              </div>
            )}
          </Button>
        )}
      </div>
      
      {existingUrl && !previewUrl && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <FileImage className="w-3 h-3" />
          Receipt attached
        </p>
      )}
    </div>
  );
}
