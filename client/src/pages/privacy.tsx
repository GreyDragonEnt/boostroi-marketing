import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
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
            <h1 className="text-4xl font-montserrat font-bold text-charcoal mb-8">Privacy Policy</h1>
            
            <p className="text-gray-600 mb-6">
              <strong>Effective Date:</strong> January 1, 2024<br />
              <strong>Last Updated:</strong> January 1, 2024
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-montserrat font-semibold text-charcoal mb-4">1. Information We Collect</h2>
              <h3 className="text-xl font-montserrat font-medium text-charcoal mb-3">Contact Information</h3>
              <ul>
                <li>Name and business details</li>
                <li>Email address and phone number</li>
                <li>Business address and billing information</li>
                <li>Marketing spend and revenue data (for ROI calculations)</li>
              </ul>
              
              <h3 className="text-xl font-montserrat font-medium text-charcoal mb-3 mt-6">Analytics Data</h3>
              <ul>
                <li>Website usage patterns and behavior</li>
                <li>Device and browser information</li>
                <li>IP address and location data</li>
                <li>Marketing campaign performance metrics</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-montserrat font-semibold text-charcoal mb-4">2. How We Use Your Information</h2>
              <ul>
                <li>Providing and improving our marketing services</li>
                <li>Calculating ROI projections and recommendations</li>
                <li>Communication regarding your campaigns and account</li>
                <li>Billing and payment processing</li>
                <li>Legal compliance and fraud prevention</li>
                <li>Creating anonymized case studies and benchmarks</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-montserrat font-semibold text-charcoal mb-4">3. Data Storage and Security</h2>
              <h3 className="text-xl font-montserrat font-medium text-charcoal mb-3">Storage Locations</h3>
              <ul>
                <li><strong>Replit Database:</strong> ROI calculations and basic contact information</li>
                <li><strong>Stripe:</strong> Payment information and billing details</li>
                <li><strong>Marketing Platforms:</strong> Campaign data stored with Google, Facebook, and other advertising platforms</li>
              </ul>
              
              <h3 className="text-xl font-montserrat font-medium text-charcoal mb-3 mt-6">Security Measures</h3>
              <p>
                We implement industry-standard security measures including encryption in transit and at rest, access controls, and regular security audits. However, no system is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-montserrat font-semibold text-charcoal mb-4">4. Data Sharing and Disclosure</h2>
              <p>We do not sell your personal information. We may share data with:</p>
              <ul>
                <li><strong>Service Providers:</strong> Stripe for payments, marketing platforms for campaign management</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our legal rights</li>
                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of business assets</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-montserrat font-semibold text-charcoal mb-4">5. Australian Privacy Act 1988 Compliance</h2>
              <p>
                As an Australian business, we comply with the Privacy Act 1988 and the Australian Privacy Principles (APPs). You have the right to:
              </p>
              <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your data (subject to legal and business requirements)</li>
                <li>Withdraw consent for marketing communications</li>
                <li>Lodge a complaint with the Office of the Australian Information Commissioner (OAIC)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-montserrat font-semibold text-charcoal mb-4">6. Cookies and Tracking</h2>
              <p>
                Our website uses cookies and similar technologies for:
              </p>
              <ul>
                <li>Essential website functionality</li>
                <li>Analytics and performance measurement</li>
                <li>Marketing and advertising optimization</li>
                <li>Personalized user experience</li>
              </ul>
              <p>
                You can control cookie settings through your browser, but some website features may not function properly with cookies disabled.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-montserrat font-semibold text-charcoal mb-4">7. Data Retention</h2>
              <p>
                We retain your data for as long as necessary to provide services and comply with legal obligations:
              </p>
              <ul>
                <li><strong>Active clients:</strong> Duration of service relationship plus 7 years for tax purposes</li>
                <li><strong>ROI calculations:</strong> 2 years from creation date</li>
                <li><strong>Marketing data:</strong> As required by platform terms and legal obligations</li>
                <li><strong>Financial records:</strong> 7 years as required by Australian tax law</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-montserrat font-semibold text-charcoal mb-4">8. Children's Privacy</h2>
              <p>
                Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children under 18.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-montserrat font-semibold text-charcoal mb-4">9. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. Changes will be posted on our website with an updated effective date. We will notify you of significant changes via email or prominent website notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-montserrat font-semibold text-charcoal mb-4">10. Contact Us</h2>
              <p>
                For privacy-related questions or to exercise your rights under the Privacy Act 1988, please contact us at:<br />
                Email: privacy@boostroi.agency<br />
                Phone: +61 2 8123 4567<br />
                Address: BoostROI Agency, Perth, Western Australia
              </p>
              <p className="mt-4">
                If you are not satisfied with our response to your privacy concern, you may lodge a complaint with the Office of the Australian Information Commissioner (OAIC) at <a href="https://www.oaic.gov.au" className="text-brand hover:text-brand/80">www.oaic.gov.au</a>.
              </p>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
