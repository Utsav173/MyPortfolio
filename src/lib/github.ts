import { type Project } from "@/components/sections/ProjectCard";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  languages_url: string;
  topics: string[];
  owner: {
    login: string;
  };
}

interface RepoLanguageData {
  [language: string]: number;
}

const featuredRepoDetails: Array<{
  name: string;
  owner: string;
  imageUrl?: string;
  customHomepage?: string;
  displayName?: string;
  displayDescription?: string;
  customTechStack?: string[];
}> = [
  {
    name: "expense-tracker",
    owner: "Utsav173",
    displayName: "Expense Tracker Pro",
    displayDescription:
      "AI-enhanced finance management with intelligent expense categorization, secure JWT auth, and Recharts data visualization.",
    imageUrl: "/images/projects/expense-pro.webp",
    customHomepage: "http://pro-expense.vercel.app/",
    customTechStack: [
      "Next.js",
      "TypeScript",
      "Hono.js",
      "Drizzle ORM",
      "PostgreSQL",
      "Gemini AI",
    ],
  },
  {
    name: "fal-flux-generation",
    owner: "Utsav173",
    displayName: "AI Image Generator (Flux)",
    displayDescription:
      "On-demand AI image generation using Next.js, TypeScript, and the Fal.ai API (Flux Model) for efficient backend processing.",
    imageUrl: "/images/projects/flux-image.webp",
    customHomepage: "https://fal-flux-generation.vercel.app",
    customTechStack: ["Next.js", "TypeScript", "Fal.ai API", "Tailwind CSS"],
  },
  {
    name: "blog-sync",
    owner: "Utsav173",
    displayName: "MDX Blog & IPO Tracker",
    displayDescription:
      "Performance-centric Next.js blog with MDX & SSG. Features a dynamic dashboard for IPO Grey Market Premiums.",
    imageUrl: "/images/projects/blog-sync.webp",
    customHomepage: "https://blog-sync.vercel.app",
    customTechStack: [
      "Next.js",
      "TypeScript",
      "MDX",
      "Tailwind CSS",
      "Data Scraping",
    ],
  },
  {
    name: "ai-card-gen",
    owner: "Utsav173",
    displayName: "AI Business Card Generator",
    displayDescription:
      "Generate professional business card designs using AI. Features various templates and customization options.",
    imageUrl: "/images/projects/ai-card-maker.webp",
    customHomepage: "https://ai-card-maker.vercel.app/",
    customTechStack: ["Next.js", "TypeScript", "AI", "Vercel"],
  },
  {
    name: "ipo-gmp-pro",
    owner: "Utsav173",
    displayName: "IPO GMP Pro Dashboard",
    displayDescription:
      "Advanced dashboard for tracking IPO Grey Market Premiums, allotment status, and subscription data.",
    customHomepage: "https://ipo-gmp-pro.pages.dev",
    customTechStack: [
      "Next.js",
      "TypeScript",
      "Cloudflare Pages",
      "Data Scraping",
    ],
  },
  {
    name: "gtu-imp",
    owner: "Utsav173",
    displayName: "GTU IMP Study Portal",
    displayDescription:
      "A comprehensive portal for GTU students providing important questions, study materials, and exam resources.",
    customHomepage: "https://gtu-imp.vercel.app",
    customTechStack: ["Next.js", "TypeScript", "Vercel", "Educational"],
  },
];

const GITHUB_API_URL = "https://api.github.com";
const GITHUB_USERNAME = "Utsav173";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const baseHeaders: HeadersInit = {
  Accept: "application/vnd.github.v3+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

if (GITHUB_TOKEN) {
  baseHeaders.Authorization = `Bearer ${GITHUB_TOKEN}`;
} else {
  console.warn(
    "GITHUB_TOKEN environment variable is not set. GitHub API requests will be unauthenticated and subject to stricter rate limits. This may cause issues with fetching project data."
  );
}

async function fetchGitHubData<T>(
  url: string,
  cacheOption: RequestCache = "no-store"
): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: baseHeaders,
      cache: cacheOption,
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `Failed to fetch GitHub data from ${url}: ${response.status} ${response.statusText} - Details: ${errorBody}`
      );
      return null;
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error(`Error during fetch request to ${url}:`, error);
    return null;
  }
}

