"use client";

import { useState } from "react";
import Image from "next/image";
import { FaLink, FaGithub, FaXmark, FaChevronLeft, FaChevronRight } from "react-icons/fa6";

interface ProjectData {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  thumbnailIndex: number;
  liveLink: string;
  githubLink: string;
  technologies: string[];
  category: string;
  startDate: string | null;
  endDate: string | null;
  featured: boolean;
  order: number;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Present";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function ImageCarousel({ images, title }: { images: string[]; title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="w-full h-48 bg-gray-800 flex items-center justify-center">
        <span className="text-4xl font-bold text-primary opacity-30">
          {title.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <Image
        src={images[0]}
        alt={title}
        width={400}
        height={192}
        className="w-full h-48 object-cover"
      />
    );
  }

  return (
    <div className="carousel-container relative">
      <Image
        src={images[currentIndex]}
        alt={`${title} - ${currentIndex + 1}`}
        width={400}
        height={192}
        className="w-full h-48 object-cover"
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        }}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-1 rounded-full hover:bg-primary transition-colors"
      >
        <FaChevronLeft size={14} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-1 rounded-full hover:bg-primary transition-colors"
      >
        <FaChevronRight size={14} />
      </button>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(i);
            }}
            className={`carousel-dot ${i === currentIndex ? "active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: ProjectData;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">
            {project.title}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-primary transition-colors text-2xl"
          >
            <FaXmark />
          </button>
        </div>

        {/* Image Carousel */}
        {project.images.length > 0 && (
          <div className="relative rounded-lg overflow-hidden mb-4">
            <Image
              src={project.images[currentIndex]}
              alt={`${project.title} - ${currentIndex + 1}`}
              width={900}
              height={500}
              className="w-full h-64 md:h-80 object-cover"
            />
            {project.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      prev === 0 ? project.images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-primary transition-colors"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      prev === project.images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-primary transition-colors"
                >
                  <FaChevronRight />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                  {project.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`carousel-dot ${i === currentIndex ? "active" : ""}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Category & Date */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-semibold">
            {project.category}
          </span>
          {project.startDate && (
            <span className="text-gray-400 text-sm">
              {formatDate(project.startDate)} — {formatDate(project.endDate)}
            </span>
          )}
        </div>

        {/* Tech Tags */}
        {project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech, i) => (
              <span
                key={i}
                className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm border border-gray-700"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-gray-300 text-lg leading-relaxed mb-6">
          {project.fullDescription || project.shortDescription}
        </p>

        {/* Links */}
        <div className="flex gap-4">
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-primary px-6 py-2 rounded-full font-semibold text-white hover:bg-primary/80 transition-all"
            >
              <FaLink /> Live Demo
            </a>
          )}
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border-2 border-primary text-primary px-6 py-2 rounded-full font-semibold hover:bg-primary hover:text-white transition-all"
            >
              <FaGithub /> GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects({ projects }: { projects: ProjectData[] }) {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="mt-20 md:mt-32 pt-5">
      <div>
        <h1 className="text-4xl lg:text-5xl font-bold text-white text-center uppercase">
          Projects
        </h1>
      </div>
      <div className="container max-w-7xl mx-auto px-6 mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div
            key={project._id}
            onClick={() => setSelectedProject(project)}
            className={`project_box rounded-xl border-4 flex flex-col overflow-hidden gap-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary ${
              project.featured
                ? "border-primary shadow-md shadow-primary/20"
                : "border-primary"
            }`}
          >
            <ImageCarousel
              images={
                project.images.length > 0
                  ? [project.images[project.thumbnailIndex] || project.images[0]]
                  : []
              }
              title={project.title}
            />
            <div className="projects_info flex flex-col justify-center items-center text-center gap-3 px-4 pb-4">
              {/* Category Badge */}
              <span className="bg-primary/20 text-primary px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                {project.category}
              </span>
              <h4 className="text-2xl font-bold text-primary truncate w-full">
                {project.title}
              </h4>
              <p className="text-white font-semibold px-2 line-clamp-3">
                {project.shortDescription}
              </p>
              {/* Tech Tags */}
              {project.technologies.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                  {project.technologies.slice(0, 4).map((tech, i) => (
                    <span
                      key={i}
                      className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="text-gray-400 text-xs py-0.5">
                      +{project.technologies.length - 4} more
                    </span>
                  )}
                </div>
              )}
              {/* Action Buttons */}
              <div className="flex gap-3 mt-2">
                {project.liveLink && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-white px-5 py-2 bg-primary rounded-full hover:opacity-60 transition-opacity"
                  >
                    <FaLink className="inline" />
                  </a>
                )}
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-primary px-5 py-2 border-2 border-primary rounded-full hover:bg-primary hover:text-white transition-all"
                  >
                    <FaGithub className="inline" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
