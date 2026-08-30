import { supabase } from "../lib/supabase";
import type { Blog } from "../types";
import { storageService } from "./storageService";

export const blogService = {
  /**
   * Fetch all blogs ordered by creation date (newest first).
   */
  async getAll(): Promise<Blog[]> {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Fetch recent blogs with a limit.
   */
  async getRecent(limit: number = 3): Promise<Blog[]> {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  /**
   * Fetch a single blog post by its ID.
   */
  async getById(id: string): Promise<Blog | null> {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Fetch multiple blog posts by their IDs (e.g. for related posts).
   */
  async getByIds(ids: string[]): Promise<Blog[]> {
    if (!ids || ids.length === 0) return [];
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .in("id", ids);

    if (error) throw error;
    return data || [];
  },

  /**
   * Create a new blog post.
   */
  async create(blogData: Partial<Blog>): Promise<Blog> {
    const { data, error } = await supabase
      .from("blogs")
      .insert([blogData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update an existing blog post.
   */
  async update(id: string, blogData: Partial<Blog>): Promise<Blog> {
    const oldBlog = await this.getById(id).catch(() => null);

    const { data, error } = await supabase
      .from("blogs")
      .update(blogData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (oldBlog) {
      if (oldBlog.image_url && blogData.image_url !== undefined && oldBlog.image_url !== blogData.image_url) {
        await storageService.deleteFile(oldBlog.image_url);
      }
      if (blogData.content !== undefined && oldBlog.content !== blogData.content) {
        const oldUrls = storageService.extractImageUrls(oldBlog.content);
        const newUrls = storageService.extractImageUrls(blogData.content);
        for (const oldUrl of oldUrls) {
          if (!newUrls.includes(oldUrl)) {
            await storageService.deleteFile(oldUrl);
          }
        }
      }
    }

    return data;
  },

  /**
   * Delete a blog post by ID.
   */
  async delete(id: string): Promise<void> {
    const oldBlog = await this.getById(id).catch(() => null);

    const { error } = await supabase
      .from("blogs")
      .delete()
      .eq("id", id);

    if (error) throw error;

    if (oldBlog) {
      if (oldBlog.image_url) {
        await storageService.deleteFile(oldBlog.image_url);
      }
      if (oldBlog.content) {
        const urls = storageService.extractImageUrls(oldBlog.content);
        for (const url of urls) {
          await storageService.deleteFile(url);
        }
      }
    }
  },

  /**
   * Get total count of blogs.
   */
  async getCount(): Promise<number> {
    const { count, error } = await supabase
      .from("blogs")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return count || 0;
  },
};
