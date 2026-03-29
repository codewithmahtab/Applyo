'use client';

import { LogoIcon } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useState } from 'react';
import { useLogin } from '@/hooks/useLogin';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';

export function LoginForm({
  className,
  onRegisterClick,
  onSuccess,
  ...props
}: React.ComponentProps<'form'> & { onRegisterClick?: () => void; onSuccess?: () => void; }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const { mutate: login, isPending } = useLogin();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    login(
      {
        email: formData.email.trim(),
        password: formData.password,
      },
      {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          } else if (callbackUrl) {
            router.replace(callbackUrl);
          } else {
            router.replace('/');
          }
        },
        onError: (error: any) => {
          let errorMessage = 'Login failed';
          if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error?.response?.data?.error) {
            errorMessage = error.response.data.error;
          } else if (error?.message) {
            errorMessage = error.message;
          }
          alert(errorMessage);
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "bg-card m-auto h-fit w-full max-w-md rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]",
        className
      )}
      {...props}
    >
      <div className="p-8 pb-6">
        <div>
          <Link href="/" aria-label="go home">
            <TrendingUp className="size-7 text-foreground" />
          </Link>
          <h1 className="mb-1 mt-4 text-xl font-semibold">Sign In to Applyo</h1>
          <p className="text-sm">Welcome back! Sign in to continue</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 w-full">
          <Button
            className="h-11 flex items-center justify-center"
            type="button"
            variant="outline"
            onClick={() => window.location.href = '/api/auth/oauth/google'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 262"
            >
              <path
                fill="#4285f4"
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
              />
              <path
                fill="#34a853"
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
              />
              <path
                fill="#fbbc05"
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
              />
              <path
                fill="#eb4335"
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
              />
            </svg>
            <span>Google</span>
          </Button>
          <Button
            className="h-11 flex items-center justify-center"
            type="button"
            variant="outline"
            onClick={() => window.location.href = '/api/auth/oauth/github'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-5 fill-foreground">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>GitHub</span>
          </Button>
        </div>

        <hr className="my-4 border-dashed" />

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="block text-sm">
              Email Address
            </Label>
            <Input
              type="email"
              required
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isPending}
              className='h-11'
            />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="pwd" className="text-sm">
                Password
              </Label>
              <Button asChild variant="link" size="sm">
                <Link href="#" className="link intent-info variant-ghost text-sm">
                  Forgot your Password?
                </Link>
              </Button>
            </div>
            <Input
              type="password"
              required
              name="password"
              id="pwd"
              value={formData.password}
              onChange={handleChange}
              disabled={isPending}
              className='h-11'
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full h-11">
            {isPending ? 'Signing In...' : 'Sign In'}
          </Button>
        </div>
      </div>

      <div className="bg-muted rounded-(--radius) border p-3">
        <p className="text-accent-foreground text-center text-sm">
          Don't have an account ?
          <Button asChild variant="link" className="px-2">
            <Link
              href="/register"
              onClick={(e) => {
                if (onRegisterClick) {
                  e.preventDefault();
                  onRegisterClick();
                }
              }}
            >
              Create account
            </Link>
          </Button>
        </p>
      </div>
    </form>
  );
}
