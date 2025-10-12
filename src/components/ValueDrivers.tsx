import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Target, TrendingUp, DollarSign, Shield, Edit2, Trash2 } from 'lucide-react';

interface ValueDriver {
  id: string;
  name: string;
  description: string;
  category: string;
  metrics: Array<{ name: string; unit: string }>;
  created_at: string;
}

interface ValueDriversProps {
  companyId: string;
}

export function ValueDrivers({ companyId }: ValueDriversProps) {
  const [valueDrivers, setValueDrivers] = useState<ValueDriver[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'cost_reduction', name: 'Cost Reduction', icon: DollarSign, color: 'green' },
    { id: 'revenue_growth', name: 'Revenue Growth', icon: TrendingUp, color: 'blue' },
    { id: 'risk_mitigation', name: 'Risk Mitigation', icon: Shield, color: 'amber' },
    { id: 'efficiency', name: 'Efficiency', icon: Target, color: 'purple' }
  ];

  useEffect(() => {
    fetchData();
  }, [companyId]);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('value_drivers')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setValueDrivers(data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDrivers = selectedCategory === 'all'
    ? valueDrivers
    : valueDrivers.filter(d => d.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    const Icon = cat?.icon || Target;
    return <Icon className="w-5 h-5" />;
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    const colorMap: Record<string, string> = {
      green: 'bg-green-100 text-green-800 border-green-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      amber: 'bg-amber-100 text-amber-800 border-amber-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colorMap[cat?.color || 'blue'];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading value drivers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Value Driver Configuration</h2>
          <p className="text-gray-600 mt-1">Define and manage standardized value propositions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          Add Value Driver
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Categories
        </button>
        {categories.map(category => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {category.name}
            </button>
          );
        })}
      </div>

      {filteredDrivers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-2">No value drivers found</p>
          <p className="text-sm text-gray-500">Create your first value driver to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDrivers.map((driver) => (
            <div key={driver.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg border ${getCategoryColor(driver.category)}`}>
                    {getCategoryIcon(driver.category)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{driver.name}</h3>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(driver.category)}`}>
                      {driver.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{driver.description}</p>

              {driver.metrics && driver.metrics.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Key Metrics</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {driver.metrics.map((metric, idx) => (
                      <div key={idx} className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500 mb-1">{metric.name}</div>
                        <div className="text-sm font-medium text-gray-900">{metric.unit}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Value Driver Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map(category => {
            const count = valueDrivers.filter(d => d.category === category.id).length;
            const Icon = category.icon;
            return (
              <div key={category.id} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 mb-2">
                  <Icon className="w-6 h-6 text-gray-700" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600">{category.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
