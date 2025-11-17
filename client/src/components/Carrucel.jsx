import { useState } from "react";
import personal from "../assets/image/personal.png";
import personal2 from "../assets/image/p1.png";
import personal3 from "../assets/image/robot.png";

const images = [personal, personal2, personal3];

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  const prevSlide = () => {
    setCurrent((current - 1 + total) % total);
  };

  const nextSlide = () => {
    setCurrent((current + 1) % total);
  };

  const goToSlide = (index) => {
    setCurrent(index);
  };

  return (
    <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
      {/* Carousel wrapper */}
      <div className="relative h-64 sm:h-80 md:h-96 lg:h-[600px] xl:h-[680px] overflow-hidden rounded-md">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index + 1}`}
            className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
              index === current
                ? "opacity-100"
                : "opacity-0 absolute top-0 left-0"
            }`}
          />
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute z-30 flex -translate-x-1/2 space-x-3 bottom-5 left-1/2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              current === index ? "bg-orange-500" : "bg-white/50"
            }`}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 hover:bg-white/50">
          <svg
            className="w-5 h-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 hover:bg-white/50">
          <svg
            className="w-5 h-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
}
