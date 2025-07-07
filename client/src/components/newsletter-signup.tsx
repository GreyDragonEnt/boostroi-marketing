import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface NewsletterSignupProps {
  variant?: "inline" | "footer" | "sidebar";
  className?: string;
}

export default function NewsletterSignup({ variant = "inline", className = "" }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const subscribeMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest("POST", "/api/newsletter-signup", { email });
      return response.json();
    },
    onSuccess: () => {
      setIsSubscribed(true);
      setEmail("");
      toast({
        title: "Subscribed!",
        description: "You'll receive our weekly marketing tips and case studies.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Subscription Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribeMutation.mutate(email);
  };

  if (isSubscribed) {
    return (
      <div className={`flex items-center text-green-600 ${className}`}>
        <CheckCircle className="mr-2 h-5 w-5" />
        <span className="font-medium">Thanks for subscribing!</span>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className={`max-w-md ${className}`}>
        <h3 className="font-montserrat font-semibold text-lg mb-2">Weekly Marketing Tips</h3>
        <p className="text-gray-400 mb-4 text-sm">
          Get actionable ROI strategies delivered to your inbox every Tuesday.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1"
            required
          />
          <Button 
            type="submit"
            disabled={subscribeMutation.isPending}
            className="bg-brand text-white hover:bg-brand/90 px-4"
          >
            <Mail className="h-4 w-4" />
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className={`bg-gray-50 p-6 rounded-xl ${className}`}>
      <div className="flex items-start space-x-4">
        <div className="bg-brand/10 p-3 rounded-lg">
          <Mail className="h-6 w-6 text-brand" />
        </div>
        <div className="flex-1">
          <h3 className="font-montserrat font-semibold text-lg mb-2">
            Stay Ahead of the Game
          </h3>
          <p className="text-gray-600 mb-4">
            Join 2,400+ smart marketers getting weekly tips, case studies, and ROI strategies.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1"
              required
            />
            <Button 
              type="submit"
              disabled={subscribeMutation.isPending}
              className="bg-brand text-white hover:bg-brand/90 px-6"
            >
              {subscribeMutation.isPending ? "..." : "Subscribe"}
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  );
}