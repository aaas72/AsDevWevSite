import { supabase } from "../lib/supabase";

export const storageService = {
  /**
   * Upload an image to the 'images' Supabase storage bucket and return its public URL.
   */
  async uploadImage(file: File, folder: string = "uploads"): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, file, {
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
};
