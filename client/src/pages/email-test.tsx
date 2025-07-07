import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function EmailTest() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const testEmailMutation = useMutation({
    mutationFn: async (emailAddress: string) => {
      const response = await fetch("/api/test-email", {
        method: "POST",
        body: JSON.stringify({ email: emailAddress }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return await response.json();
    },
    onSuccess: (data: { success: boolean; message: string }) => {
      toast({
        title: "Email Test",
        description: data.success 
          ? "Test email sent successfully! Check your inbox."
          : "Email failed to send. Check the server logs.",
        variant: data.success ? "default" : "destructive",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive",
      });
      console.error("Email test error:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }
    testEmailMutation.mutate(email);
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Email System Test</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Test Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={testEmailMutation.isPending}
            >
              {testEmailMutation.isPending ? "Sending..." : "Send Test Email"}
            </Button>
          </form>
          
          <div className="mt-6 text-sm text-gray-600">
            <p><strong>This will test:</strong></p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>SendGrid API configuration</li>
              <li>Email template rendering</li>
              <li>Email delivery functionality</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}