import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Download, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: "exit-intent" | "time-based" | "manual";
  leadMagnet?: string;
}

export default function LeadCaptureModal({ isOpen, onClose, trigger, leadMagnet = "audit-checklist" }: LeadCaptureModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const leadMagnets = {
    "audit-checklist": {
      title: "Free Marketing Audit Checklist",
      description: "Get our 47-point checklist that reveals exactly what's killing your ROI (and how to fix it)",
      fileName: "Marketing_Audit_Checklist_2025.pdf"
    },
    "roi-guide": {
      title: "Ultimate ROI Optimization Guide", 
      description: "Learn the exact strategies we use to triple our clients' marketing ROI",
      fileName: "ROI_Optimization_Guide_2025.pdf"
    },
    "case-studies": {
      title: "Australian Business Case Studies",
      description: "See how we helped 12 Aussie businesses increase revenue by 200-900%",
      fileName: "Success_Stories_2025.pdf"
    }
  };

  const currentMagnet = leadMagnets[leadMagnet as keyof typeof leadMagnets];

  const submitMutation = useMutation({
    mutationFn: async (data: { email: string; name: string; leadMagnet: string; trigger: string }) => {
      const response = await apiRequest("POST", "/api/lead-capture", data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Success!",
        description: "Check your email for the download link.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      toast({
        title: "Missing Information",
        description: "Please fill in both your name and email.",
        variant: "destructive",
      });
      return;
    }
    
    submitMutation.mutate({
      email,
      name,
      leadMagnet,
      trigger
    });
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-montserrat font-bold text-xl flex items-center">
              <CheckCircle className="text-green-500 mr-2 h-6 w-6" />
              You're All Set!
            </DialogTitle>
            <DialogDescription>
              Check your email for the download link. It should arrive within 2 minutes.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              While you're here, want to see how much we could boost your ROI?
            </p>
            <Button 
              onClick={onClose}
              className="bg-brand text-white px-6 py-3 rounded-lg hover:bg-brand/90 transition-all font-montserrat font-semibold w-full"
            >
              Calculate My ROI Potential
            </Button>
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
            {currentMagnet.title}
          </DialogTitle>
          <DialogDescription>
            {currentMagnet.description}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-charcoal mb-2">
              First Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your first name"
              className="w-full"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full"
              required
            />
          </div>

          <Button 
            type="submit"
            disabled={submitMutation.isPending}
            className="bg-brand text-white px-6 py-3 rounded-lg hover:bg-brand/90 transition-all font-montserrat font-semibold w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            {submitMutation.isPending ? "Sending..." : "Get Free Download"}
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            No spam, ever. Unsubscribe with one click.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}