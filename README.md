# Utsav Khatri - Full Stack Developer Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React.js](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)
[![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://gsap.com/)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

This repository contains the source code for my personal portfolio website, built to showcase my skills, projects, and experience as a Full Stack Developer.

## Live Demo

[utsav-khatri.vercel.app](https://www.khatriutsav.com)

## About Me

I'm Utsav Khatri, a dynamic and results-oriented Full Stack Developer with comprehensive experience in designing, developing, and deploying scalable, cloud-native web applications and robust APIs. I have proven expertise in React.js, Node.js, Next.js, TypeScript, and various cloud services (AWS, Cloudflare). I'm passionate about leveraging cutting-edge technologies to solve complex business challenges, foster team growth, and I have a keen interest in the practical applications of AI in web development.

This portfolio is a testament to my dedication to building high-impact digital products and my journey in the ever-evolving tech landscape.

## Features

This portfolio is packed with modern web features:

- **Next.js 15 App Router:** Leveraging the latest Next.js features (currently using `15.3.2`) for optimal performance and developer experience, with **Turbopack** for development.
- **React 19:** Utilizing the newest React version for cutting-edge frontend capabilities.
- **TypeScript:** For robust, maintainable, and scalable code.
- **Responsive Design:** Adapts beautifully to all screen sizes, from mobile to desktop.
- **Dark/Light Mode:** User-selectable theme preference, powered by `next-themes`.
- **shadcn/ui & Tailwind CSS v4:** Modern and utility-first styling for a sleek and customizable UI.
- **Interactive Animations:** Engaging user experience with **GSAP (ScrollTrigger)** for scroll-linked effects and **Motion One** for UI animations.
- **3D Background Effect:** A captivating "Matrix" style data stream on the hero section using **Three.js**, `@react-three/fiber`, and `@react-three/postprocessing`.
- **Smooth Scrolling:** Enhanced navigation experience achieved with CSS `scroll-smooth` and precise scroll-to-element logic.
- **Project Showcase:**
  - Curated list of featured projects with custom details.
  - Data sourced from `public/projects-data.json`. This file can be updated by adapting the scripts in `src/lib/github.ts` to fetch fresh data from GitHub.
- **Comprehensive Sections:**
  - **Hero:** An engaging introduction with animated text and 3D background.
  - **About Me:** Detailed information about my background and passion.
  - **Skills:** An interactive display of my technical toolkit with animated carousels.
  - **Experience:** Professional journey and key projects timeline.
  - **Projects:** A curated list of my work with interactive cards.
  - **Contact Form:** Functional contact form using Next.js API Routes and `Nodemailer`.
- **SEO Optimized:** With dynamic metadata generation (title, description, keywords, OpenGraph, Twitter cards, JSON-LD Schema) for better search engine visibility.
- **Organized Code Structure:** Clear separation of components, sections, and utilities for maintainability.
- **Accessibility:** Attention to semantic HTML and ARIA attributes for improved accessibility.

## Tech Stack

- **Frontend:**
  - [Next.js](https://nextjs.org/) (v15.3.2 with App Router, Turbopack for dev)
  - [React](https://reactjs.org/) (v19.0.0)
  - [TypeScript](https://www.typescriptlang.org/) (v5.x)
  - [Tailwind CSS](https://tailwindcss.com/) (v4)
  - [shadcn/ui](https://ui.shadcn.com/) (Component library)
  - Animations:
    - [GSAP (GreenSock Animation Platform)](https://gsap.com/) (ScrollTrigger, complex animations)
    - [Motion One](https://motion.dev/) (Performant UI animations)
    - [tw-animate-css](https://www.npmjs.com/package/tw-animate-css) (Tailwind CSS animation utilities)
  - 3D Graphics:
    - [Three.js](https://threejs.org/)
    - [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)
    - [@react-three/drei](https://github.com/pmndrs/drei)
    - [@react-three/postprocessing](https://github.com/pmndrs/postprocessing) (for effects like Bloom)
  - Icons:
    - [Lucide React](https://lucide.dev/)
    - [@iconify/react](https://iconify.design/) & [Simple Icons](https://simpleicons.org/) (for project tech stacks)
  - Theming: [next-themes](https://github.com/pacocoursey/next-themes)
  - UI Components: Radix UI (underlying shadcn/ui)
  - Toasts/Notifications: [Sonner](https://sonner.emilkowal.ski/)
- **Backend (Contact Form):**
  - Next.js API Routes
  - [Nodemailer](https://nodemailer.com/)
- **Validation:**
  - [Zod](https://zod.dev/) (for contact form schema)
- **Development & Build Tools:**
  - npm / yarn / pnpm / bun
  - ESLint
  - TypeScript
- **Deployment:**
  - [Vercel](https://vercel.com/) (Recommended)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v20.x or later recommended)
- Your preferred package manager (npm, yarn, pnpm, or bun)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Utsav173/MyPortfolio.git
    cd MyPortfolio
    ```

2.  **Install dependencies:**
    Choose your preferred package manager:

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root of the project. Add the following variables:

    ```env
    # For the contact form (using Nodemailer with Gmail)
    GMAIL_USERNAME=your_gmail_address@gmail.com
    GMAIL_PASS=your_gmail_app_password # It's highly recommended to use an "App Password"
    CONTACT_FORM_RECEIVER_EMAIL=your_personal_email_to_receive_messages@example.com

    # For generating absolute URLs (e.g., for metadata, sitemap, robots.txt)
    NEXT_PUBLIC_SITE_URL=http://localhost:3000 # For local development
    # NEXT_PUBLIC_SITE_URL=https://www.khatriutsav.com/ # For production
    ```

    _**Note on `GMAIL_PASS`**_: It's highly recommended to use an "App Password" for Nodemailer if you have 2-Step Verification enabled on your Google account. [Learn more here](https://support.google.com/accounts/answer/185833).

4.  **Run the development server (with Turbopack):**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

### Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
# or
bun build
```

This will create an optimized production build in the `.next` folder.

## Learn More About Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details. Remember to set up your environment variables in the Vercel project settings (especially `GMAIL_USERNAME`, `GMAIL_PASS`, `CONTACT_FORM_RECEIVER_EMAIL`, and `NEXT_PUBLIC_SITE_URL` for the production domain).

## Author

**Utsav Khatri**

- **GitHub:** [@Utsav173](https://github.com/Utsav173)
- **LinkedIn:** [Utsav Khatri](https://linkedin.com/in/utsav-khatri-in)
- **Email:** [khatriutsav40@gmail.com](mailto:khatriutsav40@gmail.com)

## License

This project is open source. Feel free to fork, star, and contribute. If you use significant portions of the code or design, please give credit. (Consider adding an MIT License file if you wish to specify formal terms).
