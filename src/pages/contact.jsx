import { siteConfig } from "../siteConfig";
import { GitHub, LinkedIn, Itch, Envelope, ChevronRight } from "../components/icons/icons.jsx";

export default function Contact() {
  // Social media configuratie met iconen
  const socialLinks = [
    { name: "GitHub", url: siteConfig.socials.github, description: "Bekijk mijn code en projecten", icon: <GitHub className="w-8 h-8" /> },
    { name: "LinkedIn", url: siteConfig.socials.linkedin, description: "Connect met mij", icon: <LinkedIn className="w-8 h-8" /> },
    { name: "Itch.io", url: siteConfig.socials.itch, description: "Speel mijn games", icon: <Itch className="w-8 h-8" /> },
  ];

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-(--text) mb-4">Contact</h1>
          <p className="text-xl text-(--muted) max-w-2xl mx-auto">
            Interesse in samenwerking of gewoon een vraag? Neem gerust contact op!
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Email CTA - Left/Top */}
          <div className="lg:flex-1 bg-(--surface) rounded-lg border border-(--bordercolor) p-8 flex flex-col justify-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto lg:mx-0 mb-4 rounded-full bg-(--accent)/10 
                              flex items-center justify-center text-(--accent)">
                <Envelope className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-(--text) mb-2 text-center lg:text-left">
                Direct contact
              </h2>
              <p className="text-(--muted) mb-6 text-center lg:text-left">
                Stuur me een email en ik reageer zo snel mogelijk.
              </p>
            </div>
            <a
              href={`mailto:${siteConfig.socials.email}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-(--accent) 
                         text-(--accent-text) rounded-lg font-semibold 
                         hover:bg-(--accent-hover) transition-colors"
            >
              <Envelope className="w-5 h-5" />
              {siteConfig.socials.email}
            </a>
          </div>

          {/* Social Links - Right/Bottom */}
          <div className="lg:flex-1 flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-(--text) mb-2">Vind me online</h2>
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 bg-(--surface) rounded-lg border border-(--bordercolor)
                           hover:border-(--accent) transition-all flex items-center gap-4"
              >
                {/* Icon */}
                <div className="w-12 h-12 shrink-0 rounded-full bg-(--bg) 
                                flex items-center justify-center text-(--muted)
                                group-hover:text-(--accent) group-hover:bg-(--accent)/10 
                                transition-colors">
                  {social.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-(--text) 
                                 group-hover:text-(--accent) transition-colors">
                    {social.name}
                  </h3>
                  <p className="text-sm text-(--muted)">
                    {social.description}
                  </p>
                </div>

                {/* Arrow */}
                    <ChevronRight className="w-5 h-5 text-(--muted) group-hover:text-(--accent) group-hover:translate-x-1 transition-all" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}