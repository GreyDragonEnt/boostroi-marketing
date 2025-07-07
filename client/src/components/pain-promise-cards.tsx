import { XCircle, Clock, HelpCircle, TrendingUp, Rocket, Target } from "lucide-react";

export default function PainPromiseCards() {
  const painPoints = [
    {
      painIcon: XCircle,
      painTitle: "Throwing Money Down the Drain",
      painDescription: "Your current marketing feels like burning cash. Zero visibility into what's working, what's not.",
      promiseIcon: TrendingUp,
      promiseTitle: "Crystal Clear ROI Tracking",
      promiseDescription: "Every dollar tracked, every campaign measured. You'll know exactly what's making you money."
    },
    {
      painIcon: Clock,
      painTitle: "Waiting Forever for Results",
      painDescription: '"It takes 6 months to see results" - Yeah, nah. That\'s code for "we don\'t know what we\'re doing."',
      promiseIcon: Rocket,
      promiseTitle: "Results in 30 Days or Less",
      promiseDescription: "We optimize for quick wins while building long-term growth. See improvements in your first month."
    },
    {
      painIcon: HelpCircle,
      painTitle: "Cookie-Cutter Strategies",
      painDescription: "One-size-fits-all approaches that ignore your unique business. Generic tactics that fall flat.",
      promiseIcon: Target,
      promiseTitle: "Custom Strategies That Actually Work",
      promiseDescription: "Tailored campaigns based on your industry, audience, and goals. No cookie-cutter rubbish."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-charcoal mb-4">
            Sick of Marketing That's All Show, No Go?
          </h2>
          <p className="font-inter text-xl text-gray-600 max-w-2xl mx-auto">
            We get it. You've been burned by agencies that promise the world but deliver sweet FA. Here's how we fix the mess.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {painPoints.map((point, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover-lift">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <point.painIcon className="text-red-500 h-8 w-8" />
                </div>
                <h3 className="font-montserrat font-bold text-xl text-charcoal mb-3">
                  {point.painTitle}
                </h3>
                <p className="text-gray-600 mb-4">
                  {point.painDescription}
                </p>
              </div>
              <div className="border-t pt-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <point.promiseIcon className="text-green-500 h-8 w-8" />
                  </div>
                </div>
                <h4 className="font-montserrat font-semibold text-lg text-charcoal mb-3 text-center">
                  {point.promiseTitle}
                </h4>
                <p className="text-gray-600 text-center">
                  {point.promiseDescription}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
