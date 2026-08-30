import { supabase } from "../lib/supabase";
import type { Project } from "../types";
import { storageService } from "./storageService";

export const projectService = {
  /**
   * Fetch all projects ordered by creation date (newest first).
   */
  async getAll(): Promise<Project[]> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Fetch recent projects with a limit.
   */
  async getRecent(limit: number = 4): Promise<Project[]> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  /**
   * Fetch a single project by its ID.
   */
  async getById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create a new project.
   */
  async create(projectData: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from("projects")
      .insert([projectData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update an existing project.
   */
  async update(id: string, projectData: Partial<Project>): Promise<Project> {
    const oldProject = await this.getById(id).catch(() => null);

    const { data, error } = await supabase
      .from("projects")
      .update(projectData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (oldProject) {
      if (oldProject.image_url && projectData.image_url !== undefined && oldProject.image_url !== projectData.image_url) {
        await storageService.deleteFile(oldProject.image_url);
      }
      if (oldProject.cover_image && projectData.cover_image !== undefined && oldProject.cover_image !== projectData.cover_image) {
        await storageService.deleteFile(oldProject.cover_image);
      }
      if (projectData.results !== undefined) {
        const oldResultUrls = oldProject.results?.map((r) => r.imageUrl).filter(Boolean) || [];
        const newResultUrls = projectData.results?.map((r) => r.imageUrl).filter(Boolean) || [];
        for (const oldUrl of oldResultUrls) {
          if (oldUrl && !newResultUrls.includes(oldUrl)) {
            await storageService.deleteFile(oldUrl);
          }
        }
      }

    }

    return data;
  },

  /**
   * Delete a project by ID.
   */
  async delete(id: string): Promise<void> {
    const oldProject = await this.getById(id).catch(() => null);

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) throw error;

    if (oldProject) {
      if (oldProject.image_url) {
        await storageService.deleteFile(oldProject.image_url);
      }
      if (oldProject.cover_image) {
        await storageService.deleteFile(oldProject.cover_image);
      }
      if (oldProject.results) {
        for (const result of oldProject.results) {
          if (result.imageUrl) {
            await storageService.deleteFile(result.imageUrl);
          }
        }
      }

    }
  },

  /**
   * Get total count of projects.
   */
  async getCount(): Promise<number> {
    const { count, error } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return count || 0;
  },
};
