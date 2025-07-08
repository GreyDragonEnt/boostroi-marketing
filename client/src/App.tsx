import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import Refund from "@/pages/refund";
import Checkout from "@/pages/checkout";
import Admin from "@/pages/admin";
import AdminEnhanced from "@/pages/admin-enhanced";
import EmailTest from "@/pages/email-test";
import NotFound from "@/pages/not-found";

function Router(): JSX.Element {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/refund" component={Refund} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin-enhanced" component={AdminEnhanced} />
      <Route path="/email-test" component={EmailTest} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
