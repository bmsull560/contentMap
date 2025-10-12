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
        Relationships: never[];
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
        Relationships: never[];
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
        Relationships: never[];
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
        Relationships: never[];
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
        Relationships: never[];
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
        Relationships: never[];
      };
      audit_requests: {
        Row: {
          id: string;
          company_name: string;
          website_url: string;
          contact_name: string;
          contact_email: string;
          industry: string;
          status: string;
          payment_status: string;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          company_name: string;
          website_url: string;
          contact_name: string;
          contact_email: string;
          industry: string;
          status?: string;
          payment_status?: string;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          company_name?: string;
          website_url?: string;
          contact_name?: string;
          contact_email?: string;
          industry?: string;
          status?: string;
          payment_status?: string;
          created_at?: string;
          completed_at?: string | null;
        };
        Relationships: never[];
      };
      crawled_pages: {
        Row: {
          id: string;
          audit_request_id: string;
          url: string;
          title: string;
          content_type: string;
          buyer_stage: string;
          word_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          audit_request_id: string;
          url: string;
          title: string;
          content_type: string;
          buyer_stage: string;
          word_count: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          audit_request_id?: string;
          url?: string;
          title?: string;
          content_type?: string;
          buyer_stage?: string;
          word_count?: number;
          created_at?: string;
        };
        Relationships: never[];
      };
      audit_reports: {
        Row: {
          id: string;
          audit_request_id: string;
          overall_score: number;
          pages_analyzed: number;
          content_found: Array<Record<string, any>>;
          recommendations: Array<Record<string, any>>;
          buyer_stage_coverage: Record<string, number>;
          content_gaps: Array<Record<string, any>>;
          competitive_insights: Record<string, any>;
          created_at: string;
        };
        Insert: {
          id?: string;
          audit_request_id: string;
          overall_score: number;
          pages_analyzed: number;
          content_found: Array<Record<string, any>>;
          recommendations: Array<Record<string, any>>;
          buyer_stage_coverage: Record<string, number>;
          content_gaps: Array<Record<string, any>>;
          competitive_insights: Record<string, any>;
          created_at?: string;
        };
        Update: {
          id?: string;
          audit_request_id?: string;
          overall_score?: number;
          pages_analyzed?: number;
          content_found?: Array<Record<string, any>>;
          recommendations?: Array<Record<string, any>>;
          buyer_stage_coverage?: Record<string, number>;
          content_gaps?: Array<Record<string, any>>;
          competitive_insights?: Record<string, any>;
          created_at?: string;
        };
        Relationships: never[];
      };
      content_recommendations: {
        Row: {
          id: string;
          prospect_id: string;
          content_id: string;
          relevance_score: number;
          reasoning: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          prospect_id: string;
          content_id: string;
          relevance_score: number;
          reasoning: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          prospect_id?: string;
          content_id?: string;
          relevance_score?: number;
          reasoning?: string;
          created_at?: string;
        };
        Relationships: never[];
      };
    };
  };
}
