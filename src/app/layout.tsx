import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { SiteHeader } from '@/components/site-header';
import { Toaster } from "@/components/ui/toaster"
import { AppProvider } from '@/context/app-context';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'AttendEase',
  description: 'Streamlined attendance tracking for teams and organizations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        <AppProvider>
          <div className="relative flex min-h-screen flex-col">
            <Image
              src="/background.png"
              alt="Background"
              layout="fill"
              objectFit="cover"
              className="-z-10 brightness-50 blur-sm print:hidden"
              data-ai-hint="abstract background"
            />
            <SiteHeader />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
