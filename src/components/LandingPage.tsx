import { CheckCircle, BarChart3, Target, TrendingUp, ArrowRight, Sparkles, Star, Users, Shield } from 'lucide-react';
import { FAQ } from './FAQ';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: BarChart3,
      title: 'Comprehensive Content Analysis',
      description: 'We analyze your entire website to identify all content assets and categorize them by type and buyer stage.'
    },
    {
      icon: Target,
      title: 'Buyer Journey Mapping',
      description: 'Discover how well your content covers each stage of the buyer journey from awareness to decision.'
    },
    {
      icon: TrendingUp,
      title: 'Gap Identification',
      description: 'Get specific recommendations on content gaps and opportunities to improve your sales effectiveness.'
    },
    {
      icon: Sparkles,
      title: 'Actionable Insights',
      description: 'Receive a detailed report with prioritized recommendations and content strategy guidance.'
    }
  ];

  const benefits = [
    'Identify missing content for each buyer stage',
    'Understand your current content effectiveness',
    'Get prioritized recommendations for improvement',
    'Benchmark against industry best practices',
    'Receive a professional PDF report',
    'Detailed competitive positioning analysis'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <title>Content Mapping Audit - Optimize Your Sales Content Strategy | $299</title>
      <meta name="description" content="Get a comprehensive content audit mapped to the buyer's journey. Identify gaps, optimize strategy, increase conversions. Professional report delivered in 48 hours." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="pt-8 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Content Mapping Audit</h1>
              <p className="text-sm text-gray-600">Professional Content Analysis Service</p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-gray-700 font-medium">4.9/5</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">500+ Audits</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">100% Satisfaction</span>
            </div>
            </div>
          </div>
        </header>

        <section className="py-16 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Is Your Content Actually<br />
            <span className="text-blue-600">Driving Sales?</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Get an <span className="font-semibold text-gray-900">instant AI-powered analysis</span> of your website's content mapped to the buyer's journey.
            Discover gaps, optimize your content strategy, and increase conversions in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              Get Your Audit Report
              <ArrowRight className="w-5 h-5" />
            </button>
            <div className="text-2xl font-bold text-gray-900">
              $299
              <span className="text-base font-normal text-gray-600"> one-time</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-700">Results in 10 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>No subscription required</span>
            </div>
          </div>
        </section>

        <section className="py-12 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Why $299 is Worth Every Penny</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">10-20 hrs</div>
                <div className="text-sm text-gray-600">Manual analysis time saved</div>
              </div>
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">$5K+</div>
                <div className="text-sm text-gray-600">Typical agency cost for same analysis</div>
              </div>
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">30%</div>
                <div className="text-sm text-gray-600">Average conversion improvement</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white rounded-2xl shadow-xl mb-16">
          <div className="max-w-6xl mx-auto px-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              What You'll Receive
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 mb-16">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Your Audit Report Includes
            </h3>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 mb-16 text-center">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Optimize Your Content?
            </h3>
            <p className="text-xl mb-8 text-blue-100">
              Join hundreds of companies who have improved their content strategy with our audit service.
            </p>
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
            >
              Start Your Audit Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        <section className="py-16 mb-16">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">What Our Clients Say</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-gray-700 mb-4 italic">"This audit revealed content gaps we didn't even know existed. Implemented their recommendations and saw a 40% increase in qualified leads within 2 months."</p>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">Sarah Johnson</div>
                  <div className="text-gray-600">VP Marketing, TechCorp</div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-gray-700 mb-4 italic">"Worth every penny. The detailed buyer journey analysis helped us restructure our entire content strategy. ROI was clear within the first quarter."</p>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">Michael Chen</div>
                  <div className="text-gray-600">CMO, Global Solutions Inc</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 mb-8">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              How It Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Submit Your Website</h4>
                <p className="text-sm text-gray-600">
                  Provide your website URL and company information
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Instant AI Analysis</h4>
                <p className="text-sm text-gray-600">
                  Our AI analyzes your content in real-time, typically 2-3 minutes
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">View & Download</h4>
                <p className="text-sm text-gray-600">
                  Review insights immediately and download your PDF report
                </p>
              </div>
            </div>
          </div>
        </section>

        <FAQ />

        <section className="py-16 mb-16">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-8">
            <div className="text-center">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our 100% Satisfaction Guarantee
              </h3>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto leading-relaxed">
                We're confident you'll find valuable insights in your audit report. If you're not completely satisfied with the analysis and recommendations, we'll refund your payment in full within 7 days. No questions asked.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Full refund within 7 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>No questions asked</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Risk-free investment</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-8 text-center text-gray-600 border-t border-gray-200">
          <p className="text-sm">
            © 2024 Content Mapping Audit. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
