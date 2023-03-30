export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      card: {
        Row: {
          from: string | null;
          id: string;
          opening_message: string | null;
          opening_music: string | null;
          to: string | null;
          user_id: string;
        };
        Insert: {
          from?: string | null;
          id: string;
          opening_message?: string | null;
          opening_music?: string | null;
          to?: string | null;
          user_id: string;
        };
        Update: {
          from?: string | null;
          id?: string;
          opening_message?: string | null;
          opening_music?: string | null;
          to?: string | null;
          user_id?: string;
        };
      };
      page: {
        Row: {
          canvas_content: Json | null;
          card_id: string;
          id: string;
          page_index: number;
        };
        Insert: {
          canvas_content?: Json | null;
          card_id: string;
          id?: string;
          page_index: number;
        };
        Update: {
          canvas_content?: Json | null;
          card_id?: string;
          id?: string;
          page_index?: number;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Card = Database["public"]["Tables"]["card"]["Row"];
export type Page = Database["public"]["Tables"]["page"]["Row"];
