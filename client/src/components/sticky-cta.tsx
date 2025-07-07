import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface StickyCTAProps {
  onOpenCalendly: () => void;
}

export default function StickyCTA({ onOpenCalendly }: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    function checkScroll() {
      if (isDismissed) return;
      
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercentage > 30 && !isVisible) {
        setIsVisible(true);
      }
    }
    
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, [isVisible, isDismissed]);

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-40 md:left-auto md:right-6 md:w-80 pointer-events-none">
      <div className="bg-brand text-white p-4 rounded-lg shadow-xl pointer-events-auto">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="font-montserrat font-semibold">Ready to boost your ROI?</div>
            <div className="text-sm opacity-90">Free strategy call • No commitment</div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={onOpenCalendly}
              className="bg-white text-brand px-4 py-2 rounded font-medium text-sm hover:bg-gray-100 transition-colors pointer-events-auto"
            >
              Book Call
            </Button>
            <button 
              onClick={() => setIsDismissed(true)}
              className="text-white/70 hover:text-white transition-colors pointer-events-auto"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
