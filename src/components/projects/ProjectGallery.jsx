import { useState } from "react";
import { ChevronLeft, ChevronRight } from "../icons/icons.jsx";

export default function ProjectGallery({ project }) {
  const { screenshots, youtube } = project;

  // Combineer video (als eerste) en screenshots in één array
  const slides = [
    ...(youtube ? [{ type: "video", src: youtube }] : []),
    ...screenshots.map((s) => ({ type: "image", src: s })),
  ];

  // Track huidige slide
  const [currentIndex, setCurrentIndex] = useState(0);

  // Navigatie functies
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="mb-4 mx-4">
      <h2 className="text-xl font-semibold text-(--text)">Gallery</h2>

      {slides.length > 0 && (
        <div className="relative group mt-4">
          {/* Slide Container */}
          <div className="overflow-hidden bg-(--surface) aspect-video">
            {/* Video Slide */}
            {slides[currentIndex].type === "video" && (
              <iframe
                src={slides[currentIndex].src}
                title="Project Video"
                allowFullScreen
                className="w-full h-full"
              />
            )}

            {/* Image Slide */}
            {slides[currentIndex].type === "image" && (
              <img
                src={slides[currentIndex].src}
                alt={`Slide ${currentIndex + 1}`}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => window.open(slides[currentIndex].src, "_blank")}
              />
            )}
          </div>

          {/* Navigation Arrows */}
          {slides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full 
                           bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full 
                           bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Dots indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentIndex 
                        ? "bg-white w-4" 
                        : "bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}