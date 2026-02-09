import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ContentAsset {
  id: string;
  video_url: string;
  video_title: string | null;
  video_thumbnail: string | null;
  video_duration: string | null;
  video_description: string | null;
  published_date: string | null;
  transcript: string | null;
  pdf_summary: {
    title: string;
    takeaways: string[];
    summary: string;
    action_steps: string[];
    product_cta: {
      product_name: string;
      product_description: string;
      product_price: string;
      product_url: string;
    };
    diagnostic_cta: {
      diagnostic_name: string;
      diagnostic_description: string;
      diagnostic_url: string;
    };
  } | null;
  linkedin_long: string | null;
  linkedin_short: string | null;
  short_form_scripts: Array<{
    title: string;
    hook: string;
    body: string;
    cta: string;
    onscreen_text: string[];
  }> | null;
  email_block: {
    subject: string;
    preview: string;
    body: string;
  } | null;
  blog_post: {
    title: string;
    meta_description: string;
    content: string;
  } | null;
  twitter_thread: string[] | null;
  relevant_product: string | null;
  relevant_diagnostic: string | null;
  pdf_url: string | null;
  status: string;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export function useContentAssets() {
  const [assets, setAssets] = useState<ContentAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const fetchAssets = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('content_assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion since we know the structure
      setAssets((data as unknown as ContentAsset[]) || []);
    } catch (error) {
      console.error('Error fetching content assets:', error);
      toast({
        title: 'Error',
        description: 'Failed to load content assets',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const processVideo = async (videoUrl: string, manualTranscript?: string): Promise<string | null> => {
    setProcessing(true);
    
    try {
      // Step 1: Create initial record
      const { data: insertData, error: insertError } = await supabase
        .from('content_assets')
        .insert({
          video_url: videoUrl,
          status: 'processing',
        })
        .select()
        .single();

      if (insertError) throw insertError;
      
      const assetId = insertData.id;
      
      toast({
        title: 'Processing started',
        description: 'Extracting transcript from video...',
      });

      // Step 2: Extract transcript
      const { data: transcriptData, error: transcriptError } = await supabase.functions.invoke(
        'extract-youtube-transcript',
        {
          body: { videoUrl, manualTranscript },
        }
      );

      if (transcriptError || !transcriptData?.success) {
        throw new Error(transcriptData?.error || 'Failed to extract transcript');
      }

      const { title, description, thumbnail, duration, publishedAt, transcript } = transcriptData.data;

      // Update record with video metadata
      await supabase
        .from('content_assets')
        .update({
          video_title: title,
          video_description: description,
          video_thumbnail: thumbnail,
          video_duration: duration,
          published_date: publishedAt ? new Date(publishedAt).toISOString() : null,
          transcript: transcript || manualTranscript,
        })
        .eq('id', assetId);

      if (!transcript && !manualTranscript) {
        throw new Error('No transcript available. Please paste the transcript manually.');
      }

      toast({
        title: 'Transcript extracted',
        description: 'Generating content assets with AI...',
      });

      // Step 3: Generate content assets
      const { data: contentData, error: contentError } = await supabase.functions.invoke(
        'generate-content-assets',
        {
          body: {
            transcript: transcript || manualTranscript,
            videoTitle: title,
            videoUrl,
          },
        }
      );

      if (contentError || !contentData?.success) {
        throw new Error(contentData?.error || 'Failed to generate content');
      }

      const generatedContent = contentData.data;

      // Update record with generated content
      await supabase
        .from('content_assets')
        .update({
          pdf_summary: generatedContent.pdf_summary,
          linkedin_long: generatedContent.linkedin_long,
          linkedin_short: generatedContent.linkedin_short,
          short_form_scripts: generatedContent.short_form_scripts,
          email_block: generatedContent.email_block,
          blog_post: generatedContent.blog_post,
          twitter_thread: generatedContent.twitter_thread,
          relevant_product: generatedContent.relevant_product,
          relevant_diagnostic: generatedContent.relevant_diagnostic,
          status: 'generating_pdf',
        })
        .eq('id', assetId);

      toast({
        title: 'Content generated',
        description: 'Creating PDF lead magnet...',
      });

      // Step 4: Generate PDF
      const { data: pdfData, error: pdfError } = await supabase.functions.invoke(
        'generate-lead-magnet-pdf',
        {
          body: {
            pdfSummary: generatedContent.pdf_summary,
            videoTitle: title,
            videoThumbnail: thumbnail,
            videoUrl,
            contentAssetId: assetId,
          },
        }
      );

      if (pdfError || !pdfData?.success) {
        console.error('PDF generation failed:', pdfData?.error);
        // Continue anyway, PDF is optional
      }

      // Final update
      await supabase
        .from('content_assets')
        .update({
          pdf_url: pdfData?.pdfUrl || null,
          status: 'completed',
        })
        .eq('id', assetId);

      toast({
        title: 'Success!',
        description: '9 content assets generated from your video',
      });

      await fetchAssets();
      return assetId;
    } catch (error) {
      console.error('Error processing video:', error);
      toast({
        title: 'Processing failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
      return null;
    } finally {
      setProcessing(false);
    }
  };

  const deleteAsset = async (id: string) => {
    try {
      const { error } = await supabase
        .from('content_assets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAssets(prev => prev.filter(a => a.id !== id));
      toast({
        title: 'Deleted',
        description: 'Content asset removed',
      });
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete asset',
        variant: 'destructive',
      });
    }
  };

  return {
    assets,
    loading,
    processing,
    processVideo,
    deleteAsset,
    refetch: fetchAssets,
  };
}
