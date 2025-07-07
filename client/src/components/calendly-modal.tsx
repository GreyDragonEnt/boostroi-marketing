import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar } from "lucide-react";

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
      closePopupWidget: () => void;
    };
  }
}

export default function CalendlyModal({ isOpen, onClose }: CalendlyModalProps) {
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Load Calendly script once when component mounts
    if (!document.querySelector('script[src*="calendly.com"]')) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      document.head.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, []);

  const openCalendlyWidget = () => {
    if (window.Calendly && scriptLoaded) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/james01woods/30min'
      });
      onClose();
    } else {
      // Fallback to new tab
      window.open('https://calendly.com/james01woods/30min', '_blank');
      onClose();
    }
  };

  const openInNewTab = () => {
    window.open('https://calendly.com/james01woods/30min', '_blank');
    onClose();
  };

  const showEmbeddedView = () => {
    setIsEmbedded(true);
  };

  if (isEmbedded) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="font-montserrat font-bold text-xl">
              Book Your Free Strategy Call
            </DialogTitle>
            <DialogDescription>
              Choose a time that works for you - no obligation, 30-minute session with free audit included.
            </DialogDescription>
          </DialogHeader>
          <div className="h-[600px] p-6">
            <iframe
              src="https://calendly.com/james01woods/30min?embed_domain=localhost&embed_type=Inline"
              width="100%"
              height="100%"
              frameBorder="0"
              title="Schedule a meeting"
              className="rounded-lg"
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-montserrat font-bold text-xl">
            Book Your Free Strategy Call
          </DialogTitle>
          <DialogDescription>
            We'll analyze your current marketing and show you exactly how to boost your ROI.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-3">
            <Button 
              onClick={showEmbeddedView}
              className="bg-brand text-white px-6 py-4 rounded-lg hover:bg-brand/90 transition-all font-montserrat font-semibold w-full"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Schedule In This Window
            </Button>
            
            <Button 
              onClick={openCalendlyWidget}
              variant="outline"
              className="border-2 border-brand text-brand px-6 py-4 rounded-lg hover:bg-brand hover:text-white transition-all font-montserrat font-semibold w-full"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Open Calendly Widget
            </Button>
            
            <Button 
              onClick={openInNewTab}
              variant="outline"
              className="px-6 py-4 rounded-lg transition-all font-montserrat font-semibold w-full"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in New Tab
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 text-center">
            No obligation • 30-minute session • Free audit included
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
