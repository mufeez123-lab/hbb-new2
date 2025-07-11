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
    <div className="max-w-6xl mx-auto px-4 py-20">
      <Link
        to="/about"
        className="text-sm text-blue-600 mb-6 inline-block hover:underline"
      >
        &larr; Back to About
      </Link>

      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-6 items-start">
  {/* Profile Image */}
  <div className="md:w-1/3 w-full">
    <img
      src={imageURL}
      alt={director.name}
      className="w-full h-auto object-cover rounded-md border border-gray-200"
    />
  </div>

  {/* Info Section */}
  <div className="md:w-2/3 w-full">
    <h1 className="text-3xl font-bold text-neutral-800 mb-1">{director.name}</h1>
    <p className="text-lg text-gray-600 font-medium mb-4">{director.position}</p>

    {director.bio ? (
      <div
        className="text-sm leading-[1.9] text-justify text-neutral-800 space-y-4"
        dangerouslySetInnerHTML={{ __html: director.bio }}
      />
    ) : (
      <p className="text-neutral-500 italic">Bio not available.</p>
    )}
  </div>
</div>

    </div>
  );
};

export default BoardOfDirectorDetailPage;
