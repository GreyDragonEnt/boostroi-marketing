import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { X, CheckCircle, TrendingUp, Users, DollarSign } from "lucide-react";

const roiAuditSchema = z.object({
  // Basic Business Info
  businessName: z.string().min(2, "Business name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  website: z.string().url("Valid website URL is required").optional().or(z.literal("")),
  
  // Business Details
  industry: z.string().min(1, "Please select your industry"),
  businessType: z.string().min(1, "Please select your business type"),
  businessAge: z.string().min(1, "Please select business age"),
  teamSize: z.string().min(1, "Please select team size"),
  
  // Current Marketing
  currentMonthlySpend: z.string().min(1, "Please select your current spend"),
  currentChannels: z.array(z.string()).min(1, "Please select at least one channel"),
  currentROI: z.string().min(1, "Please select your current ROI satisfaction"),
  biggestChallenge: z.string().min(10, "Please describe your biggest challenge"),
  
  // Goals
  revenueGoal: z.string().min(1, "Please select your revenue goal"),
  primaryGoal: z.string().min(1, "Please select your primary goal"),
  timeline: z.string().min(1, "Please select your timeline"),
  
  // Additional Info
  previousAgencies: z.boolean().default(false),
  budget: z.string().min(1, "Please select your budget range"),
  additionalInfo: z.string().optional(),
  
  // Consent
  marketingConsent: z.boolean().refine(val => val === true, "Marketing consent is required"),
  auditConsent: z.boolean().refine(val => val === true, "Audit consent is required")
});

type ROIAuditForm = z.infer<typeof roiAuditSchema>;

interface ROIAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ROIAuditModal({ isOpen, onClose }: ROIAuditModalProps) {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ROIAuditForm>({
    resolver: zodResolver(roiAuditSchema),
    defaultValues: {
      businessName: "",
      contactName: "",
      email: "",
      phone: "",
      website: "",
      industry: "",
      businessType: "",
      businessAge: "",
      teamSize: "",
      currentMonthlySpend: "",
      currentChannels: [],
      currentROI: "",
      biggestChallenge: "",
      revenueGoal: "",
      primaryGoal: "",
      timeline: "",
      previousAgencies: false,
      budget: "",
      additionalInfo: "",
      marketingConsent: false,
      auditConsent: false
    }
  });

  const submitAuditMutation = useMutation({
    mutationFn: async (data: ROIAuditForm) => {
      const response = await apiRequest("POST", "/api/roi-audit", data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["/api/roi-audit"] });
      toast({
        title: "Audit Request Submitted!",
        description: "We'll analyze your business and send your personalized ROI audit within 24 hours.",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: ROIAuditForm) => {
    submitAuditMutation.mutate(data);
  };

  const nextStep = () => {
    const fieldsToValidate = getFieldsForStep(step);
    form.trigger(fieldsToValidate).then((isValid) => {
      if (isValid) {
        setStep(step + 1);
      }
    });
  };

  const prevStep = () => setStep(step - 1);

  const getFieldsForStep = (stepNumber: number): (keyof ROIAuditForm)[] => {
    switch (stepNumber) {
      case 1: return ["businessName", "contactName", "email", "phone", "website"];
      case 2: return ["industry", "businessType", "businessAge", "teamSize"];
      case 3: return ["currentMonthlySpend", "currentChannels", "currentROI", "biggestChallenge"];
      case 4: return ["revenueGoal", "primaryGoal", "timeline", "budget"];
      default: return [];
    }
  };

  const handleChannelChange = (channel: string, checked: boolean) => {
    const currentChannels = form.getValues("currentChannels");
    if (checked) {
      form.setValue("currentChannels", [...currentChannels, channel]);
    } else {
      form.setValue("currentChannels", currentChannels.filter(c => c !== channel));
    }
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Audit Request Submitted!</h2>
            <p className="text-gray-600 mb-6">
              We'll analyze your business and send your personalized ROI audit within 24 hours.
            </p>
            <Button onClick={onClose} className="bg-brand hover:bg-brand/90">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Free ROI Audit - Step {step} of 5
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-brand h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <TrendingUp className="w-12 h-12 text-brand mx-auto mb-2" />
                <h3 className="text-xl font-semibold">Let's Get Started</h3>
                <p className="text-gray-600">Tell us about your business</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    {...form.register("businessName")}
                    placeholder="Your Business Name"
                  />
                  {form.formState.errors.businessName && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.businessName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="contactName">Contact Name *</Label>
                  <Input
                    id="contactName"
                    {...form.register("contactName")}
                    placeholder="Your Full Name"
                  />
                  {form.formState.errors.contactName && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.contactName.message}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    placeholder="your@email.com"
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    {...form.register("phone")}
                    placeholder="+61 4XX XXX XXX"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.phone.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  {...form.register("website")}
                  placeholder="https://yourwebsite.com.au"
                />
                {form.formState.errors.website && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.website.message}</p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Users className="w-12 h-12 text-brand mx-auto mb-2" />
                <h3 className="text-xl font-semibold">Business Details</h3>
                <p className="text-gray-600">Help us understand your business better</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="industry">Industry *</Label>
                  <Select onValueChange={(value) => form.setValue("industry", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="saas">SaaS / Tech</SelectItem>
                      <SelectItem value="professional-services">Professional Services</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="real-estate">Real Estate</SelectItem>
                      <SelectItem value="hospitality">Hospitality</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.industry && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.industry.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Select onValueChange={(value) => form.setValue("businessType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="b2b">B2B</SelectItem>
                      <SelectItem value="b2c">B2C</SelectItem>
                      <SelectItem value="both">Both B2B & B2C</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.businessType && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.businessType.message}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessAge">Business Age *</Label>
                  <Select onValueChange={(value) => form.setValue("businessAge", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="How long in business?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="startup">Startup (0-1 years)</SelectItem>
                      <SelectItem value="growing">Growing (1-3 years)</SelectItem>
                      <SelectItem value="established">Established (3-10 years)</SelectItem>
                      <SelectItem value="mature">Mature (10+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.businessAge && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.businessAge.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="teamSize">Team Size *</Label>
                  <Select onValueChange={(value) => form.setValue("teamSize", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Number of employees" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solo">Just me</SelectItem>
                      <SelectItem value="small">2-10 employees</SelectItem>
                      <SelectItem value="medium">11-50 employees</SelectItem>
                      <SelectItem value="large">51-200 employees</SelectItem>
                      <SelectItem value="enterprise">200+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.teamSize && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.teamSize.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <DollarSign className="w-12 h-12 text-brand mx-auto mb-2" />
                <h3 className="text-xl font-semibold">Current Marketing</h3>
                <p className="text-gray-600">Tell us about your current marketing efforts</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentMonthlySpend">Current Monthly Marketing Spend *</Label>
                  <Select onValueChange={(value) => form.setValue("currentMonthlySpend", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select spend range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1000">$0 - $1,000</SelectItem>
                      <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                      <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                      <SelectItem value="10000-25000">$10,000 - $25,000</SelectItem>
                      <SelectItem value="25000+">$25,000+</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.currentMonthlySpend && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.currentMonthlySpend.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="currentROI">Current ROI Satisfaction *</Label>
                  <Select onValueChange={(value) => form.setValue("currentROI", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="How satisfied are you?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="very-unsatisfied">Very Unsatisfied</SelectItem>
                      <SelectItem value="unsatisfied">Unsatisfied</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="satisfied">Satisfied</SelectItem>
                      <SelectItem value="very-satisfied">Very Satisfied</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.currentROI && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.currentROI.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <Label>Current Marketing Channels * (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    "Social Media Ads", "Google Ads", "SEO", "Content Marketing",
                    "Email Marketing", "Influencer Marketing", "Traditional Advertising", 
                    "Referrals", "None Currently", "Other"
                  ].map((channel) => (
                    <div key={channel} className="flex items-center space-x-2">
                      <Checkbox
                        id={channel}
                        onCheckedChange={(checked) => handleChannelChange(channel, checked as boolean)}
                      />
                      <Label htmlFor={channel} className="text-sm">{channel}</Label>
                    </div>
                  ))}
                </div>
                {form.formState.errors.currentChannels && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.currentChannels.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="biggestChallenge">Biggest Marketing Challenge *</Label>
                <Textarea
                  id="biggestChallenge"
                  {...form.register("biggestChallenge")}
                  placeholder="What's your biggest challenge with marketing right now?"
                  rows={3}
                />
                {form.formState.errors.biggestChallenge && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.biggestChallenge.message}</p>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <TrendingUp className="w-12 h-12 text-brand mx-auto mb-2" />
                <h3 className="text-xl font-semibold">Goals & Budget</h3>
                <p className="text-gray-600">What are you looking to achieve?</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="revenueGoal">Revenue Goal *</Label>
                  <Select onValueChange={(value) => form.setValue("revenueGoal", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Target revenue increase" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="25">25% increase</SelectItem>
                      <SelectItem value="50">50% increase</SelectItem>
                      <SelectItem value="100">Double revenue</SelectItem>
                      <SelectItem value="200">Triple revenue</SelectItem>
                      <SelectItem value="other">Other/Not sure</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.revenueGoal && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.revenueGoal.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="timeline">Timeline *</Label>
                  <Select onValueChange={(value) => form.setValue("timeline", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="When do you want results?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">ASAP</SelectItem>
                      <SelectItem value="3-months">Within 3 months</SelectItem>
                      <SelectItem value="6-months">Within 6 months</SelectItem>
                      <SelectItem value="12-months">Within 12 months</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.timeline && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.timeline.message}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryGoal">Primary Goal *</Label>
                  <Select onValueChange={(value) => form.setValue("primaryGoal", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="What's most important?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="increase-revenue">Increase Revenue</SelectItem>
                      <SelectItem value="generate-leads">Generate More Leads</SelectItem>
                      <SelectItem value="improve-roi">Improve ROI</SelectItem>
                      <SelectItem value="brand-awareness">Build Brand Awareness</SelectItem>
                      <SelectItem value="customer-acquisition">Customer Acquisition</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.primaryGoal && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.primaryGoal.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="budget">Marketing Budget Range *</Label>
                  <Select onValueChange={(value) => form.setValue("budget", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="What's your budget?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-2500">Under $2,500/month</SelectItem>
                      <SelectItem value="2500-7500">$2,500 - $7,500/month</SelectItem>
                      <SelectItem value="7500-15000">$7,500 - $15,000/month</SelectItem>
                      <SelectItem value="15000+">$15,000+/month</SelectItem>
                      <SelectItem value="project-based">Project-based</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.budget && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.budget.message}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="previousAgencies"
                  onCheckedChange={(checked) => form.setValue("previousAgencies", checked as boolean)}
                />
                <Label htmlFor="previousAgencies" className="text-sm">
                  I've worked with marketing agencies before
                </Label>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <CheckCircle className="w-12 h-12 text-brand mx-auto mb-2" />
                <h3 className="text-xl font-semibold">Final Details</h3>
                <p className="text-gray-600">Just a few more details to complete your audit</p>
              </div>
              
              <div>
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  {...form.register("additionalInfo")}
                  placeholder="Anything else you'd like us to know about your business or marketing goals?"
                  rows={3}
                />
              </div>
              
              <div className="space-y-3 border-t pt-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="auditConsent"
                    onCheckedChange={(checked) => form.setValue("auditConsent", checked as boolean)}
                  />
                  <Label htmlFor="auditConsent" className="text-sm leading-relaxed">
                    I consent to BoostROI Agency conducting a free audit of my business and marketing efforts. *
                  </Label>
                </div>
                {form.formState.errors.auditConsent && (
                  <p className="text-red-500 text-sm">{form.formState.errors.auditConsent.message}</p>
                )}
                
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="marketingConsent"
                    onCheckedChange={(checked) => form.setValue("marketingConsent", checked as boolean)}
                  />
                  <Label htmlFor="marketingConsent" className="text-sm leading-relaxed">
                    I agree to receive marketing communications from BoostROI Agency including my audit results, tips, and relevant offers. You can unsubscribe at any time. *
                  </Label>
                </div>
                {form.formState.errors.marketingConsent && (
                  <p className="text-red-500 text-sm">{form.formState.errors.marketingConsent.message}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6 border-t">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
            
            {step < 5 ? (
              <Button 
                type="button" 
                onClick={nextStep}
                className="bg-brand hover:bg-brand/90 ml-auto"
              >
                Next Step
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={submitAuditMutation.isPending}
                className="bg-brand hover:bg-brand/90 ml-auto"
              >
                {submitAuditMutation.isPending ? "Submitting..." : "Submit Audit Request"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}