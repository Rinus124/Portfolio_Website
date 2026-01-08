import { siteConfig } from "../siteConfig";
import { Download, Users, Tech } from "../components/icons/icons.jsx";

export default function About() {
  // Split de about tekst in paragrafen
  const paragraphs = siteConfig.aboutLong
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-(--text) mb-4">Over mij</h1>
        <p className="text-xl text-(--muted) max-w-2xl mx-auto">{siteConfig.tagline}</p>
      </div>

      <div className="container mx-auto max-w-5xl">
        {/* Main Grid */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Right Column - Photo & Contact Card */}
          <div className="lg:flex-1">
            {/* Profile Card */}
            <div className="bg-(--surface) border border-(--bordercolor) rounded-lg p-6 h-full flex flex-col">
              {/* Photo */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-(--accent) rounded-lg blur-xl opacity-20" />
                <img
                  src={siteConfig.aboutImage}
                  alt={siteConfig.name}
                  className="relative w-full aspect-square object-cover rounded-lg border-4 border-(--accent)"
                />
              </div>

              {/* Info */}
              <div className="text-center mb-6 grow flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-(--text) mb-1">{siteConfig.name}</h3>
                <p className="text-(--accent) font-medium">{siteConfig.role}</p>
              </div>

              {/* CV Download */}
              <a
                href={siteConfig.cv}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 
                           px-4 py-3 bg-(--accent) text-(--accent-text) rounded-lg 
                           font-semibold hover:bg-(--accent-hover) transition-colors">
                <Download className="w-5 h-5" />
                Download CV
              </a>
            </div>
          </div>

          {/* Left Column - Bio & Skills */}
          <div className="flex flex-col gap-8 lg:flex-2">
            {/* Bio */}
            <section className="bg-(--surface) border border-(--bordercolor) rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-(--text) mb-6">Mijn Verhaal</h2>
              <div className="space-y-4">
                {paragraphs.map((text, i) => (
                  <p key={i} className="text-(--muted) leading-relaxed">
                    {text}
                  </p>
                ))}
              </div>
            </section>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              {/* Soft Skills */}
              <section className="bg-(--surface) border border-(--bordercolor) rounded-lg p-6 flex flex-col">
                <h3 className="text-lg font-semibold text-(--text) mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-(--accent)" />
                  Soft Skills
                </h3>
                <ul className="space-y-2">
                  {siteConfig.softSkills.map((skill) => (
                    <li key={skill} className="flex items-start gap-2 text-(--muted)">
                      <span className="text-(--accent) mt-1">•</span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Hard Skills */}
              <section className="bg-(--surface) border border-(--bordercolor) rounded-lg p-6 flex flex-col">
                <h3 className="text-lg font-semibold text-(--text) mb-4 flex items-center gap-2">
                  <Tech className="w-5 h-5 text-(--accent)" />
                  Hard Skills
                </h3>
                <ul className="space-y-2">
                  {siteConfig.hardSkills.map((skill) => (
                    <li key={skill} className="flex items-start gap-2 text-(--muted)">
                      <span className="text-(--accent) mt-1">•</span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}