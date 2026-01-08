import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "../icons/icons.jsx";

export default function ProjectPrevNext({ previous, next }) {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <>
      {/* STICKY SIDE NAVIGATION - always visible */}
      <div className="fixed top-1/2 -translate-y-1/2 left-0 right-0 pointer-events-none z-40 hidden lg:block">
        <div className="max-w-screen-2xl mx-auto px-4 flex justify-between items-center">
          {/* Previous button - positioned outside content */}
          {previous ? (
            <Link
              to={previous.url}
              onClick={scrollToTop}
              className="pointer-events-auto w-12 h-12 rounded-full bg-(--surface) border-2 border-(--bordercolor) hover:border-(--accent) hover:bg-(--accent) hover:text-(--accent-text) flex items-center justify-center transition-all shadow-lg group -ml-20"
              title={`Vorige: ${previous.title}`}
            >
              <ArrowLeft className="w-6 h-6 text-(--muted) group-hover:text-(--accent) group-hover:-translate-x-0.5 transition-transform" aria-hidden />
            </Link>
          ) : (
            <div />
          )}

          {/* Next button - positioned outside content */}
          {next ? (
            <Link
              to={next.url}
              onClick={scrollToTop}
              className="pointer-events-auto w-12 h-12 rounded-full bg-(--surface) border-2 border-(--bordercolor) hover:border-(--accent) hover:bg-(--accent) hover:text-(--accent-text) flex items-center justify-center transition-all shadow-lg group -mr-20"
              title={`Volgende: ${next.title}`}
            >
              <ArrowRight className="w-6 h-6 text-(--muted) group-hover:text-(--accent) group-hover:translate-x-0.5 transition-transform" aria-hidden />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>

      {/* FOOTER NAVIGATION - at the bottom */}
      <nav className="mt-16 pt-8 border-t border-(--bordercolor) mx-4">
        <div className="flex items-center justify-between gap-4">
          
          {/* PREVIOUS */}
          {previous ? (
            <Link
              to={previous.url}
              onClick={scrollToTop}
              className="group flex items-center gap-3 hover:text-(--accent) transition-colors max-w-[45%]"
            >
              <ArrowLeft className="w-5 h-5 shrink-0 text-(--muted) group-hover:text-(--accent) group-hover:-translate-x-1 transition-transform" aria-hidden />
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-(--muted) uppercase tracking-wider">Vorige</span>
                <span className="font-semibold truncate">{previous.title}</span>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {/* NEXT */}
          {next ? (
            <Link
              to={next.url}
              onClick={scrollToTop}
              className="group flex items-center gap-3 hover:text-(--accent) transition-colors max-w-[45%] ml-auto"
            >
              <div className="flex flex-col min-w-0 text-right">
                <span className="text-xs text-(--muted) uppercase tracking-wider">Volgende</span>
                <span className="font-semibold truncate">{next.title}</span>
              </div>
              <ArrowRight className="w-5 h-5 shrink-0 text-(--muted) group-hover:text-(--accent) group-hover:translate-x-1 transition-transform" aria-hidden />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </nav>
    </>
  );
}