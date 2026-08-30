import { supabase } from "../lib/supabase";
import imageCompression from "browser-image-compression";

export const storageService = {
  /**
   * Upload an image to the 'images' Supabase storage bucket and return its public URL.
   * Compresses the image before upload to optimize loading times.
   */
  async uploadImage(file: File, folder: string = "uploads"): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    let fileToUpload = file;

    // Only compress if it's an image (excluding gifs as they lose animation)
    if (file.type.startsWith("image/") && file.type !== "image/gif") {
      try {
        const options = {
          maxSizeMB: 2, // Target size ~2MB for better quality
          maxWidthOrHeight: 2560, // Keep quality for 1440p/2K displays
          initialQuality: 0.9, // Higher initial quality
          useWebWorker: true,
        };
        fileToUpload = await imageCompression(file, options) as File;
      } catch (error) {
        console.warn("Image compression failed, uploading original file:", error);
      }
    }

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, fileToUpload, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from("images").getPublicUrl(fileName);
    return data.publicUrl;
  },

  /**
   * Upload a general file/document (e.g. CV PDF) to a specified bucket.
   */
  async uploadFile(file: File, bucket: string = "images", folder: string = "documents"): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  },

  /**
   * Delete a file from Supabase storage using its public URL
   */
  async deleteFile(url: string | undefined | null): Promise<void> {
    if (!url) return;
    try {
      const parts = url.split('/storage/v1/object/public/');
      if (parts.length !== 2) return;
      
      const pathParts = parts[1].split('/');
      const bucket = pathParts[0];
      const filePath = pathParts.slice(1).join('/');

      if (bucket && filePath) {
        const { error } = await supabase.storage.from(bucket).remove([filePath]);
        if (error) {
          console.error("Supabase storage delete error:", error);
        }
      }
    } catch (err) {
      console.error("Failed to delete file from storage:", err);
    }
  },

  /**
   * Extract all image URLs from an HTML string
   */
  extractImageUrls(html: string | undefined | null): string[] {
    if (!html) return [];
    const urls: string[] = [];
    const regex = /<img[^>]+src="([^">]+)"/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      urls.push(match[1]);
    }
    return urls;
  }
};
