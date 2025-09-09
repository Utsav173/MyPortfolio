
export interface Project {
  id: number | string;
  name: string;
  description: string;
  repoUrl: string;
  liveUrl?: string | null;
  imageUrl?: string;
  projectType: string;
  techStack: string[];
  keyFeatures: string[];
  githubStats: {
    stars: number;
    forks: number;
  };
}
