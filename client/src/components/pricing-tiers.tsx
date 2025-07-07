import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PricingTiersProps {
  onOpenCalendly: () => void;
}

export default function PricingTiers({ onOpenCalendly }: PricingTiersProps) {
  const { toast } = useToast();

  const checkoutMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await apiRequest("POST", "/api/checkout", {
        productId,
        successUrl: `${window.location.origin}/?success=true`,
        cancelUrl: `${window.location.origin}/?canceled=true`
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: any) => {
      toast({
        title: "Checkout Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleCheckout = (productId: string) => {
    checkoutMutation.mutate(productId);
  };

  const tiers = [
    {
      name: "Starter",
      description: "Perfect for small businesses ready to scale",
      price: "A$550",
      period: "One-time setup + audit",
      productId: "prod_Scy0uhHaNSgiVz",
      features: [
        "Complete marketing audit",
        "ROI optimization roadmap",
        "1 campaign setup & optimization",
        "30-day performance tracking",
        "Email support"
      ],
      guarantee: "14-day money back guarantee",
      popular: false
    },
    {
      name: "Pro",
      description: "For businesses serious about growth",
      price: "A$7,500",
      period: "per month",
      productId: "prod_Scy9MEn8aTpimu",
      features: [
        "Everything in Starter",
        "Multi-channel campaigns",
        "Advanced analytics & reporting",
        "Dedicated account manager",
        "Weekly strategy calls",
        "Priority support"
      ],
      guarantee: "14-day prorata refund policy",
      popular: true
    },
    {
      name: "Legendary",
      description: "For enterprises dominating their market",
      price: "A$15,000",
      period: "per month",
      productId: "prod_ScyBqdMDyhsup6",
      features: [
        "Everything in Pro",
        "Custom funnel development",
        "Advanced automation setup",
        "Senior strategist assigned",
        "Daily monitoring & optimization",
        "Direct line to founders"
      ],
      guarantee: "14-day prorata refund policy",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-charcoal mb-4">
            Fair Dinkum Pricing That Works
          </h2>
          <p className="font-inter text-xl text-gray-600 max-w-2xl mx-auto">
            No sneaky fees, no hidden costs. Just straightforward pricing that scales with your success.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <div 
              key={tier.name} 
              className={`bg-white rounded-2xl p-8 shadow-lg hover-lift relative ${
                tier.popular ? 'border-2 border-brand shadow-xl' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-brand text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="font-montserrat font-bold text-2xl text-charcoal mb-2">
                  {tier.name}
                </h3>
                <p className="text-gray-600 mb-4">{tier.description}</p>
                <div className="text-4xl font-bold text-charcoal mb-2">{tier.price}</div>
                <div className="text-sm text-gray-500">{tier.period}</div>
              </div>
              
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="text-brand mr-3 h-5 w-5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                onClick={() => handleCheckout(tier.productId)}
                disabled={checkoutMutation.isPending}
                className={`w-full py-3 rounded-lg transition-all font-montserrat font-semibold ${
                  tier.popular 
                    ? 'bg-brand text-white hover:bg-brand/90' 
                    : tier.name === 'Legendary'
                    ? 'bg-charcoal text-white hover:bg-charcoal/90'
                    : 'bg-brand text-white hover:bg-brand/90'
                }`}
              >
                {checkoutMutation.isPending 
                  ? "Loading..." 
                  : tier.name === 'Starter' 
                  ? "Get Started" 
                  : tier.name === 'Pro'
                  ? "Start Pro Plan"
                  : "Go Legendary"
                }
              </Button>
              
              <div className="text-center mt-4">
                <div className="text-sm text-gray-500">{tier.guarantee}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Not sure which plan is right for you?</p>
          <Button 
            onClick={onOpenCalendly}
            variant="outline"
            className="border-2 border-brand text-brand px-8 py-3 rounded-lg hover:bg-brand hover:text-white transition-all font-montserrat font-semibold"
          >
            Book a Free Strategy Call
          </Button>
        </div>
      </div>
    </section>
  );
}
