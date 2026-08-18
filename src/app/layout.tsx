import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import '../index.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import ClientProviders from '@/components/ClientProviders';
import PageTransition from '@/components/PageTransition';

// IBM Plex Sans Arabic: خط المقروئية والتحديث البصري
const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-arabic',
  display: 'swap',
});

// Georgia: خط العناوين اللاتيني الرسمي للمؤسسة (لا يحتوي حروف عربية —
// يُستخدم فقط للنصوص اللاتينية المضمّنة: أرقام، أسماء أجنبية، إلخ)
const georgia = localFont({
  src: '../fonts/Georgia.ttf',
  variable: '--font-georgia',
  display: 'swap',
});

// Helvetica Neue Arabic: خط النصوص الأساسي (الوزن العادي) للمحتوى العربي
const helveticaArabicRoman = localFont({
  src: '../fonts/HelveticaNeueLTArabic-Roman.ttf',
  variable: '--font-helvetica-arabic',
  weight: '400',
  display: 'swap',
});

// Helvetica Neue Arabic: الوزن الخفيف (للتسميات والنصوص الثانوية الكبيرة)
const helveticaArabicLight = localFont({
  src: '../fonts/HelveticaNeueLTArabic-Light.ttf',
  variable: '--font-helvetica-arabic-light',
  weight: '300',
  display: 'swap',
});

// Scheherazade: خط عربي تراثي — البديل العربي الفعلي لروح Georgia
// التحريرية، يُستخدم للعناوين الكبيرة والاقتباسات الشعورية
// ("معًا، من أجل الإنسانية" ونحوها)
const scheherazade = localFont({
  src: '../fonts/Scheherazade-Bold.ttf',
  variable: '--font-scheherazade',
  weight: '700',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: 'var(--primary)',
};

const SITE_URL = 'https://waleed-foundation.org'; // TODO: تأكد من مطابقته للدومين الفعلي بعد الإطلاق
const OG_IMAGE = 'https://res.cloudinary.com/wlkrtcrr/image/upload/v1784572343/logo_vkbiil.png';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'مؤسسة الوليد للإنسانية',
    template: '%s | مؤسسة الوليد للإنسانية',
  },
  description:
    'مؤسسة الوليد للإنسانية تعمل على دعم المبادرات والمشاريع الإنسانية في مختلف أنحاء العالم.',
  keywords: ['مؤسسة الوليد للإنسانية', 'تطوع', 'إغاثة', 'صحة', 'تعليم', 'دعم إنساني'],
  robots: 'index, follow',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: OG_IMAGE,
    apple: OG_IMAGE,
  },
  openGraph: {
    title: 'مؤسسة الوليد للإنسانية',
    description:
      'مؤسسة الوليد للإنسانية تعمل على دعم المبادرات والمشاريع الإنسانية في مختلف أنحاء العالم.',
    type: 'website',
    locale: 'ar_SA',
    siteName: 'مؤسسة الوليد للإنسانية',
    url: SITE_URL,
    images: [
      {
        url: OG_IMAGE,
        width: 512,
        height: 512,
        alt: 'شعار مؤسسة الوليد للإنسانية',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مؤسسة الوليد للإنسانية',
    description:
      'مؤسسة الوليد للإنسانية تعمل على دعم المبادرات والمشاريع الإنسانية في مختلف أنحاء العالم.',
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${ibmPlexArabic.variable} ${georgia.variable} ${helveticaArabicRoman.variable} ${helveticaArabicLight.variable} ${scheherazade.variable}`}
    >
      <body className="bg-(--background) text-(--text) font-body min-h-screen flex flex-col antialiased">
        <ClientProviders>
          <Header />
          <main className="flex-grow flex flex-col">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--surface)',
                color: 'var(--text)',
                borderRadius: '1rem',
                border: '1px solid var(--accent)',
                fontFamily: 'var(--font-helvetica-arabic), sans-serif',
              },
              success: {
                iconTheme: {
                  primary: 'var(--gold)',
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
