import { useState } from "react";
import { ChevronLeft, ChevronRight } from "../icons/icons.jsx";

export default function ProjectGallery({ project }) {
  const { screenshots = [], youtube } = project || {};

  // Zorg dat youtube altijd een array is
  const youtubeArray = Array.isArray(youtube)
    ? youtube
    : youtube
    ? [youtube]
    : [];

  // Helper: detecteer of iets een YouTube/video link is
  const isVideo = (url) => {
    return (
      url.includes("youtube.com") ||
      url.includes("youtu.be") ||
      url.includes("embed")
    );
  };

  // Combineer alles in slides
  const slides = [
    ...youtubeArray.map((url) => ({ type: "video", src: url })),
    ...screenshots.map((src) => ({
      type: isVideo(src) ? "video" : "image",
      src,
    })),
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Early return als leeg
  if (!slides.length) return null;

  // Navigatie
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlide = slides[currentIndex];

  return (
    <div className="mb-6 mx-4">
      <h2 className="text-xl font-semibold text-(--text)">Gallery</h2>

      <div className="relative group mt-4">
        {/* Slide container */}
        <div className="overflow-hidden bg-(--surface) aspect-video rounded-xl">
          
          {/* VIDEO */}
          {currentSlide.type === "video" && (
            <iframe
              src={`${currentSlide.src}?autoplay=0&mute=1&rel=0`}
              title={`Project Video ${currentIndex}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          )}

          {/* IMAGE */}
          {currentSlide.type === "image" && (
            <img
              src={currentSlide.src}
              alt={`Slide ${currentIndex + 1}`}
              className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
              onClick={() => window.open(currentSlide.src, "_blank")}
            />
          )}
        </div>

        {/* NAVIGATION */}
        {slides.length > 1 && (
          <>
            {/* Left */}
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full 
                         bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right */}
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full 
                         bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* DOTS */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? "bg-white w-5"
                      : "bg-white/50 hover:bg-white/80 w-2"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}