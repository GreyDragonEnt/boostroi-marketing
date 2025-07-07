import { useState } from "react";
import Header from "@/components/header";
import Hero from "@/components/hero";
import PainPromiseCards from "@/components/pain-promise-cards";
import ServiceTabs from "@/components/service-tabs";
import CaseCarousel from "@/components/case-carousel";
import ROICalculator from "@/components/roi-calculator";
import PricingTiers from "@/components/pricing-tiers";
import StickyCTA from "@/components/sticky-cta";
import Footer from "@/components/footer";
import CalendlyModal from "@/components/calendly-modal";
import ExitIntentHandler from "@/components/exit-intent-handler";
import ROIAuditModal from "@/components/roi-audit-modal";
import InlineLeadCapture from "@/components/inline-lead-capture";
import NewsletterSignup from "@/components/newsletter-signup";
import ClientLogos from "@/components/client-logos";
import VideoTestimonials from "@/components/video-testimonials";
import LiveChatWidget from "@/components/live-chat-widget";
import SecurityBadges from "@/components/security-badges";
import TeamPhotos from "@/components/team-photos";

export default function Home() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [isROIAuditOpen, setIsROIAuditOpen] = useState(false);

  const openCalendly = () => setIsCalendlyOpen(true);
  const closeCalendly = () => setIsCalendlyOpen(false);
  const openROIAudit = () => setIsROIAuditOpen(true);
  const closeROIAudit = () => setIsROIAuditOpen(false);

  const scrollToCalculator = () => {
    const calculatorElement = document.getElementById('calculator');
    if (calculatorElement) {
      calculatorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="scroll-smooth">
      <Header onOpenCalendly={openCalendly} />
      
      {/* Top banner lead capture */}
      <InlineLeadCapture 
        variant="banner"
        title="Free Marketing Audit Checklist"
        description="47 points that reveal what's killing your ROI"
        buttonText="Get Free Checklist"
        leadMagnet="audit-checklist"
      />
      
      <Hero onOpenCalendly={openCalendly} onScrollToCalculator={scrollToCalculator} onOpenROIAudit={openROIAudit} />
      <ClientLogos />
      <PainPromiseCards />
      <ServiceTabs />
      <VideoTestimonials onOpenCalendly={openCalendly} />
      <CaseCarousel onOpenCalendly={openCalendly} />
      <TeamPhotos />
      
      {/* Mid-page lead capture */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <InlineLeadCapture 
            title="Want to See How We Triple ROI?"
            description="Download our case study collection showing exactly how we helped 12 Australian businesses increase revenue by 200-900%"
            buttonText="Get Case Studies"
            leadMagnet="case-studies"
            className="max-w-4xl mx-auto"
          />
        </div>
      </section>
      
      <ROICalculator onOpenCalendly={openCalendly} />
      
      {/* Newsletter signup before pricing */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <NewsletterSignup className="max-w-4xl mx-auto" />
        </div>
      </section>
      
      <PricingTiers onOpenCalendly={openCalendly} />
      <SecurityBadges />
      <StickyCTA onOpenCalendly={openCalendly} />
      <Footer />
      <LiveChatWidget />
      <CalendlyModal isOpen={isCalendlyOpen} onClose={closeCalendly} />
      <ROIAuditModal isOpen={isROIAuditOpen} onClose={closeROIAudit} />
      {/* <ExitIntentHandler /> */}
    </div>
  );
}
