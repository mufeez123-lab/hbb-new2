import { useState, useEffect } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// Interface aligned with the Supabase projects schema
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

const FeaturedProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        setLoading(true);
        // Query database looking explicitly for records flagged with featured status
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("status", "featured")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data) setProjects(data as Project[]);
      } catch (err) {
        console.error("Error retrieving featured records:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <header className="flex items-center mb-16">
          <div className="flex-grow h-px bg-gray-300"></div>
          <h2 className="px-6 text-lg uppercase tracking-[0.2em] font-medium text-gray-800 text-center">
            Our featured projects
          </h2>
          <div className="flex-grow h-px bg-gray-300"></div>
        </header>

        {loading ? (
          <div className="py-12 text-center text-sm font-poppins text-neutral-400 tracking-widest">
            SYNCHRONIZING FEATURED STAGE CAROUSEL...
          </div>
        ) : projects.length === 0 ? (
          <div className="py-12 text-center text-sm font-poppins text-neutral-500">
            No featured projects available at the moment.
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            navigation={{ prevEl, nextEl }}
            onBeforeInit={(swiper) => {
              const nav = swiper.params.navigation;
              if (nav && typeof nav !== "boolean") {
                nav.prevEl = prevEl;
                nav.nextEl = nextEl;
              }
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="relative group"
          >
            {projects.slice(0, 8).map((project) => {
              const isClickable = project.explore;
              const hasImage = project.images && project.images.length > 0;
              const displayImageUrl = hasImage ? project.images[0].url : "/images/placeholder.jpg";

              return (
                <SwiperSlide key={project.id} className="pb-12">
                  <div className="group/card">
                    <div
                      className={`border rounded-lg overflow-hidden shadow transition-all duration-500 bg-white ${
                        isClickable
                          ? "hover:shadow-xl cursor-pointer"
                          : "opacity-75 cursor-not-allowed"
                      }`}
                    >
                      {/* IMAGE */}
                      {isClickable ? (
                        <Link
                          to={`/projects/${project.id}`}
                          className="block overflow-hidden"
                        >
                          <img
                            src={displayImageUrl}
                            alt={project.name}
                            className="h-[36vh] w-full object-cover group-hover/card:scale-110 transition-transform duration-700"
                          />
                        </Link>
                      ) : (
                        <div className="relative overflow-hidden">
                          <img
                            src={displayImageUrl}
                            alt={project.name}
                            className="h-[36vh] w-full object-cover"
                          />
                          <span className="absolute top-3 right-3 bg-black font-poppins text-white text-xs px-3 py-1 rounded">
                            Sold Out
                          </span>
                        </div>
                      )}

                      {/* CONTENT */}
                      <div className="p-5">
                        <h3 className="text-lg font-display font-semibold">
                          {project.name}
                        </h3>

                        <p className="text-sm font-poppins text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin
                            size={14}
                            className="text-gray-400"
                            strokeWidth={2.5}
                          />
                          {project.location || "Location unassigned"}
                        </p>

                        <div className="flex justify-between items-center mt-4">
                          <span className="text-sm font-poppins font-semibold">
                            {project.price
                              ? `BUA: ${project.price} sqft`
                              : project.client}
                          </span>

                          {isClickable && (
                            <Link
                              to={`/projects/${project.id}`}
                              className="text-[#b57c6b] font-poppins flex items-center gap-1 hover:gap-2 transition-all"
                            >
                              More <ArrowRight size={14} />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default FeaturedProjects;