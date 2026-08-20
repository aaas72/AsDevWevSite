import { supabase } from "../lib/supabase";
import type { Message } from "../types";

export const messageService = {
  /**
   * Fetch all contact messages ordered by creation date (newest first).
   */
  async getAll(): Promise<Message[]> {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Send/Submit a contact message from the contact form.
   */
  async send(message: { name: string; email: string; message: string }): Promise<void> {
    const { error } = await supabase
      .from("contact_messages")
      .insert([message]);

    if (error) throw error;
  },

  /**
   * Mark a message as read.
   */
  async markAsRead(id: number): Promise<void> {
    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read: true })
      .eq("id", id);

    if (error) throw error;
  },

  /**
   * Delete a message by ID.
   */
  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};
