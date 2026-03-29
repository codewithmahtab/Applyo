import { PrismaClient, Role, ApplicationStatus } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Clean up existing data ───────────────────────────────────────────────
  await prisma.reviews.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 10);

  // ─── USERS ────────────────────────────────────────────────────────────────
  // 1 employer + 5 candidates (main seed actors)
  const employer = await prisma.user.create({
    data: {
      name: "Marcus Webb",
      email: "marcus.webb@employer.com",
      password: hashedPassword,
      role: Role.EMPLOYER,
      bio: "Talent acquisition lead with 10+ years placing engineers at top-tier companies.",
      headline: "Head of Engineering Talent @ TechCorp",
      phone: "+1-415-555-0192",
      location: "San Francisco, CA",
      avatar:
        "https://randomuser.me/api/portraits/men/32.jpg",
      skills: ["Recruiting", "Talent Strategy", "Employer Branding"],
    },
  });

  const candidates = await Promise.all([
    prisma.user.create({
      data: {
        name: "Priya Sharma",
        email: "priya.sharma@gmail.com",
        password: hashedPassword,
        role: Role.CANDIDATE,
        bio: "Full-stack engineer with 4 years of experience building scalable SaaS products.",
        headline: "Full-Stack Engineer | React · Node.js · AWS",
        phone: "+1-650-555-0147",
        location: "Palo Alto, CA",
        resumeUrl: "https://example.com/resumes/priya-sharma.pdf",
        skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      },
    }),
    prisma.user.create({
      data: {
        name: "James O'Connor",
        email: "james.oconnor@outlook.com",
        password: hashedPassword,
        role: Role.CANDIDATE,
        bio: "Backend-focused developer who loves distributed systems and Rust.",
        headline: "Backend Engineer | Go · Rust · Kubernetes",
        phone: "+1-312-555-0183",
        location: "Chicago, IL",
        resumeUrl: "https://example.com/resumes/james-oconnor.pdf",
        skills: ["Go", "Rust", "Kubernetes", "Docker", "PostgreSQL"],
        avatar: "https://randomuser.me/api/portraits/men/15.jpg",
      },
    }),
    prisma.user.create({
      data: {
        name: "Sofia Martinez",
        email: "sofia.martinez@yahoo.com",
        password: hashedPassword,
        role: Role.CANDIDATE,
        bio: "Product-minded designer who bridges UX and frontend engineering.",
        headline: "Frontend Engineer & UI/UX Designer",
        phone: "+1-305-555-0162",
        location: "Miami, FL",
        resumeUrl: "https://example.com/resumes/sofia-martinez.pdf",
        skills: ["Figma", "React", "CSS", "Tailwind", "User Research"],
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      },
    }),
    prisma.user.create({
      data: {
        name: "Daniel Kim",
        email: "daniel.kim@gmail.com",
        password: hashedPassword,
        role: Role.CANDIDATE,
        bio: "ML engineer specializing in NLP and recommendation systems.",
        headline: "ML Engineer | Python · PyTorch · HuggingFace",
        phone: "+1-206-555-0109",
        location: "Seattle, WA",
        resumeUrl: "https://example.com/resumes/daniel-kim.pdf",
        skills: ["Python", "PyTorch", "HuggingFace", "MLflow", "SQL"],
        avatar: "https://randomuser.me/api/portraits/men/54.jpg",
      },
    }),
    prisma.user.create({
      data: {
        name: "Aisha Patel",
        email: "aisha.patel@protonmail.com",
        password: hashedPassword,
        role: Role.CANDIDATE,
        bio: "DevOps engineer passionate about platform reliability and developer experience.",
        headline: "DevOps / Platform Engineer | AWS · Terraform · CI/CD",
        phone: "+1-512-555-0177",
        location: "Austin, TX",
        resumeUrl: "https://example.com/resumes/aisha-patel.pdf",
        skills: ["AWS", "Terraform", "GitHub Actions", "Prometheus", "Python"],
        avatar: "https://randomuser.me/api/portraits/women/29.jpg",
      },
    }),
  ]);

  const [priya, james, sofia, daniel, aisha] = candidates;

  // ─── COMPANIES ────────────────────────────────────────────────────────────
  const companiesData = [
    {
      name: "Stripe",
      industry: "Fintech",
      location: "San Francisco, CA",
      description:
        "Stripe builds economic infrastructure for the internet, helping millions of businesses accept payments and manage revenue online.",
      website: "https://stripe.com",
      logo: "https://logo.clearbit.com/stripe.com",
      size: "1,000–5,000",
      foundedYear: 2010,
      type: "Private",
    },
    {
      name: "Vercel",
      industry: "Developer Tools",
      location: "San Francisco, CA",
      description:
        "Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.",
      website: "https://vercel.com",
      logo: "https://logo.clearbit.com/vercel.com",
      size: "200–500",
      foundedYear: 2015,
      type: "Private",
    },
    {
      name: "Notion",
      industry: "Productivity Software",
      location: "San Francisco, CA",
      description:
        "Notion is an all-in-one workspace for notes, tasks, wikis, and databases, used by teams around the world.",
      website: "https://notion.so",
      logo: "https://logo.clearbit.com/notion.so",
      size: "200–500",
      foundedYear: 2016,
      type: "Private",
    },
    {
      name: "Figma",
      industry: "Design Software",
      location: "San Francisco, CA",
      description:
        "Figma is a collaborative design tool used by teams to design, prototype, and develop products.",
      website: "https://figma.com",
      logo: "https://logo.clearbit.com/figma.com",
      size: "500–1,000",
      foundedYear: 2012,
      type: "Private",
    },
    {
      name: "Linear",
      industry: "Developer Tools",
      location: "San Francisco, CA",
      description:
        "Linear is the issue tracking tool built for high-performance teams—streamlined for speed and clarity.",
      website: "https://linear.app",
      logo: "https://logo.clearbit.com/linear.app",
      size: "50–200",
      foundedYear: 2019,
      type: "Private",
    },
    {
      name: "Datadog",
      industry: "Cloud Monitoring",
      location: "New York, NY",
      description:
        "Datadog provides monitoring, security, and analytics for cloud-scale infrastructure and applications.",
      website: "https://datadoghq.com",
      logo: "https://logo.clearbit.com/datadoghq.com",
      size: "5,000–10,000",
      foundedYear: 2010,
      type: "Public",
    },
    {
      name: "Shopify",
      industry: "E-commerce",
      location: "Ottawa, Canada",
      description:
        "Shopify is a leading global commerce company, providing trusted tools to start, grow, market, and manage a retail business.",
      website: "https://shopify.com",
      logo: "https://logo.clearbit.com/shopify.com",
      size: "10,000+",
      foundedYear: 2006,
      type: "Public",
    },
    {
      name: "Cloudflare",
      industry: "Networking & Security",
      location: "San Francisco, CA",
      description:
        "Cloudflare is a global network designed to make everything you connect to the internet secure, private, fast, and reliable.",
      website: "https://cloudflare.com",
      logo: "https://logo.clearbit.com/cloudflare.com",
      size: "3,000–5,000",
      foundedYear: 2009,
      type: "Public",
    },
    {
      name: "Plaid",
      industry: "Fintech",
      location: "San Francisco, CA",
      description:
        "Plaid powers the digital financial ecosystem, connecting consumers, financial institutions, and developers.",
      website: "https://plaid.com",
      logo: "https://logo.clearbit.com/plaid.com",
      size: "500–1,000",
      foundedYear: 2013,
      type: "Private",
    },
    {
      name: "Hashicorp",
      industry: "Developer Tools",
      location: "San Francisco, CA",
      description:
        "HashiCorp provides infrastructure automation software for multi-cloud environments.",
      website: "https://hashicorp.com",
      logo: "https://logo.clearbit.com/hashicorp.com",
      size: "1,000–3,000",
      foundedYear: 2012,
      type: "Public",
    },
    {
      name: "Airtable",
      industry: "Productivity Software",
      location: "San Francisco, CA",
      description:
        "Airtable is a low-code platform for building collaborative apps, combining the simplicity of a spreadsheet with database power.",
      website: "https://airtable.com",
      logo: "https://logo.clearbit.com/airtable.com",
      size: "500–1,000",
      foundedYear: 2012,
      type: "Private",
    },
    {
      name: "Confluent",
      industry: "Data Streaming",
      location: "Mountain View, CA",
      description:
        "Confluent is the data streaming company powering the next generation of real-time data pipelines with Apache Kafka.",
      website: "https://confluent.io",
      logo: "https://logo.clearbit.com/confluent.io",
      size: "1,000–3,000",
      foundedYear: 2014,
      type: "Public",
    },
    {
      name: "Twilio",
      industry: "Communications Platform",
      location: "San Francisco, CA",
      description:
        "Twilio is a cloud communications platform that enables developers to build communication features into their applications.",
      website: "https://twilio.com",
      logo: "https://logo.clearbit.com/twilio.com",
      size: "5,000–10,000",
      foundedYear: 2008,
      type: "Public",
    },
    {
      name: "PlanetScale",
      industry: "Database Infrastructure",
      location: "San Francisco, CA",
      description:
        "PlanetScale is a MySQL-compatible serverless database platform built on Vitess, the database technology that scales YouTube.",
      website: "https://planetscale.com",
      logo: "https://logo.clearbit.com/planetscale.com",
      size: "50–200",
      foundedYear: 2018,
      type: "Private",
    },
    {
      name: "Brex",
      industry: "Fintech",
      location: "San Francisco, CA",
      description:
        "Brex offers financial services and software for growing businesses, including corporate cards, business accounts, and expense management.",
      website: "https://brex.com",
      logo: "https://logo.clearbit.com/brex.com",
      size: "1,000–3,000",
      foundedYear: 2017,
      type: "Private",
    },
    {
      name: "Retool",
      industry: "Developer Tools",
      location: "San Francisco, CA",
      description:
        "Retool is the fast way to build internal tools, letting developers drag-and-drop components and connect to any database or API.",
      website: "https://retool.com",
      logo: "https://logo.clearbit.com/retool.com",
      size: "200–500",
      foundedYear: 2017,
      type: "Private",
    },
    {
      name: "Segment",
      industry: "Data & Analytics",
      location: "San Francisco, CA",
      description:
        "Segment is a customer data platform (CDP) that helps companies collect, clean, and control their customer data.",
      website: "https://segment.com",
      logo: "https://logo.clearbit.com/segment.com",
      size: "500–1,000",
      foundedYear: 2011,
      type: "Acquired (Twilio)",
    },
    {
      name: "Sentry",
      industry: "Developer Tools",
      location: "San Francisco, CA",
      description:
        "Sentry is an application monitoring platform that helps developers identify and fix bugs in real time.",
      website: "https://sentry.io",
      logo: "https://logo.clearbit.com/sentry.io",
      size: "500–1,000",
      foundedYear: 2012,
      type: "Private",
    },
    {
      name: "Temporal",
      industry: "Developer Infrastructure",
      location: "Seattle, WA",
      description:
        "Temporal is an open-source workflow orchestration platform that makes it simple to build reliable applications at scale.",
      website: "https://temporal.io",
      logo: "https://logo.clearbit.com/temporal.io",
      size: "200–500",
      foundedYear: 2019,
      type: "Private",
    },
    {
      name: "Render",
      industry: "Cloud Hosting",
      location: "San Francisco, CA",
      description:
        "Render is a unified cloud platform to build and run all your apps and websites with free TLS certificates, global CDN, and auto deploys.",
      website: "https://render.com",
      logo: "https://logo.clearbit.com/render.com",
      size: "50–200",
      foundedYear: 2019,
      type: "Private",
    },
  ];

  const companies = await Promise.all(
    companiesData.map((c) =>
      prisma.company.create({ data: { ...c, ownerId: employer.id } })
    )
  );

  const [
    stripe, vercel, notion, figma, linear,
    datadog, shopify, cloudflare, plaid, hashicorp,
    airtable, confluent, twilio, planetscale, brex,
    retool, segment, sentry, temporal, render,
  ] = companies;

  // ─── JOBS ─────────────────────────────────────────────────────────────────
  const jobsData = [
    // 1
    {
      job_title: "Senior Frontend Engineer",
      employer_name: "Vercel",
      job_description:
        "Join the Vercel product team to build the next generation of frontend tooling. You'll work on the dashboard, CLI, and core DX surfaces used by millions of developers. We move fast, ship often, and care deeply about performance and polish.\n\nResponsibilities:\n- Build and maintain React-based UIs used by millions of developers\n- Collaborate with design and product to define experiences\n- Improve Core Web Vitals across vercel.com and dashboard\n- Mentor junior engineers and contribute to front-end architecture decisions\n\nWe offer competitive equity, remote-first culture, and a $20k/year learning budget.",
      job_location: "Remote (US)",
      job_employment_type_text: "Full-time",
      job_posted_human_readable: "2 days ago",
      salary_min: 160000,
      salary_max: 210000,
      skills: ["React", "TypeScript", "Next.js", "CSS", "Web Performance"],
      experience_level: "Senior",
      companyId: vercel.id,
      postedByUserId: employer.id,
    },
    // 2
    {
      job_title: "Backend Engineer – Payments Infrastructure",
      employer_name: "Stripe",
      job_description:
        "You'll work on Stripe's core payment processing infrastructure that handles millions of transactions per day. Our backend team owns services written in Ruby, Go, and Java that run at enormous scale.\n\nResponsibilities:\n- Design and implement high-throughput payment processing services\n- Own reliability and on-call for critical payment pipelines\n- Collaborate with financial, legal, and compliance teams on new features\n- Drive technical decisions around database sharding and distributed transactions\n\nStripe offers top-of-market compensation, generous parental leave, and strong employee equity.",
      job_location: "San Francisco, CA / New York, NY",
      job_employment_type_text: "Full-time",
      job_posted_human_readable: "5 days ago",
      salary_min: 180000,
      salary_max: 240000,
      skills: ["Go", "Ruby", "Distributed Systems", "PostgreSQL", "AWS"],
      experience_level: "Senior",
      companyId: stripe.id,
      postedByUserId: employer.id,
    },
    // 3
    {
      job_title: "Product Designer",
      employer_name: "Notion",
      job_description:
        "Notion is looking for a Product Designer to join our core product team. You'll shape how millions of people organize their work and knowledge.\n\nResponsibilities:\n- End-to-end design ownership of key product areas\n- Partner closely with engineering and PM to ship high-quality features\n- Conduct user research and translate insights into design decisions\n- Contribute to Notion's design system\n\nWe're a remote-first team. You'll have access to a $2,000/month remote work stipend and a professional development budget.",
      job_location: "Remote",
      job_employment_type_text: "Full-time",
      job_posted_human_readable: "1 week ago",
      salary_min: 140000,
      salary_max: 180000,
      skills: ["Figma", "Prototyping", "User Research", "Design Systems", "Product Thinking"],
      experience_level: "Mid-level",
      companyId: notion.id,
      postedByUserId: employer.id,
    },
    // 4
    {
      job_title: "Staff Machine Learning Engineer",
      employer_name: "Shopify",
      job_description:
        "Shopify's ML team is growing. You'll work on recommendation systems, fraud detection, and merchant intelligence products that power commerce for over 1.7M merchants worldwide.\n\nResponsibilities:\n- Lead design and development of large-scale ML systems\n- Mentor a team of ML engineers and data scientists\n- Partner with product teams to identify high-impact ML opportunities\n- Drive MLOps practices and model observability across the org\n\nBenefits include RSUs, extended health coverage, and a $5k/year learning budget.",
      job_location: "Remote (Canada / US)",
      job_employment_type_text: "Full-time",
      job_posted_human_readable: "3 days ago",
      salary_min: 190000,
      salary_max: 260000,
      skills: ["Python", "PyTorch", "MLflow", "Spark", "Recommendation Systems"],
      experience_level: "Staff",
      companyId: shopify.id,
      postedByUserId: employer.id,
    },
    // 5
    {
      job_title: "Site Reliability Engineer",
      employer_name: "Datadog",
      job_description:
        "Datadog's SRE team ensures our platform—used by thousands of enterprises—stays fast, reliable, and scalable. You'll work with some of the best SREs in the industry.\n\nResponsibilities:\n- Reduce toil through automation and tooling improvements\n- Lead incident response and blameless post-mortems\n- Collaborate with product engineering teams on reliability best practices\n- Define and track SLOs/SLAs for critical platform services\n\nWe offer a hybrid work model, great health benefits, and significant equity upside.",
      job_location: "New York, NY",
      job_employment_type_text: "Full-time",
      job_posted_human_readable: "4 days ago",
      salary_min: 160000,
      salary_max: 210000,
      skills: ["Kubernetes", "Prometheus", "Terraform", "Python", "AWS"],
      experience_level: "Senior",
      companyId: datadog.id,
      postedByUserId: employer.id,
    },
    // 6
    {
      job_title: "Software Engineer – Developer Experience",
      employer_name: "Linear",
      job_description:
        "Linear is building the future of software project management. As a DX engineer, you'll own the developer tooling, CLI, API, and integration ecosystem.\n\nResponsibilities:\n- Build and maintain the Linear API and public developer platform\n- Create CLI tools and GitHub/GitLab integrations\n- Write excellent documentation and developer guides\n- Partner with design on API and SDK ergonomics\n\nLinear is a small team with huge impact. Fully remote, competitive salary and equity.",
      job_location: "Remote",
      job_employment_type_text: "Full-time",
      job_posted_human_readable: "6 days ago",
      salary_min: 150000,
      salary_max: 200000,
      skills: ["TypeScript", "GraphQL", "REST APIs", "CLI Tools", "Developer Relations"],
      experience_level: "Mid-level",
      companyId: linear.id,
      postedByUserId: employer.id,
    },
    // 7
    {
      job_title: "Platform Engineer",
      employer_name: "Cloudflare",
      job_description:
        "Cloudflare's platform team builds internal infrastructure that powers our global network across 300+ data centers. You'll work on systems that touch every product we build.\n\nResponsibilities:\n- Maintain and scale internal compute and deployment platforms\n- Improve CI/CD infrastructure for hundreds of engineers\n- Drive infrastructure-as-code adoption across the organization\n- Collaborate with security to enforce zero-trust principles\n\nCloudflare offers strong benefits, RSUs, and a culture of learning.",
      job_location: "Austin, TX / Remote",
      job_employment_type_text: "Full-time",
      job_posted_human_readable: "1 week ago",
      salary_min: 155000,
      salary_max: 205000,
      skills: ["Terraform", "Kubernetes", "Rust", "CI/CD", "Networking"],
      experience_level: "Senior",
      companyId: cloudflare.id,
      postedByUserId: employer.id,
    },
    // 8
    {
      job_title: "Full Stack Engineer – Financial Data",
      employer_name: "Plaid",
      job_description:
        "Plaid connects financial data across thousands of institutions. You'll build the APIs and dashboards that developers and financial institutions depend on daily.\n\nResponsibilities:\n- Build and maintain RESTful APIs consumed by thousands of fintech developers\n- Develop React dashboards for institutional partners\n- Own data privacy and compliance engineering efforts\n- Participate in technical design reviews and code review\n\nPlaid is committed to equitable compensation and offers a comprehensive benefits package.",
      job_location: "San Francisco, CA",
      job_employment_type_text: "Full-time",
      job_posted_human_readable: "2 weeks ago",
      salary_min: 150000,
      salary_max: 195000,
      skills: ["React", "Node.js", "PostgreSQL", "REST APIs", "Fintech"],
      experience_level: "Mid-level",
      companyId: plaid.id,
      postedByUserId: employer.id,
    },
    // 9
    {
      job_title: "Infrastructure Engineer – Terraform",
      employer_name: "HashiCorp",
      job_description:
        "HashiCorp builds tools like Terraform, Vault, and Consul. You'll work directly on core Terraform Cloud infrastructure that manages millions of runs per day.\n\nResponsibilities:\n- Build and maintain cloud infrastructure backing Terraform Cloud\n- Design scalable multi-tenant compute and state management systems\n- Drive reliability improvements and incident response\n- Collaborate with open-source and enterprise product teams\n\nHashiCorp is remote-first with offices in San Francisco, London, and Sydney.",
      job_location: "Remote",
      job_employment_type_text: "Full-time",
      job_posted_human_readable: "3 days ago",
      salary_min: 165000,
      salary_max: 220000,
      skills: ["Terraform", "Go", "AWS", "GCP", "Distributed Systems"],
      experience_level: "Senior",
      companyId: hashicorp.id,
      postedByUserId: employer.id,
    },
    // 10
    {
      job_title: "Frontend Engineer – Design Systems",
      employer_name: "Figma",
      job_description:
        "You'll help build and scale the design system powering all of Figma's product surfaces—used internally and open-sourced for the design community.\n\nResponsibilities:\n- Build accessible React components with strong visual fidelity\n- Define token architecture and theming strategy\n- Work closely with the Figma design team to dogfood your own work\n- Write comprehensive documentation and contribute to the OSS community\n\nFigma offers generous equity, remote flexibility, and industry-leading health coverage.",
      job_location: "San Francisco, CA / Remote",
      job_employment_type_text: "Full-time",
      job_posted_human_readable: "5 days ago",
      salary_min: 155000,
      salary_max: 205000,
      skills: ["React", "TypeScript", "Design Systems", "Accessibility", "CSS"],
      experience_level: "Senior",
      companyId: figma.id,
      postedByUserId: employer.id,
    },
    // 11
    {
      job_title: "Data Engineer",
      employer_name: "Segment",
      job_description:
        "Segment's data engineering team owns the pipelines that process billions of events per day across the Twilio Customer Data Platform.\n\nResponsibilities:\n- Design and maintain high-throughput event ingestion pipelines\n- Build data quality monitoring and alerting systems\n- Collaborate with data science teams on feature engineering for ML models\n- Drive adoption of dbt, Airflow, and Spark best practices\n\nBenefits include Twilio RSUs, generous PTO, and a strong remote-work culture.",
      job_location: "Remote (US)",
      job_employment_type_text: "Full-time",
      job_posted_human_readable: "1 week ago",
      salary_min: 140000,
      salary_max: 185000,
      skills: ["Python", "Spark", "Airflow", "dbt", "SQL"],
      experience_level: "Mid-level",
      companyId: segment.id,
      postedByUserId: employer.id,
    },
    // 12
    {
      job_title: "Software Engineer – Observability",
      employer_name: "Sentry",
      job_description:
        "Sentry is the go-to platform for application monitoring. Join the core engineering team building the product developers use to catch and fix bugs before users do.\n\nResponsibilities:\n- Build features across Sentry's Python/Django backend and React frontend\n- Improve performance of real-time event ingestion and grouping algorithms\n- Contribute to open-source Sentry SDK ecosystem\n- Work closely with support to resolve complex customer issues\n\nFully remote company, strong work-life balance, and meaningful equity.",
      job_location: "Remote",
      job_employment_type_text: "Full-time",
      job_posted_human_readable: "2 days ago",
      salary_min: 140000,
      salary_max: 185000,
      skills: ["Python", "Django", "React", "TypeScript", "ClickHouse"],
      experience_level: "Mid-level",
      companyId: sentry.id,
      postedByUserId: employer.id,
    },
    // 13
    {
      job_title: "Senior Backend Engineer – Messaging",
      employer_name: "Twilio",
      job_description:
        "Join Twilio's Messaging team and work on the infrastructure that delivers billions of SMS and WhatsApp messages globally every month.\n\nResponsibilities:\n- Own and scale high-availability messaging delivery systems\n- Improve latency and throughput of carrier-grade message queues\n- Contribute to global regulatory compliance for messaging\n- Mentor team members and lead technical design reviews\n\nTwilio offers remote-first culture, stock units, and comprehensive mental health benefits.",
      job_location: "Remote (US)",
      job_employment_type_text: "Full-time",
      job_posted_human_readable: "4 days ago",
      salary_min: 160000,
      salary_max: 215000,
      skills: ["Java", "Kafka", "AWS", "Distributed Systems", "REST APIs"],
      experience_level: "Senior",
      companyId: twilio.id,
      postedByUserId: employer.id,
    },
    // 14
    {
      job_title: "Database Engineer",
      employer_name: "PlanetScale",
      job_description:
        "PlanetScale is scaling the world's databases. You'll work on Vitess—the open-source database clustering system behind YouTube—and the PlanetScale cloud platform.\n\nResponsibilities:\n- Contribute to Vitess and PlanetScale's core database engine\n- Build tools for schema management and zero-downtime migrations\n- Improve query routing, connection pooling, and replication reliability\n- Participate in open-source community and developer advocacy\n\nSmall team, massive impact, and top-of-band compensation for database experts.",
      job_location: "Remote",
      job_employment_type_text: "Full-time",
      job_posted_human_readable: "1 week ago",
      salary_min: 165000,
      salary_max: 230000,
      skills: ["MySQL", "Go", "Vitess", "Distributed Databases", "Kubernetes"],
      experience_level: "Senior",
      companyId: planetscale.id,
      postedByUserId: employer.id,
    },
    // 15
    {
      job_title: "Growth Engineer",
      employer_name: "Brex",
      job_description:
        "Brex's Growth Engineering team drives activation, retention, and expansion across our product. You'll own experiments and features that directly impact revenue and user growth.\n\nResponsibilities:\n- Build and run A/B tests and growth experiments end-to-end\n- Improve onboarding funnels for new business customers\n- Develop analytics dashboards and self-serve reporting tools\n- Collaborate with product, design, and data science\n\nBrex offers competitive salary, strong equity, and an exceptional team culture.",
      job_location: "San Francisco, CA",
      job_employment_type_text: "Full-time",
      job_posted_human_readable: "3 days ago",
      salary_min: 145000,
      salary_max: 195000,
      skills: ["React", "Node.js", "SQL", "Amplitude", "Experimentation"],
      experience_level: "Mid-level",
      companyId: brex.id,
      postedByUserId: employer.id,
    },
    // 16
    {
      job_title: "Software Engineer – Internal Tools",
      employer_name: "Retool",
      job_description:
        "At Retool, we eat our own dog food. The internal tools team builds everything Retool itself uses—from sales tooling to operational dashboards—using Retool.\n\nResponsibilities:\n- Build internal applications that superpower our GTM, support, and ops teams\n- Contribute to Retool's core product based on internal needs\n- Maintain integrations with Salesforce, Zendesk, and other enterprise tools\n- Document and evangelize internal tooling best practices\n\nFull-time in SF or remote. Strong benefits and a tight-knit team culture.",
      job_location: "San Francisco, CA / Remote",
      job_employment_type_text: "Full-time",
      job_posted_human_readable: "2 weeks ago",
      salary_min: 135000,
      salary_max: 175000,
      skills: ["JavaScript", "React", "REST APIs", "SQL", "Salesforce"],
      experience_level: "Mid-level",
      companyId: retool.id,
      postedByUserId: employer.id,
    },
    // 17
    {
      job_title: "Senior Software Engineer – Workflow Engine",
      employer_name: "Temporal",
      job_description:
        "Temporal's core platform team is building the next evolution of durable execution infrastructure. You'll work on the engine that powers mission-critical workflows at Stripe, Netflix, and thousands of other companies.\n\nResponsibilities:\n- Develop and improve the Temporal workflow and activity execution engine\n- Design language SDK integrations (Go, Java, Python, TypeScript)\n- Drive technical direction for workflow versioning and history compression\n- Contribute to open-source Temporal SDKs and community\n\nRemote-first, highly autonomous, competitive salary and meaningful equity.",
      job_location: "Remote",
      job_employment_type_text: "Full-time",
      job_posted_human_readable: "6 days ago",
      salary_min: 170000,
      salary_max: 235000,
      skills: ["Go", "Java", "Distributed Systems", "gRPC", "Kubernetes"],
      experience_level: "Senior",
      companyId: temporal.id,
      postedByUserId: employer.id,
    },
    // 18
    {
      job_title: "DevOps Engineer",
      employer_name: "Render",
      job_description:
        "Render is the fastest-growing cloud platform for developers. Our DevOps team manages the infrastructure that runs thousands of customer applications 24/7.\n\nResponsibilities:\n- Maintain and improve Kubernetes clusters across multiple cloud regions\n- Build monitoring, alerting, and auto-remediation tooling\n- Implement cost optimization strategies across cloud resources\n- Collaborate with product engineering on platform-level features\n\nSmall team, huge opportunity. Equity, full remote, and strong growth trajectory.",
      job_location: "Remote",
      job_employment_type_text: "Full-time",
      job_posted_human_readable: "1 week ago",
      salary_min: 130000,
      salary_max: 175000,
      skills: ["Kubernetes", "AWS", "GCP", "Terraform", "Go"],
      experience_level: "Mid-level",
      companyId: render.id,
      postedByUserId: employer.id,
    },
    // 19
    {
      job_title: "Senior Data Engineer – Streaming",
      employer_name: "Confluent",
      job_description:
        "Confluent is the company behind Apache Kafka. Our engineering team builds the cloud-native streaming platform that Fortune 500 companies rely on for real-time data.\n\nResponsibilities:\n- Build managed Kafka services on AWS, Azure, and GCP\n- Contribute to open-source Kafka and Confluent Schema Registry\n- Design multi-tenant data isolation and quota management systems\n- Drive reliability and SLA improvements across cloud platform offerings\n\nConfluent offers strong equity, comprehensive benefits, and a culture of technical excellence.",
      job_location: "Mountain View, CA / Remote",
      job_employment_type_text: "Full-time",
      job_posted_human_readable: "5 days ago",
      salary_min: 165000,
      salary_max: 225000,
      skills: ["Kafka", "Java", "Scala", "AWS", "Kubernetes"],
      experience_level: "Senior",
      companyId: confluent.id,
      postedByUserId: employer.id,
    },
    // 20
    {
      job_title: "Product Manager – No-Code Platform",
      employer_name: "Airtable",
      job_description:
        "Airtable is looking for a seasoned PM to lead the no-code automation and scripting platform. You'll drive vision, strategy, and execution for features used by power users and enterprise customers alike.\n\nResponsibilities:\n- Define product strategy for Airtable Automations and Scripting\n- Work cross-functionally with engineering, design, and enterprise sales\n- Conduct customer discovery and synthesize insights into roadmap priorities\n- Define success metrics and track feature adoption and retention\n\nAirtable offers generous equity, unlimited PTO, and a collaborative culture.",
      job_location: "San Francisco, CA",
      job_employment_type_text: "Full-time",
      job_posted_human_readable: "3 days ago",
      salary_min: 155000,
      salary_max: 210000,
      skills: ["Product Strategy", "Roadmapping", "SQL", "Customer Discovery", "B2B SaaS"],
      experience_level: "Senior",
      companyId: airtable.id,
      postedByUserId: employer.id,
    },
  ];

  const jobs = await Promise.all(
    jobsData.map((j) => prisma.job.create({ data: j }))
  );

  const [
    jobVercelFE,      // 0
    jobStripeBackend, // 1
    jobNotionDesign,  // 2
    jobShopifyML,     // 3
    jobDatadogSRE,    // 4
    jobLinearDX,      // 5
    jobCloudflarePlatform, // 6
    jobPlaidFS,       // 7
    jobHashiTerraform,// 8
    jobFigmaFE,       // 9
    jobSegmentDE,     // 10
    jobSentryEngineer,// 11
    jobTwilioBackend, // 12
    jobPlanetscaleDB, // 13
    jobBrexGrowth,    // 14
    jobRetoolInternal,// 15
    jobTemporalWorkflow,// 16
    jobRenderDevops,  // 17
    jobConfluentDE,   // 18
    jobAirtablePM,    // 19
  ] = jobs;

  // ─── APPLICATIONS ─────────────────────────────────────────────────────────
  // Priya (React/Node): applied to Vercel FE, Figma FE, Plaid FS, Brex Growth
  await Promise.all([
    prisma.application.create({
      data: {
        userId: priya.id,
        jobId: jobVercelFE.id,
        coverLetter:
          "I've been building high-performance React apps for 4 years and am deeply familiar with Next.js and the Vercel ecosystem—I deploy my personal projects on Vercel and track Core Web Vitals obsessively. I'd love to help millions of developers build faster.",
        resume: "https://example.com/resumes/priya-sharma.pdf",
        status: ApplicationStatus.INTERVIEW,
      },
    }),
    prisma.application.create({
      data: {
        userId: priya.id,
        jobId: jobFigmaFE.id,
        coverLetter:
          "I've been contributing to open-source design systems for 2 years and am passionate about accessible, well-documented component libraries. Figma's approach to bridging design and engineering resonates deeply with how I work.",
        resume: "https://example.com/resumes/priya-sharma.pdf",
        status: ApplicationStatus.REVIEWED,
      },
    }),
    prisma.application.create({
      data: {
        userId: priya.id,
        jobId: jobPlaidFS.id,
        coverLetter:
          "Fintech infrastructure is where I want to grow, and Plaid's API-first approach to financial data is exactly the kind of problem I want to work on. I've built payment integrations on top of Plaid and understand the developer perspective inside-out.",
        resume: "https://example.com/resumes/priya-sharma.pdf",
        status: ApplicationStatus.PENDING,
      },
    }),
    prisma.application.create({
      data: {
        userId: priya.id,
        jobId: jobBrexGrowth.id,
        coverLetter:
          "I enjoy ownership of growth experiments and the tight feedback loop between engineering and business outcomes. At my current company, I led an A/B testing refactor that cut experiment cycle time by 40%.",
        resume: "https://example.com/resumes/priya-sharma.pdf",
        status: ApplicationStatus.REJECTED,
      },
    }),
  ]);

  // James (Go/Rust/K8s): applied to Stripe, Temporal, Cloudflare, Confluent
  await Promise.all([
    prisma.application.create({
      data: {
        userId: james.id,
        jobId: jobStripeBackend.id,
        coverLetter:
          "Payments infrastructure is where I've spent the last 3 years—building high-throughput Go services processing millions of financial events per day. I'm drawn to Stripe's engineering culture and the scale of problems you solve.",
        resume: "https://example.com/resumes/james-oconnor.pdf",
        status: ApplicationStatus.ACCEPTED,
      },
    }),
    prisma.application.create({
      data: {
        userId: james.id,
        jobId: jobTemporalWorkflow.id,
        coverLetter:
          "I've been running Temporal in production for 18 months to orchestrate complex billing workflows, and I've fallen in love with the durable execution model. Contributing to the core engine would be a dream.",
        resume: "https://example.com/resumes/james-oconnor.pdf",
        status: ApplicationStatus.INTERVIEW,
      },
    }),
    prisma.application.create({
      data: {
        userId: james.id,
        jobId: jobCloudflarePlatform.id,
        coverLetter:
          "Cloudflare's global network is a marvel of infrastructure engineering. I've spent years building Kubernetes-based platforms and would love to bring that experience to a company operating at internet scale.",
        resume: "https://example.com/resumes/james-oconnor.pdf",
        status: ApplicationStatus.REVIEWED,
      },
    }),
    prisma.application.create({
      data: {
        userId: james.id,
        jobId: jobConfluentDE.id,
        coverLetter:
          "Kafka is foundational to every real-time system I've built. Contributing to the open-source ecosystem while working on managed cloud Kafka would combine two things I'm deeply passionate about.",
        resume: "https://example.com/resumes/james-oconnor.pdf",
        status: ApplicationStatus.PENDING,
      },
    }),
  ]);

  // Sofia (Design/React): applied to Notion, Linear, Retool, Sentry
  await Promise.all([
    prisma.application.create({
      data: {
        userId: sofia.id,
        jobId: jobNotionDesign.id,
        coverLetter:
          "Notion changed how I think about knowledge management. I've been a power user since 2018 and have redesigned complex templates for 10k+ Notion users. I'd love to shape the product from the inside.",
        resume: "https://example.com/resumes/sofia-martinez.pdf",
        status: ApplicationStatus.INTERVIEW,
      },
    }),
    prisma.application.create({
      data: {
        userId: sofia.id,
        jobId: jobLinearDX.id,
        coverLetter:
          "I use Linear every day and have strong opinions about great developer tooling UX. My background spans both design and frontend, and I think the intersection of DX and design is where I can add the most value.",
        resume: "https://example.com/resumes/sofia-martinez.pdf",
        status: ApplicationStatus.PENDING,
      },
    }),
    prisma.application.create({
      data: {
        userId: sofia.id,
        jobId: jobRetoolInternal.id,
        coverLetter:
          "I've built 15+ internal tools using Retool for operations teams and know the product's strengths and friction points intimately. I'd love to help make those tools even better.",
        resume: "https://example.com/resumes/sofia-martinez.pdf",
        status: ApplicationStatus.REVIEWED,
      },
    }),
    prisma.application.create({
      data: {
        userId: sofia.id,
        jobId: jobSentryEngineer.id,
        coverLetter:
          "I'm a full-stack engineer who leans heavily on Sentry for error monitoring. I've contributed small patches to the open-source SDK and would love to contribute to the product full-time.",
        resume: "https://example.com/resumes/sofia-martinez.pdf",
        status: ApplicationStatus.REJECTED,
      },
    }),
  ]);

  // Daniel (ML): applied to Shopify ML, Segment DE, Confluent, PlanetScale
  await Promise.all([
    prisma.application.create({
      data: {
        userId: daniel.id,
        jobId: jobShopifyML.id,
        coverLetter:
          "I've led ML projects on recommendation systems serving 5M+ users and am eager to scale that expertise to Shopify's 1.7M merchant ecosystem. I believe ML can unlock massive value in commerce discovery and fraud prevention.",
        resume: "https://example.com/resumes/daniel-kim.pdf",
        status: ApplicationStatus.INTERVIEW,
      },
    }),
    prisma.application.create({
      data: {
        userId: daniel.id,
        jobId: jobSegmentDE.id,
        coverLetter:
          "I've worked with Segment's APIs and built pipelines on top of them. I'm excited about working on the infrastructure side—specifically improving the event quality and data reliability that ML teams depend on.",
        resume: "https://example.com/resumes/daniel-kim.pdf",
        status: ApplicationStatus.PENDING,
      },
    }),
    prisma.application.create({
      data: {
        userId: daniel.id,
        jobId: jobConfluentDE.id,
        coverLetter:
          "Real-time feature pipelines are core to modern ML systems, and Kafka is at the heart of that. I'd love to work on the streaming infrastructure that enables the next generation of real-time ML.",
        resume: "https://example.com/resumes/daniel-kim.pdf",
        status: ApplicationStatus.REVIEWED,
      },
    }),
    prisma.application.create({
      data: {
        userId: daniel.id,
        jobId: jobPlanetscaleDB.id,
        coverLetter:
          "Database performance directly impacts ML training and inference pipelines. I've spent significant time optimizing query patterns for ML workloads and am excited about PlanetScale's database-as-infrastructure vision.",
        resume: "https://example.com/resumes/daniel-kim.pdf",
        status: ApplicationStatus.PENDING,
      },
    }),
  ]);

  // Aisha (DevOps): applied to Datadog SRE, Hashicorp, Render DevOps, Cloudflare
  await Promise.all([
    prisma.application.create({
      data: {
        userId: aisha.id,
        jobId: jobDatadogSRE.id,
        coverLetter:
          "I've managed Datadog as a customer for 3 years, designing alert hierarchies for 200+ services. Working at Datadog would let me apply that operational experience to improve the product for every SRE team out there.",
        resume: "https://example.com/resumes/aisha-patel.pdf",
        status: ApplicationStatus.ACCEPTED,
      },
    }),
    prisma.application.create({
      data: {
        userId: aisha.id,
        jobId: jobHashiTerraform.id,
        coverLetter:
          "Terraform is the foundation of every infrastructure I've built. I've written thousands of lines of HCL, built custom providers, and trained teams on infrastructure-as-code best practices. Contributing to Terraform Cloud would be a career highlight.",
        resume: "https://example.com/resumes/aisha-patel.pdf",
        status: ApplicationStatus.INTERVIEW,
      },
    }),
    prisma.application.create({
      data: {
        userId: aisha.id,
        jobId: jobRenderDevops.id,
        coverLetter:
          "Render's developer-friendly approach to cloud hosting is exactly the kind of platform I'd be proud to keep running. I've managed multi-cloud Kubernetes environments at scale and am excited about the challenge at a fast-growing startup.",
        resume: "https://example.com/resumes/aisha-patel.pdf",
        status: ApplicationStatus.PENDING,
      },
    }),
    prisma.application.create({
      data: {
        userId: aisha.id,
        jobId: jobCloudflarePlatform.id,
        coverLetter:
          "I've deployed services on Cloudflare Workers and am a huge fan of the edge computing model. I'd love to help build the internal platform that powers one of the world's largest networks.",
        resume: "https://example.com/resumes/aisha-patel.pdf",
        status: ApplicationStatus.REVIEWED,
      },
    }),
  ]);

  // ─── FAVORITES (saved jobs) ───────────────────────────────────────────────
  const favoritesData = [
    // Priya saves jobs she hasn't applied to yet
    { userId: priya.id, jobId: jobLinearDX.id },
    { userId: priya.id, jobId: jobNotionDesign.id },
    { userId: priya.id, jobId: jobSentryEngineer.id },

    // James saves jobs he's curious about
    { userId: james.id, jobId: jobHashiTerraform.id },
    { userId: james.id, jobId: jobRenderDevops.id },
    { userId: james.id, jobId: jobPlanetscaleDB.id },

    // Sofia saves design/DX-adjacent jobs
    { userId: sofia.id, jobId: jobVercelFE.id },
    { userId: sofia.id, jobId: jobFigmaFE.id },
    { userId: sofia.id, jobId: jobBrexGrowth.id },

    // Daniel saves data-heavy roles
    { userId: daniel.id, jobId: jobDatadogSRE.id },
    { userId: daniel.id, jobId: jobAirtablePM.id },
    { userId: daniel.id, jobId: jobTwilioBackend.id },

    // Aisha saves infrastructure jobs
    { userId: aisha.id, jobId: jobTemporalWorkflow.id },
    { userId: aisha.id, jobId: jobConfluentDE.id },
    { userId: aisha.id, jobId: jobStripeBackend.id },
  ];

  await Promise.all(
    favoritesData.map((f) => prisma.favorite.create({ data: f }))
  );

  // ─── REVIEWS ──────────────────────────────────────────────────────────────
  const reviewsData = [
    {
      userId: james.id,
      jobId: jobStripeBackend.id,
      companyId: stripe.id,
      rating: 5,
      review:
        "Stripe's engineering culture is elite. Code review is thorough but respectful, and the bar for technical excellence is genuinely high. Onboarding took 3 months but I felt supported throughout. Compensation is top of market.",
    },
    {
      userId: priya.id,
      jobId: jobVercelFE.id,
      companyId: vercel.id,
      rating: 5,
      review:
        "The interview process was one of the best I've experienced—practical, respectful of my time, and focused on real engineering challenges. The team ships incredibly fast and cares deeply about developer experience.",
    },
    {
      userId: sofia.id,
      jobId: jobNotionDesign.id,
      companyId: notion.id,
      rating: 4,
      review:
        "Great product to work on and smart colleagues. Design and engineering collaboration is genuinely collaborative, not just lip service. My only note is that priorities can shift quickly, which can be exciting or chaotic depending on your tolerance.",
    },
    {
      userId: aisha.id,
      jobId: jobDatadogSRE.id,
      companyId: datadog.id,
      rating: 5,
      review:
        "Datadog's SRE team is world-class. Blameless post-mortems are taken seriously, on-call rotation is humane, and tooling is genuinely the best I've used. Growth trajectory inside the company is strong.",
    },
    {
      userId: daniel.id,
      jobId: jobShopifyML.id,
      companyId: shopify.id,
      rating: 4,
      review:
        "ML at Shopify is exciting because the impact surface is enormous—millions of merchants benefit from every model improvement. Team is smart and data is plentiful. Process can feel large-company at times, but leadership listens.",
    },
    {
      userId: james.id,
      jobId: jobCloudflarePlatform.id,
      companyId: cloudflare.id,
      rating: 4,
      review:
        "Technical problems at Cloudflare are legitimately hard and interesting. The global network scale means you encounter challenges most engineers never will. Work-life balance is reasonable for the seniority level.",
    },
    {
      userId: priya.id,
      jobId: jobFigmaFE.id,
      companyId: figma.id,
      rating: 5,
      review:
        "Building the design system at Figma is incredibly meta—you design tools for designers using the tool itself. The team genuinely cares about accessibility and quality, which aligns with my values as an engineer.",
    },
    {
      userId: aisha.id,
      jobId: jobHashiTerraform.id,
      companyId: hashicorp.id,
      rating: 5,
      review:
        "HashiCorp has one of the strongest open-source cultures in the industry. The team is thoughtful about OSS/enterprise trade-offs and the engineering bar is very high. Terraform Cloud is a challenging and rewarding product to work on.",
    },
  ];

  await Promise.all(
    reviewsData.map((r) => prisma.reviews.create({ data: r }))
  );

  console.log("✅ Seeding complete!");
  console.log(`   • 6 users (1 employer + 5 candidates)`);
  console.log(`   • 20 companies`);
  console.log(`   • 20 jobs`);
  console.log(`   • 20 applications (PENDING, REVIEWED, INTERVIEW, REJECTED, ACCEPTED)`);
  console.log(`   • 15 saved favorites`);
  console.log(`   • 8 company/job reviews`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });