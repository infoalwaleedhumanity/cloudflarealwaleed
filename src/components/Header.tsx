'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X, ChevronDown, Phone, Mail, Search } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface NavDropdownItem {
  label: string;
  page: string;
}

interface NavItem {
  label: string;
  page?: string;
  dropdown?: NavDropdownItem[];
}

const CONTACT = {
  phone: '+966 11 234 5678',
  phoneHref: 'tel:+966112345678',
  email: 'info@waleed-foundation.org',
};

const LOGO_URL = 'https://res.cloudinary.com/wlkrtcrr/image/upload/v1784572343/logo_vkbiil.png';

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

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const activePage = resolveActivePage(pathname);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
      router.push(`/news?q=${encodeURIComponent(query)}`);
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
        className={`fixed left-0 right-0 z-[999] transition-all duration-500 ${
          scrolled ? 'text-[var(--text-strong)]' : 'text-white'
        }`}
        style={{
          top: '0',
          backgroundColor: scrolled ? 'var(--surface)' : 'transparent',
          transform: 'translateZ(0)',
          boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
        }}
      >
        {/* Top Institutional Utility Bar */}
        <div
          className={`hidden lg:block transition-all duration-300 border-b ${
            scrolled ? 'py-1.5 bg-[var(--background)] border-[var(--border)]' : 'py-2 bg-transparent border-white/10'
          }`}
        >
          <div className={`max-w-[1600px] w-full mx-auto px-[var(--page-x)] flex items-center justify-between text-xs font-cairo ${scrolled ? 'text-[var(--text)]' : 'text-white/90'}`}>
            {/* Contact numbers & mail */}
            <div className="flex items-center gap-6">
              <a
                href={CONTACT.phoneHref}
                className="flex items-center gap-2 hover:text-[var(--primary)] transition-colors py-0.5"
                dir="ltr"
              >
                <Phone size={13} className="text-[var(--accent)] shrink-0" />
                <span className="font-sans text-xs tracking-wider font-medium">{CONTACT.phone}</span>
              </a>
              <span className={scrolled ? 'text-[var(--border)]' : 'text-white/25'}>|</span>
              <a
                href={`mailto:${CONTACT.email}`}
                className="flex items-center gap-2 hover:text-[var(--primary)] transition-colors py-0.5"
                dir="ltr"
              >
                <Mail size={13} className="text-[var(--accent)] shrink-0" />
                <span className="font-sans text-xs font-medium">{CONTACT.email}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Primary Navbar Container */}
        <div className="max-w-[1600px] w-full mx-auto px-[var(--page-x)]" style={{ minHeight: 'var(--header-height)' }}>
          <div className="flex items-center justify-between h-full" style={{ minHeight: 'var(--header-height)' }}>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="transition-transform duration-300 group-hover:scale-102">
                <Image
                  src={LOGO_URL}
                  alt="مؤسسة الوليد للإنسانية"
                  width={320}
                  height={80}
                  priority
                  className={`h-13 md:h-16 lg:h-18 max-h-20 w-auto max-w-[280px] md:max-w-[340px] lg:max-w-[380px] object-contain transition-all duration-300 ${
                    scrolled ? '' : 'brightness-0 invert drop-shadow-lg'
                  }`}
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
                        className={`nav-link flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[15px] font-bold font-cairo transition-all cursor-pointer ${
                          scrolled
                            ? 'text-[var(--text-strong)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5'
                            : 'text-white hover:text-[var(--accent)] hover:bg-white/10'
                        }`}
                        onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                        aria-haspopup="true"
                        aria-expanded={openDropdown === item.label}
                      >
                        {item.label}
                        <ChevronDown
                          size={15}
                          className={`transition-transform duration-300 ${scrolled ? 'text-[var(--primary)]' : 'text-[var(--accent)]'}`}
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
                              className="dropdown-item w-full text-right font-semibold"
                              onClick={() => {
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
                      className={`nav-link px-3.5 py-2 rounded-xl text-[15px] font-bold font-cairo transition-all ${
                        activePage === item.page
                          ? scrolled
                            ? 'text-[var(--primary)] active font-bold bg-[var(--primary)]/8 shadow-sm'
                            : 'text-[var(--accent)] active font-bold bg-white/15 shadow-sm'
                          : scrolled
                            ? 'text-[var(--text-strong)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5'
                            : 'text-white hover:text-[var(--accent)] hover:bg-white/10'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA & Search & Language Buttons */}
            <div className="hidden xl:flex items-center gap-3">
              {/* Primary Accent CTA */}
              <Link
                href="/apply"
                className="bg-[var(--primary)] hover:bg-[var(--secondary)] text-white font-extrabold text-[15px] py-2.5 px-7 rounded-[var(--radius-default)] hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_6px_22px_rgba(var(--primary-rgb),0.35)] flex items-center gap-2 font-cairo cursor-pointer"
              >
                <span>تقديم طلب</span>
              </Link>

              {/* Search Toggle */}
              <button
                type="button"
                onClick={() => setShowSearch((prev) => !prev)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 cursor-pointer border ${
                  scrolled
                    ? 'bg-[var(--primary)]/5 hover:bg-[var(--primary)]/10 border-[var(--border)] text-[var(--text-strong)]'
                    : 'bg-white/10 hover:bg-white/20 backdrop-blur-md border-white/20 text-white'
                }`}
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
              className={`xl:hidden w-11 h-11 rounded-[var(--radius-default)] border flex items-center justify-center transition-all cursor-pointer ${
                scrolled
                  ? 'bg-[var(--primary)]/5 hover:bg-[var(--primary)]/10 border-[var(--border)] text-[var(--text-strong)]'
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
              }`}
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Search Modal Bar */}
        {showSearch && (
          <div className="bg-[var(--primary)] border-b border-white/20 backdrop-blur-xl py-4 px-6 transition-all duration-300">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
              <Search className="text-[var(--accent)] shrink-0" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="ابحث عن برنامج، مشروع، أو خيارات التقديم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white placeholder-white/50 text-base focus:outline-none font-cairo"
              />
              <button type="submit" className="text-[var(--accent)] hover:text-white text-sm px-2 font-cairo cursor-pointer">
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
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between gap-3 mb-6 pb-5 border-b border-white/15">
            <Image
              src={LOGO_URL}
              alt="مؤسسة الوليد للإنسانية"
              width={220}
              height={55}
              className="h-12 max-h-13 w-auto max-w-[210px] object-contain brightness-0 invert drop-shadow-md"
            />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer shrink-0"
              aria-label="إغلاق القائمة"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.dropdown ? (
                  <div>
                    <button
                      type="button"
                      className="w-full text-right text-white font-bold text-base py-3 px-4 rounded-xl font-cairo transition-all hover:bg-white/10 hover:text-[var(--accent)] flex items-center justify-between"
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      aria-haspopup="true"
                      aria-expanded={openDropdown === item.label}
                    >
                      {item.label}
                      <ChevronDown
                        size={16}
                        className="transition-transform duration-300 text-[var(--accent)]"
                        style={{ transform: openDropdown === item.label ? 'rotate(180deg)' : 'rotate(0)' }}
                      />
                    </button>
                    {openDropdown === item.label && (
                      <div className="mr-4 border-r-2 border-[var(--accent)]/40 pr-4 mt-1 space-y-1">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.page}
                            href={pageToPath[sub.page] || '/'}
                            className="block w-full text-right text-white/90 font-semibold text-sm py-2 px-3 rounded-lg font-cairo transition-all hover:text-[var(--accent)] hover:bg-white/10"
                            onClick={() => {
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
                    className={`block w-full text-right font-bold text-base py-3 px-4 rounded-xl font-cairo transition-all ${
                      activePage === item.page
                        ? 'bg-white/20 text-[var(--accent)]'
                        : 'text-white hover:bg-white/10 hover:text-[var(--accent)]'
                    }`}
                    onClick={() => {
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
                setMobileOpen(false);
              }}
            >
              تقديم طلب الآن
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-6 space-y-3">
            <a
              href={CONTACT.phoneHref}
              className="flex items-center gap-3 text-white/50 hover:text-white/80 transition-colors text-sm"
            >
              <Phone size={14} />
              <span className="font-cairo">{CONTACT.phone}</span>
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="flex items-center gap-3 text-white/50 hover:text-white/80 transition-colors text-sm"
            >
              <Mail size={14} />
              <span className="font-cairo">{CONTACT.email}</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
