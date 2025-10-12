/*
  # Add Audit Service Tables

  ## Overview
  Adds tables to support a paid content audit service where companies can
  request audits by providing their website URL.

  ## New Tables

  ### 1. `audit_requests`
  Tracks incoming audit requests from customers
  - `id` (uuid, primary key)
  - `company_name` (text) - Customer's company name
  - `website_url` (text) - Website to audit
  - `contact_email` (text) - Where to send the report
  - `contact_name` (text) - Contact person
  - `industry` (text) - Company's industry
  - `status` (text) - 'pending', 'processing', 'completed', 'failed'
  - `payment_status` (text) - 'unpaid', 'paid', 'refunded'
  - `payment_amount` (numeric) - Amount charged
  - `stripe_payment_id` (text) - Stripe payment reference
  - `created_at` (timestamptz)
  - `completed_at` (timestamptz)

  ### 2. `audit_reports`
  Generated audit reports with findings
  - `id` (uuid, primary key)
  - `audit_request_id` (uuid, foreign key)
  - `report_data` (jsonb) - Complete audit findings
  - `overall_score` (numeric) - 0-100 overall content score
  - `pages_analyzed` (integer) - Number of pages crawled
  - `content_found` (jsonb) - Extracted content items
  - `recommendations` (jsonb) - Actionable recommendations
  - `buyer_stage_coverage` (jsonb) - Coverage by stage
  - `content_gaps` (jsonb) - Identified gaps
  - `competitive_insights` (jsonb) - Market positioning
  - `pdf_url` (text) - Link to PDF report
  - `created_at` (timestamptz)

  ### 3. `crawled_pages`
  Individual pages discovered during website crawl
  - `id` (uuid, primary key)
  - `audit_request_id` (uuid, foreign key)
  - `url` (text) - Page URL
  - `title` (text) - Page title
  - `content_type` (text) - Detected content type
  - `buyer_stage` (text) - Inferred buyer stage
  - `word_count` (integer) - Content length
  - `metadata` (jsonb) - Additional page data
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Public can insert audit_requests
  - Only authenticated admins can view/update
*/

-- Audit requests table
CREATE TABLE IF NOT EXISTS audit_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  website_url text NOT NULL,
  contact_email text NOT NULL,
  contact_name text NOT NULL,
  industry text DEFAULT '',
  status text DEFAULT 'pending',
  payment_status text DEFAULT 'unpaid',
  payment_amount numeric DEFAULT 299.00,
  stripe_payment_id text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE audit_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit audit requests"
  ON audit_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view audit requests"
  ON audit_requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update audit requests"
  ON audit_requests FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Audit reports table
CREATE TABLE IF NOT EXISTS audit_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_request_id uuid REFERENCES audit_requests(id) ON DELETE CASCADE NOT NULL,
  report_data jsonb DEFAULT '{}'::jsonb,
  overall_score numeric DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
  pages_analyzed integer DEFAULT 0,
  content_found jsonb DEFAULT '[]'::jsonb,
  recommendations jsonb DEFAULT '[]'::jsonb,
  buyer_stage_coverage jsonb DEFAULT '{}'::jsonb,
  content_gaps jsonb DEFAULT '[]'::jsonb,
  competitive_insights jsonb DEFAULT '{}'::jsonb,
  pdf_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audit_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view audit reports"
  ON audit_reports FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create audit reports"
  ON audit_reports FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update audit reports"
  ON audit_reports FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Crawled pages table
CREATE TABLE IF NOT EXISTS crawled_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_request_id uuid REFERENCES audit_requests(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  title text DEFAULT '',
  content_type text DEFAULT 'unknown',
  buyer_stage text DEFAULT 'unknown',
  word_count integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE crawled_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view crawled pages"
  ON crawled_pages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create crawled pages"
  ON crawled_pages FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_audit_requests_status ON audit_requests(status);
CREATE INDEX IF NOT EXISTS idx_audit_requests_payment_status ON audit_requests(payment_status);
CREATE INDEX IF NOT EXISTS idx_audit_reports_request_id ON audit_reports(audit_request_id);
CREATE INDEX IF NOT EXISTS idx_crawled_pages_request_id ON crawled_pages(audit_request_id);