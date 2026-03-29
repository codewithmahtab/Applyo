'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TrendingUp, User, FileText, Heart, Building2 } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/hooks/getUser';
import ThemeToggle from '@/components/ThemeToggle';
import { useEffect, useState, useRef } from 'react';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LogoutButton from '@/components/LogoutButton';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const PublicNavbar = () => {
  const { data: user, isLoading } = useUser();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const loginBtnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginClick = () => {
    if (loginBtnRef.current) {
      const rect = loginBtnRef.current.getBoundingClientRect();
      // Store the center of the login button
      sessionStorage.setItem(
        'loginBtnOrigin',
        JSON.stringify({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        })
      );
    }
  };

  return (
    <header className="w-full flex justify-center">
      <div
        className={cn(
          'mt-2 w-full flex items-center justify-between px-6 py-2 md:py-3 transition-all duration-500 ease-in-out z-50 rounded-full lg:px-10',
          scrolled
            ? 'bg-background/70 shadow-lg shadow-black/10 dark:shadow-black/30 border border-border/60 backdrop-blur-md max-w-4xl'
            : 'bg-transparent border-transparent max-w-6xl'
        )}
      >
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <TrendingUp className="size-5 text-foreground" />
          <span className="font-bold text-lg hidden sm:block">Applyo</span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/jobs"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Jobs
          </Link>
          <Link
            href="/company"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Companies
          </Link>
          <Link
            href="/jobs"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Services
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {isLoading ? (
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-16 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          ) : !user ? (
            <>
              {/* LOGIN BUTTON — capture its screen position before navigating */}
              <Link href={`/login?callbackUrl=${encodeURIComponent(pathname)}`} ref={loginBtnRef} onClick={handleLoginClick}>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full bg-transparent"
                >
                  Login
                </Button>
              </Link>

              <Link href="/register">
                <Button size="sm" className="rounded-full">
                  Register
                </Button>
              </Link>
            </>
          ) : (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                      {user.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2 !p-2 cursor-pointer">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/jobs/applied" className="flex items-center gap-2 !p-2 cursor-pointer">
                    <FileText className="h-4 w-4" /> My Applications
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/jobs/saved" className="flex items-center gap-2 !p-2 cursor-pointer">
                    <Heart className="h-4 w-4" /> Saved Jobs
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/company" className="flex items-center gap-2 !p-2 cursor-pointer">
                    <Building2 className="h-4 w-4" /> My Companies
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <LogoutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;