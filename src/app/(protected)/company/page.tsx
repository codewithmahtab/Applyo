'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAllCompanies } from '@/hooks/useAllCompanies';
import { useMyCompanies } from '@/hooks/useMyCompanies';
import { useUser } from '@/hooks/getUser';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Company = {
  id: string;
  name: string;
  industry?: string;
  location?: string;
  description?: string;
  logo?: string;
};

const CompanyInitial = ({ name, logo }: { name: string; logo?: string }) => (
  <Avatar className="w-10 h-10 rounded-lg shrink-0">
    <AvatarImage src={logo} alt={name} className="object-cover" />
    <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg rounded-lg">
      {name.charAt(0).toUpperCase()}
    </AvatarFallback>
  </Avatar>
);

export default function CompanyPage() {
  const router = useRouter();
  const { data: user } = useUser();
  const { data: myCompanies, isLoading: isLoadingMyCompanies } = useMyCompanies();
  const { data: companies, isLoading: isLoadingAll } = useAllCompanies();

  const handleLoginRedirect = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const x = e?.clientX ?? window.innerWidth / 2;
    const y = e?.clientY ?? window.innerHeight / 2;
    
    sessionStorage.setItem(
      'loginBtnOrigin',
      JSON.stringify({ x, y })
    );
    
    router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-6 mx-auto">
      {/* My Companies */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">My Companies</h1>
          <Button 
            size="sm" 
            className="gap-1.5"
            onClick={(e) => {
              if (!user) {
                handleLoginRedirect(e);
              } else {
                router.push('/company/create');
              }
            }}
          >
            <Plus className="w-4 h-4" />
            Create Company
          </Button>
        </div>

        {isLoadingMyCompanies ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-5 h-32 animate-pulse bg-muted/60 border-transparent rounded-xl" />
            ))}
          </div>
        ) : Array.isArray(myCompanies) && myCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myCompanies.map((company: Company) => (
              <Card
                key={company.id}
                className="p-5 flex flex-col gap-3 hover:shadow-md transition-shadow group cursor-pointer"
                onClick={() => router.push(`/company/${company.id}`)}
              >
                <div className="flex items-center gap-3">
                  <CompanyInitial name={company.name} logo={company.logo} />
                  <div className="min-w-0">
                    <h2 className="font-semibold truncate group-hover:text-primary transition-colors">{company.name}</h2>
                    {company.industry && (
                      <p className="text-xs text-muted-foreground">
                        {company.industry}
                      </p>
                    )}
                  </div>
                </div>

                {company.location && (
                  <p className="text-xs text-muted-foreground">
                    📍 {company.location}
                  </p>
                )}

                {company.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {company.description}
                  </p>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed border-border rounded-xl">
            <Briefcase className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-medium mb-1">No companies yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first company to start posting jobs.
            </p>
            <Button 
              size="sm" 
              variant="outline"
              onClick={(e) => {
                if (!user) {
                  handleLoginRedirect(e);
                } else {
                  router.push('/company/create');
                }
              }}
            >
              Create Company
            </Button>
          </div>
        )}
      </section>

      {/* Explore Companies */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Explore Companies</h2>

        {isLoadingAll ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-5 h-32 animate-pulse bg-muted" />
            ))}
          </div>
        ) : !Array.isArray(companies) || companies.length === 0 ? (
          <p className="text-muted-foreground text-sm">No companies found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((company: Company) => (
              <Card
                key={company.id}
                className="p-5 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer group hover:bg-card/80"
                onClick={() => router.push(`/company/${company.id}`)}
              >
                <div className="flex items-center gap-3">
                  <CompanyInitial name={company.name} logo={company.logo} />
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate group-hover:text-primary">{company.name}</h3>
                    {company.industry && (
                      <p className="text-xs text-muted-foreground">
                        {company.industry}
                      </p>
                    )}
                  </div>
                </div>

                {company.location && (
                  <p className="text-xs text-muted-foreground">
                    📍 {company.location}
                  </p>
                )}

                {company.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {company.description}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
