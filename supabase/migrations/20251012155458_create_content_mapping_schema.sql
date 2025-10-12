/*
  # Content Mapping Services Schema

  ## Overview
  This migration creates the complete database schema for a Content Mapping Services platform
  based on the ValueVerse value-driven selling methodology.

  ## New Tables

  ### 1. `companies`
  Stores company profile information
  - `id` (uuid, primary key)
  - `name` (text) - Company name
  - `website` (text) - Company website URL
  - `branding_config` (jsonb) - Logo, colors, fonts
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `products`
  Product catalog with descriptions and features
  - `id` (uuid, primary key)
  - `company_id` (uuid, foreign key)
  - `name` (text)
  - `description` (text)
  - `features` (jsonb)
  - `pricing_model` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `value_drivers`
  Standardized value propositions linked to products
  - `id` (uuid, primary key)
  - `company_id` (uuid, foreign key)
  - `name` (text)
  - `description` (text)
  - `category` (text) - e.g., 'cost_reduction', 'revenue_growth', 'risk_mitigation'
  - `metrics` (jsonb) - Measurable KPIs
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. `product_value_drivers`
  Links products to their relevant value drivers
  - `id` (uuid, primary key)
  - `product_id` (uuid, foreign key)
  - `value_driver_id` (uuid, foreign key)
  - `relevance_score` (integer) - 1-10 scale
  - `created_at` (timestamptz)

  ### 5. `content_items`
  Library of all content assets
  - `id` (uuid, primary key)
  - `company_id` (uuid, foreign key)
  - `title` (text)
  - `content_type` (text) - 'case_study', 'white_paper', 'proposal_template', etc.
  - `description` (text)
  - `file_url` (text)
  - `buyer_stage` (text) - 'awareness', 'consideration', 'decision'
  - `tags` (jsonb)
  - `status` (text) - 'draft', 'approved', 'archived'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. `content_value_drivers`
  Maps content to value drivers
  - `id` (uuid, primary key)
  - `content_id` (uuid, foreign key)
  - `value_driver_id` (uuid, foreign key)
  - `created_at` (timestamptz)

  ### 7. `content_products`
  Maps content to products
  - `id` (uuid, primary key)
  - `content_id` (uuid, foreign key)
  - `product_id` (uuid, foreign key)
  - `created_at` (timestamptz)

  ### 8. `prospects`
  Prospect/customer information
  - `id` (uuid, primary key)
  - `company_id` (uuid, foreign key)
  - `name` (text)
  - `company_name` (text)
  - `industry` (text)
  - `context` (jsonb) - Research findings, pain points
  - `stage` (text) - Current buyer stage
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 9. `value_models`
  Generated value models for prospects
  - `id` (uuid, primary key)
  - `company_id` (uuid, foreign key)
  - `prospect_id` (uuid, foreign key)
  - `title` (text)
  - `model_data` (jsonb) - Complete model configuration
  - `projected_roi` (numeric)
  - `status` (text) - 'draft', 'presented', 'accepted'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 10. `content_recommendations`
  AI-generated content recommendations for deals
  - `id` (uuid, primary key)
  - `prospect_id` (uuid, foreign key)
  - `content_id` (uuid, foreign key)
  - `relevance_score` (numeric) - 0-1 scale
  - `reasoning` (text)
  - `created_at` (timestamptz)

  ### 11. `content_audit_logs`
  Tracks content usage and gaps
  - `id` (uuid, primary key)
  - `company_id` (uuid, foreign key)
  - `audit_date` (date)
  - `total_content_count` (integer)
  - `by_stage` (jsonb) - Count per buyer stage
  - `by_type` (jsonb) - Count per content type
  - `gaps_identified` (jsonb) - Missing content areas
  - `consistency_score` (numeric) - 0-100 scale
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users to manage their company's data
*/

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  website text,
  branding_config jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company"
  ON companies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create companies"
  ON companies FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their company"
  ON companies FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  features jsonb DEFAULT '[]'::jsonb,
  pricing_model text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- Value drivers table
CREATE TABLE IF NOT EXISTS value_drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  category text DEFAULT '',
  metrics jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE value_drivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view value drivers"
  ON value_drivers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create value drivers"
  ON value_drivers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update value drivers"
  ON value_drivers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete value drivers"
  ON value_drivers FOR DELETE
  TO authenticated
  USING (true);

