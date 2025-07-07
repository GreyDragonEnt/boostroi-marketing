export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-center text-gray-900">
          BoostROI Agency
        </h1>
        <p className="text-xl text-center text-gray-600 mt-4">
          The Aussie marketing agency that actually boosts your ROI
        </p>
        <div className="mt-8 text-center">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}