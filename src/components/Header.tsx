'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X, ChevronDown, Phone, Mail, Globe, Search } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavDropdownItem {
  label: string;
  page: string;
}

interface NavItem {
  label: string;
  page?: string;
  dropdown?: NavDropdownItem[];
}

interface HeaderProps {
  currentPage?: string;
  setCurrentPage?: (page: string) => void;
}

const pageToPath: Record<string, string> = {
  home: '/',
  about: '/about',
  vision: '/vision',
  goals: '/goals',
  programs: '/programs',
  projects: '/projects',
  news: '/news',
  faq: '/faq',
  apply: '/apply',
  track: '/track',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
};

const pathToPage: Record<string, string> = Object.fromEntries(
  Object.entries(pageToPath).map(([page, path]) => [path, page])
);

// Resolves the active nav item even on nested routes (e.g. /news/some-article -> "news")
function resolveActivePage(pathname: string): string {
  if (pathToPage[pathname]) return pathToPage[pathname];
  const match = Object.entries(pageToPath)
    .filter(([page, path]) => page !== 'home' && pathname.startsWith(`${path}/`))
    .sort((a, b) => b[1].length - a[1].length)[0];
  return match ? match[0] : 'home';
}

const navItems: NavItem[] = [
  { label: 'الرئيسية', page: 'home' },
  {
    label: 'عن المؤسسة',
    dropdown: [
      { label: 'من نحن', page: 'about' },
      { label: 'رؤيتنا ورسالتنا', page: 'vision' },
      { label: 'أهداف المؤسسة', page: 'goals' },
    ],
  },
  { label: 'برامجنا', page: 'programs' },
  { label: 'مشاريعنا', page: 'projects' },
  { label: 'الأخبار', page: 'news' },
  {
    label: 'خدماتنا',
    dropdown: [
      { label: 'تقديم طلب', page: 'apply' },
      { label: 'تتبع الطلب', page: 'track' },
      { label: 'الأسئلة الشائعة', page: 'faq' },
    ],
  },
  { label: 'تواصل معنا', page: 'contact' },
];

