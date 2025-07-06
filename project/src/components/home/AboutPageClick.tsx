import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useState, useEffect } from 'react';
import api from '../../services/api';

interface DirectorImage {
  url: string;
  public_id: string;
}

interface Director {
  _id: string;
  name: string;
  position: string;
  image: string | DirectorImage;
  order: number;
  isActive: boolean;
}

interface AboutStats {
  yearsOfExperience: number;
  completedProjects: number;
  happyClients: number;
  awardsWon: number;
}

interface CountUpNumberProps {
  end: number;
  suffix?: string;
}

const CountUpNumber = ({ end, suffix = '' }: CountUpNumberProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / 2000, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end]);

  return (
    <div className="text-5xl font-light text-neutral-900 mb-2">
      {count}
      <span className="text-[#8a6c1a] font-light">{suffix}</span>
    </div>
  );
};

const AboutPageClick = () => {
  const [directors, setDirectors] = useState<Director[]>([]);
  const [stats, setStats] = useState<AboutStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [directorsRes, statsRes] = await Promise.all([
          api.get('/board'),
          api.get('/about'),
        ]);
        setDirectors(directorsRes.data);
        setStats(statsRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load board members or stats');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white pb-2 pt-32"
    >
      <Helmet>
        <meta
          name="description"
          content="Learn about Hindustan Bawa Builders' legacy of excellence in real estate development, our values, and commitment to quality construction."
        />
      </Helmet>

      <div className="container mx-auto px-4 mt-22">
        <h2 className="text-sm font-bold font-poppins tracking-widest uppercase text-[#8a6c1a] mb-4 ml-1">
          About Hindustan Bawa Builders
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-2">
              <div className="border-r border-neutral-300 pr-4 mr-4">
                <h3 className="text-2xl md:text-2xl font-poppins text-neutral-900">
                  Building Landmarks, Crafting Lifestyles
                </h3>
              </div>
            </div>

            <p className="text-base text-neutral-600 leading-relaxed mb-3 font-poppins">
              For over two decades, Hindustan Bawa Builders has been at the forefront of India's real estate development,
              creating landmark properties that combine exceptional quality, innovative design, and sustainable practices.
              Our commitment to excellence has earned us the trust of countless families and businesses who call our developments home.
            </p>
          </div>

          <div className="lg:col-span-1 border-l border-neutral-300 pl-4">
            {stats ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center mr-3">
                  <CountUpNumber end={stats.yearsOfExperience} suffix="+" />
                  <p className="text-neutral-600 text-sm mt-1">Years of Excellence</p>
                </div>
                <div className="text-center ml-3">
                  <CountUpNumber end={stats.completedProjects} suffix="+" />
                  <p className="text-neutral-600 text-sm mt-1">Projects Completed</p>
                </div>
                <div className="text-center mr-3">
                  <CountUpNumber end={stats.happyClients} suffix="+" />
                  <p className="text-neutral-600 text-sm mt-1">Happy Families</p>
                </div>
                <div className="text-center ml-3">
                  <CountUpNumber end={stats.awardsWon} suffix="+" />
                  <p className="text-neutral-600 text-sm mt-1">Awards Won</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-neutral-500">Loading stats...</p>
            )}
          </div>
        </div>

        {/* Board of Directors Section */}
        <div className="mt-16">
          <h3 className="text-xl sm:text-2xl font-poppins text-neutral-900 mb-8 text-center">
            Board of Directors
          </h3>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-700 mx-auto"></div>
              <p className="mt-4 text-neutral-600">Loading board members...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : directors.length === 0 ? (
            <div className="text-center py-8 text-neutral-600">
              Our leadership team is being updated — check back shortly.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {directors.map((director) => {
                const imageURL =
                  typeof director.image === 'object' && director.image.url
                    ? director.image.url
                    : '/default-avatar.png';

                return (
                  <div key={director._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="w-full mt-0 bg-neutral-100 overflow-hidden h-80 sm:h-[22rem] lg:h-72">
                      <img
                        src={imageURL}
                        alt={director.name || 'Director'}
                        className="w-full h-full object-cover object-top transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = '/default-avatar.png';
                        }}
                      />
                    </div>
                    <div className="p-4 text-center">
                      <h4 className="text-lg font-semibold text-neutral-800">
                        {director.name}
                      </h4>
                      <p className="text-neutral-600 text-sm">{director.position}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AboutPageClick;
