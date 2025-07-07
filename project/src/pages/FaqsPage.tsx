import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

const dummyFaqs: FAQ[] = [
  {
    _id: '1',
    question: 'What services do Hindustan Builders offer?',
    answer: 'We provide residential, commercial, and mixed-use real estate development services across India.',
  },
  {
    _id: '2',
    question: 'How can I book a site visit?',
    answer: 'You can schedule a site visit through our contact form. Click on Contact us Page 🡨',
  },
  {
    _id: '3',
    question: 'Are your projects RERA approved?',
    answer: 'Yes, all our projects are fully compliant and registered with the respective RERA authorities.',
  },
  {
    _id: '4',
    question: 'Do you offer home loan assistance?',
    answer: 'Yes, we assist our clients in connecting with trusted banking partners for home loan services.',
  },
  {
    _id: '5',
    question: 'Where are your ongoing projects located?',
    answer: 'Our ongoing projects are currently located in Mangalore, Bangalore, and Udupi.',
  },
];

const FaqsPage = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    // Simulate fetching from API by loading dummy data
    setTimeout(() => {
      setFaqs(dummyFaqs);
    }, 500);
  }, []);

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white py-12"
    >
      <Helmet>
        <meta name="description" content="Frequently Asked Questions about Hindustan Builders" />
      </Helmet>

      <div className="container mx-auto px-6 mt-20">
       <h2 className="text-2xl font-bold font-poppins tracking-widest text-dark mb-2 ml-4 md:ml-28">
  FAQ<span className="lowercase">s</span>
</h2>


        <div className="max-w-3xl mx-auto mt-8">
          {faqs.length > 0 ? (
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={faq._id}
                  className="border border-neutral-300 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-5 py-4 flex justify-between items-center text-left focus:outline-none bg-neutral-50 hover:bg-neutral-100"
                  >
                    <span className="text-lg font-medium text-neutral-800">
                      {faq.question}
                    </span>
                    {expandedIndex === index ? (
                      <ChevronUp className="text-[#8a6c1a]" />
                    ) : (
                      <ChevronDown className="text-[#8a6c1a]" />
                    )}
                  </button>
                  {expandedIndex === index && (
                    <div className="px-5 pb-4 text-neutral-600">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-neutral-500">Loading FAQs...</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FaqsPage;
