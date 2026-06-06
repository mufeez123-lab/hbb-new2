import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabaseClient';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Redirect directly to your upload asset engine upon success
      navigate('/admin/upload-engine');
    } catch (err: any) {
      setError(err.message || 'Invalid administrative credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 font-poppins px-4">
      <div className="max-w-md w-full bg-white border rounded-xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <img src="/logo-SVG.svg" className="h-14 mx-auto mb-3" alt="Logo" />
          <h2 className="text-2xl font-bold text-neutral-800">Admin Login</h2>
          <p className="text-xs text-neutral-500 mt-1">Hindustan Builders </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Administrative Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@company.com"
              className="w-full border rounded p-3 text-sm focus:outline-none focus:border-amber-600"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Security Token / Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border rounded p-3 text-sm focus:outline-none focus:border-amber-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-neutral-950 hover:bg-black text-white text-xs font-bold tracking-widest uppercase rounded transition duration-200"
          >
            {loading ? 'Verifying Identity...' : 'Authenticate Access'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;