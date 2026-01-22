import ProjectCard from "../components/ProjectCard";
import projectData from "../data/projectdata.json";
import projectDataEigen from "../data/projectdata_eigen.json";

export default function Projects() {
      const projects = projectData.projects; 
      const projectseigen = projectDataEigen.projects;
    return (
    <main className="container mx-auto px-4 py-12">
        
        {/* Projecten Section (School) */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-(--text) mb-8 text-center">Mijn School Projecten</h2>

          {/* Grid met ProjectCards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

        {/* Projecten Section (eigen) */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-(--text) mb-8 text-center">Mijn Eigen Projecten</h2>

            {/* Grid met ProjectCards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectseigen.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
        </div>
      </section>
    </main>
  );
}