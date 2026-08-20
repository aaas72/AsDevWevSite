import { supabase } from "../lib/supabase";
import type { Tool } from "../types";

export const toolService = {
  /**
   * Fetch all tools ordered by creation date ascending.
   */
  async getAll(): Promise<Tool[]> {
    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Create a new tool.
   */
  async create(toolData: Partial<Tool>): Promise<Tool> {
    const { data, error } = await supabase
      .from("tools")
      .insert([toolData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update an existing tool.
   */
  async update(id: string, toolData: Partial<Tool>): Promise<Tool> {
    const { data, error } = await supabase
      .from("tools")
      .update(toolData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a tool by ID.
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("tools")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  /**
   * Get total count of tools.
   */
  async getCount(): Promise<number> {
    const { count, error } = await supabase
      .from("tools")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return count || 0;
  },
};
