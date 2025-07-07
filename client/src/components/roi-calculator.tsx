import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ROICalculation } from "@shared/schema";

interface ROICalculatorProps {
  onOpenCalendly: () => void;
}

export default function ROICalculator({ onOpenCalendly }: ROICalculatorProps) {
  const [formData, setFormData] = useState({
    monthlySpend: "",
    monthlyRevenue: "",
    industry: "",
    channels: "",
    email: ""
  });
  const [results, setResults] = useState<ROICalculation | null>(null);
  const { toast } = useToast();

  const calculateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/calc", {
        monthlySpend: data.monthlySpend,
        monthlyRevenue: data.monthlyRevenue,
        industry: data.industry,
        channels: data.channels,
        email: data.email
      });
      return response.json();
    },
    onSuccess: (data: ROICalculation) => {
      setResults(data);
      toast({
        title: "ROI Calculated!",
        description: "Check out your potential below.",
      });
      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById('roi-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    },
    onError: (error: any) => {
      toast({
        title: "Calculation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleCalculate = () => {
    if (!formData.monthlySpend || !formData.monthlyRevenue || !formData.industry || !formData.channels) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to calculate your ROI.",
        variant: "destructive",
      });
      return;
    }

    calculateMutation.mutate(formData);
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <section id="calculator" className="py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-charcoal mb-4">
              Calculate Your Potential ROI
            </h2>
            <p className="font-inter text-xl text-gray-600">
              See exactly how much more revenue you could be generating. Takes 30 seconds.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <Label htmlFor="monthlySpend" className="block text-sm font-medium text-charcoal mb-2">
                  Current Monthly Marketing Spend (A$)
                </Label>
                <Input
                  id="monthlySpend"
                  type="number"
                  placeholder="5000"
                  value={formData.monthlySpend}
                  onChange={(e) => setFormData({ ...formData, monthlySpend: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                />
              </div>
              <div>
                <Label htmlFor="monthlyRevenue" className="block text-sm font-medium text-charcoal mb-2">
                  Current Monthly Revenue (A$)
                </Label>
                <Input
                  id="monthlyRevenue"
                  type="number"
                  placeholder="20000"
                  value={formData.monthlyRevenue}
                  onChange={(e) => setFormData({ ...formData, monthlyRevenue: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                />
              </div>
              <div>
                <Label htmlFor="industry" className="block text-sm font-medium text-charcoal mb-2">
                  Industry
                </Label>
                <Select onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                  <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="E-commerce">E-commerce</SelectItem>
                    <SelectItem value="SaaS">SaaS</SelectItem>
                    <SelectItem value="Professional Services">Professional Services</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Real Estate">Real Estate</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="channels" className="block text-sm font-medium text-charcoal mb-2">
                  Current Marketing Channels
                </Label>
                <Select onValueChange={(value) => setFormData({ ...formData, channels: value })}>
                  <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent">
                    <SelectValue placeholder="Select your channels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Google Ads Only">Google Ads Only</SelectItem>
                    <SelectItem value="Facebook Ads Only">Facebook Ads Only</SelectItem>
                    <SelectItem value="SEO Only">SEO Only</SelectItem>
                    <SelectItem value="Mixed Channels">Mixed Channels</SelectItem>
                    <SelectItem value="No Digital Marketing">No Digital Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-8">
              <Label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">
                Email (optional - to save your results)
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
              />
            </div>

            <div className="text-center mb-8">
              <Button 
                onClick={handleCalculate}
                disabled={calculateMutation.isPending}
                className="bg-brand text-white px-8 py-4 rounded-lg hover:bg-brand/90 transition-all font-montserrat font-semibold text-lg"
              >
                {calculateMutation.isPending ? "Calculating..." : "Calculate My ROI Potential"}
              </Button>
            </div>

            {/* Results Display */}
            {results && (
              <div id="roi-results" className="border-t pt-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-2">Projected Monthly Revenue</div>
                    <div className="text-3xl font-bold text-brand">
                      {formatCurrency(results.projectedRevenue || "0")}
                    </div>
                    <div className="text-sm text-green-500">
                      +{Math.round(((parseFloat(results.projectedRevenue || "0") - parseFloat(formData.monthlyRevenue)) / parseFloat(formData.monthlyRevenue)) * 100)}% increase
                    </div>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-2">Additional Monthly Profit</div>
                    <div className="text-3xl font-bold text-green-500">
                      {formatCurrency(results.additionalProfit || "0")}
                    </div>
                    <div className="text-sm text-gray-500">after our fees</div>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-2">ROI Improvement</div>
                    <div className="text-3xl font-bold text-brand">
                      {results.roiImprovement}%
                    </div>
                    <div className="text-sm text-gray-500">vs current performance</div>
                  </div>
                </div>
                <div className="text-center mt-8">
                  <Button 
                    onClick={onOpenCalendly}
                    className="bg-charcoal text-white px-8 py-4 rounded-lg hover:bg-charcoal/90 transition-all font-montserrat font-semibold"
                  >
                    Book a Call to Discuss These Results
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
