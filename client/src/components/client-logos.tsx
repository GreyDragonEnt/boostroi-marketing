export default function ClientLogos() {
  const clients = [
    {
      name: "Woolworths Group",
      logo: "/logos/woolworths-logo.svg",
      industry: "Retail"
    },
    {
      name: "NAB",
      logo: "/logos/nab-logo.svg",
      industry: "Banking"
    },
    {
      name: "Qantas",
      logo: "/logos/qantas-logo.svg",
      industry: "Aviation"
    },
    {
      name: "Bunnings",
      logo: "/logos/bunnings-logo.svg",
      industry: "Hardware Retail"
    },
    {
      name: "JB Hi-Fi",
      logo: "/logos/jb-hifi-logo.svg",
      industry: "Electronics"
    },
    {
      name: "Harvey Norman",
      logo: "/logos/harvey-norman-logo.svg",
      industry: "Retail"
    }
  ];

  return (
    <section className="py-12 bg-white border-t border-b border-gray-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <p className="text-gray-500 font-medium">
            Trusted by leading Australian brands
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {clients.map((client, index) => (
            <div 
              key={index}
              className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
            >
              <img 
                src={client.logo}
                alt={`${client.name} logo`}
                className="max-h-12 w-auto object-contain"
                loading="lazy"
                onError={(e) => {
                  console.log(`Failed to load logo for ${client.name}`);
                  e.currentTarget.style.display = 'none';
                }}
                onLoad={() => {
                  console.log(`Successfully loaded logo for ${client.name}`);
                }}
              />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            Results speak louder than logos. See our case studies below.
          </p>
        </div>
      </div>
    </section>
  );
}