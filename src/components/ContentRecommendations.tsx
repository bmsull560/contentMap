import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Sparkles, FileText, ArrowRight, Target, Building2, TrendingUp } from 'lucide-react';

interface Prospect {
  id: string;
  name: string;
  company_name: string;
  industry: string;
  stage: string;
}

interface ContentItem {
  id: string;
  title: string;
  content_type: string;
  description: string;
  buyer_stage: string;
  file_url: string;
  tags?: string[];
}

interface Recommendation {
  content: ContentItem;
  relevance_score: number;
  reasoning: string;
}

interface ContentRecommendationsProps {
  companyId: string;
  initialProspects?: Prospect[];
  initialRecommendations?: Recommendation[];
  demoMode?: boolean;
}

export function ContentRecommendations({
  companyId,
  initialProspects,
  initialRecommendations,
  demoMode = false
}: ContentRecommendationsProps) {
  const [prospects, setProspects] = useState<Prospect[]>(initialProspects ?? []);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(initialProspects?.[0] ?? null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(initialRecommendations ?? []);
  const [loading, setLoading] = useState(!initialProspects);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (initialProspects) {
      setLoading(false);
      return;
    }

    if (!demoMode) {
      fetchProspects();
    } else {
      setLoading(false);
    }
  }, [companyId, initialProspects, demoMode]);

  const fetchProspects = async () => {
    if (demoMode) {
      return;
    }
    try {
      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProspects(data || []);
    } catch (error) {
      console.error('Error fetching prospects:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async (prospect: Prospect) => {
    setGenerating(true);
    setSelectedProspect(prospect);

    try {
      if (demoMode) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const demoRecommendations: Recommendation[] = initialRecommendations ?? [
          {
            content: {
              id: 'demo-1',
              title: 'Case Study: Scaling Revenue with ABM',
              content_type: 'case_study',
              description: 'Deep-dive case study showing 35% pipeline growth in 90 days.',
              buyer_stage: 'consideration',
              file_url: '#',
              tags: ['technology', 'abm']
            } as ContentItem,
            relevance_score: 0.86,
            reasoning: 'Matches consideration buyer stage. Social proof relevant for SaaS prospects.'
          },
          {
            content: {
              id: 'demo-2',
              title: 'ROI Calculator Template',
              content_type: 'calculator',
              description: 'Interactive spreadsheet to project ROI from implementing your platform.',
              buyer_stage: 'decision',
              file_url: '#',
              tags: ['finance']
            } as ContentItem,
            relevance_score: 0.78,
            reasoning: 'Decision-stage asset focused on ROI. Complements procurement discussions.'
          }
        ];
        setRecommendations(demoRecommendations);
        return;
      }

      const { data: contentItems, error: contentError } = await supabase
        .from('content_items')
        .select('*')
        .eq('company_id', companyId)
        .eq('status', 'approved');

      if (contentError) throw contentError;

  const recommendedContent: Recommendation[] = [];
  const items = (contentItems || []) as Array<ContentItem & { tags?: string[] }>;

  items.forEach(item => {
        let relevanceScore = 0;
        const reasons: string[] = [];

        if (item.buyer_stage === prospect.stage) {
          relevanceScore += 0.4;
          reasons.push(`Matches ${prospect.stage} buyer stage`);
        }

        if (item.buyer_stage === 'awareness' && prospect.stage === 'awareness') {
          relevanceScore += 0.2;
          reasons.push('Educational content for early-stage prospect');
        }

        if (item.buyer_stage === 'decision' && prospect.stage === 'decision') {
          relevanceScore += 0.3;
          reasons.push('ROI-focused content for decision stage');
        }

        if (item.content_type === 'case_study' && prospect.stage !== 'awareness') {
          relevanceScore += 0.2;
          reasons.push('Social proof relevant for this stage');
        }

        if (prospect.industry && item.tags && item.tags.includes(prospect.industry.toLowerCase())) {
          relevanceScore += 0.3;
          reasons.push(`Industry-specific content for ${prospect.industry}`);
        }

        if (relevanceScore > 0.3) {
          recommendedContent.push({
            content: item,
            relevance_score: Math.min(relevanceScore, 1),
            reasoning: reasons.join('. ')
          });
        }
      });

      recommendedContent.sort((a, b) => b.relevance_score - a.relevance_score);
      setRecommendations(recommendedContent.slice(0, 6));

      const insertPromises = recommendedContent.slice(0, 6).map(rec =>
        supabase.from('content_recommendations').insert({
          prospect_id: prospect.id,
          content_id: rec.content.id,
          relevance_score: rec.relevance_score,
          reasoning: rec.reasoning
        })
      );

      await Promise.all(insertPromises);

    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setGenerating(false);
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'awareness': return 'bg-blue-100 text-blue-800';
      case 'consideration': return 'bg-amber-100 text-amber-800';
      case 'decision': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.6) return 'bg-blue-500';
    if (score >= 0.4) return 'bg-amber-500';
    return 'bg-gray-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading recommendations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Content Recommendations</h2>
        <p className="text-gray-600 mt-1">AI-powered content suggestions based on prospect context</p>
      </div>

      {prospects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-2">No prospects available</p>
          <p className="text-sm text-gray-500">Add prospects to generate content recommendations</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Select Prospect</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {prospects.map(prospect => (
                  <button
                    key={prospect.id}
                    onClick={() => generateRecommendations(prospect)}
                    disabled={generating}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedProspect?.id === prospect.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="font-medium text-gray-900 mb-1">{prospect.name}</div>
                    <div className="text-sm text-gray-600 mb-2">{prospect.company_name}</div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStageColor(prospect.stage)}`}>
                        {prospect.stage}
                      </span>
                      {prospect.industry && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {prospect.industry}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {!selectedProspect ? (
              <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Select a prospect to view recommendations</p>
                </div>
              </div>
            ) : generating ? (
              <div className="h-full flex items-center justify-center bg-white rounded-lg border border-gray-200">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mx-auto mb-3"></div>
                  <p className="text-gray-600">Generating recommendations...</p>
                </div>
              </div>
            ) : recommendations.length === 0 ? (
              <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">No relevant content found</p>
                  <p className="text-sm text-gray-500">Try adding more content to your library</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-blue-900 mb-1">
                        Recommendations for {selectedProspect.name}
                      </div>
                      <div className="text-sm text-blue-700">
                        {selectedProspect.company_name} • {selectedProspect.industry} • {selectedProspect.stage} stage
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {recommendations.map(rec => (
                    <div key={rec.content.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h4 className="font-semibold text-gray-900">{rec.content.title}</h4>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <div className="text-right">
                                <div className="text-xs text-gray-500">Relevance</div>
                                <div className="text-sm font-bold text-gray-900">
                                  {Math.round(rec.relevance_score * 100)}%
                                </div>
                              </div>
                              <div className="w-2 h-12 rounded-full bg-gray-200 overflow-hidden">
                                <div
                                  className={`w-full ${getRelevanceColor(rec.relevance_score)} transition-all`}
                                  style={{ height: `${rec.relevance_score * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 mb-3">{rec.content.description}</p>

                          <div className="flex items-center gap-2 mb-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStageColor(rec.content.buyer_stage)}`}>
                              {rec.content.buyer_stage}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                              {rec.content.content_type.replace('_', ' ')}
                            </span>
                          </div>

                          <div className="bg-gray-50 rounded p-3 mb-3">
                            <div className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Why this content?
                            </div>
                            <div className="text-xs text-gray-600">{rec.reasoning}</div>
                          </div>

                          {rec.content.file_url && (
                            <a
                              href={rec.content.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              View Content
                              <ArrowRight className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
