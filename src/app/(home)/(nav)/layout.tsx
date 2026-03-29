import PublicNavbar from '@/components/layout/PublicNavbar';

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <header className="fixed top-0 left-0 z-50 w-full px-4">
        <div className="max-w-screen-xl mx-auto flex justify-center">
          <div className="w-full">
            <PublicNavbar />
          </div>
        </div>
      </header>
      <main className="max-w-screen mx-auto flex gap-4 pt-20 md:px-0 px-1 md:pt-18">
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
};

export default HomeLayout;