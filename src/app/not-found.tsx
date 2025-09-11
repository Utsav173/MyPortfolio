import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Frown } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404: Page Not Found',
  description: 'The page you were looking for could not be found.',
};

export default function NotFound() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center py-20 md:py-28 lg:py-32">
        <Frown className="w-24 h-24 text-primary/50 mb-8" />
        <h1 className="text-6xl md:text-8xl font-bold text-primary tracking-tighter mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">Page Not Found</h2>
        <p className="max-w-md text-muted-foreground mb-10">
          Oops! The page you are looking for does not exist. It might have been moved or deleted.
        </p>
        <Button asChild size="lg" className="group">
          <Link href="/" className="flex items-center">
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            <span className="ml-2">Go Back to Homepage</span>
          </Link>
        </Button>
      </div>
    </PageWrapper>
  );
}
