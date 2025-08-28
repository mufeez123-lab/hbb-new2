export interface Project {
  _id: string;
  title: string;
  description: string;
  status: 'ongoing' | 'completed' | 'upcoming';
  createdAt: string;
  updatedAt: string;
  images: string[];
  location?: string;
  client?: string;
  completionDate?: string;
  features?: string[];
  technologies?: string[];
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
} 