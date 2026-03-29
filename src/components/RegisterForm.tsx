'use client';

import { LogoIcon } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useState } from 'react';
import { userRegister } from '@/hooks/useRegister';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const router = useRouter();
  const { mutate: register, isPending, error } = userRegister();

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

    register(
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      },
      {
        onSuccess: () => {
          router.push('/jobs');
        },
        onError: (error: any) => {
          alert(error.response?.data?.message || 'Registration failed');
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
      <div className="p-8 pb-6 pt-2">
        <div>
          <h1 className="mb-1 mt-4 text-xl font-semibold">Sign Up for Applyo</h1>
          <p className="text-sm">Create your account to get started</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button type="button" variant="outline" className='h-11'>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="0.98em"
              height="1em"
              viewBox="0 0 256 262">
              <path
                fill="#4285f4"
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
              <path
                fill="#34a853"
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
              <path
                fill="#fbbc05"
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"></path>
              <path
                fill="#eb4335"
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
            </svg>
            <span>Google</span>
          </Button>
          <Button type="button" variant="outline" className='h-11'>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24">
              <path fill="#0a66c2" d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06c0-1.14.92-2.06 2.06-2.06c1.14 0 2.06.92 2.06 2.06c0 1.14-.92 2.06-2.06 2.06zM20.45 20.45h-3.56v-5.61c0-1.34-.03-3.06-1.87-3.06c-1.87 0-2.15 1.46-2.15 2.96v5.71h-3.56V9h3.42v1.56h.05c.48-.9 1.63-1.85 3.37-1.85c3.6 0 4.27 2.37 4.27 5.45v6.29z" />
            </svg>
            <span>LinkedIn</span>
          </Button>
        </div>

        <hr className="my-4 border-dashed" />

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="block text-sm">
              Full Name
            </Label>
            <Input
              type="text"
              required
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isPending}
              className='h-11'
            />
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="pwd" className="text-sm">
              Password
            </Label>
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
            {isPending ? 'Creating account...' : 'Create Account'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-destructive text-sm text-center pb-2">
          {error.response?.data?.message || 'Registration failed'}
        </div>
      )}

      <div className="bg-muted rounded-(--radius) border p-3">
        <p className="text-accent-foreground text-center text-sm">
          Already have an account?
          <Button
            variant="link"
            className="px-2"
            onClick={() => (window.location.href = "/login")}
          >
            Sign In
          </Button>
        </p>
      </div>
    </form>
  );
}
