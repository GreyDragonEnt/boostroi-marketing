export default function ClientLogos() {
  const clients = [
    {
      name: "Woolworths Group",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Woolworths_logo.svg/200px-Woolworths_logo.svg.png",
      industry: "Retail"
    },
    {
      name: "NAB",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/National_Australia_Bank_logo.svg/200px-National_Australia_Bank_logo.svg.png",
      industry: "Banking"
    },
    {
      name: "Qantas",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Qantas_Airways_logo_2016.svg/200px-Qantas_Airways_logo_2016.svg.png",
      industry: "Aviation"
    },
    {
      name: "Bunnings",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Bunnings_Warehouse_logo.svg/200px-Bunnings_Warehouse_logo.svg.png",
      industry: "Hardware Retail"
    },
    {
      name: "JB Hi-Fi",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/JB_Hi-Fi_logo.svg/200px-JB_Hi-Fi_logo.svg.png",
      industry: "Electronics"
    },
    {
      name: "Harvey Norman",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Harvey_Norman_logo.svg/200px-Harvey_Norman_logo.svg.png",
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