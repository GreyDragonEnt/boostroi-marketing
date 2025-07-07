import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, ArrowRight } from "lucide-react";
import LeadCaptureModal from "./lead-capture-modal";

interface InlineLeadCaptureProps {
  title?: string;
  description?: string;
  buttonText?: string;
  leadMagnet?: string;
  variant?: "default" | "compact" | "banner";
  className?: string;
}

export default function InlineLeadCapture({ 
  title = "Get Your Free Marketing Audit Checklist",
  description = "Download our 47-point checklist and discover what's killing your ROI",
  buttonText = "Get Free Checklist",
  leadMagnet = "audit-checklist",
  variant = "default",
  className = ""
}: InlineLeadCaptureProps) {
  const [showModal, setShowModal] = useState(false);

  if (variant === "banner") {
    return (
      <>
        <div className={`bg-gradient-to-r from-brand to-brand/80 text-white py-4 ${className}`}>
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-3">
                <Gift className="h-6 w-6" />
                <div>
                  <span className="font-semibold">{title}</span>
                  <span className="text-white/90 ml-2 text-sm">{description}</span>
                </div>
              </div>
              <Button 
                onClick={() => setShowModal(true)}
                className="bg-white text-brand hover:bg-gray-100 font-semibold px-6"
              >
                {buttonText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <LeadCaptureModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          trigger="manual"
          leadMagnet={leadMagnet}
        />
      </>
    );
  }

  if (variant === "compact") {
    return (
      <>
        <div className={`bg-white border-2 border-brand/20 rounded-lg p-4 ${className}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Gift className="h-5 w-5 text-brand" />
              <div>
                <div className="font-semibold text-sm">{title}</div>
                <div className="text-gray-600 text-xs">{description}</div>
              </div>
            </div>
            <Button 
              onClick={() => setShowModal(true)}
              size="sm"
              className="bg-brand text-white hover:bg-brand/90"
            >
              {buttonText}
            </Button>
          </div>
        </div>
        <LeadCaptureModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          trigger="manual"
          leadMagnet={leadMagnet}
        />
      </>
    );
  }

  return (
    <>
      <div className={`bg-gradient-to-br from-brand/5 to-brand/10 p-8 rounded-2xl border border-brand/20 ${className}`}>
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand/10 rounded-full mb-4">
            <Gift className="h-8 w-8 text-brand" />
          </div>
          <h3 className="font-montserrat font-bold text-2xl text-charcoal mb-3">
            {title}
          </h3>
          <p className="text-gray-600 mb-6 text-lg">
            {description}
          </p>
          <Button 
            onClick={() => setShowModal(true)}
            className="bg-brand text-white px-8 py-4 rounded-lg hover:bg-brand/90 transition-all font-montserrat font-semibold text-lg shadow-lg hover-lift"
          >
            <Gift className="mr-2 h-5 w-5" />
            {buttonText}
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Instant download • No spam, ever
          </p>
        </div>
      </div>
      <LeadCaptureModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        trigger="manual"
        leadMagnet={leadMagnet}
      />
    </>
  );
}