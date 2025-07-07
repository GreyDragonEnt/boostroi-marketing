import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-brand hover:text-brand/80 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>
          
          <main className="prose prose-lg max-w-none bg-white rounded-lg p-8 shadow-sm">
            <h1 className="text-4xl font-montserrat font-bold text-charcoal mb-8">Terms of Service</h1>
            
            <p className="text-gray-600 mb-6">
              <strong>Effective Date:</strong> January 1, 2024<br />
              <strong>Last Updated:</strong> January 1, 2024
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-montserrat font-semibold text-charcoal mb-4">1. Service Scope</h2>
              <p>
                BoostROI Agency ("we," "us," "our") provides digital marketing services including but not limited to paid advertising management, search engine optimization, conversion rate optimization, and marketing analytics. Our services are delivered according to the specific plan you have selected (Starter, Pro, or Legendary).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-montserrat font-semibold text-charcoal mb-4">2. Payment Terms</h2>
              <ul>
                <li><strong>Starter Plan:</strong> One-time payment of A$550, due upon service commencement</li>
                <li><strong>Pro Plan:</strong> Monthly subscription of A$7,500, billed monthly in advance</li>
                <li><strong>Legendary Plan:</strong> Monthly subscription of A$15,000, billed monthly in advance</li>
              </ul>
              <p>
                All payments are processed through Stripe. Late payments may result in service suspension. We reserve the right to adjust pricing with 30 days written notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-montserrat font-semibold text-charcoal mb-4">3. No-Guarantee Clause</h2>
              <p>
                While we strive to deliver exceptional results, digital marketing performance can be influenced by numerous external factors including market conditions, competition, and industry changes. We do not guarantee specific results, ROI improvements, or revenue increases. All projections and estimates are based on historical data and industry benchmarks but should not be considered promises of future performance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-montserrat font-semibold text-charcoal mb-4">4. Client Obligations</h2>
              <p>
                Clients are responsible for providing timely access to necessary accounts, accurate information, and prompt feedback. Delays in client response may impact project timelines and results. Clients must comply with all platform terms of service and applicable laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-montserrat font-semibold text-charcoal mb-4">5. Intellectual Property</h2>
              <p>
                All strategies, methodologies, and proprietary tools developed by BoostROI Agency remain our intellectual property. Clients retain ownership of their content and data. We may use aggregated, anonymized performance data for case studies and marketing purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-montserrat font-semibold text-charcoal mb-4">6. Termination</h2>
              <p>
                Either party may terminate monthly subscriptions with 30 days written notice. The Starter plan is non-refundable after 14 days. Upon termination, clients will receive all campaign data and account access will be transferred back to them within 5 business days.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-montserrat font-semibold text-charcoal mb-4">7. Limitation of Liability</h2>
              <p>
                Our liability is limited to the amount paid for services in the preceding 12 months. We are not liable for indirect, consequential, or punitive damages. This limitation applies to all claims, whether based on contract, tort, or any other legal theory.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-montserrat font-semibold text-charcoal mb-4">8. Governing Law</h2>
              <p>
                These terms are governed by the laws of Western Australia. Any disputes will be resolved in the courts of Western Australia. If any provision is found unenforceable, the remainder of these terms will remain in effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-montserrat font-semibold text-charcoal mb-4">9. Changes to Terms</h2>
              <p>
                We may update these terms from time to time. Changes will be posted on our website and will take effect 30 days after posting. Continued use of our services constitutes acceptance of updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-montserrat font-semibold text-charcoal mb-4">10. Contact Information</h2>
              <p>
                For questions about these terms, please contact us at:<br />
                Email: legal@boostroi.agency<br />
                Address: BoostROI Agency, Perth, Western Australia
              </p>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
