import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: custom * 0.2 }
  })
};

const slides = [
  {
    id: 1,
    image: "https://dlcdnwebimgs.asus.com/gain/ABADC85C-8359-414B-9C55-60C31FBF091F/fwebp",
    alt: 'Promo Mall Diskon Rp 200rb',
  },
  {
    id: 2,
    image: "https://www.alezay.com/wp-content/uploads/2022/07/ASUS-ROG-PHONE-6-MAIN-BANNER-ALEZAY-KUWAIT-1.jpg",
    alt: 'Flash Sale 55%',
  },
  {
    id: 3,
    image: "https://sg.store.asus.com/media/wysiwyg/CES_2024_ROG_Family_Banner_1500x525.jpg",
    alt: 'Promo Gratis Ongkir',
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);

  // Auto slide
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearTimeout(timeoutRef.current);
  }, [current]);

  const goToNext = () => {
    setCurrent((current + 1) % slides.length);
  };

  const goToPrev = () => {
    setCurrent((current - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full overflow-hidden bg-black">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="relative rounded-lg overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={slides[current].id}
              src={slides[current].image}
              alt={slides[current].alt}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="w-full object-cover rounded-lg h-[300px] md:h-[400px]"
            />
          </AnimatePresence>

          {/* Tombol navigasi */}
          <button
            onClick={goToPrev}
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full hover:bg-white"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={goToNext}
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full hover:bg-white"
          >
            <ChevronRight />
          </button>

          {/* Indicator bulat */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrent(index)}
                className={`w-3 h-3 rounded-full ${
                  index === current ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}