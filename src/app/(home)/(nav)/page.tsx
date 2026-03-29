import SearchBar from '@/components/search/SearchBar';
import { Button } from '@/components/ui/button';
import { TextEffect } from '@/components/ui/text-effect';
import { AnimatedGroup } from '@/components/ui/animated-group';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Cog,
  GraduationCap,
  Handshake,
  HeartPulse,
  Laptop,
  Palette,
  Search,
  Sparkles,
  TrendingUp,
  Trophy,
  User,
  Users,
} from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Find Your Dream Job | Applyo',
  description:
    "Browse 5 lakh+ jobs from top companies. Apply instantly with Applyo — India's fastest growing job portal.",
};

const categories = [
  { name: 'Technology', icon: <Laptop className="w-6 h-6" />, jobs: '50,000+' },
  {
    name: 'Healthcare',
    icon: <HeartPulse className="w-6 h-6" />,
    jobs: '30,000+',
  },
  {
    name: 'Finance',
    icon: <CircleDollarSign className="w-6 h-6" />,
    jobs: '25,000+',
  },
  {
    name: 'Education',
    icon: <GraduationCap className="w-6 h-6" />,
    jobs: '20,000+',
  },
  {
    name: 'Marketing',
    icon: <TrendingUp className="w-6 h-6" />,
    jobs: '18,000+',
  },
  { name: 'Design', icon: <Palette className="w-6 h-6" />, jobs: '15,000+' },
  { name: 'Sales', icon: <Handshake className="w-6 h-6" />, jobs: '22,000+' },
  { name: 'Engineering', icon: <Cog className="w-6 h-6" />, jobs: '35,000+' },
];

const STATS = [
  {
    number: '5M+',
    label: 'Active Jobs',
    icon: <TrendingUp className="size-9" />,
  },
  {
    number: '2M+',
    label: 'Companies',
    icon: <Building2 className="size-9" />,
  },
  { number: '10M+', label: 'Job Seekers', icon: <Users className="size-9" /> },
  {
    number: '500K+',
    label: 'Success Stories',
    icon: <CheckCircle2 className="size-9" />,
  },
];

const howItWorks = [
  {
    step: '1',
    title: 'Create Profile',
    desc: 'Sign up and create your professional profile with your skills, experience, and resume.',
    icon: <User className="w-10 h-10 text-primary-foreground" />,
  },
  {
    step: '2',
    title: 'Search Jobs',
    desc: 'Browse through thousands of job listings matching your skills and preferences.',
    icon: <Search className="w-10 h-10 text-primary-foreground" />,
  },
  {
    step: '3',
    title: 'Apply & Get Hired',
    desc: 'Apply directly to companies and track your application status in real-time.',
    icon: <Trophy className="w-10 h-10 text-primary-foreground" />,
  },
];

