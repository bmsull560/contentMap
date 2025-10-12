import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowRight, FileText, AlertCircle } from 'lucide-react';

interface ContentCount {
  stage: string;
  count: number;
  types: Record<string, number>;
}

interface BuyerJourneyMapProps {
  companyId: string;
}

export function BuyerJourneyMap({ companyId }: BuyerJourneyMapProps) {
  const [contentByStage, setContentByStage] = useState<ContentCount[]>([]);
  const [loading, setLoading] = useState(true);

  const stages = [
    {
      id: 'awareness',
      name: 'Awareness',
      description: 'Prospects identify their problem',
      color: 'blue',
      objectives: [
        'Educate about industry challenges',
        'Build brand awareness',
        'Generate interest'
      ]
    },
    {
      id: 'consideration',
      name: 'Consideration',
      description: 'Prospects evaluate solutions',
      color: 'amber',
      objectives: [
        'Demonstrate capabilities',
        'Differentiate from competitors',
        'Build trust and credibility'
      ]
    },
    {
      id: 'decision',
      name: 'Decision',
      description: 'Prospects choose a vendor',
      color: 'green',
      objectives: [
        'Provide ROI evidence',
        'Address specific concerns',
        'Facilitate purchase process'
      ]
    }
  ];

  useEffect(() => {
    fetchContentDistribution();
  }, [companyId]);

  const fetchContentDistribution = async () => {
    try {
      const { data, error } = await supabase
        .from('content_items')
        .select('buyer_stage, content_type, status')
        .eq('company_id', companyId)
        .eq('status', 'approved');

      if (error) throw error;

      const distribution: Record<string, ContentCount> = {};

      stages.forEach(stage => {
        distribution[stage.id] = {
          stage: stage.id,
          count: 0,
          types: {}
        };
      });

      (data || []).forEach(item => {
        const stage = item.buyer_stage;
        if (distribution[stage]) {
          distribution[stage].count++;
          distribution[stage].types[item.content_type] =
            (distribution[stage].types[item.content_type] || 0) + 1;
        }
      });

      setContentByStage(Object.values(distribution));
    } catch (error) {
      console.error('Error fetching content distribution:', error);
    } finally {
      setLoading(false);
    }
  };

  const getColorClasses = (color: string, isHeader = false) => {
    const colors = {
      blue: isHeader ? 'bg-blue-600' : 'bg-blue-50 border-blue-200',
      amber: isHeader ? 'bg-amber-600' : 'bg-amber-50 border-amber-200',
      green: isHeader ? 'bg-green-600' : 'bg-green-50 border-green-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getStageContent = (stageId: string) => {
    return contentByStage.find(c => c.stage === stageId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading buyer journey map...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Buyer Journey Mapping</h2>
        <p className="text-gray-600 mt-1">Align your content with each stage of the buyer's journey</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {stages.map((stage, index) => {
          const content = getStageContent(stage.id);
          const hasContent = content && content.count > 0;

          return (
            <div key={stage.id} className="relative">
              {index < stages.length - 1 && (
                <div className="hidden lg:block absolute top-16 -right-3 z-10">
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                </div>
              )}

              <div className={`border-2 rounded-lg overflow-hidden ${getColorClasses(stage.color)}`}>
                <div className={`${getColorClasses(stage.color, true)} text-white p-4`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{stage.name}</h3>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                      {content?.count || 0} items
                    </span>
                  </div>
                  <p className="text-sm text-white/90">{stage.description}</p>
                </div>

                <div className="p-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Objectives</h4>
                    <ul className="space-y-1.5">
                      {stage.objectives.map((objective, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-gray-400 mt-0.5">•</span>
                          <span>{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Content Distribution
                    </h4>

                    {hasContent ? (
                      <div className="space-y-2">
                        {Object.entries(content.types).map(([type, count]) => (
                          <div key={type} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 capitalize">
                              {type.replace('_', ' ')}
                            </span>
                            <span className="font-medium text-gray-900">{count}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>No content mapped to this stage</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Content Coverage Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stages.map(stage => {
            const content = getStageContent(stage.id);
            const count = content?.count || 0;
            const percentage = contentByStage.reduce((sum, c) => sum + c.count, 0) > 0
              ? Math.round((count / contentByStage.reduce((sum, c) => sum + c.count, 0)) * 100)
              : 0;

            return (
              <div key={stage.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{stage.name}</span>
                  <span className="text-sm text-gray-600">{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      stage.color === 'blue' ? 'bg-blue-600' :
                      stage.color === 'amber' ? 'bg-amber-600' : 'bg-green-600'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">{count} content items</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
