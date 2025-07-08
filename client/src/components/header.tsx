import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  onOpenCalendly: () => void;
}

export default function Header({ onOpenCalendly }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 shadow-sm">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img 
              src="/boostroi-logo.svg" 
              alt="BoostROI Agency" 
              className="h-12 w-auto"
              onError={(e) => {
                console.error('Logo failed to load:', e);
                e.currentTarget.style.display = 'none';
              }}
              onLoad={() => console.log('Logo loaded successfully')}
            />
            <span className="ml-2 text-2xl font-bold text-brand">BoostROI</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-charcoal hover:text-brand transition-colors">
              Services
            </a>
            <a href="#case-studies" className="text-charcoal hover:text-brand transition-colors">
              Case Studies
            </a>
            <a href="#calculator" className="text-charcoal hover:text-brand transition-colors">
              ROI Calculator
            </a>
            <a href="#pricing" className="text-charcoal hover:text-brand transition-colors">
              Pricing
            </a>
            <Button 
              onClick={onOpenCalendly}
              className="bg-brand text-white px-6 py-2 rounded-lg hover:bg-brand/90 transition-all font-medium"
            >
              Book a Chat
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-charcoal"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t">
            <div className="flex flex-col space-y-4 pt-4">
              <a href="#services" className="text-charcoal hover:text-brand transition-colors">
                Services
              </a>
              <a href="#case-studies" className="text-charcoal hover:text-brand transition-colors">
                Case Studies
              </a>
              <a href="#calculator" className="text-charcoal hover:text-brand transition-colors">
                ROI Calculator
              </a>
              <a href="#pricing" className="text-charcoal hover:text-brand transition-colors">
                Pricing
              </a>
              <Button 
                onClick={onOpenCalendly}
                className="bg-brand text-white px-6 py-2 rounded-lg hover:bg-brand/90 transition-all font-medium w-fit"
              >
                Book a Chat
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
