"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
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
import anime from "animejs/lib/anime.es.js";
import { z } from "zod";
import { contactFormSchema } from "@/lib/validations";

type FormData = z.infer<typeof contactFormSchema>;
type FormErrors = Partial<Record<keyof FormData, string[] | undefined>>;

export function ContactSection() {
  const [formData, setFormDataState] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrorsState] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmittingState] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const getInTouchRef = useRef<HTMLDivElement>(null);
  const formElRef = useRef<HTMLFormElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const animatedElements = useRef({
    heading: false,
    getInTouch: false,
    form: false,
  });

  useEffect(() => {
    const currentSectionRef = sectionRef.current;
    const elementsToAnimate = [
      {
        ref: headingRef,
        name: "heading",
        config: {
          translateY: [30, 0],
          filter: ["blur(4px)", "blur(0px)"],
          duration: 800,
        },
      },
      {
        ref: getInTouchRef,
        name: "getInTouch",
        config: {
          translateX: [-50, 0],
          filter: ["blur(4px)", "blur(0px)"],
          duration: 800,
          delay: 100,
        },
      },
      {
        ref: formElRef,
        name: "form",
        config: {
          translateX: [50, 0],
          filter: ["blur(4px)", "blur(0px)"],
          duration: 800,
          delay: 200,
        },
      },
    ];

    elementsToAnimate.forEach((item) => {
      if (item.ref.current) {
        item.ref.current.style.opacity = "0";
      }
    });

    const observerCallback = (
      entries: IntersectionObserverEntry[],
      observerInstance: IntersectionObserver
    ) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const targetRefName = elementsToAnimate.find(
            (el) => el.ref.current === entry.target
          )?.name;

          if (
            targetRefName === "heading" &&
            headingRef.current &&
            !animatedElements.current.heading
          ) {
            anime({
              targets: headingRef.current,
              opacity: [0, 1],
              ...elementsToAnimate[0].config,
            });
            animatedElements.current.heading = true;
          }
          if (
            targetRefName === "getInTouch" &&
            getInTouchRef.current &&
            !animatedElements.current.getInTouch
          ) {
            anime({
              targets: getInTouchRef.current,
              opacity: [0, 1],
              ...elementsToAnimate[1].config,
            });
            animatedElements.current.getInTouch = true;
          }
          if (
            targetRefName === "form" &&
            formElRef.current &&
            !animatedElements.current.form
          ) {
            anime({
              targets: formElRef.current,
              opacity: [0, 1],
              ...elementsToAnimate[2].config,
            });
            animatedElements.current.form = true;
          }

          if (
            targetRefName &&
            animatedElements.current[
              targetRefName as keyof typeof animatedElements.current
            ]
          ) {
            observerInstance.unobserve(entry.target);
          }
        }
      });
    };

    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    };
    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    elementsToAnimate.forEach((item) => {
      if (item.ref.current) {
        observer.observe(item.ref.current);
      }
    });

    return () => {
      elementsToAnimate.forEach((item) => {
        if (item.ref.current) {
          observer.unobserve(item.ref.current);
        }
      });
      anime.remove([
        headingRef.current,
        getInTouchRef.current,
        formElRef.current,
      ]);
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormDataState((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrorsState((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
    if (submitButtonRef.current) {
      anime({
        targets: submitButtonRef.current,
        opacity: 0.7,
        duration: 200,
        easing: "linear",
        begin: () => {
          if (submitButtonRef.current)
            submitButtonRef.current.style.pointerEvents = "none";
        },
      });
    }

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
        setFormDataState({ name: "", email: "", message: "" });
      } else {
        sonnerToast.error("Submission Failed", {
          description:
            result.message || "Could not send your message. Please try again.",
          duration: 5000,
        });
        if (result.errors) {
          setErrorsState(result.errors);
        }
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
      sonnerToast.error("Submission Error", {
        description: "An unexpected error occurred. Please try again later.",
        duration: 5000,
      });
    } finally {
      setIsSubmittingState(false);
      if (submitButtonRef.current) {
        anime({
          targets: submitButtonRef.current,
          opacity: 1,
          duration: 200,
          easing: "linear",
          complete: () => {
            if (submitButtonRef.current)
              submitButtonRef.current.style.pointerEvents = "auto";
          },
        });
      }
    }
  };

  const { name, email, message } = formData;

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="bg-secondary/20 dark:bg-secondary/5"
    >
      <div className="container mx-auto px-4">
        <h2
          ref={headingRef}
          className="mb-16 text-center text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter"
        >
          Let's <span className="text-primary">Connect</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div ref={getInTouchRef}>
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
                <a
                  key={item.href}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    item.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="flex items-center gap-4 text-lg text-foreground/90 hover:text-primary transition-all duration-200 group"
                >
                  <item.icon className="size-6 text-primary/90 group-hover:text-primary group-hover:scale-110 transition-all duration-200 shrink-0" />
                  <span className="truncate transition-colors duration-200">
                    {item.text}
                  </span>
                </a>
              ))}
            </div>
          </div>
          <form
            ref={formElRef}
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
                className="bg-card/60 dark:bg-card/70 text-base p-3 focus:ring-primary focus:border-primary h-11"
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
                className="bg-card/60 dark:bg-card/70 text-base p-3 focus:ring-primary focus:border-primary h-11"
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
                className="bg-card/60 dark:bg-card/70 text-base p-3 focus:ring-primary focus:border-primary min-h-[120px]"
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
            <Button
              ref={submitButtonRef}
              type="submit"
              size="lg"
              className="w-full shadow-lg hover:shadow-primary/40 transition-all duration-300 group text-base py-3 h-12 hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 size-5 animate-spin" />
              ) : (
                <SendHorizonal className="mr-2 size-5 transition-transform group-hover:translate-x-1" />
              )}
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
