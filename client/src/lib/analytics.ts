import React from "react";

// Analytics service for tracking user interactions
interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
}

class AnalyticsService {
  private isEnabled: boolean;
  private userId?: string;

  constructor() {
    this.isEnabled = process.env.NODE_ENV === "production" && 
                    typeof window !== "undefined" &&
                    process.env.REACT_APP_ENABLE_ANALYTICS === "true";
  }

  // Initialize analytics with user consent
  initialize(consent: boolean = false) {
    this.isEnabled = this.isEnabled && consent;
    
    if (this.isEnabled) {
      // Initialize Google Analytics or other analytics services
      console.log("Analytics initialized");
    }
  }

  // Track page views
  trackPageView(path: string, title?: string) {
    if (!this.isEnabled) return;

    // Example: Google Analytics 4
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("config", process.env.REACT_APP_GA_TRACKING_ID, {
        page_path: path,
        page_title: title,
      });
    }

    console.log(`Page view: ${path}`, { title });
  }

  // Track custom events
  trackEvent(event: AnalyticsEvent) {
    if (!this.isEnabled) return;

    // Example: Google Analytics 4
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_parameters: event.properties,
      });
    }

    console.log("Event tracked:", event);
  }

  // ROI Calculator specific events
  trackROICalculation(data: {
    industry: string;
    monthlySpend: number;
    monthlyRevenue: number;
    projectedRevenue: number;
  }) {
    this.trackEvent({
      action: "roi_calculation_completed",
      category: "calculator",
      label: data.industry,
      value: data.projectedRevenue,
      properties: {
        monthly_spend: data.monthlySpend,
        monthly_revenue: data.monthlyRevenue,
        improvement_percentage: ((data.projectedRevenue - data.monthlyRevenue) / data.monthlyRevenue * 100).toFixed(2),
      },
    });
  }

  // Lead capture events
  trackLeadCapture(source: string, leadMagnet: string) {
    this.trackEvent({
      action: "lead_captured",
      category: "conversion",
      label: leadMagnet,
      properties: {
        source,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Form interaction events
  trackFormStart(formName: string) {
    this.trackEvent({
      action: "form_started",
      category: "engagement",
      label: formName,
    });
  }

  trackFormSubmit(formName: string, success: boolean) {
    this.trackEvent({
      action: success ? "form_submitted" : "form_error",
      category: "conversion",
      label: formName,
    });
  }

  // User identification (for authenticated users)
  identifyUser(userId: string, properties?: Record<string, any>) {
    this.userId = userId;
    
    if (!this.isEnabled) return;

    // Example: Set user properties
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("config", process.env.REACT_APP_GA_TRACKING_ID, {
        user_id: userId,
        custom_map: properties,
      });
    }

    console.log("User identified:", userId, properties);
  }
}

export const analytics = new AnalyticsService();

// Hook for tracking page views in React Router
export function usePageTracking() {
  return (path: string, title?: string) => {
    analytics.trackPageView(path, title);
  };
}

// HOC for tracking component renders
export function withAnalytics<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  eventData: Partial<AnalyticsEvent>
): React.ComponentType<T> {
  return function AnalyticsWrapper(props: T) {
    React.useEffect(() => {
      analytics.trackEvent({
        action: "component_viewed",
        category: "engagement",
        ...eventData,
      });
    }, []);

    return React.createElement(WrappedComponent, props);
  };
}
