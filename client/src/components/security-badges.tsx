import { Shield, Lock, CheckCircle, CreditCard } from "lucide-react";

export default function SecurityBadges() {
  const badges = [
    {
      icon: Shield,
      title: "SSL Secured",
      description: "256-bit encryption",
      color: "text-green-600"
    },
    {
      icon: Lock,
      title: "GDPR Compliant",
      description: "Privacy protected",
      color: "text-blue-600"
    },
    {
      icon: CreditCard,
      title: "Stripe Verified",
      description: "Secure payments",
      color: "text-purple-600"
    },
    {
      icon: CheckCircle,
      title: "Money Back Guarantee",
      description: "14-day guarantee",
      color: "text-brand"
    }
  ];

  return (
    <section className="py-8 bg-gray-50/50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500 font-medium">
              Your data and payments are secure with enterprise-grade protection
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {badges.map((badge, index) => {
              const IconComponent = badge.icon;
              return (
                <div 
                  key={index}
                  className="bg-white p-4 rounded-lg text-center shadow-sm border hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-center mb-2">
                    <IconComponent className={`h-8 w-8 ${badge.color}`} />
                  </div>
                  <div className="font-semibold text-sm text-charcoal mb-1">
                    {badge.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {badge.description}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/200px-Stripe_Logo%2C_revised_2016.svg.png"
                alt="Stripe"
                className="h-6 w-auto opacity-70"
              />
              <span>Powered by Stripe</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Bank-level security</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Lock className="h-4 w-4 text-blue-600" />
              <span>No stored card details</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-brand" />
              <span>Australian business</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}