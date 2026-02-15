'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { TECH_STACK_DETAILS } from '@/lib/tech-stack-data';

import { skillsData, SkillItemData, SkillCategoryData } from '@/lib/skills-data';

const SkillItem = ({ skill, resolvedTheme }: { skill: SkillItemData; resolvedTheme?: string }) => {
  const techDetail = TECH_STACK_DETAILS[skill.name.toLowerCase()];
  const brandColor = techDetail
    ? resolvedTheme === 'dark'
      ? techDetail.darkmodecolor
      : techDetail.color
    : 'oklch(var(--muted-foreground))';

  return (
    <div
      className="skill-card"
      style={{ '--brand-color': brandColor } as React.CSSProperties}
      title={skill.name}
    >
      <Icon icon={skill.iconifyString} className="skill-icon" color={brandColor} />
      <span className="skill-name">{skill.name}</span>
    </div>
  );
};

const SkillCarousel = ({
  categoryData,
  isReverse,
  resolvedTheme,
}: {
  categoryData: SkillCategoryData;
  isReverse: boolean;
  resolvedTheme?: string;
}) => {
  const CategoryIcon = categoryData.categoryIcon;
  const duration = categoryData.skills.length * 3.5;

  return (
    <div className="carousel-section">
      <div className="carousel-header">
        <CategoryIcon className="category-icon" />
        <h3 className="category-title">{categoryData.category}</h3>
      </div>

      <div className="carousel-container">
        <div
          className={cn('carousel-track', isReverse && 'reverse')}
          style={{ '--duration': `${duration}s` } as React.CSSProperties}
        >
          {[...Array(2)].map((_, setIndex) => (
            <div key={setIndex} className="carousel-set" aria-hidden={setIndex === 1}>
              {categoryData.skills.map((skill, idx) => (
                <SkillItem
                  key={`${skill.name}-${idx}`}
                  skill={skill}
                  resolvedTheme={resolvedTheme}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export function SkillsSection({ className, id }: { className?: string; id?: string }) {
  const { theme } = useTheme();

  return (
    <section id={id} className={cn('skills-section', className)}>
      <div className="skills-container">
        <h2 className="skills-heading">
          My <span className="highlight">Technical Toolkit</span>
        </h2>

        <div className="skills-content">
          {skillsData.map((category, idx) => (
            <SkillCarousel
              key={category.category}
              categoryData={category}
              isReverse={idx % 2 !== 0}
              resolvedTheme={theme}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
