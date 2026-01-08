import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function ProjectMechanics({ project }) {
  // Skip als er geen mechanics zijn
  if (!project.mechanics || project.mechanics.length === 0) {
    return null;
  }

  return (
    <div className="mx-4">
      <h2 className="text-xl font-semibold text-(--text) mb-4">Code Highlights</h2>

      {project.mechanics.map((m, i) => (
        <div key={i} className="flex flex-col gap-4 border-b border-(--bordercolor) pb-4 mb-4">
          {/* Title + Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-(--text)">{m.subtitle}</h3>
            <p className="leading-relaxed text-(--muted)">{m.description}</p>
          </div>

          {/* Code + Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-[65%_35%] gap-4">
            {/* Code block with syntax highlighting */}
            <div className="h-60 overflow-auto rounded-lg">
              <SyntaxHighlighter
                language="csharp"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  height: "100%",
                }}
                showLineNumbers={true}>
                {m.code}
              </SyntaxHighlighter>
            </div>

            {/* Preview image */}
            {m.image && (
              <a href={m.image} target="_blank" rel="noopener noreferrer">
                <img
                  src={m.image}
                  alt={m.subtitle}
                  className="w-full h-60 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}