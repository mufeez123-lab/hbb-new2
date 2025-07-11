import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';

interface DirectorImage {
  url: string;
  public_id: string;
}

interface Director {
  _id: string;
  name: string;
  position: string;
  bio?: string;
  image: string | DirectorImage;
  order: number;
  isActive: boolean;
}

const BoardOfDirectorDetailPage = () => {
  const { id } = useParams();
  const [director, setDirector] = useState<Director | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDirector = async () => {
      try {
        const res = await api.get(`/board/${id}`);
        setDirector(res.data);
        setLoading(false);
      } catch (err) {
        setError('Unable to fetch director details.');
        setLoading(false);
      }
    };

    fetchDirector();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-16">Loading...</div>;
  }

  if (error || !director) {
    return <div className="text-center mt-16 text-red-600">{error}</div>;
  }

  const imageURL =
    typeof director.image === 'object' && director.image.url
      ? director.image.url
      : '/default-avatar.png';

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <Link to="/about" className="text-sm text-blue-600 mb-4 inline-block">&larr; Back to About</Link>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col sm:flex-row gap-6">
        <div className="flex-shrink-0 w-full sm:w-1/2 h-80 overflow-hidden">
          <img
            src={imageURL}
            alt={director.name}
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div className="flex flex-col justify-center p-6">
          <h2 className="text-2xl font-bold text-[#8a6c1a]">{director.name}</h2>
          <p className="text-sm text-neutral-600 mb-4">{director.position}</p>
          {director.bio ? (
            <p className="text-neutral-700 leading-relaxed">{director.bio}</p>
          ) : (
            <p className="text-neutral-500 italic">Bio not available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardOfDirectorDetailPage;
