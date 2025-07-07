import { Linkedin, Mail } from "lucide-react";

export default function TeamPhotos() {
  const teamMembers = [
    {
      name: "James Harrison",
      role: "Founder & CEO",
      bio: "15+ years in digital marketing. Former Google Ads specialist. Built 3 agencies from scratch.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
      linkedin: "https://linkedin.com/in/jamesharrison",
      email: "james@boostroi.agency",
      specialty: "Growth Strategy"
    },
    {
      name: "Sarah Mitchell",
      role: "Head of Performance",
      bio: "Data scientist turned marketer. Specializes in conversion optimization and analytics.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b372?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
      linkedin: "https://linkedin.com/in/sarahmitchell",
      email: "sarah@boostroi.agency",
      specialty: "Conversion Optimization"
    },
    {
      name: "Marcus Chen",
      role: "Creative Director",
      bio: "Award-winning creative with 12 years in advertising. Leads our content and social media strategies.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
      linkedin: "https://linkedin.com/in/marcuschen",
      email: "marcus@boostroi.agency",
      specialty: "Creative Strategy"
    },
    {
      name: "Emma Thompson",
      role: "Client Success Manager",
      bio: "Ensures every client gets maximum ROI. 8 years in account management and customer success.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
      linkedin: "https://linkedin.com/in/emmathompson",
      email: "emma@boostroi.agency",
      specialty: "Client Success"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-charcoal mb-4">
            Meet Your ROI Experts
          </h2>
          <p className="font-inter text-xl text-gray-600 max-w-2xl mx-auto">
            Real people, real expertise. No outsourcing, no junior staff. Just seasoned professionals dedicated to your success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center group">
              {/* Photo */}
              <div className="relative mb-6">
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Specialty Badge */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-brand text-white px-3 py-1 rounded-full text-xs font-medium">
                    {member.specialty}
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-montserrat font-bold text-xl text-charcoal">
                    {member.name}
                  </h3>
                  <p className="text-brand font-semibold">
                    {member.role}
                  </p>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.bio}
                </p>

                {/* Social Links */}
                <div className="flex justify-center space-x-3 pt-2">
                  <a 
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a 
                    href={`mailto:${member.email}`}
                    className="text-gray-400 hover:text-brand transition-colors p-2 rounded-full hover:bg-orange-50"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Company Values */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="font-montserrat font-bold text-2xl text-charcoal mb-4">
              Why Work With Us?
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-brand/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand">100%</span>
              </div>
              <h4 className="font-semibold text-charcoal mb-2">Australian Team</h4>
              <p className="text-gray-600 text-sm">
                No outsourcing. All work done in-house by our Sydney-based team.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-brand/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand">50+</span>
              </div>
              <h4 className="font-semibold text-charcoal mb-2">Years Combined Experience</h4>
              <p className="text-gray-600 text-sm">
                Decades of expertise in digital marketing and business growth.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-brand/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand">24/7</span>
              </div>
              <h4 className="font-semibold text-charcoal mb-2">Support Available</h4>
              <p className="text-gray-600 text-sm">
                Always here when you need us. Direct access to your account manager.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}