import { useState } from "react";
import { Play, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoTestimonialsProps {
  onOpenCalendly?: () => void;
}

export default function VideoTestimonials({ onOpenCalendly }: VideoTestimonialsProps) {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      title: "Founder, EcoStyle",
      company: "Sustainable Fashion E-commerce",
      location: "Melbourne, VIC",
      thumbnail: "https://images.unsplash.com/photo-1494790108755-2616b612b372?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
      videoUrl: "https://player.vimeo.com/video/placeholder1", // In real implementation, use actual video URLs
      quote: "BoostROI tripled our revenue in 6 months. Their data-driven approach to social media marketing completely transformed our business.",
      results: ["300% revenue increase", "65% lower CAC", "4.2x ROAS"]
    },
    {
      id: 2,
      name: "Marcus Wong",
      title: "CEO, TechFlow",
      company: "B2B SaaS Platform",
      location: "Sydney, NSW",
      thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
      videoUrl: "https://player.vimeo.com/video/placeholder2",
      quote: "The ROI calculator they built for our landing page increased conversions by 180%. These guys know what they're doing.",
      results: ["180% conversion increase", "$2M ARR growth", "85% lead quality improvement"]
    },
    {
      id: 3,
      name: "Emma Thompson",
      title: "Marketing Director, HealthPlus",
      company: "Healthcare Services",
      location: "Brisbane, QLD",
      thumbnail: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
      videoUrl: "https://player.vimeo.com/video/placeholder3",
      quote: "Finally, an agency that actually understands ROI. They helped us scale from 50 to 500 patients per month.",
      results: ["900% patient growth", "45% cost reduction", "12x marketing ROI"]
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-charcoal mb-4">
            Hear From Real Clients
          </h2>
          <p className="font-inter text-xl text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. See how we've transformed businesses across Australia.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover-lift">
              {/* Video Thumbnail */}
              <div className="relative aspect-video bg-gray-200">
                <img 
                  src={testimonial.thumbnail}
                  alt={`${testimonial.name} testimonial`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Button
                    onClick={() => setActiveVideo(activeVideo === testimonial.id ? null : testimonial.id)}
                    className="bg-brand text-white rounded-full w-16 h-16 p-0 hover:bg-brand/90 hover:scale-110 transition-all shadow-lg"
                  >
                    <Play className="h-6 w-6 ml-1" fill="currentColor" />
                  </Button>
                </div>
                
                {/* Video Player Overlay */}
                {activeVideo === testimonial.id && (
                  <div className="absolute inset-0 bg-black">
                    <iframe
                      src={testimonial.videoUrl}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title={`${testimonial.name} testimonial`}
                    ></iframe>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start mb-4">
                  <Quote className="text-brand h-6 w-6 mr-2 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 italic">
                    "{testimonial.quote}"
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="font-montserrat font-semibold text-lg text-charcoal">
                    {testimonial.name}
                  </h3>
                  <p className="text-brand font-medium">{testimonial.title}</p>
                  <p className="text-gray-500 text-sm">{testimonial.company}</p>
                  <p className="text-gray-400 text-sm">{testimonial.location}</p>
                </div>

                {/* Results */}
                <div className="space-y-2">
                  {testimonial.results.map((result, idx) => (
                    <div key={idx} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-gray-600">{result}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Ready to join our success stories?
          </p>
          <Button 
            onClick={onOpenCalendly}
            className="bg-brand text-white px-8 py-4 rounded-lg hover:bg-brand/90 transition-all font-montserrat font-semibold"
          >
            Get Your Free Strategy Call
          </Button>
        </div>
      </div>
    </section>
  );
}