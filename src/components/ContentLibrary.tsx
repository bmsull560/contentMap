import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Search, Tag, FileText, ExternalLink } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  content_type: string;
  description: string;
  file_url: string;
  buyer_stage: string;
  tags: string[];
  status: string;
  created_at: string;
}

interface ContentLibraryProps {
  companyId: string;
  initialItems?: ContentItem[];
  demoMode?: boolean;
}

export function ContentLibrary({ companyId, initialItems, demoMode = false }: ContentLibraryProps) {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [, setShowAddModal] = useState(false);

  useEffect(() => {
    if (initialItems) {
      setContentItems(initialItems);
      setLoading(false);
      return;
    }

    if (!demoMode) {
      fetchContentItems();
    } else {
      setLoading(false);
    }
  }, [companyId, initialItems, demoMode]);

  const fetchContentItems = async () => {
    try {
      const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContentItems(data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = filterStage === 'all' || item.buyer_stage === filterStage;
    const matchesType = filterType === 'all' || item.content_type === filterType;
    return matchesSearch && matchesStage && matchesType;
  });

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'awareness': return 'bg-blue-100 text-blue-800';
      case 'consideration': return 'bg-amber-100 text-amber-800';
      case 'decision': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading content library...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Content Library</h2>
          <p className="text-gray-600 mt-1">Manage and organize your sales content assets</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Content
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Stages</option>
            <option value="awareness">Awareness</option>
            <option value="consideration">Consideration</option>
            <option value="decision">Decision</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="case_study">Case Study</option>
            <option value="white_paper">White Paper</option>
            <option value="proposal_template">Proposal Template</option>
            <option value="presentation">Presentation</option>
            <option value="brochure">Brochure</option>
          </select>
        </div>
      </div>

      {filteredContent.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-2">No content found</p>
          <p className="text-sm text-gray-500">Try adjusting your filters or add new content</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{item.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(item.buyer_stage)}`}>
                    {item.buyer_stage}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {item.content_type.replace('_', ' ')}
                  </span>
                </div>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{item.tags.length - 3}</span>
                    )}
                  </div>
                )}
              </div>

              {item.file_url && (
                <a
                  href={item.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Content
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
