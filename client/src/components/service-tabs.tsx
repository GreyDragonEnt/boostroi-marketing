import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ServiceTabs() {
  const [activeTab, setActiveTab] = useState("social");

  const tabs = [
    { id: "social", label: "Social Media Marketing" },
    { id: "content", label: "Content & Influencer Marketing" },
    { id: "conversion", label: "Conversion Optimization" },
    { id: "analytics", label: "Analytics & Tracking" }
  ];

  const tabContent = {
    social: {
      title: "Social Media That Builds Communities & Drives Sales",
      description: "Turn your social presence into a revenue-generating machine. We create content that actually engages and converts your ideal customers.",
      features: [
        "Platform-specific content strategy (Instagram, TikTok, LinkedIn)",
        "Community building and engagement tactics",
        "Social commerce optimization",
        "Viral content creation and trend leveraging"
      ],
      metric: "400%",
      metricDescription: "engagement increase",
      image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
    },
    content: {
      title: "Content & Influencer Marketing That Converts",
      description: "Authentic content and strategic influencer partnerships that your audience actually wants to engage with.",
      features: [
        "Viral content strategy and creation",
        "Micro and macro influencer partnerships",
        "User-generated content campaigns",
        "Story-driven brand narrative development"
      ],
      metric: "285%",
      metricDescription: "brand awareness boost",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
    },
    conversion: {
      title: "Conversion Rate Optimization That Pays",
      description: "Turn more visitors into customers without spending more on ads. Every percentage point improvement goes straight to your bottom line.",
      features: [
        "Landing page optimization and testing",
        "Funnel analysis and improvement",
        "User experience optimization",
        "Cart abandonment recovery"
      ],
      metric: "45%",
      metricDescription: "conversion rate improvement",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
    },
    analytics: {
      title: "Analytics That Drive Smart Decisions",
      description: "Know exactly what's working and what's not. Data-driven insights that guide every marketing decision.",
      features: [
        "Custom dashboard setup and monitoring",
        "Attribution modeling across channels",
        "Performance reporting and insights",
        "ROI tracking and optimization"
      ],
      metric: "100%",
      metricDescription: "data accuracy guarantee",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
    }
  };

  return (
    <section id="services" className="py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-charcoal mb-4">
            Services That Actually Boost Your ROI
          </h2>
          <p className="font-inter text-xl text-gray-600 max-w-2xl mx-auto">
            No fluff, no filler. Just the marketing services that move the needle on your bottom line.
          </p>
        </div>

        {/* Service Tabs */}
        <div className="flex flex-wrap justify-center mb-8 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 py-3 font-medium transition-colors border-b-2",
                activeTab === tab.id
                  ? "text-brand border-brand"
                  : "text-gray-600 border-transparent hover:text-brand"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Service Content */}
        <div className="tab-content">
          {Object.entries(tabContent).map(([tabId, content]) => (
            <div
              key={tabId}
              className={cn(
                "tab-panel",
                activeTab === tabId ? "block" : "hidden"
              )}
            >
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="font-montserrat font-bold text-2xl text-charcoal mb-4">
                    {content.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {content.description}
                  </p>
                  <ul className="space-y-3 mb-6">
                    {content.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="text-brand mr-3 h-5 w-5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Average Results</div>
                    <div className="text-2xl font-bold text-brand">{content.metric}</div>
                    <div className="text-sm text-gray-600">{content.metricDescription}</div>
                  </div>
                </div>
                <div>
                  <img 
                    src={content.image} 
                    alt={content.title} 
                    className="rounded-xl shadow-lg" 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
