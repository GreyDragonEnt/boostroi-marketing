import { Button } from "@/components/ui/button";
import InlineLeadCapture from "./inline-lead-capture";

interface CaseCarouselProps {
  onOpenCalendly: () => void;
}

export default function CaseCarousel({ onOpenCalendly }: CaseCarouselProps) {
  const caseStudies = [
    {
      type: "E-commerce Retailer",
      title: "From $50k to $500k Revenue in 8 Months",
      description: "Melbourne-based fashion retailer was struggling with low ROAS from Facebook ads. We rebuilt their entire funnel.",
      metric1: { value: "900%", label: "Revenue Growth" },
      metric2: { value: "4.8x", label: "ROAS" },
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250"
    },
    {
      type: "SaaS Company",
      title: "Slashed Customer Acquisition Cost by 65%",
      description: "Sydney-based SaaS was burning cash on Google Ads. We optimized their entire acquisition funnel.",
      metric1: { value: "65%", label: "Lower CAC" },
      metric2: { value: "240%", label: "More Leads" },
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250"
    },
    {
      type: "Professional Services",
      title: "Tripled Lead Quality in 90 Days",
      description: "Perth-based consultancy was getting lots of leads but poor quality. We fixed their targeting strategy.",
      metric1: { value: "300%", label: "Better Leads" },
      metric2: { value: "85%", label: "Close Rate" },
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250"
    }
  ];

  return (
    <section id="case-studies" className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-charcoal mb-4">
            Real Results from Real Aussie Businesses
          </h2>
          <p className="font-inter text-xl text-gray-600 max-w-2xl mx-auto">
            Don't take our word for it. Here's how we've helped businesses like yours smash their ROI goals.
          </p>
        </div>

        <div className="relative">
          <div className="grid md:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover-lift">
                <div className="mb-6">
                  <img 
                    src={study.image} 
                    alt={study.type} 
                    className="w-full h-48 object-cover rounded-lg mb-4" 
                  />
                  <div className="text-sm text-gray-500 mb-2">{study.type}</div>
                  <h3 className="font-montserrat font-bold text-xl text-charcoal mb-3">
                    {study.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {study.description}
                  </p>
                </div>
                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-brand">{study.metric1.value}</div>
                      <div className="text-sm text-gray-500">{study.metric1.label}</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-500">{study.metric2.value}</div>
                      <div className="text-sm text-gray-500">{study.metric2.label}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Button 
            onClick={onOpenCalendly}
            className="bg-brand text-white px-8 py-4 rounded-lg hover:bg-brand/90 transition-all font-montserrat font-semibold"
          >
            Get Your Case Study Next
          </Button>
        </div>
      </div>
    </section>
  );
}