export default function Home() {
  return (
    <main className="flex flex-col items-center w-full overflow-hidden relative isolate">
      <div
        aria-hidden
        className="absolute inset-0 isolate hidden opacity-80 contain-strict lg:block -z-10"
      >
        <div className="w-[35rem] h-[80rem] -translate-y-[21.875rem] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(var(--primary-foreground),.08)_0,hsla(var(--primary-foreground),.02)_50%,transparent_80%)]" />
        <div className="h-[80rem] absolute left-0 top-0 w-[15rem] -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(var(--primary-foreground),.06)_0,transparent_80%)] [translate:5%_-50%]" />
        <div className="h-[80rem] -translate-y-[21.875rem] absolute left-0 top-0 w-[15rem] -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(var(--primary-foreground),.04)_0,transparent_80%)]" />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-20 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,hsl(var(--background))_100%)]"
      />

      {/* Hero Section */}
      <section className="w-full min-h-[calc(100vh-100px)] max-w-5xl px-4 pt-10 pb-20 flex flex-col items-center text-center justify-center gap-6 relative">
        <AnimatedGroup
          variants={{
            item: {
              hidden: { opacity: 0, filter: 'blur(12px)', y: 12 },
              visible: {
                opacity: 1,
                filter: 'blur(0px)',
                y: 0,
                transition: { type: 'spring', bounce: 0.3, duration: 1.5 },
              },
            },
          }}
        >
          <Link
            href="/jobs"
            className="hover:bg-transparent bg-primary/5 group mx-auto flex w-fit items-center gap-3 rounded-full border border-primary/10 p-1 pl-4  transition-colors duration-300"
          >
            <span className="text-primary text-xs font-medium flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> 5 lakh+ jobs for you to
              explore
            </span>

            <div className="bg-background group-hover:bg-primary/10 size-7 overflow-hidden rounded-full duration-500 border border-primary/10">
              <div className="flex w-14 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0 h-full">
                <span className="flex size-7 items-center justify-center">
                  <ArrowRight className="size-3.5 text-primary" />
                </span>
                <span className="flex size-7 items-center justify-center">
                  <ArrowRight className="size-3.5 text-primary" />
                </span>
              </div>
            </div>
          </Link>
        </AnimatedGroup>

        <h1 className="flex flex-col sm:flex-row flex-wrap items-center justify-center sm:gap-x-4 font-sans font-normal text-5xl sm:text-7xl lg:text-[100px] leading-tight lg:leading-[100px] tracking-tight mt-2 text-center px-4">
          <TextEffect
            as="span"
            preset="fade-in-blur"
            speedSegment={0.3}
            className="text-foreground"
          >
            Find opportunities
          </TextEffect>
          <TextEffect
            as="span"
            preset="fade-in-blur"
            speedSegment={0.3}
            delay={0.3}
            className="text-primary mt-2 sm:mt-0"
          >
            that match your skills
          </TextEffect>
        </h1>

        <TextEffect
          per="line"
          preset="fade-in-blur"
          speedSegment={0.3}
          delay={0.5}
          as="p"
          className="text-lg text-muted-foreground max-w-xl mx-auto"
        >
          Your next opportunity is one search away. Join millions of
          professionals finding their perfect career match on Applyo.
        </TextEffect>

        <SearchBar variant="hero" className="mt-2" />

        <div className="flex items-center flex-wrap justify-center gap-2 text-sm text-muted-foreground">
          <span>Popular:</span>
          {[
            'React Developer',
            'Product Manager',
            'Data Scientist',
            'UI Designer',
            'Frontend Developer',
          ].map((term) => (
            <Link
              key={term}
              href={`/jobs/search?q=${encodeURIComponent(term)}`}
              className="hover:text-primary transition-colors bg-card px-3 py-1 rounded-full border"
            >
              {term}
            </Link>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="w-full py-8">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center gap-1"
              >
                <div className="text-primary mb-1">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-extrabold">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="w-full max-w-screen-xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Explore by Category
          </h2>
          <p className="text-muted-foreground">
            Find opportunities in your field of expertise
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/jobs/search?q=${encodeURIComponent(category.name)}`}
              className="group flex flex-col items-center text-center p-5 rounded-xl border bg-card hover:border-primary/30 transition-all duration-200 hover:shadow-sm"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                {category.icon}
              </div>
              <h3 className="font-semibold mb-1 text-sm">{category.name}</h3>
              <p className="text-xs text-muted-foreground">
                {category.jobs} jobs
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full bg-secondary/40 py-16">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground">Get hired in 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center group"
              >
                <div className="relative mb-5">
                  <div className="mx-auto w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg mb-6 rotate-3 group-hover:-rotate-3 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full max-w-screen-xl mx-auto px-4 py-16">
        <div className="bg-card rounded-2xl p-8 md:p-12 text-center border">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to find your next opportunity?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of professionals who have found their dream jobs
            through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register">
              <Button size="lg" className="px-8">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/jobs">
              <Button variant="outline" size="lg" className="px-8">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