async function fetchGitHubRepo(
  owner: string,
  repoName: string
): Promise<GitHubRepo | null> {
  return fetchGitHubData<GitHubRepo>(
    `${GITHUB_API_URL}/repos/${owner}/${repoName}`
  );
}

async function fetchUserRepos(username: string): Promise<GitHubRepo[]> {
  const data = await fetchGitHubData<GitHubRepo[]>(
    `${GITHUB_API_URL}/users/${username}/repos?type=public&sort=updated&per_page=100`
  );
  return data || [];
}

async function fetchRepoLanguages(languagesUrl: string): Promise<string[]> {
  const data = await fetchGitHubData<RepoLanguageData>(languagesUrl);
  return data ? Object.keys(data) : [];
}

async function mapRepoToProject(
  repoData: GitHubRepo,
  customDetails?: (typeof featuredRepoDetails)[0]
): Promise<Project> {
  let techStack: string[] = [];

  if (
    customDetails?.customTechStack &&
    customDetails.customTechStack.length > 0
  ) {
    techStack = customDetails.customTechStack;
  } else if (repoData.languages_url) {
    const fetchedLanguages = await fetchRepoLanguages(repoData.languages_url);
    if (fetchedLanguages.length > 0) {
      techStack = fetchedLanguages;
    } else if (repoData.language) {
      techStack = [repoData.language];
    } else {
      techStack = repoData.topics || []; // Fallback to topics if no specific languages
    }
  } else if (repoData.language) {
    techStack = [repoData.language];
  } else {
    techStack = repoData.topics || []; // Fallback to topics
  }

  return {
    id: repoData.id,
    name: customDetails?.displayName || repoData.name,
    description: customDetails?.displayDescription || repoData.description,
    html_url: repoData.html_url,
    homepage: customDetails?.customHomepage || repoData.homepage,
    stargazers_count: repoData.stargazers_count,
    forks_count: repoData.forks_count,
    language: repoData.language,
    topics: repoData.topics || [],
    imageUrl: customDetails?.imageUrl,
    techStack:
      techStack.length > 0
        ? techStack
        : repoData.language
        ? [repoData.language]
        : [], // Ensure techStack is never totally empty if a primary language exists
  };
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects: Project[] = [];
  console.log("Attempting to fetch featured projects...");

  for (const detail of featuredRepoDetails) {
    const repoData = await fetchGitHubRepo(detail.owner, detail.name);
    if (repoData) {
      projects.push(await mapRepoToProject(repoData, detail));
    } else {
      console.warn(
        `Warning: Could not fetch data for featured repository: ${detail.owner}/${detail.name}. It might be private, misspelled, or the API request failed.`
      );
    }
  }
  console.log(
    `Successfully fetched ${projects.length} out of ${featuredRepoDetails.length} defined featured projects.`
  );
  return projects;
}

export async function getRemainingPublicProjects(): Promise<Project[]> {
  console.log(
    "Attempting to fetch remaining public projects for user:",
    GITHUB_USERNAME
  );

  const allUserRepos = await fetchUserRepos(GITHUB_USERNAME);
  if (!allUserRepos || allUserRepos.length === 0) {
    console.warn(
      `No public repositories found for user ${GITHUB_USERNAME}, or the API request failed.`
    );
    return [];
  }

  console.log(
    `Fetched a total of ${allUserRepos.length} public repositories for ${GITHUB_USERNAME}.`
  );

  const featuredRepoFullNames = new Set(
    featuredRepoDetails.map((fr) => `${fr.owner}/${fr.name}`.toLowerCase())
  );
  const remainingProjectsPromises: Promise<Project>[] = [];

  for (const repoData of allUserRepos) {
    if (!featuredRepoFullNames.has(repoData.full_name.toLowerCase())) {
      remainingProjectsPromises.push(mapRepoToProject(repoData));
    }
  }

  const remainingProjects = await Promise.all(remainingProjectsPromises);
  console.log(
    `Identified ${remainingProjects.length} remaining public projects after filtering out the ${featuredRepoDetails.length} featured ones.`
  );
  return remainingProjects;
}
