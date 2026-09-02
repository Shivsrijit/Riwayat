import React, { useState } from 'react';
import { Search, MapPin, Star, Calendar, Award } from 'lucide-react';

const samplePlaces = [
  {
    id: 1,
    name: 'Khajuraho Temples',
    description: 'Ancient temples showcasing exquisite sculptures and architectural brilliance.',
    image: 'https://images.unsplash.com/photo-1548013146-72492268e070?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    region: 'Madhya Pradesh',
    bestTime: 'October to March',
    heritage: 'UNESCO World Heritage',
    entryFee: '₹40 (Indian), ₹600 (Foreign)',
  },
  {
    id: 2,
    name: 'Hampi Ruins',
    description: 'UNESCO World Heritage site with stunning ruins of the Vijayanagara Empire.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    region: 'Karnataka',
    bestTime: 'November to February',
    heritage: 'UNESCO World Heritage',
    entryFee: '₹40 (Indian), ₹600 (Foreign)',
  },
  {
    id: 3,
    name: 'Konark Sun Temple',
    description: 'Magnificent 13th-century temple dedicated to the Sun God.',
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db71102?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    region: 'Odisha',
    bestTime: 'October to March',
    heritage: 'UNESCO World Heritage',
    entryFee: '₹40 (Indian), ₹600 (Foreign)',
  },
];

function Places() {
  const [search, setSearch] = useState('');

  const filteredPlaces = samplePlaces.filter((place) =>
    place.name.toLowerCase().includes(search.toLowerCase()) ||
    place.region.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Cultural Destinations</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore the most culturally rich places across India.
          </p>
        </div>
        <div className="flex justify-center mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search destinations or regions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredPlaces.map((place) => (
            <div key={place.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 cultural-hover">
              <div className="relative h-48">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-orange-500 text-white px-2 py-1 rounded text-xs">
                  {place.heritage}
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <MapPin className="w-4 h-4" />
                    {place.region}
                  </div>
                  <h3 className="text-xl font-bold">{place.name}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">{place.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Best Time:</span>
                    <span className="font-medium">{place.bestTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Entry Fee:</span>
                    <span className="font-medium">{place.entryFee}</span>
                  </div>
                </div>
                <button className="text-orange-600 hover:text-orange-700 font-medium">
                  Learn More →
                </button>
              </div>
            </div>
          ))}
        </div>
        {filteredPlaces.length === 0 && (
          <div className="text-center text-gray-500 mt-12 text-lg">No destinations found.</div>
        )}
      </div>
    </div>
  );
}

export default Places; 