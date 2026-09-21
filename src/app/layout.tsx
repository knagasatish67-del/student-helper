import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/providers/authprovider';
import { Toaster } from 'sonner';
import { BottomNav } from '@/components/client/bottomnav';

export const metadata: Metadata = {
  title: 'Student Helper - University Student Service Platform',
  description:
    'University student assignment, lab manual record, and xerox printing platform with offline collection and live agent tracking.',
  openGraph: {
    title: 'Student Helper - University Student Service Platform',
    description:
      'University student assignment, lab manual record, and xerox printing platform with offline collection and live agent tracking.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <AuthProvider>
          {children}
          <BottomNav />
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
