import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { LanguageContext } from "./Language";

export default function Header() {
  const location = useLocation();
  const { lang, changeLang } = useContext(LanguageContext);

  const [showDropdown, setShowDropdown] = useState(false);
  const triggerDistance = 80;

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname.startsWith("/home");
    }
    return location.pathname.startsWith(path);
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      const mouseY = e.clientY;

      if (mouseY < 80 + triggerDistance) {
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-(--surface) border-b border-(--bordercolor)">
        
        <nav className="relative container mx-auto px-4 h-20 flex items-center justify-center">
          {/* Logo */}
          <div>
            <img 
              src="./Logo.webp" 
              alt="Logo"
              className="h-30 w-auto"
            />
          </div>

          {/*NAAM */}
          <Link 
            to="/" 
            onClick={scrollToTop}
            className="text-3xl md:text-4xl font-bold tracking-wide text-(--accent) hover:opacity-80 transition-opacity"
          >
            Marijn van Veggel
          </Link>

          {/* Language knop rechts */}
          <div className="absolute right-4">
            <button
              onClick={() => changeLang(lang === "en" ? "nl" : "en")}
              className="px-3 py-1 border border-(--bordercolor) rounded hover:bg-(--surface-hover)">
              {lang === "en" ? "NL" : "EN"}
            </button>
          </div>
        </nav>
      </header>

      {/*DROPDOWN */}
      <div
        className={`fixed top-20 left-0 w-full z-40 transition-all duration-300 ${
          showDropdown
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="bg-(--surface) border-b border-(--bordercolor) shadow-xl">
          
          <div className="container mx-auto px-4 py-6 flex gap-12 justify-center">
            
            <Link
              to="/"
              onClick={scrollToTop}
              className={`text-lg md:text-xl transition-colors ${
                isActive("/") 
                  ? "text-(--accent) font-semibold" 
                  : "text-(--muted) hover:text-(--text)"
              }`}
            >
              Home
            </Link>

            <Link
              to="/about"
              onClick={scrollToTop}
              className={`text-lg md:text-xl transition-colors ${
                isActive("/about") 
                  ? "text-(--accent) font-semibold" 
                  : "text-(--muted) hover:text-(--text)"
              }`}
            >
              Over Mij
            </Link>

            <Link
              to="/projects"
              onClick={scrollToTop}
              className={`text-lg md:text-xl transition-colors ${
                isActive("/projects") 
                  ? "text-(--accent) font-semibold" 
                  : "text-(--muted) hover:text-(--text)"
              }`}
            >
              Projecten
            </Link>

            <Link
              to="/contact"
              onClick={scrollToTop}
              className={`text-lg md:text-xl transition-colors ${
                isActive("/contact") 
                  ? "text-(--accent) font-semibold" 
                  : "text-(--muted) hover:text-(--text)"
              }`}
            >
              Contact
            </Link>

          </div>
        </div>
      </div>
    </>
  );
}