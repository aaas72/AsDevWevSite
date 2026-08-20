import { supabase } from "../lib/supabase";
import type { AboutContent } from "../types";

export const aboutService = {
  /**
   * Fetch about content (singleton record with id 1).
   */
  async get(): Promise<AboutContent | null> {
    const { data, error } = await supabase
      .from("about_content")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Upsert about content.
   */
  async upsert(payload: Partial<AboutContent> & { id?: number }): Promise<void> {
    const { error } = await supabase
      .from("about_content")
      .upsert({ id: 1, ...payload });

    if (error) throw error;
  },
};