export default function Header({ currentPage: propCurrentPage, setCurrentPage: propSetCurrentPage }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const activePage = propCurrentPage || resolveActivePage(pathname);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locale, setLocale] = useState<'ar' | 'en'>('ar');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Scroll progress + scrolled state
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          const isScrolled = currentScroll > 40;
          setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));

          const doc = document.documentElement;
          const scrollHeight = doc.scrollHeight - doc.clientHeight;
          if (scrollHeight > 0) {
            const newProgress = Math.min(100, Math.max(0, (currentScroll / scrollHeight) * 100));
            setProgress(newProgress);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown / mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideDropdown = dropdownRef.current?.contains(target);
      const insideMobileMenu = mobileMenuRef.current?.contains(target);
      if (!insideDropdown && !insideMobileMenu) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
    setShowSearch(false);
  }, [pathname]);

  // Escape key closes any open overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (showSearch) setShowSearch(false);
      else if (mobileOpen) setMobileOpen(false);
      else if (openDropdown) setOpenDropdown(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSearch, mobileOpen, openDropdown]);

  // Reset mobile-only state when the viewport grows past the desktop breakpoint
  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1280px)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setMobileOpen(false);
        setOpenDropdown(null);
      }
    };
    desktopQuery.addEventListener('change', handleChange);
    return () => desktopQuery.removeEventListener('change', handleChange);
  }, []);

  // Prefetch all main routes for instant navigation
  useEffect(() => {
    Object.values(pageToPath).forEach((path) => {
      try {
        router.prefetch(path);
      } catch (err) {
        // ignore prefetch errors
      }
    });
  }, [router]);

  // Lock background scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Focus the search field as soon as it appears
  useEffect(() => {
    if (showSearch) searchInputRef.current?.focus();
  }, [showSearch]);

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const query = searchQuery.trim();
      if (!query) return;
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setShowSearch(false);
      setSearchQuery('');
    },
    [router, searchQuery]
  );

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="progress-bar" style={{ width: `${progress}%` }} />

      {/* Main Header */}
      <header
        className="fixed left-0 right-0 z-[999] transition-all duration-500 text-white"
        style={{
          top: '0',
          background: scrolled ? 'rgba(2, 43, 18, 0.98)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          transform: 'translateZ(0)',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.25), 0 1px 0 rgba(201, 168, 76,0.2)' : 'none',
        }}
      >
        {/* Top Institutional Utility Bar */}
        <div
          className={`hidden lg:block border-b transition-all duration-300 ${
            scrolled ? 'py-1 bg-black/20 border-white/10' : 'py-2 bg-transparent border-white/15'
          }`}
        >
          <div className="max-w-[1600px] w-full mx-auto px-6 md:px-10 lg:px-14 flex items-center justify-between text-xs text-white/80 font-cairo">
            {/* Contact numbers & mail */}
            <div className="flex items-center gap-6">
              <a
                href="tel:+966112345678"
                className="flex items-center gap-2 hover:text-[#C9A84C] transition-colors"
                dir="ltr"
              >
                <Phone size={13} className="text-[#C9A84C]" />
                <span className="font-sans text-xs tracking-wider">+966 11 234 5678</span>
              </a>
              <span className="text-white/20">|</span>
              <a
                href="mailto:info@waleed-foundation.org"
                className="flex items-center gap-2 hover:text-[#C9A84C] transition-colors"
                dir="ltr"
              >
                <Mail size={13} className="text-[#C9A84C]" />
                <span className="font-sans text-xs">info@waleed-foundation.org</span>
              </a>
            </div>

            {/* Language Switch */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setLocale((prev) => (prev === 'ar' ? 'en' : 'ar'))}
                aria-pressed={locale === 'en'}
                aria-label="تبديل اللغة"
                className="flex items-center gap-1.5 hover:text-[#C9A84C] transition-colors py-0.5 px-2 rounded hover:bg-white/10 cursor-pointer"
              >
                <Globe size={13} className="text-[#C9A84C]" />
                <span className={locale === 'ar' ? 'text-white' : 'text-white/60 font-sans'}>العربية</span>
                <span className="text-white/40">|</span>
                <span className={locale === 'en' ? 'text-white font-sans' : 'text-white/60 font-sans'}>English</span>
              </button>
            </div>
          </div>
        </div>

        {/* Primary Navbar Container */}
        <div className="max-w-[1600px] w-full mx-auto px-6 md:px-10 lg:px-14">
          <div className="flex items-center justify-between py-3.5 md:py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="transition-transform group-hover:scale-105">
                <img
                  src="https://res.cloudinary.com/wlkrtcrr/image/upload/v1784572343/logo_vkbiil.png"
                  alt="مؤسسة الوليد للإنسانية"
                  width={260}
                  height={64}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="h-12 md:h-14 lg:h-16 max-h-16 w-auto max-w-[260px] md:max-w-[300px] object-contain brightness-0 invert drop-shadow-xl"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-1.5 lg:gap-2" ref={dropdownRef}>
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.dropdown && setOpenDropdown(item.label)}
                  onMouseLeave={() => item.dropdown && setOpenDropdown(null)}
                >
                  {item.dropdown ? (
                    <div>
                      <button
                        type="button"
                        className="nav-link flex items-center gap-1 px-3.5 py-2 rounded-xl text-white/95 hover:text-white text-base font-semibold font-cairo transition-all hover:bg-white/10"
                        onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                        aria-haspopup="true"
                        aria-expanded={openDropdown === item.label}
                      >
                        {item.label}
                        <ChevronDown
                          size={14}
                          className="transition-transform duration-300 opacity-80"
                          style={{ transform: openDropdown === item.label ? 'rotate(180deg)' : 'rotate(0)' }}
                        />
                      </button>
                      {openDropdown === item.label && (
                        <div className="dropdown-menu" role="menu">
                          {item.dropdown.map((sub) => (
                            <Link
                              key={sub.page}
                              href={pageToPath[sub.page] || '/'}
                              role="menuitem"
                              className="dropdown-item w-full text-right font-medium"
                              onClick={() => {
                                if (propSetCurrentPage) propSetCurrentPage(sub.page);
                                setOpenDropdown(null);
                              }}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={pageToPath[item.page!] || '/'}
                      aria-current={activePage === item.page ? 'page' : undefined}
                      className={`nav-link px-3.5 py-2 rounded-xl text-base font-semibold font-cairo transition-all ${
                        activePage === item.page
                          ? 'text-[#C9A84C] font-bold bg-white/10'
                          : 'text-white/95 hover:text-white hover:bg-white/10'
                      }`}
                      onClick={() => {
                        if (propSetCurrentPage) propSetCurrentPage(item.page!);
                      }}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA & Search & Language Buttons */}
            <div className="hidden xl:flex items-center gap-3">
              {/* Primary Golden CTA */}
              <Link
                href="/apply"
                className="bg-gradient-to-r from-[#C9A84C] to-[#E2C366] text-[#022B12] font-extrabold text-base py-3 px-8 rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_8px_25px_rgba(201,168,76,0.35)] flex items-center gap-2 font-cairo cursor-pointer"
                onClick={() => {
                  if (propSetCurrentPage) propSetCurrentPage('apply');
                }}
              >
                <span>تقديم طلب</span>
              </Link>

              {/* Search Toggle */}
              <button
                type="button"
                onClick={() => setShowSearch((prev) => !prev)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all hover:scale-105 cursor-pointer"
                title="البحث"
                aria-expanded={showSearch}
                aria-label="فتح البحث"
              >
                <Search size={18} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="xl:hidden w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white transition-all hover:bg-white/20"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Search Modal Bar */}
        {showSearch && (
          <div className="bg-[#022B12]/95 border-b border-[#C9A84C]/30 backdrop-blur-xl py-4 px-6 transition-all duration-300">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
              <Search className="text-[#C9A84C] shrink-0" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="ابحث عن برنامج، مشروع، أو خيارات التقديم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white placeholder-white/50 text-base focus:outline-none font-cairo"
              />
              <button type="submit" className="text-[#C9A84C] hover:text-white text-sm px-2 font-cairo cursor-pointer">
                بحث
              </button>
              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="text-white/60 hover:text-white text-sm px-2 font-cairo cursor-pointer"
              >
                إغلاق
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Overlay */}
      <div className={`mobile-overlay ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)} />

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`} ref={mobileMenuRef}>
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
            <div className="p-2">
              <img
                src="https://res.cloudinary.com/wlkrtcrr/image/upload/v1784572343/logo_vkbiil.png"
                alt="مؤسسة الوليد للإنسانية"
                width={200}
                height={48}
                loading="lazy"
                decoding="async"
                className="h-12 max-h-12 w-auto max-w-[200px] object-contain brightness-0 invert drop-shadow-lg"
              />
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.dropdown ? (
                  <div>
                    <button
                      type="button"
                      className="w-full text-right text-white/80 font-semibold text-sm py-3 px-4 rounded-xl font-cairo transition-all hover:bg-white/10 hover:text-[#C9A84C] flex items-center justify-between"
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      aria-haspopup="true"
                      aria-expanded={openDropdown === item.label}
                    >
                      {item.label}
                      <ChevronDown
                        size={14}
                        className="transition-transform duration-300"
                        style={{ transform: openDropdown === item.label ? 'rotate(180deg)' : 'rotate(0)' }}
                      />
                    </button>
                    {openDropdown === item.label && (
                      <div className="mr-4 border-r-2 border-[#C9A84C]/30 pr-4 mt-1 space-y-1">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.page}
                            href={pageToPath[sub.page] || '/'}
                            className="block w-full text-right text-white/60 text-sm py-2 px-3 rounded-lg font-cairo transition-all hover:text-[#C9A84C]"
                            onClick={() => {
                              if (propSetCurrentPage) propSetCurrentPage(sub.page);
                              setMobileOpen(false);
                            }}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={pageToPath[item.page!] || '/'}
                    aria-current={activePage === item.page ? 'page' : undefined}
                    className={`block w-full text-right font-medium text-sm py-3 px-4 rounded-xl font-cairo transition-all ${
                      activePage === item.page
                        ? 'bg-[#C9A84C]/20 text-[#C9A84C]'
                        : 'text-white/80 hover:bg-white/10 hover:text-[#C9A84C]'
                    }`}
                    onClick={() => {
                      if (propSetCurrentPage) propSetCurrentPage(item.page!);
                      setMobileOpen(false);
                    }}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile CTA */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <Link
              href="/apply"
              className="btn-primary w-full justify-center text-sm text-center"
              onClick={() => {
                if (propSetCurrentPage) propSetCurrentPage('apply');
                setMobileOpen(false);
              }}
            >
              تقديم طلب الآن
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-6 space-y-3">
            <a
              href="tel:+966112345678"
              className="flex items-center gap-3 text-white/50 hover:text-white/80 transition-colors text-sm"
            >
              <Phone size={14} />
              <span className="font-cairo">+966 11 234 5678</span>
            </a>
            <a
              href="mailto:info@waleed-foundation.org"
              className="flex items-center gap-3 text-white/50 hover:text-white/80 transition-colors text-sm"
            >
              <Mail size={14} />
              <span className="font-cairo">info@waleed-foundation.org</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
