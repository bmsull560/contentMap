import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'How long does the audit take?',
      answer: 'Your audit starts instantly after submission! Preliminary insights appear within 2-3 minutes, and your complete comprehensive analysis with all recommendations is typically ready in 10 minutes or less.'
    },
    {
      question: 'What if I\'m not satisfied with the audit?',
      answer: 'We offer a 100% money-back guarantee. If you\'re not completely satisfied with the insights and recommendations in your audit report, contact us within 7 days for a full refund, no questions asked.'
    },
    {
      question: 'Can you audit password-protected or internal pages?',
      answer: 'Our standard audit analyzes publicly accessible pages on your website. If you need analysis of gated content or internal resources, contact us for a custom enterprise audit solution.'
    },
    {
      question: 'How is this different from a free SEO audit?',
      answer: 'Unlike SEO audits that focus on technical optimization, our Content Mapping Audit analyzes your content strategy through the lens of the buyer journey. We identify gaps in your sales enablement content and provide actionable recommendations to improve conversion rates.'
    },
    {
      question: 'Will I receive recommendations specific to my industry?',
      answer: 'Yes! Our analysis considers your industry context and benchmarks your content against best practices in your sector. Recommendations are tailored to your specific market and buyer personas.'
    },
    {
      question: 'Can I request a re-audit after implementing changes?',
      answer: 'Absolutely! We offer a 50% discount on follow-up audits within 90 days of your original audit. This allows you to measure the impact of implemented recommendations.'
    },
    {
      question: 'Do you provide implementation support?',
      answer: 'The audit includes detailed, actionable recommendations you can implement yourself. For hands-on implementation support, we offer consulting packages starting at $2,500/month.'
    },
    {
      question: 'What size websites can you audit?',
      answer: 'We can audit websites of any size, from small business sites with 10-20 pages to enterprise sites with thousands of pages. Our pricing remains the same regardless of site size.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 mb-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-3">
            Frequently Asked Questions
          </h3>
          <p className="text-gray-600">
            Everything you need to know about our Content Mapping Audit
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div
                  id={`faq-answer-${index}`}
                  className="px-6 pb-4 text-gray-700 leading-relaxed"
                >
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Still have questions?
          </p>
          <a
            href="mailto:support@contentmappingaudit.com"
            className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            Contact our support team
          </a>
        </div>
      </div>
    </section>
  );
}
