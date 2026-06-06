import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../config/supabaseClient";
import Demo from "../components/ScrollReavel.tsx/Demo1";
import SEO from "../components/seo/Seo";

// Match the structural alignment coming from the Supabase table
interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  status: string;
  explore: boolean;
  location: string;
  client: string;
  price?: string;
  images: { url: string; public_id: string }[];
}

const ProjectsPage = () => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data) setProjects(data as Project[]);
      } catch (err) {
        console.error("Error loading project repository data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <>
      <SEO
        title="Properties"
        description="At Hindustan Limited, Construction is a discipline of precision. Drawing on over four decades of experience, we execute complex architectural details with exactitude. We don’t just build for the handover; we build for the next generation."
        path="/projects"
        image="https://hindustanbuilders.in/images/villas-preview.jpg"
      />

      <Demo />

      <section className="py-28 bg-neutral-50">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-center font-poppins uppercase mb-8">
            Our Projects
          </h2>

          {loading ? (
            <div className="py-12 text-center text-sm font-poppins text-neutral-500 tracking-widest">
              LOADING COMPREHENSIVE ARCHIVE...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => {
                const isClickable = project.explore;
                const hasImage = project.images && project.images.length > 0;
                const displayImageUrl = hasImage ? project.images[0].url : "/images/placeholder.jpg";

                return (
                  <div
                    key={project.id}
                    onMouseEnter={() => setHovered(project.id)}
                    onMouseLeave={() => setHovered(null)}
                    className="group"
                  >
                    <div
                      className={`bg-white border rounded-lg shadow transition-all duration-500 ${
                        isClickable
                          ? "group-hover:scale-105 hover:shadow-xl cursor-pointer"
                          : "opacity-70 cursor-not-allowed"
                      }`}
                    >
                      {/* IMAGE SECTION */}
                      {isClickable ? (
                        <Link to={`/projects/${project.id}`}>
                          <img
                            src={displayImageUrl}
                            alt={project.name}
                            className="h-[33vh] w-full object-cover rounded-t-lg"
                          />
                        </Link>
                      ) : (
                        <div className="relative">
                          <img
                            src={displayImageUrl}
                            alt={project.name}
                            className="h-[33vh] w-full object-cover rounded-t-lg"
                          />
                          <span className="absolute top-3 right-3 font-poppins bg-black text-white text-xs px-3 py-1 rounded">
                            Sold Out
                          </span>
                        </div>
                      )}

                      {/* CONTENT */}
                      <div className="p-5">
                        <h3 className="font-semibold text-lg">
                          {project.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {project.location || "Location unassigned"}
                        </p>

                        <div className="flex justify-between items-center mt-4">
                          <span className="text-sm font-semibold">
                            {project.price
                              ? `BUA: ${project.price} sqft`
                              : project.client}
                          </span>

                          {isClickable && (
                            <Link
                              to={`/projects/${project.id}`}
                              className="text-[#b57c6b] text-sm font-medium hover:underline"
                            >
                              More
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ProjectsPage;