-- Product value drivers junction table
CREATE TABLE IF NOT EXISTS product_value_drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  value_driver_id uuid REFERENCES value_drivers(id) ON DELETE CASCADE NOT NULL,
  relevance_score integer DEFAULT 5 CHECK (relevance_score >= 1 AND relevance_score <= 10),
  created_at timestamptz DEFAULT now(),
  UNIQUE(product_id, value_driver_id)
);

ALTER TABLE product_value_drivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view product value drivers"
  ON product_value_drivers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create product value drivers"
  ON product_value_drivers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can delete product value drivers"
  ON product_value_drivers FOR DELETE
  TO authenticated
  USING (true);

-- Content items table
CREATE TABLE IF NOT EXISTS content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content_type text DEFAULT '',
  description text DEFAULT '',
  file_url text DEFAULT '',
  buyer_stage text DEFAULT 'awareness',
  tags jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view content items"
  ON content_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create content items"
  ON content_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update content items"
  ON content_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete content items"
  ON content_items FOR DELETE
  TO authenticated
  USING (true);

-- Content value drivers junction table
CREATE TABLE IF NOT EXISTS content_value_drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES content_items(id) ON DELETE CASCADE NOT NULL,
  value_driver_id uuid REFERENCES value_drivers(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(content_id, value_driver_id)
);

ALTER TABLE content_value_drivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view content value drivers"
  ON content_value_drivers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create content value drivers"
  ON content_value_drivers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can delete content value drivers"
  ON content_value_drivers FOR DELETE
  TO authenticated
  USING (true);

-- Content products junction table
CREATE TABLE IF NOT EXISTS content_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES content_items(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(content_id, product_id)
);

ALTER TABLE content_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view content products"
  ON content_products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create content products"
  ON content_products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can delete content products"
  ON content_products FOR DELETE
  TO authenticated
  USING (true);

-- Prospects table
CREATE TABLE IF NOT EXISTS prospects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  company_name text DEFAULT '',
  industry text DEFAULT '',
  context jsonb DEFAULT '{}'::jsonb,
  stage text DEFAULT 'awareness',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view prospects"
  ON prospects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create prospects"
  ON prospects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update prospects"
  ON prospects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete prospects"
  ON prospects FOR DELETE
  TO authenticated
  USING (true);

-- Value models table
CREATE TABLE IF NOT EXISTS value_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  prospect_id uuid REFERENCES prospects(id) ON DELETE CASCADE,
  title text NOT NULL,
  model_data jsonb DEFAULT '{}'::jsonb,
  projected_roi numeric DEFAULT 0,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE value_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view value models"
  ON value_models FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create value models"
  ON value_models FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update value models"
  ON value_models FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete value models"
  ON value_models FOR DELETE
  TO authenticated
  USING (true);

-- Content recommendations table
CREATE TABLE IF NOT EXISTS content_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id uuid REFERENCES prospects(id) ON DELETE CASCADE NOT NULL,
  content_id uuid REFERENCES content_items(id) ON DELETE CASCADE NOT NULL,
  relevance_score numeric DEFAULT 0.5 CHECK (relevance_score >= 0 AND relevance_score <= 1),
  reasoning text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE content_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view content recommendations"
  ON content_recommendations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create content recommendations"
  ON content_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can delete content recommendations"
  ON content_recommendations FOR DELETE
  TO authenticated
  USING (true);

-- Content audit logs table
CREATE TABLE IF NOT EXISTS content_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  audit_date date DEFAULT CURRENT_DATE,
  total_content_count integer DEFAULT 0,
  by_stage jsonb DEFAULT '{}'::jsonb,
  by_type jsonb DEFAULT '{}'::jsonb,
  gaps_identified jsonb DEFAULT '[]'::jsonb,
  consistency_score numeric DEFAULT 0 CHECK (consistency_score >= 0 AND consistency_score <= 100),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE content_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view content audit logs"
  ON content_audit_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create content audit logs"
  ON content_audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_company_id ON products(company_id);
CREATE INDEX IF NOT EXISTS idx_value_drivers_company_id ON value_drivers(company_id);
CREATE INDEX IF NOT EXISTS idx_content_items_company_id ON content_items(company_id);
CREATE INDEX IF NOT EXISTS idx_content_items_buyer_stage ON content_items(buyer_stage);
CREATE INDEX IF NOT EXISTS idx_prospects_company_id ON prospects(company_id);
CREATE INDEX IF NOT EXISTS idx_value_models_company_id ON value_models(company_id);
CREATE INDEX IF NOT EXISTS idx_value_models_prospect_id ON value_models(prospect_id);
CREATE INDEX IF NOT EXISTS idx_content_recommendations_prospect_id ON content_recommendations(prospect_id);