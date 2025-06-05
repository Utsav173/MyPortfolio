import PageClient from "@/components/layout/PageClient";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import FooterSection from "@/components/sections/FooterSection";

export default async function HomePage() {
  return (
    <PageClient>
      <main className="relative z-0 flex-grow w-full">
        <HeroSection id="hero" className="content-section" />
        <AboutSection id="about" className="content-section" />
        <SkillsSection id="skills" className="content-section" />
        <ExperienceSection id="experience" className="content-section" />
        <ProjectsSection id="projects" className="content-section" />
        <ContactSection id="contact" className="content-section" />
        <FooterSection />
      </main>
    </PageClient>
  );
}
