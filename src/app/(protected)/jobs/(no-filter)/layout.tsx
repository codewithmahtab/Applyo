import Filter from '@/components/Filter';
import SeekerNavbar from '@/components/layout/DashboardNavbar';
import { Loader2 } from 'lucide-react';
import React, { Suspense } from 'react';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="max-w-screen-xl mx-auto flex gap-4 pt-20 md:px-4 px-1 md:pt-24">
      <section className="flex-1 basis-2/3 min-w-1/3 flex justify-center">
        <div className="w-full max-w-screen">
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-64">
                <Loader2 className="size-8 text-primary animate-spin" />
              </div>
            }
          >
            {children}
          </Suspense>
        </div>
      </section>
    </main>
  )
};

export default AppLayout;
