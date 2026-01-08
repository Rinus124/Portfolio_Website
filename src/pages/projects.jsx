import ProjectCard from "../components/ProjectCard";
import projectData from "../data/projectdata.json";

export default function Projects() {
      const projects = projectData.projects; 
    return (
    <main className="container mx-auto px-4 py-12">
        
        {/* Projecten Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-(--text) mb-8 text-center">Mijn Projecten</h2>

          {/* Grid met ProjectCards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
      
      <div className="max-w-2xl">
        <h1 className="text-5xl font-bold text-(--text) mb-6">Projecten</h1>
        <p className="text-lg text-(--muted) leading-relaxed">
          Mijn projecten
        </p>
      </div>
    </main>
  );
}