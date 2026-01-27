import { useState } from "react";
import ProjectCard from "../components/ProjectCard";
import projectData from "../data/projectdata.json";
import projectDataEigen from "../data/projectdata_eigen.json";

export default function Projects() {
  const [activeTab, setActiveTab] = useState("school");

  const projects =
    activeTab === "school"
      ? projectData.projects
      : projectDataEigen.projects;

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-(--text)">
        Mijn Projecten
      </h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-12">
        <button
          onClick={() => setActiveTab("school")}
          className={`px-6 py-2 rounded-full font-semibold transition
            ${activeTab === "school"
              ? "bg-(--primary) text-white"
              : "bg-gray-200 text-gray-700"}`}
        >
          School
        </button>

        <button
          onClick={() => setActiveTab("eigen")}
          className={`px-6 py-2 rounded-full font-semibold transition
            ${activeTab === "eigen"
              ? "bg-(--primary) text-white"
              : "bg-gray-200 text-gray-700"}`}
        >
          Eigen
        </button>
      </div>

      {/* Project Grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </main>
  );
}
