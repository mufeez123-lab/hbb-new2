import React, { createContext, useContext, useState, useEffect } from 'react';

interface Project {
  _id: string;
  name: string;
  description: string;
  images: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
  client: string;
  location: string;
  completionDate?: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

// Sample projects data
const initialProjects: Project[] = [
  {
    _id: '1',
    name: 'Bawa Heights',
    description: 'Luxury apartments with modern amenities and breathtaking sea views.',
    status: 'ongoing',
    images: ['https://images.pexels.com/photos/1082326/pexels-photo-1082326.jpeg'],
    client: 'Bawa Developers',
    location: 'Mumbai',
    completionDate: '2024-06-30',
    category: 'Apartment',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'Bawa Business Park',
    description: 'Premium office spaces designed for modern businesses with state-of-the-art facilities.',
    status: 'completed',
    images: ['https://images.pexels.com/photos/158571/architecture-about-building-modern-158571.jpeg'],
    client: 'Bawa Developers',
    location: 'Mumbai',
    completionDate: '2023-06-30',
    category: 'Office',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '3',
    name: 'Bawa Royal Villas',
    description: 'Exclusive villas surrounded by nature offering privacy and luxury living.',
    status: 'upcoming',
    images: ['https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg'],
    client: 'Bawa Developers',
    location: 'Mumbai',
    completionDate: '2025-06-30',
    category: 'Villa',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  addProject: (project: Omit<Project, '_id' | 'createdAt' | 'updatedAt'>) => Promise<Project>;
  updateProject: (id: string, project: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/projects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (project: Omit<Project, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(project)
      });
      if (!response.ok) throw new Error('Failed to add project');
      const newProject = await response.json();
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateProject = async (id: string, project: Partial<Project>) => {
    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(project)
      });
      if (!response.ok) throw new Error('Failed to update project');
      const updatedProject = await response.json();
      setProjects(prev => prev.map(p => p._id === id ? updatedProject : p));
      return updatedProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete project');
      setProjects(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <ProjectContext.Provider value={{
      projects,
      loading,
      error,
      fetchProjects,
      addProject,
      updateProject,
      deleteProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}; 