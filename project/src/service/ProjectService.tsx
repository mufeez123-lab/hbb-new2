import projects from '../data/projects.json';

export interface Project {
  _id: string;
  name: string;
  description: string;
  images: { url: string; public_id: string }[];
  category: string;
  status: string;
  location: string;
  client: string;
  price?: string;
  amenities?: string[];
  specifications?: {
    title: string;
    description?: string[];
  }[];
  gallery?: { url: string; public_id: string }[];
}

export const getAllProjects = (): Project[] => projects;

export const getFeaturedProjects = (): Project[] =>
  projects.filter(p => p.status === 'featured');

export const getProjectById = (id: string): Project | undefined =>
  projects.find(p => p._id === id);
