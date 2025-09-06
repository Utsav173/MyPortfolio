'use client';

import React, { useCallback, useState, useRef, memo } from 'react';
import { motion, useReducedMotion, Variants } from 'motion/react';
import { z } from 'zod';
import { toast as sonnerToast } from 'sonner';
import { Mail, Phone, SendHorizonal, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { contactFormSchema } from '@/lib/validations';
import { cn } from '@/lib/utils';

type FormData = z.infer<typeof contactFormSchema>;
type FormErrors = Partial<Record<keyof FormData, string[] | undefined>>;

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    role="img"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>GitHub</title>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.334-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.803 5.625-5.475 5.92.43.37.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 21.796 24 17.297 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    role="img"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>LinkedIn</title>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.327-.027-3.037-1.849-3.037-1.851 0-2.132 1.445-2.132 2.939v5.667H9.358V9h3.414v1.561h.049c.476-.899 1.637-1.849 3.37-1.849 3.602 0 4.267 2.369 4.267 5.455v6.285zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.554V9h3.565v11.452zM22.225 0H1.771C.792 0 0 .771 0 1.723v20.549C0 23.229.792 24 1.771 24h20.451C23.2 24 24 23.229 24 22.271V1.723C24 .771 23.2 0 22.225 0z" />
  </svg>
);

const sectionVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

interface SocialLink {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'mailto:khatriutsav40@gmail.com',
    icon: Mail,
    text: 'khatriutsav40@gmail.com',
  },
  {
    href: 'https://linkedin.com/in/utsav-khatri-in',
    icon: LinkedinIcon,
    text: 'Utsav Khatri',
  },
  { href: 'https://github.com/Utsav173', icon: GithubIcon, text: 'Utsav173' },
  { href: 'tel:+916355321582', icon: Phone, text: '+91 6355321582' },
];

const ContactSectionComponent = ({ className, id }: { className?: string; id?: string }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name as keyof FormData]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setErrors({});
      const validationResult = contactFormSchema.safeParse(formData);
      if (!validationResult.success) {
        const fieldErrors = validationResult.error.flatten().fieldErrors;
        setErrors(fieldErrors);
        sonnerToast.error('Validation Failed', {
          description: 'Please check the form for errors.',
        });
        return;
      }
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validationResult.data),
        });
        const result = await response.json();
        if (response.ok) {
          sonnerToast.success('Message Sent!', {
            description: result.message || "Thanks for reaching out. I'll get back to you soon.",
          });
          setFormData({ name: '', email: '', message: '' });
        } else {
          sonnerToast.error('Submission Failed', {
            description: result.message || 'Could not send your message. Please try again.',
          });
          if (result.errors) setErrors(result.errors);
        }
      } catch (error) {
        sonnerToast.error('Submission Error', {
          description: 'An unexpected error occurred. Please try again later.',
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData]
  );

  return (
    <motion.section
      id={id}
      className={cn('bg-secondary/20 py-20 dark:bg-secondary/5 md:py-28 lg:py-32', className)}
      variants={shouldReduceMotion ? undefined : sectionVariants}
      initial={shouldReduceMotion ? undefined : 'hidden'}
      whileInView={shouldReduceMotion ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.15 }}
      aria-labelledby="contact-heading"
    >
      <div className="container mx-auto px-4">
        <motion.h2
          id="contact-heading"
          variants={shouldReduceMotion ? undefined : itemVariants}
          className="mb-16 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
        >
          Let&apos;s <span className="text-primary">Connect</span>
        </motion.h2>
        <div className="grid items-start gap-12 md:grid-cols-2 lg:gap-20">
          <motion.div variants={shouldReduceMotion ? undefined : itemVariants}>
            <h3 className="mb-6 text-2xl font-semibold text-foreground lg:text-3xl">
              Get in Touch
            </h3>
            <p className="mb-10 text-base leading-relaxed text-muted-foreground md:text-lg">
              I&apos;m always open to discussing new projects, creative ideas, or opportunities.
              Feel free to reach out through the form or any of the channels below!
            </p>
            <div className="space-y-6">
              {SOCIAL_LINKS.map(({ href, icon: Icon, text }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 text-base text-foreground/90 transition-all duration-300 hover:text-primary md:text-lg"
                >
                  <Icon className="size-6 shrink-0 text-primary/90 transition-colors duration-300 group-hover:text-primary" />
                  <span className="truncate transition-colors duration-300">{text}</span>
                </a>
              ))}
            </div>
          </motion.div>
          <motion.form
            variants={shouldReduceMotion ? undefined : itemVariants}
            onSubmit={handleSubmit}
            className="space-y-6"
            noValidate
          >
            <h3 className="mb-2 text-2xl font-semibold text-foreground lg:text-3xl">
              Send Me a Message
            </h3>
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-muted-foreground"
              >
                Full Name
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p
                  id="name-error"
                  className="mt-1.5 flex items-center gap-1 text-sm text-destructive"
                >
                  <AlertCircle size={14} />
                  {errors.name[0]}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-muted-foreground"
              >
                Email Address
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="mt-1.5 flex items-center gap-1 text-sm text-destructive"
                >
                  <AlertCircle size={14} />
                  {errors.email[0]}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="message"
                className="mb-1.5 block text-sm font-medium text-muted-foreground"
              >
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                placeholder="Your message..."
                rows={5}
                value={formData.message}
                onChange={handleChange}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'message-error' : undefined}
                className="min-h-[120px]"
              />
              {errors.message && (
                <p
                  id="message-error"
                  className="mt-1.5 flex items-center gap-1 text-sm text-destructive"
                >
                  <AlertCircle size={14} />
                  {errors.message[0]}
                </p>
              )}
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-12 w-full py-3 text-base shadow-lg transition-all duration-300 group hover:shadow-primary/40"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 size-5 animate-spin" />
              ) : (
                <SendHorizonal className="mr-2 size-5 transition-transform group-hover:translate-x-1" />
              )}
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </motion.form>
        </div>
      </div>
    </motion.section>
  );
};

export const ContactSection = memo(ContactSectionComponent);
