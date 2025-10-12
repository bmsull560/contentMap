import { useState } from 'react';
import { LandingPage } from './LandingPage';
import { AuditRequestForm } from './AuditRequestForm';
import { AuditProcessor } from './AuditProcessor';
import { AuditReport } from './AuditReport';
import { ContentAudit } from './ContentAudit';
import { ContentLibrary } from './ContentLibrary';
import { ContentRecommendations } from './ContentRecommendations';
import { FAQ } from './FAQ';

const demoCompanyId = 'demo-company';

const demoAuditData = {
  total_content_count: 12,
  by_stage: { awareness: 5, consideration: 4, decision: 3 },
  by_type: { blog: 4, case_study: 3, white_paper: 2, video: 1, webinar: 2 },
  gaps_identified: [
    {
      area: 'Decision Stage Content',
      severity: 'medium',
      recommendation: 'Add ROI calculators and onboarding guides to support purchasing teams.'
    },
    {
      area: 'Thought Leadership',
      severity: 'low',
      recommendation: 'Publish white papers quarterly to stay top-of-mind in your industry.'
    }
  ],
  consistency_score: 78
};

const demoReport = {
  overall_score: 82,
  pages_analyzed: 24,
  content_found: [
    {
      url: 'https://example.com/resources/content-strategy',
      title: 'Content Strategy Playbook',
      content_type: 'guide',
      buyer_stage: 'awareness',
      word_count: 2100
    },
    {
      url: 'https://example.com/case-studies/enterprise',
      title: 'Enterprise Case Study',
      content_type: 'case_study',
      buyer_stage: 'consideration',
      word_count: 1650
    }
  ],
  recommendations: [
    {
      title: 'Expand Decision-Stage Content',
      priority: 'high',
      impact: 'Increases close rate by addressing final objections',
      description: 'Create ROI calculator, comparison matrix, and implementation timeline guides.'
    },
    {
      title: 'Refresh Awareness Assets',
      priority: 'medium',
      impact: 'Improves top-of-funnel conversion and lead quality',
      description: 'Update blog series with 2025 data and integrate expert commentary.'
    }
  ],
  buyer_stage_coverage: { awareness: 8, consideration: 10, decision: 6 },
  content_gaps: [
    {
      area: 'Customer Proof Points',
      severity: 'medium',
      recommendation: 'Add fresh case studies and testimonial videos for key industries.'
    }
  ],
  competitive_insights: {
    strengths: ['Clear product messaging', 'Robust educational resources'],
    weaknesses: ['Minimal decision-stage enablers', 'Limited industry personalization'],
    opportunities: ['Launch monthly webinar series', 'Deepen ABM nurture tracks']
  },
  audit_requests: {
    company_name: 'Demo SaaS Co.',
    website_url: 'https://example.com'
  }
};

const demoContentItems = [
  {
    id: 'demo-item-1',
    title: 'Enterprise Sales Playbook',
    content_type: 'white_paper',
    description: 'Deep-dive guide covering the modern enterprise buyer journey.',
    file_url: '#',
    buyer_stage: 'awareness',
    tags: ['enterprise', 'strategy'],
    status: 'approved',
    created_at: new Date().toISOString(),
    company_id: demoCompanyId,
    updated_at: new Date().toISOString()
  },
  {
    id: 'demo-item-2',
    title: 'ROI Calculator Spreadsheet',
    content_type: 'calculator',
    description: 'Interactive spreadsheet to model platform ROI with sales assumptions.',
    file_url: '#',
    buyer_stage: 'decision',
    tags: ['finance', 'roi'],
    status: 'approved',
    created_at: new Date().toISOString(),
    company_id: demoCompanyId,
    updated_at: new Date().toISOString()
  }
];

const demoProspects = [
  {
    id: 'prospect-1',
    name: 'Alicia Patel',
    company_name: 'Nimbus Analytics',
    industry: 'Technology',
    stage: 'consideration',
    context: {},
    company_id: demoCompanyId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prospect-2',
    name: 'Marcus Lee',
    company_name: 'Acme Industrial',
    industry: 'Manufacturing',
    stage: 'decision',
    context: {},
    company_id: demoCompanyId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const demoRecommendations = [
  {
    content: {
      id: 'demo-item-1',
      title: 'Enterprise Sales Playbook',
      content_type: 'white_paper',
      description: 'Deep-dive guide covering the modern enterprise buyer journey.',
      file_url: '#',
      buyer_stage: 'awareness',
      tags: ['enterprise', 'strategy']
    },
    relevance_score: 0.86,
    reasoning: 'Matches consideration stage and aligns with technology industry pains.'
  },
  {
    content: {
      id: 'demo-item-2',
      title: 'ROI Calculator Spreadsheet',
      content_type: 'calculator',
      description: 'Interactive spreadsheet to model platform ROI with sales assumptions.',
      file_url: '#',
      buyer_stage: 'decision',
      tags: ['finance', 'roi']
    },
    relevance_score: 0.78,
    reasoning: 'Decision-stage asset focusing on measurable outcomes for procurement teams.'
  }
];

export function ComponentShowcase() {
  const [demoReportVisible, setDemoReportVisible] = useState(true);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center space-y-3">
          <h1 className="text-4xl font-bold">Component Showcase</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Interactive gallery of the core ContentMap components using in-browser demo data. Use this page to evaluate
            visual design, component APIs, and responsive behavior without needing Supabase credentials.
          </p>
        </header>

        <section className="bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden">
          <LandingPage onGetStarted={() => void 0} />
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="bg-white text-slate-900 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">Audit Request Form</h2>
            <p className="text-sm text-slate-600 mb-4">
              Demo mode disables Supabase calls and simulates a successful submission.
            </p>
            <AuditRequestForm onBack={() => void 0} onSuccess={() => void 0} demoMode />
          </div>

          <div className="bg-white text-slate-900 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">Audit Processor</h2>
            <p className="text-sm text-slate-600 mb-4">
              Progress animation illustrates each analysis step before marking the audit complete.
            </p>
            <AuditProcessor requestId="demo-request" onViewReport={() => void 0} demoMode />
          </div>
        </section>

        <section className="bg-white text-slate-900 rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Audit Report</h2>
            <button
              onClick={() => setDemoReportVisible(prev => !prev)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {demoReportVisible ? 'Hide report' : 'Show report'}
            </button>
          </div>
          {demoReportVisible ? (
            <AuditReport reportId="demo-report" onBack={() => void 0} initialReport={demoReport} demoMode />
          ) : (
            <div className="text-sm text-slate-600">Report hidden. Toggle to reveal the full layout.</div>
          )}
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="bg-white text-slate-900 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">Content Audit Dashboard</h2>
            <ContentAudit companyId={demoCompanyId} initialData={demoAuditData} demoMode />
          </div>
          <div className="bg-white text-slate-900 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">Content Library</h2>
            <ContentLibrary companyId={demoCompanyId} initialItems={demoContentItems as any} demoMode />
          </div>
        </section>

        <section className="bg-white text-slate-900 rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Content Recommendations</h2>
          <ContentRecommendations
            companyId={demoCompanyId}
            initialProspects={demoProspects as any}
            initialRecommendations={demoRecommendations as any}
            demoMode
          />
        </section>

        <section className="bg-white text-slate-900 rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
          <FAQ />
        </section>
      </div>
    </div>
  );
}
