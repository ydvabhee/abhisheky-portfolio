export interface Experience {
  id: number;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string[];
  tech: string[];
}

export const experiences: Experience[] = [
  {
    id: 1,
    company: "Trippl",
    role: "Software Engineer",
    period: "June 2025 — Present",
    location: "Auckland, New Zealand",
    description: [
      "Full-Stack Developer leveraging React.js, Node.js, TypeScript, and Nest.js.",
      "Building scalable solutions and integrating AI/ML capabilities.",
      "Collaborating on innovative projects in a dynamic environment."
    ],
    tech: ["React.js", "Node.js", "TypeScript", "Nest.js", "Docker"]
  },
  {
    id: 2,
    company: "Superdash",
    role: "Backend Developer",
    period: "Nov 2024 — June 2025",
    location: "Bengaluru, India",
    description: [
      "Focused on backend architecture and API development.",
      "Optimized database performance and system reliability."
    ],
    tech: ["Backend Architecture", "APIs", "Database Optimization"]
  },
  {
    id: 3,
    company: "USEReady",
    role: "Software Engineer",
    period: "Feb 2023 — Nov 2024",
    location: "Bengaluru, India",
    description: [
      "Resolved a critical MFA issue, enabling faster product releases.",
      "Improved data migration speed by over 40% through Python automation scripts.",
      "Designed a microservice for high-precision reports within the Tableau dashboard.",
      "Managed merging of 10,000+ reports via secure SFTP with PGP encryption."
    ],
    tech: ["Python", "Tableau", "Automation", "Microservices"]
  },
  {
    id: 4,
    company: "Fleapo",
    role: "Full Stack Developer",
    period: "Sept 2021 — Feb 2023",
    location: "Kolkata, India",
    description: [
      "Developed scalable web apps using React.js/Next.js, TypeScript, Node.js, and MongoDB/PostgreSQL.",
      "Implemented micro-services architecture and load balancing.",
      "Automated video generation from user data using Adobe After Effects scripts.",
      "Integrated customization tools for Scentcraft's platform."
    ],
    tech: ["React.js", "Next.js", "Node.js", "MongoDB", "PostgreSQL", "Docker"]
  }
];
