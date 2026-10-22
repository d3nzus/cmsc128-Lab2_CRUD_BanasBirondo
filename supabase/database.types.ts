export type Database = {
  public: {
    Tables: {
      category: {
        Row: { id: number; name: string };
        Insert: { id?: never; name: string };
        Update: { id?: never; name?: string };
        Relationships: [];
      };
      task: {
        Row: {
          id: number;
          title: string;
          due_date: string;
          due_time: string;
          priority: Database["public"]["Enums"]["priority"] | null;
          category_id: number;
          done: boolean;
          tasklist_id: number;
        };
        Insert: {
          id?: never;
          title?: string;
          due_date: string;
          due_time: string;
          priority?: Database["public"]["Enums"]["priority"] | null;
          category_id: number;
          done?: boolean;
          tasklist_id: number;
        };
        Update: {
          id?: never;
          title?: string;
          due_date?: string;
          due_time?: string;
          priority?: Database["public"]["Enums"]["priority"] | null;
          category_id?: number;
          done?: boolean;
          tasklist_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "task_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "category";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "task_tasklist_id_fkey";
            columns: ["tasklist_id"];
            isOneToOne: false;
            referencedRelation: "tasklist";
            referencedColumns: ["id"];
          },
        ];
      };
      tasklist: {
        Row: { id: number; name: string | null; created_by: string | null };
        Insert: { id?: never; name?: string | null; created_by?: string | null };
        Update: { id?: never; name?: string | null; created_by?: string | null };
        Relationships: [];
      };
      tasklist_owners: {
        Row: { tasklist_id: number; user_id: string };
        Insert: { tasklist_id: number; user_id: string };
        Update: { tasklist_id?: number; user_id?: string };
        Relationships: [
          {
            foreignKeyName: "tasklist_owners_tasklist_id_fkey";
            columns: ["tasklist_id"];
            isOneToOne: false;
            referencedRelation: "tasklist";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_tasklist_with_owner: {
        Args: { list_name: string };
        Returns: { id: number; name: string | null }[];
      };
    };
    Enums: { priority: "high" | "mid" | "low" };
    CompositeTypes: Record<string, never>;
  };
};
