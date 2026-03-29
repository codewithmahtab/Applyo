'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Briefcase,
  User,
  FileText,
  Heart,
  LogOut,
  Building2,
  Menu,
  X,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { useUser } from '@/hooks/getUser';
import ThemeToggle from '@/components/ThemeToggle';
import LogoutButton from '@/components/LogoutButton';
import SearchBar from '@/components/search/SearchBar';
import { useFavouriteJobs } from '@/hooks/useFavouriteJobs';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardNavbar = () => {
  const { data: user, isLoading } = useUser();
  const { data: favourites } = useFavouriteJobs();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const savedCount = user && Array.isArray(favourites) ? favourites.length : 0;

  const handleLoginClick = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    sessionStorage.setItem(
      'loginBtnOrigin',
      JSON.stringify({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      })
    );
  };

  const navLinks = [
    { href: '/jobs', label: 'Jobs' },
    { href: '/company', label: 'Companies' },
    { href: '/jobs/saved', label: 'Saved Jobs' },
    { href: '/jobs/applied', label: 'Applied Jobs' },
  ];

  return (
    <header className="w-full h-16 flex items-center bg-card backdrop-blur-md">
      <div className="w-full max-w-screen-xl mx-auto px-0 sm:px-6 flex items-center gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
        >
          <TrendingUp className="size-5" />
          <span className="font-bold text-lg hidden sm:block">Applyo</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 ml-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search Bar */}
        <div className="hidden lg:flex flex-1 mx-4">
          <SearchBar variant="navbar" className="w-full max-w-lg border rounded-full border-border/80 " />
        </div>

        {/* Right Section */}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          {isLoading ? (
            <Skeleton className="h-8 w-8 rounded-full" />
          ) : !user ? (
            <>
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname : '')}`}
                onClick={handleLoginClick}
              >
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          ) : (
            <>
              {/* Post a Job */}
              <Link href="/company" className="hidden sm:block">
                <Button variant="outline" size="sm" className="text-xs">
                  Post a Job
                </Button>
              </Link>

              {/* User Dropdown */}
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 !p-2 cursor-pointer"
                    >
                      <User className="h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/jobs/applied"
                      className="flex items-center gap-2 !p-2 cursor-pointer"
                    >
                      <FileText className="h-4 w-4" /> My Applications
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/jobs/saved"
                      className="flex items-center gap-2 !p-2 cursor-pointer"
                    >
                      <Heart className="h-4 w-4" /> Saved Jobs
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/company" className="flex items-center gap-2 !p-2 cursor-pointer">
                      <Building2 className="h-4 w-4 " /> My Companies
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <LogoutButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b border-border z-50 px-4 py-4 space-y-3 md:hidden">
          <SearchBar variant="navbar" className="w-full" />
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium py-1 text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default DashboardNavbar;
