
export type CategoryType = "All" | "Framework" | "Tools" | "Design" | "Docs";

export interface Resource {
  id: number;
  name: string;
  category: Exclude<CategoryType, "All">
  url: string;
  description: string;
}

// 2. Resource Data with consistent types
export const DEV_RESOURCES: Resource[] = [
  {
    id: 1,
    name: "Next.js Docs",
    category: "Framework",
    url: "https://nextjs.org/docs",
    description: "The power of React with Server Components."
  },
  {
    id: 2,
    name: "Tailwind CSS",
    category: "Design",
    url: "https://tailwindcss.com",
    description: "Rapidly build modern websites without leaving your HTML."
  },
  {
    id: 3,
    name: "Lucide Icons",
    category: "Tools",
    url: "https://lucide.dev",
    description: "Beautiful & consistent icon toolkit made by the community."
  },
  {
    id: 4,
    name: "MDN Web Docs",
    category: "Docs",
    url: "https://developer.mozilla.org",
    description: "Resources for developers, by developers."
  }
];


export const CATEGORIES: CategoryType[] = ["All", "Framework", "Tools", "Design", "Docs"];