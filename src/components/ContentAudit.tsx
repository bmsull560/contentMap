import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, FileText } from 'lucide-react';

interface AuditData {
  total_content_count: number;
  by_stage: Record<string, number>;
  by_type: Record<string, number>;
  gaps_identified: Array<{ area: string; severity: string; recommendation: string }>;
  consistency_score: number;
}

interface ContentAuditProps {
  companyId: string;
  initialData?: AuditData;
  demoMode?: boolean;
}

export function ContentAudit({ companyId, initialData, demoMode = false }: ContentAuditProps) {
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [runningAudit, setRunningAudit] = useState(false);

  useEffect(() => {
    if (initialData) {
      setAuditData(initialData);
      setLoading(false);
      return;
    }

    if (!demoMode) {
      fetchLatestAudit();
    } else {
      setLoading(false);
    }
  }, [companyId, initialData, demoMode]);

  const fetchLatestAudit = async () => {
    try {
      const { data, error } = await supabase
        .from('content_audit_logs')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setAuditData({
          total_content_count: data.total_content_count,
          by_stage: data.by_stage as Record<string, number>,
          by_type: data.by_type as Record<string, number>,
          gaps_identified: data.gaps_identified as Array<{ area: string; severity: string; recommendation: string }>,
          consistency_score: data.consistency_score
        });
      }
    } catch (error) {
      console.error('Error fetching audit:', error);
    } finally {
      setLoading(false);
    }
  };

  const runContentAudit = async () => {
    setRunningAudit(true);
    try {
      if (demoMode) {
        await new Promise(resolve => setTimeout(resolve, 600));
        const demoResult: AuditData = initialData ?? {
          total_content_count: 12,
          by_stage: { awareness: 5, consideration: 4, decision: 3 },
          by_type: { blog: 4, case_study: 3, white_paper: 2, video: 1, webinar: 2 },
          gaps_identified: [
            {
              area: 'Decision Stage Content',
              severity: 'medium',
              recommendation: 'Add ROI calculators and customer onboarding guides'
            }
          ],
          consistency_score: 78
        };
        setAuditData(demoResult);
        setRunningAudit(false);
        return;
      }

      const { data: contentData, error: contentError } = await supabase
        .from('content_items')
        .select('buyer_stage, content_type, status')
        .eq('company_id', companyId);

      if (contentError) throw contentError;

      const byStage: Record<string, number> = {};
      const byType: Record<string, number> = {};
      const contentItems = (contentData || []) as Array<{
        buyer_stage: string;
        content_type: string;
        status: string;
      }>;

      const approved = contentItems.filter(c => c.status === 'approved');

      approved.forEach(item => {
        byStage[item.buyer_stage] = (byStage[item.buyer_stage] || 0) + 1;
        byType[item.content_type] = (byType[item.content_type] || 0) + 1;
      });

      const gaps: Array<{ area: string; severity: string; recommendation: string }> = [];

      if ((byStage['awareness'] || 0) < 3) {
        gaps.push({
          area: 'Awareness Stage Content',
          severity: 'high',
          recommendation: 'Create more educational content like blog posts, infographics, and industry reports'
        });
      }

      if ((byStage['consideration'] || 0) < 3) {
        gaps.push({
          area: 'Consideration Stage Content',
          severity: 'high',
          recommendation: 'Develop comparison guides, case studies, and product demos'
        });
      }

      if ((byStage['decision'] || 0) < 2) {
        gaps.push({
          area: 'Decision Stage Content',
          severity: 'medium',
          recommendation: 'Prepare ROI calculators, proposals, and implementation guides'
        });
      }

      if (!(byType['case_study'] || 0)) {
        gaps.push({
          area: 'Case Studies',
          severity: 'medium',
          recommendation: 'Document customer success stories with measurable results'
        });
      }

      if (!(byType['white_paper'] || 0)) {
        gaps.push({
          area: 'Thought Leadership',
          severity: 'low',
          recommendation: 'Create white papers to establish industry expertise'
        });
      }

      const stageBalance = Math.abs((byStage['awareness'] || 0) - (byStage['consideration'] || 0)) +
                          Math.abs((byStage['consideration'] || 0) - (byStage['decision'] || 0));
      const consistencyScore = Math.max(0, 100 - (stageBalance * 5) - (gaps.length * 10));

      const { error: insertError } = await supabase
        .from('content_audit_logs')
        .insert({
          company_id: companyId,
          audit_date: new Date().toISOString().split('T')[0],
          total_content_count: approved.length,
          by_stage: byStage,
          by_type: byType,
          gaps_identified: gaps,
          consistency_score: consistencyScore
        });

      if (insertError) throw insertError;

      await fetchLatestAudit();
    } catch (error) {
      console.error('Error running audit:', error);
    } finally {
      setRunningAudit(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading audit data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Content Audit & Gap Analysis</h2>
          <p className="text-gray-600 mt-1">Identify content gaps and optimize your library</p>
        </div>
        <button
          onClick={runContentAudit}
          disabled={runningAudit}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {runningAudit ? 'Running Audit...' : 'Run New Audit'}
        </button>
      </div>

      {!auditData ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-2">No audit data available</p>
          <p className="text-sm text-gray-500 mb-4">Run your first content audit to identify gaps and opportunities</p>
          <button
            onClick={runContentAudit}
            disabled={runningAudit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Run Content Audit
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-8 h-8 text-blue-600" />
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {auditData.total_content_count}
              </div>
              <div className="text-sm text-gray-600">Total Content Items</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <BarChart3 className="w-8 h-8 text-green-600" />
                <CheckCircle className="w-5 h-5 text-gray-400" />
              </div>
              <div className={`text-3xl font-bold mb-1 ${getScoreColor(auditData.consistency_score)}`}>
                {Math.round(auditData.consistency_score)}%
              </div>
              <div className="text-sm text-gray-600">Consistency Score</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-8 h-8 text-amber-600" />
                <span className="text-xs text-gray-500">Identified</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {auditData.gaps_identified.length}
              </div>
              <div className="text-sm text-gray-600">Content Gaps</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Content by Buyer Stage</h3>
              <div className="space-y-4">
                {Object.entries(auditData.by_stage).map(([stage, count]) => {
                  const percentage = auditData.total_content_count > 0
                    ? (count / auditData.total_content_count) * 100
                    : 0;

                  return (
                    <div key={stage}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 capitalize">{stage}</span>
                        <span className="text-sm text-gray-600">{count} items ({Math.round(percentage)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Content by Type</h3>
              <div className="space-y-3">
                {Object.entries(auditData.by_type)
                  .sort(([, a], [, b]) => b - a)
                  .map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 capitalize">{type.replace('_', ' ')}</span>
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {auditData.gaps_identified.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Identified Content Gaps
              </h3>
              <div className="space-y-4">
                {auditData.gaps_identified.map((gap, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 ${getSeverityColor(gap.severity)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{gap.area}</h4>
                      <span className="px-2 py-1 rounded text-xs font-medium uppercase">
                        {gap.severity}
                      </span>
                    </div>
                    <p className="text-sm opacity-90">{gap.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
