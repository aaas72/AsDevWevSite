import { supabase } from '../lib/supabase';
import type { Idea } from '../types';
import { storageService } from './storageService';

export const ideaService = {
  async getAll(): Promise<Idea[]> {
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string): Promise<Idea> {
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(idea: Omit<Idea, 'id'>): Promise<Idea> {
    const { data, error } = await supabase
      .from('ideas')
      .insert(idea)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, ideaData: Partial<Idea>): Promise<Idea> {
    // Fetch the old idea to compare content for image cleanup
    const oldIdea = await this.getById(id).catch(() => null);

    const { data, error } = await supabase
      .from('ideas')
      .update(ideaData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Cleanup images if content changed
    if (oldIdea && ideaData.content !== undefined && oldIdea.content !== ideaData.content) {
      const oldUrls = storageService.extractImageUrls(oldIdea.content);
      const newUrls = storageService.extractImageUrls(ideaData.content);

      for (const oldUrl of oldUrls) {
        if (!newUrls.includes(oldUrl)) {
          await storageService.deleteFile(oldUrl);
        }
      }
    }

    return data;
  },

  async delete(id: string): Promise<void> {
    // Fetch the idea first to get the content for image cleanup
    const idea = await this.getById(id).catch(() => null);

    const { error } = await supabase
      .from('ideas')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // If the idea had images in its content, delete them
    if (idea && idea.content) {
      const urls = storageService.extractImageUrls(idea.content);
      for (const url of urls) {
        await storageService.deleteFile(url);
      }
    }
  },

  async getIncompleteCount(): Promise<number> {
    const { count, error } = await supabase
      .from('ideas')
      .select('*', { count: 'exact', head: true })
      .in('status', ['draft', 'in_progress']);

    if (error) throw error;
    return count || 0;
  }
};
