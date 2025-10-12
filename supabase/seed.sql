-- Seed data for local development
-- Insert a test company
INSERT INTO companies (id, name, website, branding_config)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Test Company Inc', 'https://testcompany.com', '{"logo": "", "primaryColor": "#3B82F6"}')
ON CONFLICT (id) DO NOTHING;

-- Insert test products
INSERT INTO products (company_id, name, description, features, pricing_model)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Enterprise CRM', 'Customer relationship management platform', '["Contact Management", "Sales Pipeline", "Analytics"]'::jsonb, 'Subscription'),
  ('00000000-0000-0000-0000-000000000001', 'Marketing Automation', 'Email and campaign automation tool', '["Email Campaigns", "A/B Testing", "Lead Scoring"]'::jsonb, 'Tiered Pricing')
ON CONFLICT DO NOTHING;

-- Insert test value drivers
INSERT INTO value_drivers (company_id, name, description, category, metrics)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Reduce Customer Churn', 'Lower customer attrition rates', 'cost_reduction', '["Churn Rate", "Customer Lifetime Value"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001', 'Increase Sales Velocity', 'Shorten sales cycles', 'revenue_growth', '["Average Deal Time", "Win Rate"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001', 'Improve Marketing ROI', 'Better marketing efficiency', 'revenue_growth', '["Cost per Lead", "Conversion Rate"]'::jsonb)
ON CONFLICT DO NOTHING;

-- Insert test content items
INSERT INTO content_items (company_id, title, content_type, description, buyer_stage, status, tags)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'CRM Implementation Guide', 'white_paper', 'Comprehensive guide to implementing our CRM solution', 'awareness', 'approved', '["CRM", "Implementation"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001', 'Enterprise Success Story - TechCorp', 'case_study', 'How TechCorp increased sales by 40% with our platform', 'consideration', 'approved', '["Case Study", "Enterprise", "Sales"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001', 'ROI Calculator Template', 'proposal_template', 'Interactive ROI calculator for prospects', 'decision', 'approved', '["ROI", "Calculator"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001', 'Product Demo Deck', 'presentation', 'Standard product demonstration presentation', 'consideration', 'approved', '["Demo", "Presentation"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001', 'Marketing Automation Best Practices', 'blog', 'Blog series on marketing automation strategies', 'awareness', 'approved', '["Marketing", "Best Practices"]'::jsonb)
ON CONFLICT DO NOTHING;

-- Insert test prospects
INSERT INTO prospects (company_id, name, company_name, industry, stage, context)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'John Smith', 'Acme Corp', 'Technology', 'consideration', '{"pain_points": ["Manual processes", "Data silos"], "budget": "50k-100k"}'::jsonb),
  ('00000000-0000-0000-0000-000000000001', 'Sarah Johnson', 'Global Industries', 'Manufacturing', 'awareness', '{"pain_points": ["Customer retention"], "budget": "unknown"}'::jsonb),
  ('00000000-0000-0000-0000-000000000001', 'Mike Davis', 'Retail Plus', 'Retail', 'decision', '{"pain_points": ["Sales efficiency"], "budget": "100k+"}'::jsonb)
ON CONFLICT DO NOTHING;

-- Insert test audit request
INSERT INTO audit_requests (id, company_name, website_url, contact_email, contact_name, industry, status, payment_status)
VALUES 
  ('00000000-0000-0000-0000-000000000002', 'Demo Company', 'https://democompany.com', 'demo@example.com', 'Demo User', 'Technology', 'completed', 'paid')
ON CONFLICT (id) DO NOTHING;
