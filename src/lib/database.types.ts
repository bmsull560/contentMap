export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          website: string | null;
          branding_config: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          website?: string | null;
          branding_config?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          website?: string | null;
          branding_config?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          description: string;
          features: any[];
          pricing_model: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          description?: string;
          features?: any[];
          pricing_model?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          description?: string;
          features?: any[];
          pricing_model?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      value_drivers: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          description: string;
          category: string;
          metrics: any[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          description?: string;
          category?: string;
          metrics?: any[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          description?: string;
          category?: string;
          metrics?: any[];
          created_at?: string;
          updated_at?: string;
        };
      };
      content_items: {
        Row: {
          id: string;
          company_id: string;
          title: string;
          content_type: string;
          description: string;
          file_url: string;
          buyer_stage: string;
          tags: any[];
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          title: string;
          content_type?: string;
          description?: string;
          file_url?: string;
          buyer_stage?: string;
          tags?: any[];
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          title?: string;
          content_type?: string;
          description?: string;
          file_url?: string;
          buyer_stage?: string;
          tags?: any[];
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      prospects: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          company_name: string;
          industry: string;
          context: Record<string, any>;
          stage: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          company_name?: string;
          industry?: string;
          context?: Record<string, any>;
          stage?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          company_name?: string;
          industry?: string;
          context?: Record<string, any>;
          stage?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      content_audit_logs: {
        Row: {
          id: string;
          company_id: string;
          audit_date: string;
          total_content_count: number;
          by_stage: Record<string, number>;
          by_type: Record<string, number>;
          gaps_identified: any[];
          consistency_score: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          audit_date?: string;
          total_content_count?: number;
          by_stage?: Record<string, number>;
          by_type?: Record<string, number>;
          gaps_identified?: any[];
          consistency_score?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          audit_date?: string;
          total_content_count?: number;
          by_stage?: Record<string, number>;
          by_type?: Record<string, number>;
          gaps_identified?: any[];
          consistency_score?: number;
          created_at?: string;
        };
      };
    };
  };
}
