import { siteConfig } from "../siteConfig";
import TimeLineDragger from "../components/UnityTimeLine";
import PlaceHolderPic from "../pictures/Place_holder.webp";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Decoratieve glow achter foto */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-(--accent) rounded-full blur-3xl opacity-20" />

        {/* Linker placeholder (rond tekst) */}
        <img
          src={PlaceHolderPic}
          alt="Placeholder left"
          className="
            hidden lg:block
            absolute left-5 top-1/2 -translate-y-1/2
            w-80 h-96 object-cover
            border-5 border-(--accent) shadow-lg
          "
        />

        {/* Rechter placeholder (rond tekst) */}
        <img
          src={PlaceHolderPic}
          alt="Placeholder right"
          className="
            hidden lg:block
            absolute right-5 top-1/2 -translate-y-1/2
            w-80 h-96 object-cover
            border-5 border-(--accent) shadow-lg
          "
        />

        {/* Informatie */}
        <div className="container mx-auto flex flex-col items-center text-center relative z-10">
          {/* Foto midden */}
          <img
            src={siteConfig.aboutImage}
            alt={siteConfig.name}
            className="w-70 h-70 object-cover border-5 border-(--accent) shadow-lg mb-6"
          />

          {/* Naam en Rol */}
          <h1 className="text-5xl font-bold text-(--text) mb-2">
            {siteConfig.name}
          </h1>
          <p className="text-xl text-(--accent) font-medium mb-4">
            {siteConfig.role}
          </p>

          {/* Tagline */}
          <p className="text-lg text-(--muted) max-w-xl mb-8">
            {siteConfig.tagline}
          </p>
        </div>
      </section>

      {/* Timeline Title */}
      <div className="container mx-auto text-center mt-1">
        <h2 className="text-3xl font-bold text-(--text)">
          {siteConfig.TLTitle}
        </h2>
      </div>

      {/* TimeLine + Dragger Component */}
      <div className="container mx-auto mt-8 px-4">
        <TimeLineDragger />
      </div>
    </div>
  );
}
