"use client";

import React, { useState, useRef, useCallback } from "react";
import { Button as ShadcnButton } from "@/components/ui/button"; // Renamed to avoid conflict
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  SendHorizonal,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast as sonnerToast } from "sonner";
import { z } from "zod";
import { contactFormSchema } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion, Variants } from "motion/react";

type FormData = z.infer<typeof contactFormSchema>;
type FormErrors = Partial<Record<keyof FormData, string[] | undefined>>;

const initialFormData: FormData = {
  name: "",
  email: "",
  message: "",
};

const sectionVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
};

const elementVariants: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
  },
};

const formElementVariants: Variants = {
  hidden: { opacity: 0, x: 60, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
  },
};

const getInTouchVariants: Variants = {
  hidden: { opacity: 0, x: -60, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
  },
};

const MotionButton = motion.create(ShadcnButton);

export function ContactSection({
  className,
  id,
}: {
  className?: string;
  id?: string;
}) {
  const [formData, setFormDataState] = useState<FormData>(initialFormData);
  const [errors, setErrorsState] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmittingState] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormDataState((prev) => ({ ...prev, [name]: value }));
      if (errors[name as keyof FormData]) {
        setErrorsState((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setErrorsState({});
      const validationResult = contactFormSchema.safeParse(formData);
      if (!validationResult.success) {
        setErrorsState(validationResult.error.flatten().fieldErrors);
        sonnerToast.error("Validation Failed", {
          description: "Please check the form for errors.",
          duration: 4000,
        });
        return;
      }
      setIsSubmittingState(true);
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
            duration: 5000,
          });
          setFormDataState(initialFormData);
        } else {
          sonnerToast.error("Submission Failed", {
            description:
              result.message ||
              "Could not send your message. Please try again.",
            duration: 5000,
          });
          if (result.errors) {
            setErrorsState(result.errors);
          }
        }
      } catch (error) {
        sonnerToast.error("Submission Error", {
          description: "An unexpected error occurred. Please try again later.",
          duration: 5000,
        });
      } finally {
        setIsSubmittingState(false);
      }
    },
    [formData]
  );

  const { name, email, message } = formData;

  const buttonAnimationStates = {
    idle: { opacity: 1, scale: 1 },
    submitting: { opacity: 0.7, scale: 0.98 },
  };

  return (
    <motion.section
      id={id}
      ref={sectionRef}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      variants={shouldReduceMotion ? {} : sectionVariants}
      viewport={{ once: true, amount: 0.15 }}
      className={cn(
        className,
        "bg-secondary/20 dark:bg-secondary/5 py-20 md:py-28 lg:py-32"
      )}
    >
      <div className="container mx-auto px-4">
        <motion.h2
          variants={shouldReduceMotion ? {} : elementVariants}
          className="mb-16 text-center text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter"
        >
          Let's <span className="text-primary">Connect</span>
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          <motion.div variants={shouldReduceMotion ? {} : getInTouchVariants}>
            <h3 className="text-2xl lg:text-3xl font-semibold mb-6 text-foreground">
              Get in Touch
            </h3>
            <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
              I'm always open to discussing new projects, creative ideas, or
              opportunities to be part of something amazing. Feel free to reach
              out through the form or any of the channels below!
            </p>
            <div className="space-y-6">
              {[
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
                {
                  href: "https://github.com/Utsav173",
                  icon: Github,
                  text: "Utsav173",
                },
                {
                  href: "tel:+916355321582",
                  icon: Phone,
                  text: "+91 6355321582",
                },
              ].map((item) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    item.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="flex items-center gap-4 text-lg text-foreground/90 hover:text-primary transition-all duration-300 group"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02, x: 2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <motion.span
                    // variants for icon hover can be complex if needed
                    whileHover={
                      shouldReduceMotion ? {} : { scale: 1.1, rotate: 5 }
                    }
                  >
                    <item.icon className="icon size-6 text-primary/90 group-hover:text-primary transition-colors duration-300 shrink-0" />
                  </motion.span>
                  <span className="truncate transition-colors duration-300">
                    {item.text}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>
          <motion.form
            variants={shouldReduceMotion ? {} : formElementVariants}
            onSubmit={handleSubmit}
            className="space-y-6"
            noValidate
          >
            <h3 className="text-2xl lg:text-3xl font-semibold mb-2 text-foreground">
              Send Me a Message
            </h3>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-muted-foreground mb-1.5"
              >
                Full Name
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Your Name"
                value={name}
                onChange={handleChange}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className="bg-card/60 dark:bg-card/70 text-base p-3 focus:ring-primary focus:border-primary h-11 transition-all duration-300"
              />
              {errors.name && (
                <p
                  id="name-error"
                  className="text-sm text-destructive mt-1.5 flex items-center gap-1"
                >
                  <AlertCircle size={14} />
                  {errors.name[0]}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-muted-foreground mb-1.5"
              >
                Email Address
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className="bg-card/60 dark:bg-card/70 text-base p-3 focus:ring-primary focus:border-primary h-11 transition-all duration-300"
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="text-sm text-destructive mt-1.5 flex items-center gap-1"
                >
                  <AlertCircle size={14} />
                  {errors.email[0]}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-muted-foreground mb-1.5"
              >
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                placeholder="Your message..."
                rows={5}
                value={message}
                onChange={handleChange}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
                className="bg-card/60 dark:bg-card/70 text-base p-3 focus:ring-primary focus:border-primary min-h-[120px] resize-none transition-all duration-300"
              />
              {errors.message && (
                <p
                  id="message-error"
                  className="text-sm text-destructive mt-1.5 flex items-center gap-1"
                >
                  <AlertCircle size={14} />
                  {errors.message[0]}
                </p>
              )}
            </div>
            <motion.div
              animate={isSubmitting ? "submitting" : "idle"}
              variants={shouldReduceMotion ? {} : buttonAnimationStates}
            >
              <MotionButton
                type="submit"
                size="lg"
                className="w-full shadow-lg hover:shadow-primary/40 transition-all duration-300 group text-base py-3 h-12 hover:bg-primary/90"
                disabled={isSubmitting}
                whileHover={shouldReduceMotion || isSubmitting ? {} : { y: -2 }}
                whileTap={
                  shouldReduceMotion || isSubmitting ? {} : { scale: 0.98 }
                }
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 size-5 animate-spin" />
                ) : (
                  <SendHorizonal className="mr-2 size-5 transition-transform group-hover:translate-x-1" />
                )}
                {isSubmitting ? "Sending..." : "Send Message"}
              </MotionButton>
            </motion.div>
          </motion.form>
        </div>
      </div>
    </motion.section>
  );
}
