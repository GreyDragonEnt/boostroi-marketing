import { Button } from "@/components/ui/button";
import { CheckCircle, Star } from "lucide-react";

interface HeroProps {
  onOpenCalendly: () => void;
  onScrollToCalculator: () => void;
  onOpenROIAudit: () => void;
}

export default function Hero({ onOpenCalendly, onScrollToCalculator, onOpenROIAudit }: HeroProps) {
  return (
    <section className="pt-24 pb-16 pattern-bg">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start lg:items-center">
          <div className="text-center lg:text-left">
            <h1 className="font-montserrat font-bold text-4xl md:text-6xl text-charcoal leading-tight mb-6">
              Stop Wasting Money on{" "}
              <span className="text-brand">Marketing That Doesn't Work</span>
            </h1>
            <p className="font-inter text-xl text-gray-600 mb-8 leading-relaxed">
              Fair dinkum marketing that actually boosts your ROI. We're the Aussie agency that turns your marketing spend into profit machines. No BS, just results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                onClick={onOpenROIAudit}
                className="bg-brand text-white px-8 py-4 rounded-lg hover:bg-brand/90 transition-all font-montserrat font-semibold text-lg shadow-lg hover-lift"
              >
                Get Your Free ROI Audit
              </Button>
              <Button 
                variant="outline"
                onClick={onScrollToCalculator}
                className="border-2 border-brand text-brand px-8 py-4 rounded-lg hover:bg-brand hover:text-white transition-all font-montserrat font-semibold text-lg"
              >
                Calculate Your ROI
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="text-green-500 mr-2 h-4 w-4" />
                <span>14-day money back guarantee</span>
              </div>
              <div className="flex items-center">
                <Star className="text-yellow-500 mr-2 h-4 w-4 fill-current" />
                <span>5.0 average rating</span>
              </div>
            </div>
          </div>
          <div className="relative mt-12 lg:mt-0">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Business growth chart dashboard" 
              className="rounded-2xl shadow-2xl w-full" 
            />
            {/* Positioned to overlap image but stay clear of buttons */}
            <div className="absolute bottom-4 left-4 bg-white p-3 md:p-4 rounded-lg shadow-lg z-10 max-w-[140px]">
              <div className="text-xs md:text-sm text-gray-500">Average ROI Increase</div>
              <div className="text-xl md:text-2xl font-bold text-brand">284%</div>
            </div>
            <div className="absolute top-4 right-4 bg-white p-3 md:p-4 rounded-lg shadow-lg z-10 max-w-[140px]">
              <div className="text-xs md:text-sm text-gray-500">Revenue Generated</div>
              <div className="text-xl md:text-2xl font-bold text-green-500">$2.4M+</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
