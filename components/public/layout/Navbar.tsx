"use client";

import Link from 'next/link';
import Image from 'next/image';
// Light theme only - no theme switching
import { User } from '@supabase/supabase-js';

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
  // Using light theme only
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-prussian-blue">PeerPull</span>
          </Link>
        </div>
        <nav className="hidden md:flex gap-6">
          <NavLink href="#problem">Problem</NavLink>
          <NavLink href="#solution">Solution</NavLink>
          <NavLink href="#how-it-works">How it Works</NavLink>
          <NavLink href="#use-cases">Use Cases</NavLink>
          <NavLink href="#faq">FAQ</NavLink>
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <Button href="/dashboard" variant="default">Dashboard</Button>
          ) : (
            <>
              <Button href="/signin" variant="ghost">Sign in</Button>
              <Button href="/signup" variant="default">Sign Up</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
