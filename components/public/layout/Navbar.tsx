"use client";

import Link from 'next/link';
import Image from 'next/image';
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
    className={`text-sm font-medium transition-all duration-200 text-dark-text-muted hover:text-dark-text relative group`}
  >
    <span className="relative z-10">{children}</span>
    <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-gradient-to-r from-blue-primary to-teal-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
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
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-primary/30 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-gradient-to-r from-blue-primary to-teal-accent text-white hover:shadow-lg hover:shadow-blue-primary/20",
    secondary: "bg-dark-card text-dark-text hover:bg-dark-card/80",
    outline: "border border-glass-border backdrop-blur-sm text-dark-text hover:border-glass-highlight hover:bg-glass-highlight/10",
    ghost: "text-dark-text-muted hover:text-dark-text hover:bg-dark-card/30",
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
  
  // Close mobile menu when clicking outside or on a link
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('#mobile-menu') && !target.closest('#menu-toggle')) {
        setIsMenuOpen(false);
      }
    };
    
    // Close menu when scrolling
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
  
  // Handle anchor link clicks to close menu and smooth scroll
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      setIsMenuOpen(false);
      
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-glass-border bg-dark-bg/80 backdrop-blur-lg shadow-md">
      {/* Subtle glass reflection */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-glass-highlight to-transparent opacity-30"></div>
      
      <div className="container flex h-16 items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-primary to-teal-accent rounded-md w-8 h-8 flex items-center justify-center shadow-sm">
              <span className={`${montserrat.className} text-dark-text font-bold text-lg`}>P</span>
            </div>
            <span className={`${montserrat.className} text-xl font-bold bg-gradient-to-r from-blue-primary to-teal-accent bg-clip-text text-transparent`}>PeerPull</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          <NavLink href="#problem">Problem</NavLink>
          <NavLink href="#solution">Solution</NavLink>
          <NavLink href="#how-it-works">How it Works</NavLink>
          <NavLink href="#use-cases">Use Cases</NavLink>
          <NavLink href="#faq">FAQ</NavLink>
        </nav>
        
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button 
            id="menu-toggle"
            className="md:hidden flex items-center justify-center p-2 rounded-md text-dark-text hover:bg-dark-card/50 focus:outline-none transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
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
        className={`md:hidden absolute top-16 inset-x-0 z-50 bg-dark-bg/95 backdrop-blur-lg border-b border-glass-border shadow-lg transform transition-all duration-300 ease-in-out ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
      >
        <div className="container py-6 px-4">
          <nav className="flex flex-col space-y-2">
            <Link 
              href="#problem" 
              className="text-base font-medium py-3 px-4 rounded-md hover:bg-dark-card/50 text-dark-text transition-colors duration-200 border border-transparent hover:border-glass-border/20"
              onClick={(e) => handleAnchorClick(e, '#problem')}
            >
              Problem
            </Link>
            <Link 
              href="#solution" 
              className="text-base font-medium py-3 px-4 rounded-md hover:bg-dark-card/50 text-dark-text transition-colors duration-200 border border-transparent hover:border-glass-border/20"
              onClick={(e) => handleAnchorClick(e, '#solution')}
            >
              Solution
            </Link>
            <Link 
              href="#how-it-works" 
              className="text-base font-medium py-3 px-4 rounded-md hover:bg-dark-card/50 text-dark-text transition-colors duration-200 border border-transparent hover:border-glass-border/20"
              onClick={(e) => handleAnchorClick(e, '#how-it-works')}
            >
              How it Works
            </Link>
            <Link 
              href="#use-cases" 
              className="text-base font-medium py-3 px-4 rounded-md hover:bg-dark-card/50 text-dark-text transition-colors duration-200 border border-transparent hover:border-glass-border/20"
              onClick={(e) => handleAnchorClick(e, '#use-cases')}
            >
              Use Cases
            </Link>
            <Link 
              href="#faq" 
              className="text-base font-medium py-3 px-4 rounded-md hover:bg-dark-card/50 text-dark-text transition-colors duration-200 border border-transparent hover:border-glass-border/20"
              onClick={(e) => handleAnchorClick(e, '#faq')}
            >
              FAQ
            </Link>
            {/* Only show Sign In in mobile menu if it's hidden in the header */}
            <div className="sm:hidden pt-4 mt-2 border-t border-glass-border/30">
              <Link 
                href="/signin" 
                className="block text-base font-medium py-3 px-4 rounded-md hover:bg-dark-card/50 text-dark-text transition-colors duration-200 border border-transparent hover:border-glass-border/20"
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
