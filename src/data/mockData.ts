import { ProjectTemplate, Project, Deployment, CloudProviderConnection, EnvVariable, CustomDomain } from '../types';

export const INITIAL_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'cloudflare-nextjs-tailwind',
    name: 'nextjs-cloudflare-tailwind',
    title: 'Cloudflare + Next.js + Tailwind',
    description: 'Next.js App Router optimized for Cloudflare Pages & Workers, styled with Tailwind CSS, D1 database, and R2 object storage.',
    icon: 'Zap',
    tags: ['Recommended', 'Next.js 14', 'Tailwind CSS', 'Cloudflare Pages', 'D1', 'R2'],
    requires: {
      frontend: true,
      backend: true,
      database: 'optional',
    },
    supportedProviders: {
      frontend: ['cloudflare-pages', 'vercel', 'aws-amplify'],
      backend: ['cloudflare-workers', 'aws-ecs'],
      database: ['cloudflare-d1', 'aws-rds-postgres'],
      storage: ['cloudflare-r2', 'aws-s3'],
    },
    defaultStack: {
      frontend: 'Cloudflare Pages',
      backend: 'Cloudflare Workers (Edge Functions)',
      database: 'Cloudflare D1 (SQLite Edge)',
      storage: 'Cloudflare R2 Storage',
      cache: 'Cloudflare KV Store',
    },
  },
  {
    id: 'hono-worker-api',
    name: 'hono-worker-api',
    title: 'Hono Edge API + Cloudflare Workers',
    description: 'Ultra-fast lightweight REST API framework running on Cloudflare Workers edge nodes with D1 SQLite database integration.',
    icon: 'Server',
    tags: ['Edge', 'Hono.js', 'Workers', 'D1', 'TypeScript'],
    requires: {
      frontend: false,
      backend: true,
      database: 'required',
    },
    supportedProviders: {
      frontend: [],
      backend: ['cloudflare-workers'],
      database: ['cloudflare-d1'],
      storage: ['cloudflare-r2'],
    },
    defaultStack: {
      frontend: 'None',
      backend: 'Cloudflare Workers API',
      database: 'Cloudflare D1',
      cache: 'Cloudflare KV',
    },
  },
  {
    id: 'react-vite-spa',
    name: 'react-vite-spa',
    title: 'React + Vite SPA Dashboard',
    description: 'High-performance React Single Page Application deployed to global CDN with instant cache purging.',
    icon: 'Atom',
    tags: ['React 18', 'Vite', 'Global CDN', 'Pages'],
    requires: {
      frontend: true,
      backend: false,
      database: 'none',
    },
    supportedProviders: {
      frontend: ['cloudflare-pages', 'aws-s3-cloudfront'],
      backend: [],
      database: [],
      storage: ['cloudflare-r2'],
    },
    defaultStack: {
      frontend: 'Cloudflare Pages',
    },
  },
  {
    id: 'astro-static-blog',
    name: 'astro-static-blog',
    title: 'Astro 4 Content Engine',
    description: 'Content-driven SSG/SSR platform with zero JavaScript runtime overhead, connected to Cloudflare KV for edge caching.',
    icon: 'Rocket',
    tags: ['Astro 4', 'Markdown', 'Edge Cache', 'Pages'],
    requires: {
      frontend: true,
      backend: false,
      database: 'optional',
    },
    supportedProviders: {
      frontend: ['cloudflare-pages'],
      backend: ['cloudflare-workers'],
      database: ['cloudflare-d1'],
      storage: ['cloudflare-r2'],
    },
    defaultStack: {
      frontend: 'Cloudflare Pages',
      cache: 'Cloudflare KV',
    },
  },
  {
    id: 'fastify-microservice',
    name: 'fastify-microservice',
    title: 'Fastify Node.js Backend',
    description: 'High throughput Node.js microservice deployed on AWS ECS Fargate with PostgreSQL database.',
    icon: 'Cpu',
    tags: ['Fastify', 'AWS ECS', 'PostgreSQL', 'Docker'],
    requires: {
      frontend: false,
      backend: true,
      database: 'required',
    },
    supportedProviders: {
      frontend: [],
      backend: ['aws-ecs'],
      database: ['aws-rds-postgres'],
      storage: ['aws-s3'],
    },
    defaultStack: {
      frontend: 'None',
      backend: 'AWS ECS Fargate',
      database: 'AWS RDS PostgreSQL',
    },
  },
];

export const INITIAL_PROVIDERS: CloudProviderConnection[] = [
  {
    id: 'prov-cf-1',
    type: 'cloudflare',
    name: 'Cloudflare Account (arunkabish1)',
    status: 'connected',
    accountId: '39cd6e21a6317ad90e471a9b70a463af',
    zonesCount: 0,
    resourcesCount: 0,
    connectedAt: new Date().toISOString(),
  },
];

export const INITIAL_PROJECTS: Project[] = [];

export const INITIAL_DEPLOYMENTS: Deployment[] = [];

export const INITIAL_ENV_VARS: EnvVariable[] = [];

export const INITIAL_DOMAINS: CustomDomain[] = [];
