'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCreateCompany } from '@/hooks/useCreateCompany';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Globe, MapPin, AlignLeft, Loader2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const CreateCompanyPage = () => {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');

  const router = useRouter();

  const { mutate: createCompany, isPending: isLoading } = useCreateCompany();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createCompany(
      { name, industry, location, description, logo },
      {
        onSuccess: () => {
          router.push('/company');
        },
        onError: (error) => {
          console.error('Error creating company:', error);
        },
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto py-2 px-4 animate-fade-in">
      <div className="mb-3">
        <Link
          href="/company"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Companies
        </Link>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" />
            Create a New Company
          </CardTitle>
          <CardDescription>
            Add your company details to start posting jobs and attracting top talent.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                Company Name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., TechVision Ltd."
                  className="pl-9 bg-background h-11"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="industry" className="text-sm font-medium flex items-center gap-2">
                  Industry <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g., Information Technology"
                    className="pl-9 bg-background h-11"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                  Location <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Bangalore, India"
                    className="pl-9 bg-background h-11"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo" className="text-sm font-medium flex items-center gap-2">
                Logo URL
              </Label>
              <div className="flex gap-4 items-start">
                <Avatar className="h-16 w-16 border rounded-lg shadow-sm">
                  <AvatarImage src={logo} alt="Company Logo" className="object-cover" />
                  <AvatarFallback className="bg-muted text-muted-foreground rounded-lg">
                    <Building2 className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="relative flex-1">
                  <Input
                    id="logo"
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="pl-3 bg-background h-11"
                  />
                  <p className="text-xs text-muted-foreground mt-2">Provide a direct link to an image to use as your company logo.</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                Description
              </Label>
              <div className="relative">
                <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write a short description about what your company does, its mission, and its culture..."
                  className="min-h-[120px] pl-9 bg-background resize-y"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end border-t border-border/60 pt-6 bg-muted/20">
            <Button type="button" variant="ghost" onClick={() => router.push('/company')} className="mr-3">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="min-w-[150px]">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Company'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateCompanyPage;
