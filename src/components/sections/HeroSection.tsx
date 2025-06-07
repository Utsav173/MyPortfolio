// components/sections/HeroSection.tsx

'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, Variants } from 'motion/react';
import { ArrowRight, DownloadCloud, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useScrollToSection } from '@/hooks/use-scroll-to-section';

const heroVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.1, delayChildren: 0.2 },
	},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
	visible: {
		opacity: 1,
		y: 0,
		filter: 'blur(0px)',
		transition: { duration: 0.7, ease: [0.33, 1, 0.68, 1] },
	},
};

const nameContainerVariants: Variants = {
	hidden: {},
	visible: {
		transition: { staggerChildren: 0.06, delayChildren: 0.3 },
	},
};

const nameCharVariants: Variants = {
	hidden: { opacity: 0, y: 25, scale: 0.9, rotateX: -30 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		rotateX: 0,
		transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] },
	},
};

const scrollIndicatorVariants: Variants = {
	hidden: { opacity: 0, y: -10 },
	visible: {
		opacity: 0.6,
		y: 10,
		transition: {
			opacity: { duration: 0.5, ease: 'easeOut', delay: 2 },
			y: {
				from: 0,
				duration: 0.75,
				ease: 'circInOut',
				delay: 2.5,
				repeat: Infinity,
				repeatType: 'reverse',
			},
		},
	},
};

const buttonHoverVariants: Variants = {
	hover: {
		scale: 1.02,
		y: -2,
		transition: { duration: 0.2, ease: 'easeOut' },
	},
	tap: {
		scale: 0.98,
		transition: { duration: 0.1 },
	},
};

export function HeroSection({
	className,
	id,
}: {
	className?: string;
	id?: string;
}) {
	const shouldReduceMotion = useReducedMotion();
	const nameParts = 'Utsav Khatri'.split('');

	const { scrollTo } = useScrollToSection();

	const handleProjectScroll = useCallback(
		(e: React.MouseEvent<HTMLAnchorElement>) => {
			e.preventDefault();
			scrollTo('#projects');
		},
		[scrollTo]
	);

	return (
		<motion.section
			id={id}
			className={cn(
				'relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-transparent px-4 text-center',
				className
			)}
			variants={shouldReduceMotion ? {} : heroVariants}
			initial={shouldReduceMotion ? undefined : 'hidden'}
			animate={shouldReduceMotion ? undefined : 'visible'}
			aria-labelledby="hero-heading"
		>
			<div className="container relative z-10 mx-auto">
				<motion.p
					variants={shouldReduceMotion ? {} : itemVariants}
					className="mb-3 text-base font-semibold text-primary md:text-lg"
				>
					Hello, I'm
				</motion.p>
				<motion.h1
					id="hero-heading"
					aria-label="Utsav Khatri"
					variants={shouldReduceMotion ? {} : nameContainerVariants}
					style={{ perspective: '800px' }}
					className={cn(
						'my-2 select-none font-bold tracking-tighter relative',
						'text-[2.75rem] leading-tight sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl'
					)}
				>
					<div
						className="hero-name-glow absolute inset-0 -z-10 pointer-events-none"
						aria-hidden="true"
					>
						Utsav Khatri
					</div>
					<div className="hero-name-gradient relative z-10">
						{nameParts.map((char, index) => (
							<motion.span
								key={index}
								variants={shouldReduceMotion ? {} : nameCharVariants}
								className="inline-block"
								style={char === ' ' ? { width: '0.25em' } : {}}
							>
								{char === ' ' ? '\u00A0' : char}
							</motion.span>
						))}
					</div>
				</motion.h1>
				<motion.p
					variants={shouldReduceMotion ? {} : itemVariants}
					className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:mt-8 md:text-xl"
				>
					A{' '}
					<span className="font-semibold text-primary">
						Full Stack Developer
					</span>{' '}
					based in Gujarat, India, crafting high-performance web experiences.
				</motion.p>

				<motion.div
					variants={shouldReduceMotion ? {} : itemVariants}
					className={cn(
						'mt-8 flex select-none flex-col items-center justify-center gap-4 sm:flex-row md:mt-10'
					)}
					role="group"
					aria-label="Primary actions"
				>
					{/* Primary CTA Button */}
					<motion.div
						variants={shouldReduceMotion ? {} : buttonHoverVariants}
						whileHover={shouldReduceMotion ? undefined : 'hover'}
						whileTap={shouldReduceMotion ? undefined : 'tap'}
					>
						<Button
							size="lg"
							asChild
							className={cn(
								'group relative h-auto overflow-hidden rounded-full border-0 bg-gradient-to-r from-primary via-primary to-primary/80 px-8 py-4 text-base font-semibold text-primary-foreground shadow-2xl shadow-primary/25 transition-all duration-300 ease-out hover:shadow-2xl hover:shadow-primary/40 sm:px-10 sm:py-4',
								'before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-white/20 before:via-transparent before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100',
								'after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-white/20 after:translate-x-[-100%] after:transition-transform after:duration-700 hover:after:translate-x-[100%]'
							)}
						>
							<Link
								href="#projects"
								onClick={handleProjectScroll}
								className="relative z-10 flex items-center justify-center"
								aria-label="Explore my projects"
							>
								<Sparkles className="mr-2 size-5 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
								Explore Projects
								<ArrowRight className="ml-2.5 size-5 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:scale-110" />
							</Link>
						</Button>
					</motion.div>

					{/* Secondary CTA Button */}
					<motion.div
						variants={shouldReduceMotion ? {} : buttonHoverVariants}
						whileHover={shouldReduceMotion ? undefined : 'hover'}
						whileTap={shouldReduceMotion ? undefined : 'tap'}
					>
						<Button
							size="lg"
							variant="outline"
							asChild
							className={cn(
								'group relative h-auto overflow-hidden rounded-full border-2 border-primary/30 bg-background/50 px-8 py-4 text-base font-semibold backdrop-blur-sm transition-all duration-300 ease-out hover:border-primary hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/20 sm:px-10 sm:py-4',
								'before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-primary/5 before:via-primary/10 before:to-primary/5 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100',
								'text-primary dark:border-primary/40 dark:bg-background/80 dark:hover:border-primary/80 dark:hover:bg-primary/10'
							)}
						>
							<a
								href="/resume_utsav_khatri.pdf"
								target="_blank"
								rel="noopener noreferrer"
								download="resume_utsav_khatri.pdf"
								className="relative z-10 flex items-center justify-center"
								aria-label="Download Utsav Khatri's Resume"
							>
								<DownloadCloud className="mr-2.5 size-5 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" />
								Download Resume
								<div className="ml-2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
									<svg
										width="4"
										height="4"
										viewBox="0 0 4 4"
										fill="none"
										className="fill-current"
									>
										<circle cx="2" cy="2" r="2" />
									</svg>
								</div>
							</a>
						</Button>
					</motion.div>
				</motion.div>
			</div>

			<motion.div
				variants={shouldReduceMotion ? {} : scrollIndicatorVariants}
				className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
				aria-hidden="true"
			>
				<div className="relative">
					<div className="absolute inset-0 rounded-full bg-primary/20 blur-md animate-pulse" />
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="28"
						height="28"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="relative lucide lucide-arrow-down text-muted-foreground/70 transition-colors hover:text-primary"
					>
						<path d="M12 5v14" />
						<path d="m19 12-7 7-7-7" />
					</svg>
				</div>
			</motion.div>
		</motion.section>
	);
}
