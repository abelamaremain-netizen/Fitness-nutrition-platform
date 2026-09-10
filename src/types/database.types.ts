export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string;
          name: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "admins_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };

      plans: {
        Row: {
          id: string;
          title: string;
          description: string;
          long_description: string;
          goal: Database["public"]["Enums"]["plan_goal"];
          level: Database["public"]["Enums"]["plan_level"];
          image_url: string | null;
          video_url: string | null;
          pdf_url: string | null;
          video_thumb: string | null;
          tags: string[];
          includes: string[];
          suitable_for: string[];
          min_bmi: number | null;
          max_bmi: number | null;
          activity_levels: string[];
          featured: boolean;
          bestseller: boolean;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          long_description?: string;
          goal?: Database["public"]["Enums"]["plan_goal"];
          level?: Database["public"]["Enums"]["plan_level"];
          image_url?: string | null;
          video_url?: string | null;
          pdf_url?: string | null;
          video_thumb?: string | null;
          tags?: string[];
          includes?: string[];
          suitable_for?: string[];
          min_bmi?: number | null;
          max_bmi?: number | null;
          activity_levels?: string[];
          featured?: boolean;
          bestseller?: boolean;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          long_description?: string;
          goal?: Database["public"]["Enums"]["plan_goal"];
          level?: Database["public"]["Enums"]["plan_level"];
          image_url?: string | null;
          video_url?: string | null;
          pdf_url?: string | null;
          video_thumb?: string | null;
          tags?: string[];
          includes?: string[];
          suitable_for?: string[];
          min_bmi?: number | null;
          max_bmi?: number | null;
          activity_levels?: string[];
          featured?: boolean;
          bestseller?: boolean;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      plan_durations: {
        Row: {
          id: string;
          plan_id: string;
          key: Database["public"]["Enums"]["plan_duration_key"];
          label: string;
          price: number;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          plan_id: string;
          key: Database["public"]["Enums"]["plan_duration_key"];
          label: string;
          price: number;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          plan_id?: string;
          key?: Database["public"]["Enums"]["plan_duration_key"];
          label?: string;
          price?: number;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "plan_durations_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "plans";
            referencedColumns: ["id"];
          },
        ];
      };

      orders: {
        Row: {
          id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          plan_id: string;
          duration_key: Database["public"]["Enums"]["plan_duration_key"];
          duration_label: string;
          amount: number;
          currency: string;
          payment_method: Database["public"]["Enums"]["payment_method"];
          status: Database["public"]["Enums"]["order_status"];
          tx_ref: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_email: string;
          customer_phone?: string;
          plan_id: string;
          duration_key: Database["public"]["Enums"]["plan_duration_key"];
          duration_label: string;
          amount: number;
          currency?: string;
          payment_method: Database["public"]["Enums"]["payment_method"];
          status?: Database["public"]["Enums"]["order_status"];
          tx_ref?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          plan_id?: string;
          duration_key?: Database["public"]["Enums"]["plan_duration_key"];
          duration_label?: string;
          amount?: number;
          currency?: string;
          payment_method?: Database["public"]["Enums"]["payment_method"];
          status?: Database["public"]["Enums"]["order_status"];
          tx_ref?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "plans";
            referencedColumns: ["id"];
          },
        ];
      };

      order_access: {
        Row: {
          id: string;
          order_id: string;
          plan_id: string;
          email: string;
          unlocked: boolean;
          unlocked_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          plan_id: string;
          email: string;
          unlocked?: boolean;
          unlocked_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          plan_id?: string;
          email?: string;
          unlocked?: boolean;
          unlocked_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_access_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_access_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "plans";
            referencedColumns: ["id"];
          },
        ];
      };

      faqs: {
        Row: {
          id: string;
          question: string;
          answer: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          answer: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          question?: string;
          answer?: string;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };

      testimonials: {
        Row: {
          id: string;
          name: string;
          role: string;
          text: string;
          plan_name: string;
          image_url: string | null;
          rating: number;
          published: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role?: string;
          text: string;
          plan_name?: string;
          image_url?: string | null;
          rating?: number;
          published?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string;
          text?: string;
          plan_name?: string;
          image_url?: string | null;
          rating?: number;
          published?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };

      blog_posts: {
        Row: {
          id: string;
          title: string;
          excerpt: string;
          body: string;
          category: string;
          image_url: string | null;
          author: string;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          excerpt?: string;
          body?: string;
          category?: string;
          image_url?: string | null;
          author?: string;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          excerpt?: string;
          body?: string;
          category?: string;
          image_url?: string | null;
          author?: string;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      team_members: {
        Row: {
          id: string;
          name: string;
          role: string;
          bio: string;
          image_url: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role?: string;
          bio?: string;
          image_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string;
          bio?: string;
          image_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };

      how_it_works_steps: {
        Row: {
          id: string;
          step_number: number;
          title: string;
          description: string;
          image_url: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          step_number?: number;
          title: string;
          description?: string;
          image_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          step_number?: number;
          title?: string;
          description?: string;
          image_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };

      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject?: string;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string;
          message?: string;
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };

      site_content: {
        Row: {
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: {
          key: string;
          value?: string;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };

    Views: { [key: string]: never };
    Functions: {
      is_admin: {
        Args: Record<never, never>;
        Returns: boolean;
      };
      update_updated_at_column: {
        Args: Record<never, never>;
        Returns: undefined;
      };
    };
    Enums: {
      plan_goal: "weight-loss" | "muscle-gain" | "nutrition" | "lifestyle";
      plan_level: "normal" | "pro" | "vip";
      plan_duration_key: "1-week" | "1-month" | "3-months" | "6-months";
      payment_method: "telebirr" | "cbe" | "chapa" | "card";
      order_status: "pending" | "completed" | "failed" | "pending_verification";
    };
    CompositeTypes: { [key: string]: never };
  };
};

export type PlanGoal = Database["public"]["Enums"]["plan_goal"];
export type PlanLevel = Database["public"]["Enums"]["plan_level"];
export type PlanDurationKey = Database["public"]["Enums"]["plan_duration_key"];
export type PaymentMethod = Database["public"]["Enums"]["payment_method"];
export type OrderStatus = Database["public"]["Enums"]["order_status"];

export type Plan = Database["public"]["Tables"]["plans"]["Row"];
export type PlanDuration =
  Database["public"]["Tables"]["plan_durations"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderAccess = Database["public"]["Tables"]["order_access"]["Row"];
export type Faq = Database["public"]["Tables"]["faqs"]["Row"];
export type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];
export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
export type TeamMember = Database["public"]["Tables"]["team_members"]["Row"];
export type HowItWorksStep =
  Database["public"]["Tables"]["how_it_works_steps"]["Row"];
export type ContactMessage =
  Database["public"]["Tables"]["contact_messages"]["Row"];
export type SiteContent = Database["public"]["Tables"]["site_content"]["Row"];
export type Admin = Database["public"]["Tables"]["admins"]["Row"];

export type PlanWithDurations = Plan & {
  plan_durations: PlanDuration[];
};
