export default function ProjectHeader({ project }) {
  return (
    <div className="relative w-full mb-4 overflow-hidden">
      
      {/* Banner */}
      <img 
        src={project.thumbnail} 
        alt={project.title}
        className="w-full h-48 sm:h-64 object-cover" 
      />

      {/* Overlay */}
      <div className="absolute bottom-4 left-4">
        
        {project.logo ? (
          <>
            <img 
              src={
                typeof project.logo === "string"
                  ? project.logo
                  : project.logo.src
              }
              alt={`${project.title} logo`}
              className={`
                ${
                  typeof project.logo === "object" && project.logo.className
                    ? project.logo.className
                    : "h-20"
                }
                object-contain drop-shadow-md mb-2
              `}
            />

            <p className="text-base text-gray-300 max-w-xl drop-shadow-sm font-medium">
              {project.tagline}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md mb-1">
              {project.title}
            </h1>

            <p className="text-base text-gray-300 max-w-xl drop-shadow-sm font-medium">
              {project.tagline}
            </p>
          </>
        )}

      </div>
    </div>
  );
}