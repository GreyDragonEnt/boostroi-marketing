import { Link } from "wouter";
import NewsletterSignup from "./newsletter-signup";

export default function Footer() {
  const faqs = [
    {
      question: "How quickly will I see results?",
      answer: "Most clients see improvements within 30 days. Significant ROI gains typically happen within 60-90 days as we optimize and scale your campaigns."
    },
    {
      question: "Do you work with businesses outside Australia?",
      answer: "Absolutely! While we're based in Australia, we work with businesses globally. Our strategies work in any English-speaking market."
    },
    {
      question: "What if I'm not happy with the results?",
      answer: "We offer a 14-day money-back guarantee on our Starter package, and prorata refunds for monthly plans. Your success is our reputation."
    },
    {
      question: "Do you require long-term contracts?",
      answer: "Nope! Our monthly plans are month-to-month. You can cancel anytime. We earn your business every month through results."
    },
    {
      question: "What industries do you work with?",
      answer: "We work with all industries, but we're particularly effective with e-commerce, SaaS, professional services, and local businesses."
    },
    {
      question: "How hands-on are you with campaign management?",
      answer: "Very hands-on. We don't just set and forget. We actively monitor, test, and optimize your campaigns daily for maximum ROI."
    }
  ];

  return (
    <footer className="bg-charcoal text-white py-16">
      <div className="container mx-auto px-6">
        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="font-montserrat font-bold text-2xl mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              {faqs.slice(0, 3).map((faq, index) => (
                <div key={index}>
                  <h3 className="font-montserrat font-semibold text-lg mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {faqs.slice(3).map((faq, index) => (
                <div key={index}>
                  <h3 className="font-montserrat font-semibold text-lg mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="border-t border-gray-700 pt-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <img 
                  src="/boostroi-logo.svg" 
                  alt="BoostROI Agency" 
                  className="h-12 w-auto"
                />
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                The Aussie marketing agency that actually boosts your ROI. No BS, just results that matter to your bottom line.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-montserrat font-semibold text-lg mb-4">Services</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#services" className="hover:text-white transition-colors">Social Media Marketing</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Content & Influencer Marketing</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Conversion Optimization</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Analytics & Tracking</a></li>
              </ul>
            </div>
            
            <div>
              <NewsletterSignup variant="footer" />
              
              <div className="mt-8">
                <h3 className="font-montserrat font-semibold text-lg mb-4">Legal</h3>
                <ul className="space-y-2 text-gray-300">
                  <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
                </ul>
                
                <div className="mt-6">
                  <h3 className="font-montserrat font-semibold text-lg mb-4">Contact</h3>
                  <p className="text-gray-300">hello@boostroi.agency</p>
                  <p className="text-gray-300">+61 2 8123 4567</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 BoostROI Agency. All rights reserved. Built with ❤️ in Australia.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
