import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { getFeaturedProjects } from "@/lib/github";

export default async function Home() {
  const featuredProjects = await getFeaturedProjects();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <ProjectsSection projects={featuredProjects} />
        <ContactSection />
        <footer className="py-8 border-t border-border/40">
          <div className="container flex flex-col items-center justify-center gap-4 md:h-16 md:flex-row mx-auto">
            <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
              Designed & Built by Utsav Khatri. © {new Date().getFullYear()}.
              All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
