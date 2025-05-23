
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kgeabazzragukkvlslzw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnZWFiYXp6cmFndWtrdmxzbHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyNjU5NTYsImV4cCI6MjA1NDg0MTk1Nn0.s3Y3nKqUzCk0qrYNGSwDf2K32zelV2GUxxXZH_wNNZQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Dictionary-specific helpers
export const dictionaryAPI = {
  // Get translation for a specific word in requested languages
  getTranslation: async (word: string, languageCodes: string[]) => {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('language_code, translation, image_url, pronunciation')
        .eq('word', word.toLowerCase().trim())
        .in('language_code', languageCodes);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching translations:", error);
      return [];
    }
  },
  
  // Get image for a word
  getWordImage: async (word: string) => {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('image_url')
        .eq('word', word.toLowerCase().trim())
        .not('image_url', 'is', null)
        .limit(1);
      
      if (error) throw error;
      return data && data.length > 0 ? data[0].image_url : null;
    } catch (error) {
      console.error("Error fetching word image:", error);
      return null;
    }
  },
  
  // List all available words in a specific language
  listWords: async (languageCode: string = 'en', limit: number = 100, offset: number = 0) => {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('word, translation, pronunciation')
        .eq('language_code', languageCode)
        .range(offset, offset + limit - 1)
        .order('word', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error listing words:", error);
      return [];
    }
  },
  
  // Update a word's image URL
  updateWordImage: async (word: string, imageUrl: string) => {
    try {
      const { error } = await supabase
        .from('translations')
        .update({ image_url: imageUrl })
        .eq('word', word.toLowerCase().trim());
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error updating word image:", error);
      return false;
    }
  },
  
  // Add a new word (with upsert to handle duplicates)
  addWord: async (
    word: string, 
    languageCode: string, 
    translation: string, 
    pronunciation: string | null = null, 
    imageUrl: string | null = null
  ) => {
    try {
      const { error } = await supabase
        .from('translations')
        .upsert({ 
          word: word.toLowerCase().trim(),
          language_code: languageCode, 
          translation, 
          pronunciation, 
          image_url: imageUrl 
        }, { 
          onConflict: 'word,language_code',
          ignoreDuplicates: false 
        });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error adding word:", error);
      return false;
    }
  }
};
