'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { useCompanyById } from '@/hooks/useCompanyByID';
import { useUpdateCompany } from '@/hooks/useUpdateCompany';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Globe, MapPin, AlignLeft, Loader2, ArrowLeft, Eye, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const EditPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: company, isLoading } = useCompanyById(id as string);
  const { mutate: updateCompany, isPending } = useUpdateCompany();

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    location: '',
    description: '',
    logo: '',
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        industry: company.industry || '',
        location: company.location || '',
        description: company.description || '',
        logo: company.logo || '',
      });
    }
  }, [company]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!id) return;
    updateCompany(
      { id: id as string, data: formData },
      {
        onSuccess: () => {
          router.push('/company');
        },
        onError: (err) => {
          console.error('Update failed', err);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12 min-h-[50vh]">
        <Loader2 className="size-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-2 px-4 animate-fade-in">
      <div className="mb-3">
        <Link
          href={`/company/${id}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Companies
        </Link>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            Edit Company
          </CardTitle>
          <CardDescription>
            Update your company details and profile information.
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
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Company Name"
                  className="pl-9 bg-background h-11"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="industry" className="text-sm font-medium flex items-center gap-2">
                  Industry
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="Industry"
                    className="pl-9 bg-background h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                  Location
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Location"
                    className="pl-9 bg-background h-11"
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
                  <AvatarImage src={formData.logo} alt="Company Logo" className="object-cover" />
                  <AvatarFallback className="bg-muted text-muted-foreground rounded-lg">
                    <Building2 className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="relative flex-1">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="logo"
                    name="logo"
                    value={formData.logo}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.png"
                    className="pl-9 bg-background h-11"
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
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write a short description about what your company does, its mission, and its culture..."
                  className="min-h-[120px] pl-9 bg-background resize-y"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between items-center border-t border-border/60 pt-6 bg-muted/20">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/company/detail/${id}`)}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <div className="flex gap-3">
              <Button type="button" variant="ghost" onClick={() => router.push('/company')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="min-w-[150px]">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Company'
                )}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EditPage;
