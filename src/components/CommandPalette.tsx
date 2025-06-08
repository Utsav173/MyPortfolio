"use client";

import React, { useEffect, useCallback, memo } from "react";
import { useTheme } from "next-themes";
import {
  FileText,
  Home,
  Moon,
  Sun,
  Palette,
  Mail,
  User,
  Wrench,
  Library,
  Lightbulb,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { NAV_ITEMS, RESUME_URL } from "@/lib/constants";
import { useScrollToSection } from "@/hooks/use-scroll-to-section";
import { Icon } from "@iconify/react";

const ICONS_MAP: {
  [key: string]: React.ComponentType<{ className?: string }>;
} = {
  "#hero": Home,
  "#about": User,
  "#skills": Wrench,
  "#experience": Library,
  "#projects": Palette,
  "#contact": Mail,
};

interface CommandPaletteProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CommandPaletteComponent = ({
  isOpen,
  setIsOpen,
}: CommandPaletteProps) => {
  const { setTheme } = useTheme();
  const { scrollTo } = useScrollToSection();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setIsOpen]);

  const runCommand = useCallback(
    (command: () => unknown) => {
      setIsOpen(false);
      command();
    },
    [setIsOpen],
  );

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      aria-label="Command Palette"
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = ICONS_MAP[item.href] || Lightbulb;
            return (
              <CommandItem
                key={`nav-${item.href}`}
                value={`Go to ${item.label}`}
                onSelect={() => runCommand(() => scrollTo(item.href))}
                className="cursor-pointer"
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>Go to {item.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Links">
          <CommandItem
            value="GitHub"
            onSelect={() =>
              runCommand(() =>
                window.open("https://github.com/Utsav173", "_blank"),
              )
            }
            className="cursor-pointer"
          >
            <Icon icon={"simple-icons:github"} className="mr-2 h-4 w-4" />
            <span>Open GitHub</span>
          </CommandItem>
          <CommandItem
            value="LinkedIn"
            onSelect={() =>
              runCommand(() =>
                window.open(
                  "https://linkedin.com/in/utsav-khatri-in",
                  "_blank",
                ),
              )
            }
            className="cursor-pointer"
          >
            <Icon icon={"simple-icons:linkedin"} className="mr-2 h-4 w-4" />
            <span>Open LinkedIn</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem
            value="Toggle Theme"
            onSelect={() => runCommand(() => setTheme("light"))}
            className="cursor-pointer"
          >
            <Sun className="mr-2 h-4 w-4" />
            <span>Set Light Theme</span>
          </CommandItem>
          <CommandItem
            value="Toggle Theme"
            onSelect={() => runCommand(() => setTheme("dark"))}
            className="cursor-pointer"
          >
            <Moon className="mr-2 h-4 w-4" />
            <span>Set Dark Theme</span>
          </CommandItem>
          <CommandItem
            value="Download Resume"
            onSelect={() => runCommand(() => window.open(RESUME_URL, "_blank"))}
            className="cursor-pointer"
          >
            <FileText className="mr-2 h-4 w-4" />
            <span>Download Resume</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export const CommandPalette = memo(CommandPaletteComponent);
