export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  year: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Trippl Platform",
    category: "Software Engineering",
    description: "Full-Stack development using React.js, Node.js, TypeScript, and Nest.js for a scalable platform.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2400&auto=format&fit=crop",
    year: "2025"
  },
  {
    id: 2,
    title: "Tableau Microservice",
    category: "Backend Engineering",
    description: "Designed a microservice for high-precision reports within the Tableau dashboard, resolving critical data accuracy issues.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2400&auto=format&fit=crop",
    year: "2023"
  },
  {
    id: 3,
    title: "Video Automation Tool",
    category: "Automation",
    description: "Automated video generation from user data with an ae-script for Adobe After Effects, increasing content production efficiency.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2400&auto=format&fit=crop",
    year: "2022"
  },
  {
    id: 4,
    title: "Scentcraft Customization",
    category: "Full Stack",
    description: "Integrated customization tools for Scentcraft's platform to enhance user experience and enable personalized fragrances creation.",
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2400&auto=format&fit=crop",
    year: "2022"
  }
];
