import type { Metadata, Viewport } from 'next';
import { Cairo, IBM_Plex_Sans_Arabic } from 'next/font/google';
import '../index.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import ClientProviders from '@/components/ClientProviders';
import PageTransition from '@/components/PageTransition';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-cairo',
  display: 'swap',
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'مؤسسة الوليد للإنسانية',
  description: 'مؤسسة الوليد للإنسانية تعمل على دعم المبادرات والمشاريع الإنسانية في مختلف أنحاء العالم.',
  keywords: ['مؤسسة الوليد للإنسانية', 'تطوع', 'إغاثة', 'صحة', 'تعليم', 'دعم إنساني'],
  robots: 'index, follow',
  icons: {
    icon: 'https://res.cloudinary.com/wlkrtcrr/image/upload/v1784572343/logo_vkbiil.png',
  },
  openGraph: {
    title: 'مؤسسة الوليد للإنسانية',
    description: 'مؤسسة الوليد للإنسانية تعمل على دعم المبادرات والمشاريع الإنسانية في مختلف أنحاء العالم.',
    type: 'website',
    locale: 'ar_SA',
    siteName: 'مؤسسة الوليد للإنسانية',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${ibmPlexSansArabic.variable}`}>
      <body className="bg-[#F8FAF7] text-[#033500] font-cairo min-h-screen flex flex-col antialiased">
        <ClientProviders>
          <Header />
          <main className="flex-grow flex flex-col">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <Toaster
            position="bottom-left"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#FFFFFF',
                color: '#033500',
                borderRadius: '1rem',
                border: '1px solid #C9A84C',
                fontFamily: 'var(--font-cairo), Cairo, sans-serif',
              },
              success: {
                iconTheme: {
                  primary: '#C9A84C',
                  secondary: '#FFFFFF',
                },
              },
            }}
          />
        </ClientProviders>
      </body>
    </html>
  );
}
