'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser, UserProfile } from '@/hooks/getUser';
import { useUpdateUser } from '@/hooks/useUpdateUser';
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Briefcase,
  GraduationCap,
  Tag,
  Link as LinkIcon,
  Plus,
  X,
  CheckCircle2,
  Camera,
} from 'lucide-react';

type TabType = 'overview' | 'skills' | 'resume';

export default function ProfilePage() {
  const { data: user, isLoading } = useUser();
  const { mutate: updateUser, isPending, isSuccess } = useUpdateUser();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [form, setForm] = useState({
    name: '',
    email: '',
    bio: '',
    headline: '',
    phone: '',
    location: '',
    resumeUrl: '',
    avatar: '',
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        headline: user.headline || '',
        phone: user.phone || '',
        location: user.location || '',
        resumeUrl: user.resumeUrl || '',
        avatar: user.avatar || '',
      });
      setSkills(user.skills || []);
    }
  }, [user]);

  const handleSave = () => {
    updateUser({ ...form, skills });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) =>
    setSkills((prev) => prev.filter((s) => s !== skill));

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <User className="h-4 w-4" /> },
    { key: 'skills', label: 'Skills', icon: <Tag className="h-4 w-4" /> },
    { key: 'resume', label: 'Resume', icon: <FileText className="h-4 w-4" /> },
  ];

  return (
    <div className="max-w-7xl mt-15 mx-auto space-y-5 p-4 md:p-6 animate-fade-in">
      {/* Profile Header Card */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* Cover */}
        <div className="h-28 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />

        <div className="px-6 pb-5 -mt-12 flex flex-col sm:flex-row gap-4">
          {/* Avatar */}
          <div className="relative w-20 h-20 shrink-0">
            <Avatar className="w-20 h-20 ring-4 ring-background">
              <AvatarImage src={form.avatar} alt={form.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                {form.name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary/80 transition-colors">
              <Camera className="h-3 w-3" />
            </button>
          </div>

          {/* Name & Headline */}
          <div className="flex-1 pt-3 sm:pt-10">
            <h1 className="text-xl font-bold">{form.name || 'Your Name'}</h1>
            <p className="text-muted-foreground text-sm">
              {form.headline || 'Add your headline'}
            </p>
            {form.location && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <MapPin className="h-3 w-3" /> {form.location}
              </span>
            )}
          </div>

          <div className="sm:pt-10 flex items-end">
            <Button
              onClick={handleSave}
              disabled={isPending}
              size="sm"
              className="gap-1.5"
            >
              {saved ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Saved!
                </>
              ) : isPending ? (
                'Saving...'
              ) : (
                'Save Profile'
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
        {activeTab === 'overview' && (
          <>
            <h2 className="font-semibold text-base">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" /> Full Name
                </label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> Email
                </label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5" /> Professional Headline
                </label>
                <Input
                  value={form.headline}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, headline: e.target.value }))
                  }
                  placeholder="Senior Software Engineer at Google"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> Phone
                </label>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> Location
                </label>
                <Input
                  value={form.location}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, location: e.target.value }))
                  }
                  placeholder="Bangalore, India"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <Camera className="h-3.5 w-3.5" /> Avatar URL
                </label>
                <Input
                  type="url"
                  value={form.avatar}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, avatar: e.target.value }))
                  }
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Bio / About
              </label>
              <Textarea
                value={form.bio}
                onChange={(e) =>
                  setForm((p) => ({ ...p, bio: e.target.value }))
                }
                placeholder="Tell employers a bit about yourself, your experience, and what you're looking for..."
                rows={4}
              />
            </div>
          </>
        )}

        {activeTab === 'skills' && (
          <>
            <h2 className="font-semibold text-base">Skills</h2>
            <p className="text-sm text-muted-foreground">
              Add your technical and soft skills to help employers find you.
            </p>

            {/* Skill Input */}
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                placeholder="e.g. React, Python, Project Management..."
                className="flex-1"
              />
              <Button onClick={addSkill} variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Skills Tags */}
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="hover:text-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Tag className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No skills added yet</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'resume' && (
          <>
            <h2 className="font-semibold text-base">Resume</h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <LinkIcon className="h-3.5 w-3.5" /> Resume URL
                </label>
                <Input
                  type="url"
                  value={form.resumeUrl}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, resumeUrl: e.target.value }))
                  }
                  placeholder="https://drive.google.com/your-resume or LinkedIn URL"
                />
                <p className="text-xs text-muted-foreground">
                  Share a link to your resume (Google Drive, Dropbox, LinkedIn,
                  etc.)
                </p>
              </div>

              {form.resumeUrl && (
                <a
                  href={form.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <FileText className="h-4 w-4" />
                  View Resume
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
