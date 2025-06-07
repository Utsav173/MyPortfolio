"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

type ToasterContextProps = ToasterProps;

const Toaster = ({ ...props }: ToasterContextProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          error: "!bg-destructive !text-destructive-foreground",
          success: "!bg-emerald-600 !text-white",
          warning: "!bg-amber-500 !text-white",
          info: "!bg-blue-500 !text-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
