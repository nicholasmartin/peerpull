"use client";

import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
};

const NavLink = ({ href, children }: NavLinkProps) => (
  <Link
    href={href}
    className="text-base font-semibold transition-colors duration-200 text-dark-text/70 hover:text-dark-text"
  >
    {children}
  </Link>
);

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  href?: string;
  [key: string]: any;
};

const Button = ({ children, variant = 'default', className = '', href, ...props }: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-200 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default: "bg-blue-primary text-dark-bg hover:bg-blue-secondary",
    secondary: "bg-dark-card text-dark-text hover:bg-dark-card/80",
    outline: "border border-dark-border text-dark-text hover:bg-dark-card/50",
    ghost: "text-dark-text-muted hover:text-dark-text",
  };

  const sizeClasses = "h-10 py-2 px-4";

  const classes = `${baseStyles} ${variants[variant]} ${sizeClasses} ${className}`;

  if (href) {
    return <Link href={href} className={classes} {...props}>{children}</Link>;
  }

  return <button className={classes} {...props}>{children}</button>;
};

type NavbarProps = {
  user: User | null;
};

export function Navbar({ user }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('#mobile-menu') && !target.closest('#menu-toggle')) {
        setIsMenuOpen(false);
      }
    };

    const handleScroll = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMenuOpen]);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const anchorId = href.startsWith('/#') ? href.substring(2) : href.startsWith('#') ? href.substring(1) : null;
    if (anchorId && window.location.pathname === '/') {
      e.preventDefault();
      setIsMenuOpen(false);
      const element = document.getElementById(anchorId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dark-border bg-dark-bg/90 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="bg-blue-primary rounded-md w-7 h-7 flex items-center justify-center">
              <span className={`${montserrat.className} text-dark-bg font-bold text-sm`}>P</span>
            </div>
            <span className={`${montserrat.className} text-lg font-bold text-dark-text`}>PeerPull</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          <NavLink href="/#problem-solution">Why PeerPull</NavLink>
          <NavLink href="/#how-it-works">How it Works</NavLink>
          <NavLink href="/#faq">FAQ</NavLink>
        </nav>

        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            id="menu-toggle"
            className="md:hidden flex items-center justify-center p-2 rounded-md text-dark-text-muted hover:text-dark-text focus:outline-none transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </>
              )}
            </svg>
          </button>

          {user ? (
            <Button href="/dashboard" variant="default" className="font-medium">Dashboard</Button>
          ) : (
            <>
              <Button href="/signin" variant="ghost" className="hidden sm:inline-flex font-medium">Sign in</Button>
              <Button href="/signup" variant="default" className="font-medium">Sign Up</Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden absolute top-16 inset-x-0 z-50 bg-dark-bg/95 backdrop-blur-lg border-b border-dark-border transform transition-all duration-300 ease-in-out ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
      >
        <div className="container py-6 px-4">
          <nav className="flex flex-col space-y-1">
            {[
              { href: "/#problem-solution", label: "Why PeerPull" },
              { href: "/#how-it-works", label: "How it Works" },
              { href: "/#faq", label: "FAQ" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base font-medium py-3 px-4 rounded-md text-dark-text-muted hover:text-dark-text hover:bg-dark-card/50 transition-colors duration-200"
                onClick={(e) => handleAnchorClick(e, link.href)}
              >
                {link.label}
              </Link>
            ))}
            {/* Only show Sign In in mobile menu if it's hidden in the header */}
            <div className="sm:hidden pt-4 mt-2 border-t border-dark-border">
              <Link
                href="/signin"
                className="block text-base font-medium py-3 px-4 rounded-md text-dark-text-muted hover:text-dark-text hover:bg-dark-card/50 transition-colors duration-200"
              >
                Sign in
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
