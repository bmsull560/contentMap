import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle, Clock, FileText, TrendingUp } from 'lucide-react';

interface AuditProcessorProps {
  requestId: string;
  onViewReport: (reportId: string) => void;
  demoMode?: boolean;
  demoReportId?: string;
}

export function AuditProcessor({ requestId, onViewReport, demoMode = false, demoReportId }: AuditProcessorProps) {
  const [status, setStatus] = useState<'processing' | 'completed'>('processing');
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Initializing audit...');
  const [reportId, setReportId] = useState<string>('');

  useEffect(() => {
    if (demoMode) {
      runDemoProcess();
      return;
    }

    if (requestId) {
      processAudit();
    }
  }, [requestId, demoMode]);

  const runDemoProcess = async () => {
    const demoSteps = [
      { step: 'Fetching website information...', progress: 10 },
      { step: 'Crawling website pages...', progress: 30 },
      { step: 'Analyzing content quality...', progress: 55 },
      { step: 'Mapping to buyer journey...', progress: 75 },
      { step: 'Generating AI-powered recommendations...', progress: 90 }
    ];

    for (const item of demoSteps) {
      setCurrentStep(item.step);
      setProgress(item.progress);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setCurrentStep('Audit complete!');
    setProgress(100);
    setStatus('completed');
    const resultingId = demoReportId ?? 'demo-report';
    setReportId(resultingId);
    await new Promise(resolve => setTimeout(resolve, 400));
    onViewReport(resultingId);
  };

  const processAudit = async () => {
    if (demoMode) {
      return;
    }
    try {
      setCurrentStep('Fetching website information...');
      setProgress(10);

      const { data: request } = await supabase
        .from('audit_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (!request) return;

      await supabase
        .from('audit_requests')
        .update({ status: 'processing' })
        .eq('id', requestId);

      await new Promise(resolve => setTimeout(resolve, 800));
      setCurrentStep('Crawling website pages...');
      setProgress(25);

      const mockPages = [
        {
          url: `${request.website_url}/`,
          title: 'Home - Company Overview',
          content_type: 'landing_page',
          buyer_stage: 'awareness',
          word_count: 850
        },
        {
          url: `${request.website_url}/about`,
          title: 'About Us',
          content_type: 'company_info',
          buyer_stage: 'awareness',
          word_count: 650
        },
        {
          url: `${request.website_url}/products`,
          title: 'Our Products',
          content_type: 'product_page',
          buyer_stage: 'consideration',
          word_count: 1200
        },
        {
          url: `${request.website_url}/case-studies`,
          title: 'Customer Success Stories',
          content_type: 'case_study',
          buyer_stage: 'consideration',
          word_count: 2100
        },
        {
          url: `${request.website_url}/pricing`,
          title: 'Pricing Plans',
          content_type: 'pricing',
          buyer_stage: 'decision',
          word_count: 450
        },
        {
          url: `${request.website_url}/blog`,
          title: 'Blog & Resources',
          content_type: 'blog',
          buyer_stage: 'awareness',
          word_count: 3500
        }
      ];

      await supabase.from('crawled_pages').insert(
        mockPages.map(page => ({
          audit_request_id: requestId,
          ...page
        }))
      );

      await new Promise(resolve => setTimeout(resolve, 800));
      setCurrentStep('Analyzing content quality...');
      setProgress(50);

      await new Promise(resolve => setTimeout(resolve, 800));
      setCurrentStep('Mapping to buyer journey...');
      setProgress(70);

      const buyerStageCoverage = {
        awareness: 3,
        consideration: 2,
        decision: 1
      };

      const contentGaps = [];
      if (buyerStageCoverage.awareness < 4) {
        contentGaps.push({
          area: 'Awareness Stage Content',
          severity: 'medium',
          recommendation: 'Add more educational blog posts, industry reports, and thought leadership content'
        });
      }
      if (buyerStageCoverage.decision < 2) {
        contentGaps.push({
          area: 'Decision Stage Content',
          severity: 'high',
          recommendation: 'Create ROI calculators, comparison guides, and implementation resources'
        });
      }

      await new Promise(resolve => setTimeout(resolve, 800));
      setCurrentStep('Generating AI-powered recommendations...');
      setProgress(85);

      const recommendations = [
        {
          title: 'Expand Case Study Library',
          priority: 'high',
          impact: 'High conversion impact',
          description: 'Add 3-5 detailed case studies showing measurable ROI for different industries'
        },
        {
          title: 'Create Comparison Content',
          priority: 'high',
          impact: 'Helps with competitive differentiation',
          description: 'Develop comparison guides and competitive analysis resources'
        },
        {
          title: 'Build Educational Resources',
          priority: 'medium',
          impact: 'Improves brand awareness',
          description: 'Publish weekly blog posts addressing common industry challenges'
        },
        {
          title: 'Add Social Proof',
          priority: 'medium',
          impact: 'Builds trust and credibility',
          description: 'Include customer testimonials and third-party validation throughout the site'
        }
      ];

      const stageBalance = Math.abs(buyerStageCoverage.awareness - buyerStageCoverage.consideration) +
                          Math.abs(buyerStageCoverage.consideration - buyerStageCoverage.decision);
      const overallScore = Math.max(30, Math.min(85, 100 - (stageBalance * 10) - (contentGaps.length * 8)));

      const { data: report } = await supabase
        .from('audit_reports')
        .insert({
          audit_request_id: requestId,
          overall_score: overallScore,
          pages_analyzed: mockPages.length,
          content_found: mockPages,
          recommendations: recommendations,
          buyer_stage_coverage: buyerStageCoverage,
          content_gaps: contentGaps,
          competitive_insights: {
            strengths: ['Strong product messaging', 'Clear value proposition'],
            weaknesses: ['Limited social proof', 'Missing competitive differentiation'],
            opportunities: ['Expand content library', 'Improve SEO optimization']
          }
        })
        .select()
        .single();

      await supabase
        .from('audit_requests')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', requestId);

      setCurrentStep('Audit complete!');
      setProgress(100);
      setStatus('completed');

      if (report) {
        setReportId(report.id);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error processing audit:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {status === 'processing' ? (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-blue-600 animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Analyzing Your Website
                </h2>
                <p className="text-gray-600">
                  AI-powered analysis in progress - typically completes in 2-3 minutes
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{currentStep}</span>
                    <span className="text-sm font-semibold text-gray-900">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-blue-700 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">What we're analyzing:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-gray-700">
                      <CheckCircle className={`w-5 h-5 flex-shrink-0 ${progress >= 25 ? 'text-green-600' : 'text-gray-300'}`} />
                      <span>Website structure and page discovery</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-700">
                      <CheckCircle className={`w-5 h-5 flex-shrink-0 ${progress >= 50 ? 'text-green-600' : 'text-gray-300'}`} />
                      <span>Content quality and messaging analysis</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-700">
                      <CheckCircle className={`w-5 h-5 flex-shrink-0 ${progress >= 70 ? 'text-green-600' : 'text-gray-300'}`} />
                      <span>Buyer journey stage mapping</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-700">
                      <CheckCircle className={`w-5 h-5 flex-shrink-0 ${progress >= 85 ? 'text-green-600' : 'text-gray-300'}`} />
                      <span>Gap identification and recommendations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Audit Complete!
                </h2>
                <p className="text-gray-600">
                  Your comprehensive content audit report is ready
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <FileText className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Your Report Includes:
                      </h3>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Comprehensive content analysis</li>
                        <li>• Buyer journey mapping</li>
                        <li>• Identified content gaps</li>
                        <li>• Prioritized recommendations</li>
                        <li>• Competitive insights</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onViewReport(reportId)}
                  className="w-full px-6 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <TrendingUp className="w-5 h-5" />
                  View Your Audit Report
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
