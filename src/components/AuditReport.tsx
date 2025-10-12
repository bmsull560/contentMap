import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  FileText,
  Download,
  ArrowLeft,
  Target,
  Map
} from 'lucide-react';

interface AuditReportProps {
  reportId: string;
  onBack: () => void;
  initialReport?: Report;
  demoMode?: boolean;
}

interface Report {
  overall_score: number;
  pages_analyzed: number;
  content_found: Array<{
    url: string;
    title: string;
    content_type: string;
    buyer_stage: string;
    word_count: number;
  }>;
  recommendations: Array<{
    title: string;
    priority: string;
    impact: string;
    description: string;
  }>;
  buyer_stage_coverage: Record<string, number>;
  content_gaps: Array<{
    area: string;
    severity: string;
    recommendation: string;
  }>;
  competitive_insights: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
  };
  audit_requests?: {
    company_name: string;
    website_url: string;
  };
}

export function AuditReport({ reportId, onBack, initialReport, demoMode = false }: AuditReportProps) {
  const [report, setReport] = useState<Report | null>(initialReport ?? null);
  const [loading, setLoading] = useState(!initialReport);

  useEffect(() => {
    if (initialReport) {
      setLoading(false);
      return;
    }

    if (!demoMode) {
      fetchReport();
    } else {
      setLoading(false);
    }
  }, [reportId, initialReport, demoMode]);

  const fetchReport = async () => {
    if (demoMode) {
      return;
    }
    try {
      const { data, error } = await supabase
        .from('audit_reports')
        .select(`
          *,
          audit_requests (
            company_name,
            website_url
          )
        `)
        .eq('id', reportId)
        .single();

      if (error) throw error;
      setReport(data as Report);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-500">Loading your audit report...</div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-amber-600 mx-auto mb-4" />
          <div className="text-gray-900 font-semibold mb-2">Report Not Found</div>
          <div className="text-gray-500 mb-4">We couldn't find the requested audit report</div>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const totalContent = report.pages_analyzed;
  const stageDistribution = report.buyer_stage_coverage;

  return (
    <div className="min-h-screen bg-gray-50 py-8 print:bg-white">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-break { page-break-after: always; }
          body { font-size: 12pt; }
          h1 { font-size: 20pt; }
          h2 { font-size: 16pt; }
          h3 { font-size: 14pt; }
        }
      `}</style>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="no-print flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Content Audit Report</h1>
                <p className="text-blue-100">
                  {report.audit_requests?.company_name} • {report.audit_requests?.website_url}
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                <Download className="w-5 h-5" />
                Download PDF
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className={`text-5xl font-bold mb-2 ${getScoreColor(report.overall_score)}`}>
                  {Math.round(report.overall_score)}
                </div>
                <div className="text-sm text-gray-600 font-medium">Overall Score</div>
                <div className="text-xs text-gray-500 mt-1">{getScoreLabel(report.overall_score)}</div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <div className="text-5xl font-bold text-green-600 mb-2">{totalContent}</div>
                <div className="text-sm text-gray-600 font-medium">Pages Analyzed</div>
                <div className="text-xs text-gray-500 mt-1">Across your website</div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl">
                <div className="text-5xl font-bold text-amber-600 mb-2">
                  {report.content_gaps.length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Content Gaps</div>
                <div className="text-xs text-gray-500 mt-1">Opportunities identified</div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Map className="w-6 h-6 text-blue-600" />
                Buyer Journey Coverage
              </h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="space-y-4">
                  {Object.entries(stageDistribution).map(([stage, count]) => {
                    const percentage = totalContent > 0 ? (count / totalContent) * 100 : 0;
                    return (
                      <div key={stage}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-700 capitalize">{stage}</span>
                          <span className="text-sm text-gray-600">{count} pages ({Math.round(percentage)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${
                              stage === 'awareness' ? 'bg-blue-600' :
                              stage === 'consideration' ? 'bg-amber-600' : 'bg-green-600'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {report.content_gaps.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                  Content Gaps Identified
                </h2>
                <div className="space-y-4">
                  {report.content_gaps.map((gap, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-amber-500 bg-amber-50 rounded-r-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{gap.area}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                          gap.severity === 'high' ? 'bg-red-100 text-red-800' :
                          gap.severity === 'medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {gap.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{gap.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-600" />
                Prioritized Recommendations
              </h2>
              <div className="space-y-4">
                {report.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{rec.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                        {rec.priority} priority
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-700">
                        <TrendingUp className="w-4 h-4" />
                        {rec.impact}
                      </span>
                    </div>
                    <p className="text-gray-700">{rec.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                Competitive Analysis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {report.competitive_insights.strengths.map((item, idx) => (
                      <li key={idx} className="text-sm text-green-800">• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Weaknesses
                  </h3>
                  <ul className="space-y-2">
                    {report.competitive_insights.weaknesses.map((item, idx) => (
                      <li key={idx} className="text-sm text-red-800">• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Opportunities
                  </h3>
                  <ul className="space-y-2">
                    {report.competitive_insights.opportunities.map((item, idx) => (
                      <li key={idx} className="text-sm text-blue-800">• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                Content Inventory
              </h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="space-y-3">
                  {report.content_found.map((page, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{page.title}</h4>
                          <p className="text-sm text-gray-500 mb-2">{page.url}</p>
                          <div className="flex gap-2">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium capitalize">
                              {page.buyer_stage}
                            </span>
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                              {page.content_type.replace('_', ' ')}
                            </span>
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                              {page.word_count} words
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
