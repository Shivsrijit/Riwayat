import React, { useState, useEffect } from 'react';

const images = [
  {
    url: "https://images.unsplash.com/photo-1545063914-a1a6ec821c88?auto=format&fit=crop&w=2000&q=80",
    caption: "Classical Bharatanatyam Dance"
  },
  {
    url: "https://images.unsplash.com/photo-1624286768741-bf24d2e0f0f3?auto=format&fit=crop&w=2000&q=80",
    caption: "Traditional Madhubani Art"
  },
  {
    url: "https://images.unsplash.com/photo-1590059300837-54d715ad0e3d?auto=format&fit=crop&w=2000&q=80",
    caption: "Handwoven Textiles"
  },
  {
    url: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2000&q=80",
    caption: "Taj Mahal Architecture"
  },
  {
    url: "https://images.stockcake.com/public/4/2/7/42705147-c920-4bed-9ef8-bb7cee6d8cdf_large/folk-dance-performance-stockcake.jpg",
    caption: "Folk Performance"
  }
];

const ImageCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[500px] w-full overflow-hidden">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image.url}
            alt={image.caption}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <p className="text-xl font-medium">{image.caption}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageCarousel;