"use client";

import React, { useCallback, useState, useRef, memo } from "react";
import { motion, useReducedMotion, Variants } from "motion/react";
import { z } from "zod";
import { toast as sonnerToast } from "sonner";
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  SendHorizonal,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactFormSchema } from "@/lib/validations";
import { cn } from "@/lib/utils";

type FormData = z.infer<typeof contactFormSchema>;
type FormErrors = Partial<Record<keyof FormData, string[] | undefined>>;

const SOCIAL_LINKS = [
  {
    href: "mailto:khatriutsav40@gmail.com",
    icon: Mail,
    text: "khatriutsav40@gmail.com",
  },
  {
    href: "https://linkedin.com/in/utsav-khatri-in",
    icon: Linkedin,
    text: "Utsav Khatri",
  },
  { href: "https://github.com/Utsav173", icon: Github, text: "Utsav173" },
  { href: "tel:+916355321582", icon: Phone, text: "+91 6355321582" },
];

const sectionVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const ContactSectionComponent = ({
  className,
  id,
}: {
  className?: string;
  id?: string;
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
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
        sonnerToast.error("Validation Failed", {
          description: "Please check the form for errors.",
        });
        return;
      }
      setIsSubmitting(true);
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validationResult.data),
        });
        const result = await response.json();
        if (response.ok) {
          sonnerToast.success("Message Sent!", {
            description:
              result.message ||
              "Thanks for reaching out. I'll get back to you soon.",
          });
          setFormData({ name: "", email: "", message: "" });
        } else {
          sonnerToast.error("Submission Failed", {
            description:
              result.message ||
              "Could not send your message. Please try again.",
          });
          if (result.errors) setErrors(result.errors);
        }
      } catch (error) {
        sonnerToast.error("Submission Error", {
          description: "An unexpected error occurred. Please try again later.",
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
      className={cn(
        "bg-secondary/20 py-20 dark:bg-secondary/5 md:py-28 lg:py-32",
        className
      )}
      variants={shouldReduceMotion ? undefined : sectionVariants}
      initial={shouldReduceMotion ? undefined : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.15 }}
      aria-labelledby="contact-heading"
    >
      <div className="container mx-auto px-4">
        <motion.h2
          id="contact-heading"
          variants={shouldReduceMotion ? undefined : itemVariants}
          className="mb-16 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
        >
          Let's <span className="text-primary">Connect</span>
        </motion.h2>
        <div className="grid items-start gap-12 md:grid-cols-2 lg:gap-20">
          <motion.div variants={shouldReduceMotion ? undefined : itemVariants}>
            <h3 className="mb-6 text-2xl font-semibold text-foreground lg:text-3xl">
              Get in Touch
            </h3>
            <p className="mb-10 text-base leading-relaxed text-muted-foreground md:text-lg">
              I'm always open to discussing new projects, creative ideas, or
              opportunities. Feel free to reach out through the form or any of
              the channels below!
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
                  <span className="truncate transition-colors duration-300">
                    {text}
                  </span>
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
                aria-describedby={errors.name ? "name-error" : undefined}
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
                aria-describedby={errors.email ? "email-error" : undefined}
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
                aria-describedby={errors.message ? "message-error" : undefined}
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
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </motion.form>
        </div>
      </div>
    </motion.section>
  );
};

export const ContactSection = memo(ContactSectionComponent);
