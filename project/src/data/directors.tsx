export interface DirectorImage {
  url: string;
  public_id: string;
}

export interface Director {
  _id: string;
  name: string;
  position: string;
  bio?: string;
  image: string | DirectorImage;
  order: number;
  isActive: boolean;
}

export const directorsData: Director[] = [
  {
    _id: '1',
    name: 'Mr. A. Rahman',
    position: 'Chairman',
    bio: `
      <p>
        Mr. A. Rahman is the visionary Chairman of Hindustan Builders with
        decades of leadership experience in real estate development.
      </p>
    `,
    image: '/images/c.png',
    order: 1,
    isActive: true,
  },
  {
    _id: '2',
    name: 'Mr. S. Khan',
    position: 'Managing Director',
    bio: `
      <p>
        Mr. S. Khan oversees strategic planning and execution of landmark
        projects across Karnataka.
      </p>
    `,
    image: '/images/c.png',
    order: 2,
    isActive: true,
  },
  {
    _id: '3',
    name: 'Ms. R. Shaikh',
    position: 'Executive Director',
    bio: `
      <p>
        Ms. Shaikh drives innovation, sustainability, and quality across all
        residential developments.
      </p>
    `,
    image: '/images/c.png',
    order: 3,
    isActive: true,
  },
  {
    _id: '4',
    name: 'Mr. N. Patel',
    position: 'Director – Projects',
    bio: `
      <p>
        Mr. Patel manages large-scale construction operations and project
        delivery timelines.
      </p>
    `,
    image: '/images/c.png',
    order: 4,
    isActive: true,
  },
];
