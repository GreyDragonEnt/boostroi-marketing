import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Refund() {
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
            <h1 className="text-4xl font-montserrat font-bold text-charcoal mb-8">Refund Policy</h1>
            
            <p className="text-gray-600 mb-6">
              <strong>Effective Date:</strong> January 1, 2024<br />
              <strong>Last Updated:</strong> January 1, 2024
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-montserrat font-semibold text-charcoal mb-4">1. Starter Plan Refund Policy</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-montserrat font-medium text-green-800 mb-2">14-Day Money-Back Guarantee</h3>
                <p className="text-green-700">
                  The Starter Plan (A$550 one-time payment) comes with a full 14-day money-back guarantee from the date of purchase.
                </p>
              </div>
              
              <h3 className="text-xl font-montserrat font-medium text-charcoal mb-3">Eligibility Criteria:</h3>
              <ul>
                <li>Request must be made within 14 calendar days of purchase</li>
                <li>Client must have participated in the initial consultation and audit process</li>
                <li>Refund requests based on "change of mind" or "different expectations" are valid</li>
                <li>No specific reason required - full discretion given to client</li>
              </ul>
              
              <h3 className="text-xl font-montserrat font-medium text-charcoal mb-3 mt-6">Refund Process:</h3>
              <ul>
                <li>Email refund request to billing@boostroi.agency</li>
                <li>Include your name, invoice number, and purchase date</li>
                <li>Refunds processed within 5-7 business days</li>
                <li>Refunds issued to original payment method via Stripe</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-montserrat font-semibold text-charcoal mb-4">2. Pro Plan Refund Policy</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-montserrat font-medium text-blue-800 mb-2">A$7,500/month - First Month Prorata</h3>
                <p className="text-blue-700">
                  Pro Plan subscribers can receive a prorated refund for the first 14 days of their initial month only.
                </p>
              </div>
              
              <h3 className="text-xl font-montserrat font-medium text-charcoal mb-3">First Month (Days 1-14):</h3>
              <ul>
                <li>Prorated refund available for unused portion of first month</li>
                <li>Example: Cancel on day 7 = refund for remaining 23 days (approximately A$5,531)</li>
                <li>Must request refund within 14 days of first payment</li>
                <li>All campaign access and data will be transferred back to client</li>
              </ul>
              
              <h3 className="text-xl font-montserrat font-medium text-charcoal mb-3 mt-6">After First Month:</h3>
              <ul>
                <li>No refunds available for subsequent monthly payments</li>
                <li>Monthly subscription - cancel anytime with 30 days notice</li>
                <li>Service continues until end of current billing period</li>
                <li>No penalties for cancellation</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-montserrat font-semibold text-charcoal mb-4">3. Legendary Plan Refund Policy</h2>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-montserrat font-medium text-purple-800 mb-2">A$15,000/month - First Month Prorata</h3>
                <p className="text-purple-700">
                  Legendary Plan subscribers can receive a prorated refund for the first 14 days of their initial month only.
                </p>
              </div>
              
              <h3 className="text-xl font-montserrat font-medium text-charcoal mb-3">First Month (Days 1-14):</h3>
              <ul>
                <li>Prorated refund available for unused portion of first month</li>
                <li>Example: Cancel on day 10 = refund for remaining 20 days (approximately A$9,677)</li>
                <li>Must request refund within 14 days of first payment</li>
                <li>All custom developments and strategies remain client property</li>
              </ul>
              
              <h3 className="text-xl font-montserrat font-medium text-charcoal mb-3 mt-6">After First Month:</h3>
              <ul>
                <li>No refunds available for subsequent monthly payments</li>
                <li>Monthly subscription - cancel anytime with 30 days notice</li>
                <li>Service continues until end of current billing period</li>
                <li>No penalties for cancellation</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-montserrat font-semibold text-charcoal mb-4">4. Cancellation Process</h2>
              <h3 className="text-xl font-montserrat font-medium text-charcoal mb-3">How to Cancel:</h3>
              <ol>
                <li>Email your cancellation request to billing@boostroi.agency</li>
                <li>Include your account details and desired cancellation date</li>
                <li>We'll confirm receipt within 24 hours</li>
                <li>For monthly plans, provide 30 days notice or pay for the current month</li>
              </ol>
              
              <h3 className="text-xl font-montserrat font-medium text-charcoal mb-3 mt-6">What Happens After Cancellation:</h3>
              <ul>
                <li>All campaign management ceases at end of billing period</li>
                <li>Client receives full data export and account access</li>
                <li>5 business days transition period for account handover</li>
                <li>Optional exit interview to improve our services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-montserrat font-semibold text-charcoal mb-4">5. Non-Refundable Items</h2>
              <ul>
                <li>Third-party advertising spend (Google Ads, Facebook Ads, etc.)</li>
                <li>External tool subscriptions purchased on client's behalf</li>
                <li>Custom development work after 14-day period</li>
                <li>Training sessions and workshops already delivered</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-montserrat font-semibold text-charcoal mb-4">6. Exceptional Circumstances</h2>
              <p>
                We may consider refunds outside these standard terms in exceptional circumstances such as:
              </p>
              <ul>
                <li>Significant service failures on our part</li>
                <li>Technical issues preventing service delivery</li>
                <li>Serious illness or business closure (documentation required)</li>
              </ul>
              <p>
                Each case will be reviewed individually and may require additional documentation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-montserrat font-semibold text-charcoal mb-4">7. Dispute Resolution</h2>
              <p>
                If you're unhappy with our refund decision:
              </p>
              <ol>
                <li>First, contact our support team to discuss your concerns</li>
                <li>Request escalation to management level</li>
                <li>Consider mediation through Australian Commercial Disputes Centre</li>
                <li>Legal disputes governed by Western Australian law</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-montserrat font-semibold text-charcoal mb-4">8. Contact Information</h2>
              <p>
                For refund requests or questions about this policy:<br />
                Email: billing@boostroi.agency<br />
                Phone: +61 2 8123 4567<br />
                Address: BoostROI Agency, Perth, Western Australia
              </p>
              <p className="mt-4">
                <strong>Business Hours:</strong> Monday-Friday 9AM-5PM AWST<br />
                <strong>Response Time:</strong> Within 24 hours for refund requests
              </p>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
