"use client";

import Link from 'next/link';
import Image from 'next/image';
// Light theme only - no theme switching
import { User } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
};

const NavLink = ({ href, children }: NavLinkProps) => (
  <Link href={href} className="text-sm font-medium transition-colors hover:text-primary">
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
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
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
  
  // Using light theme only
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-prussian-blue">PeerPull</span>
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
            className="md:hidden flex items-center justify-center p-2 rounded-md text-prussian-blue hover:bg-gray-100 focus:outline-none"
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
            <Button href="/dashboard" variant="default">Dashboard</Button>
          ) : (
            <>
              <Button href="/signin" variant="ghost" className="hidden sm:inline-flex">Sign in</Button>
              <Button href="/signup" variant="default">Sign Up</Button>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div 
        id="mobile-menu"
        className={`md:hidden absolute top-16 inset-x-0 z-50 bg-white border-b shadow-lg transform transition-transform duration-200 ease-in-out ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="container py-4 px-4">
          <nav className="flex flex-col space-y-4">
            <Link 
              href="#problem" 
              className="text-base font-medium py-2 px-3 rounded-md hover:bg-gray-100 text-prussian-blue"
              onClick={(e) => handleAnchorClick(e, '#problem')}
            >
              Problem
            </Link>
            <Link 
              href="#solution" 
              className="text-base font-medium py-2 px-3 rounded-md hover:bg-gray-100 text-prussian-blue"
              onClick={(e) => handleAnchorClick(e, '#solution')}
            >
              Solution
            </Link>
            <Link 
              href="#how-it-works" 
              className="text-base font-medium py-2 px-3 rounded-md hover:bg-gray-100 text-prussian-blue"
              onClick={(e) => handleAnchorClick(e, '#how-it-works')}
            >
              How it Works
            </Link>
            <Link 
              href="#use-cases" 
              className="text-base font-medium py-2 px-3 rounded-md hover:bg-gray-100 text-prussian-blue"
              onClick={(e) => handleAnchorClick(e, '#use-cases')}
            >
              Use Cases
            </Link>
            <Link 
              href="#faq" 
              className="text-base font-medium py-2 px-3 rounded-md hover:bg-gray-100 text-prussian-blue"
              onClick={(e) => handleAnchorClick(e, '#faq')}
            >
              FAQ
            </Link>
            {/* Only show Sign In in mobile menu if it's hidden in the header */}
            <div className="sm:hidden pt-2 border-t">
              <Link 
                href="/signin" 
                className="block text-base font-medium py-2 px-3 rounded-md hover:bg-gray-100 text-prussian-blue"
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
