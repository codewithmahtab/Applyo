import DashboardNavbar from '@/components/layout/DashboardNavbar';
import React from 'react';

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <header className="fixed top-0 left-0 z-50 w-full bg-card border-b">
        <div className="max-w-screen-xl px-2 md:px-4 mx-auto">
          <DashboardNavbar />
        </div>
      </header>

      {children}
    </div>
  );
};

export default ProfileLayout;
