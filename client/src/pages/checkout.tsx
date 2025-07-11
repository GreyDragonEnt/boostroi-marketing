import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/?success=true",
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Thank you for your purchase!",
      });
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <PaymentElement />
        <Button 
          type="submit" 
          disabled={!stripe || !elements}
          className="w-full bg-brand hover:bg-brand/90"
        >
          Complete Payment
        </Button>
      </form>
    </div>
  );
};

// Main Checkout component that handles Stripe configuration
export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the product ID from URL params or default to Starter
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product') || 'prod_Scy0uhHaNSgiVz';

    // Create checkout session
    apiRequest("POST", "/api/checkout", { 
      productId,
      successUrl: `${window.location.origin}/?success=true`,
      cancelUrl: `${window.location.origin}/?canceled=true`
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          // Redirect to Stripe Checkout
          window.location.href = data.url;
        }
      })
      .catch((error) => {
        console.error('Checkout error:', error);
        setLoading(false);
      });
  }, []);

  // If Stripe is not configured, show a message
  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <Link href="/" className="inline-flex items-center text-brand hover:text-brand/80 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h1 className="text-3xl font-montserrat font-bold text-charcoal mb-8 text-center">
                Checkout Unavailable
              </h1>
              
              <p className="text-center text-gray-600 mb-8">
                Payment processing is not configured in development mode.
              </p>
              
              <div className="text-center">
                <Button asChild className="bg-brand hover:bg-brand/90">
                  <Link href="/#pricing">Return to Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If Stripe is configured, render the checkout form
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
