import { Link } from "react-router-dom";
import IconChooser from "./projects/ProjectIconChooser";

export default function ProjectCard({ project }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="group block bg-(--surface) rounded-lg overflow-hidden border border-(--bordercolor) hover:border-(--accent) transition-all duration-300"
    >

      {/* Thumbnail met overlay */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Logo */}
        {project.logo && (
          <img
            src={
              typeof project.logo === "string"
                ? project.logo
                : project.logo.src
            }
            alt={`${project.title} logo`}
            className={`
              absolute bottom-2 left-2
              ${
                typeof project.logo === "object" && project.logo.className
                  ? project.logo.className
                  : "h-16"
              }
            `}
          />
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-(--overlay) opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-(--text) font-semibold">
            Bekijk Project →
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-(--text) mb-1 group-hover:text-(--accent) transition-colors">
          {project.title}
        </h3>

        <p className="text-sm text-(--muted) line-clamp-2">
          {project.tagline}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="tag px-4 py-2 bg-(--surface-alt) rounded-lg text-sm font-medium border border-(--bordercolor) hover:bg-(--accent) hover:text-white transition-all"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}