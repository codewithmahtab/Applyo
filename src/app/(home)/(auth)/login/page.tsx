import { Suspense } from 'react';
import { LoginForm } from '@/components/LoginForm';

export default function Login() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-transparent">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </section>
  );
}
