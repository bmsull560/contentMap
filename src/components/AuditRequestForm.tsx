import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Building2, Mail, User, Globe, Briefcase, CheckCircle, ArrowLeft } from 'lucide-react';

interface AuditRequestFormProps {
  onBack: () => void;
  onSuccess: (requestId: string) => void;
}

export function AuditRequestForm({ onBack, onSuccess }: AuditRequestFormProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    websiteUrl: '',
    contactName: '',
    contactEmail: '',
    industry: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Manufacturing',
    'Retail',
    'Education',
    'Professional Services',
    'Real Estate',
    'Marketing & Advertising',
    'Other'
  ];

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUrl = (url: string): boolean => {
    try {
      const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
      return urlPattern.test(url);
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const errors: Record<string, string> = {};

    if (!validateEmail(formData.contactEmail)) {
      errors.contactEmail = 'Please enter a valid email address';
    }

    if (!validateUrl(formData.websiteUrl)) {
      errors.websiteUrl = 'Please enter a valid website URL';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);

    try {
      let websiteUrl = formData.websiteUrl.trim();
      if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
        websiteUrl = 'https://' + websiteUrl;
      }

      const { data, error: insertError } = await supabase
        .from('audit_requests')
        .insert({
          company_name: formData.companyName,
          website_url: websiteUrl,
          contact_name: formData.contactName,
          contact_email: formData.contactEmail,
          industry: formData.industry,
          status: 'pending',
          payment_status: 'paid'
        })
        .select()
        .single();

      if (insertError) throw insertError;

      if (data) {
        onSuccess(data.id);
      }
    } catch (err) {
      console.error('Error submitting audit request:', err);
      setError('Failed to submit audit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const isValid =
    formData.companyName.trim() !== '' &&
    formData.websiteUrl.trim() !== '' &&
    formData.contactName.trim() !== '' &&
    formData.contactEmail.trim() !== '' &&
    formData.industry !== '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to home
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Request Your Content Audit</h2>
            <p className="text-blue-100">
              Fill out the form below and we'll analyze your website's content strategy
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  placeholder="Acme Corporation"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Website URL *
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  required
                  placeholder="www.example.com"
                  aria-label="Website URL"
                  aria-describedby="website-help"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    fieldErrors.websiteUrl ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
              </div>
              {fieldErrors.websiteUrl && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.websiteUrl}</p>
              )}
              <p id="website-help" className="text-xs text-gray-500 mt-1">
                Enter your company's main website URL
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                  placeholder="John Smith"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  aria-label="Email address"
                  aria-describedby="email-help"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    fieldErrors.contactEmail ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
              </div>
              {fieldErrors.contactEmail && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.contactEmail}</p>
              )}
              <p id="email-help" className="text-xs text-gray-500 mt-1">
                We'll send your audit report to this email
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Industry *
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Select your industry</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">What happens next?</p>
                  <ul className="space-y-1 text-blue-800">
                    <li>• Instant preliminary insights in 2-3 minutes</li>
                    <li>• Complete analysis ready within 10 minutes</li>
                    <li>• Comprehensive PDF report with actionable recommendations</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">Total:</span> $299 (one-time)
              </div>
              <button
                type="submit"
                disabled={!isValid || submitting}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {submitting ? 'Processing...' : 'Submit Request'}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              By submitting this form, you agree to our terms of service and privacy policy.
              For demo purposes, payment is simulated.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
