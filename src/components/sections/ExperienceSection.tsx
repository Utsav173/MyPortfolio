'use client';

import React, { useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Briefcase } from 'lucide-react';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { motion, useScroll, useTransform, useReducedMotion, Variants } from 'motion/react';
import { TECH_STACK_DETAILS } from '@/lib/tech-stack-data';
import { useTheme } from 'next-themes';

interface ExperienceSectionProps {
  className?: string;
  id?: string;
}

const getTechDetails = (techName: string) => {
  return (
    TECH_STACK_DETAILS[techName.toLowerCase()] || {
      icon: 'lucide:code',
      color: 'hsl(var(--muted-foreground))',
      name: techName,
    }
  );
};

const experiencesData = [
  {
    company: 'Zignuts Technolab, Gujarat, India',
    roles: [
      {
        title: 'Software Development Engineer',
        duration: 'August 2025 - Present',
      },
      {
        title: 'Web Developer',
        duration: 'January 2023 - July 2025',
      },
    ],
    responsibilities: [
      'Spearheaded development of critical project components, demonstrating advanced technical leadership.',
      'Engineered robust RESTful APIs using Node.js, Express.js, and PostgreSQL, improving response times via strategic query optimization and Redis caching.',
      'Developed highly scalable backend services and microservices, ensuring efficient processing of substantial daily data transactions.',
      'Led end-to-end design of complex, intuitive UIs with React.js, Redux, and Material-UI, enhancing user engagement and conversion.',
      'Integrated comprehensive security modules, including JWT-based authentication and Role-Based Access Control (RBAC).',
      'Mentoring and guiding junior engineers, fostering a culture of technical excellence.',
      'Driving the adoption of new technologies and best practices to enhance product quality and development efficiency.',
      'Collaborating with cross-functional teams to define, design, and ship new features.',
    ],
    keyProjects: [
      {
        name: 'Education Management Platform',
        tech: ['Node.js', 'Sails.js', 'PostgreSQL', 'AWS SQS'],
      },
      {
        name: 'Cloud Procurement & Bidding Platform',
        tech: ['Node.js', 'Express.js', 'Socket.io', 'AWS'],
      },
      {
        name: 'Financial Transaction Management System',
        tech: ['Node.js', 'Sails.js', 'SQL', 'Recharts'],
      },
      {
        name: 'Large-Scale Organization Management SaaS',
        tech: ['React.js', 'Redux', 'Styled Components', 'Webpack'],
      },
      {
        name: 'Restaurant Inventory Management System',
        tech: ['Node.js', 'Strapi v4', 'PostgreSQL', 'JWT'],
      },
    ],
  },
];

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(3px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
  },
};

const timelineItemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] },
  },
};

const timelineDotVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
  },
};

const timelineContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

export function ExperienceSection({ className, id }: ExperienceSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { theme } = useTheme();

  const { scrollYProgress } = useScroll({
    target: timelineContainerRef,
    offset: ['start end', 'end start'],
  });

  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={cn(
        'bg-secondary/20 dark:bg-secondary/5 py-20 md:py-28 lg:py-32 w-full',
        className
      )}
    >
      <div className="container mx-auto px-4">
        <motion.h2
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          variants={shouldReduceMotion ? {} : headingVariants}
          viewport={{ once: true, amount: 0.3 }}
          className="mb-16 sm:mb-20 text-center text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter"
        >
          Professional <span className="text-primary">Journey</span>
        </motion.h2>
        <motion.div
          ref={timelineContainerRef}
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          variants={shouldReduceMotion ? {} : timelineContainerVariants}
          viewport={{ once: true, amount: 0.1 }}
          className="relative max-w-3xl mx-auto"
        >
          <motion.div
            className="absolute top-0 left-[calc(0.75rem-1px)] sm:left-[calc(0.875rem-1px)] md:left-[calc(1rem-1.5px)] w-[2px] md:w-[3px] bg-primary/50 origin-top h-full"
            style={shouldReduceMotion ? { scaleY: 1 } : { scaleY: lineScaleY }}
            aria-hidden="true"
          />
          {experiencesData.map((exp, index) => {
            return (
              <motion.div
                key={`${exp.company}-${index}`}
                variants={shouldReduceMotion ? {} : timelineItemVariants}
                className="relative pl-8 sm:pl-10 md:pl-12 mb-10 sm:mb-12 last:mb-0 group/expitem"
              >
                <motion.div
                  variants={shouldReduceMotion ? {} : timelineDotVariants}
                  className="absolute left-0 top-1 size-6 sm:size-7 md:size-8 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 md:border-4 border-background z-10"
                  style={{ transformOrigin: 'center center' }}
                >
                  <Briefcase className="size-3 sm:size-3.5 md:size-4 text-primary-foreground" />
                </motion.div>
                <div className="ml-1 sm:ml-2">
                  <p className="text-primary font-medium text-sm sm:text-base md:text-lg mb-3 sm:mb-4">
                    {exp.company}
                  </p>
                  {exp.roles.map((role, roleIndex) => (
                    <div key={roleIndex} className="mb-4">
                      <p className="text-xs text-muted-foreground mb-1 sm:mb-1.5 font-mono tracking-wide">
                        {role.duration}
                      </p>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-0.5 sm:mb-1">
                        {role.title}
                      </h3>
                    </div>
                  ))}
                  <ul className="list-disc list-outside ml-4 sm:ml-5 space-y-1.5 sm:space-y-2 text-muted-foreground mb-4 sm:mb-6 text-[0.85rem] sm:text-[0.9rem] md:text-[0.95rem] leading-relaxed">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                  {exp.keyProjects && exp.keyProjects.length > 0 && (
                    <>
                      <h4 className="text-sm md:text-md font-semibold text-foreground mb-2 sm:mb-2.5 mt-4 sm:mt-5">
                        Key Projects:
                      </h4>
                      <div className="space-y-2.5 sm:space-y-3">
                        {exp.keyProjects.map((project, projectIndex) => (
                          <div
                            key={`${project.name}-${projectIndex}`}
                            className="p-2.5 sm:p-3 md:p-4 border rounded-md md:rounded-lg bg-card/60 dark:bg-card/30 shadow-sm hover:border-primary/40 transition-colors duration-200 group/projectcard"
                          >
                            <p className="font-semibold text-card-foreground text-[0.85rem] sm:text-sm md:text-base">
                              {project.name}
                            </p>
                            <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-1.5 sm:mt-2">
                              {project.tech.map((t, techIndex) => (
                                <Badge
                                  key={`${t}-${techIndex}`}
                                  variant="outline"
                                  className="text-[0.65rem] border-none sm:text-[0.7rem] md:text-xs px-1.5 sm:px-2 py-0.5 border-primary/40 text-primary/80 bg-primary/5 hover:bg-primary/10 transition-all duration-150 group-hover/projectcard:shadow-sm flex items-center gap-1"
                                >
                                  <Icon
                                    icon={getTechDetails(t).icon}
                                    className="size-2.5 sm:size-3"
                                    style={{
                                      color:
                                        theme === 'dark' && getTechDetails(t).darkmodecolor
                                          ? getTechDetails(t).darkmodecolor
                                          : getTechDetails(t).color,
                                    }}
                                  />
                                  {t}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
