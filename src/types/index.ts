export type DeploymentStatus = 'QUEUED' | 'BUILDING' | 'PROVISIONING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export type CloudProviderType = 'cloudflare' | 'aws' | 'gcp' | 'azure' | 'railway' | 'vercel';

export interface ProjectTemplate {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  tags: string[];
  requires: {
    frontend: boolean;
    backend: boolean;
    database: 'optional' | 'required' | 'none';
  };
  supportedProviders: {
    frontend: string[];
    backend: string[];
    database: string[];
    storage: string[];
  };
  defaultStack: {
    frontend: string;
    backend?: string;
    database?: string;
    storage?: string;
    cache?: string;
  };
}

export interface ResourceConfig {
  id: string;
  category: 'frontend' | 'backend' | 'database' | 'storage' | 'cache' | 'queue' | 'dns' | 'email';
  provider: CloudProviderType;
  serviceName: string; // e.g. "Cloudflare Pages", "Cloudflare Workers", "D1 Database", "AWS ECS"
  type: string;
  status: 'active' | 'provisioning' | 'paused' | 'error';
  details?: Record<string, string>;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  organization: string;
  templateId: string;
  repoUrl: string;
  branch: string;
  status: 'healthy' | 'deploying' | 'failed' | 'idle';
  environment: 'production' | 'preview' | 'development';
  liveUrl?: string;
  primaryProvider: CloudProviderType;
  resources: ResourceConfig[];
  createdAt: string;
  updatedAt: string;
  lastDeployment?: Deployment;
}

export interface DeploymentStep {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  logs?: string[];
}

export interface Deployment {
  id: string;
  projectId: string;
  projectName: string;
  deploymentNumber: number;
  commitHash: string;
  commitMessage: string;
  author: string;
  avatarUrl: string;
  status: DeploymentStatus;
  startedAt: string;
  durationMs?: number;
  currentStep: string;
  steps: DeploymentStep[];
  logs: LogEntry[];
  opentofuHcl?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  service: string;
  deploymentId?: string;
  message: string;
  metadata?: Record<string, string | number>;
  requestId?: string;
}

export interface EnvVariable {
  id: string;
  key: string;
  value: string;
  environments: ('development' | 'preview' | 'production')[];
  isSecret: boolean;
  updatedAt: string;
}

export interface DnsRecord {
  type: 'A' | 'AAAA' | 'CNAME' | 'TXT';
  name: string;
  value: string;
  status: 'active' | 'pending';
}

export interface CustomDomain {
  id: string;
  domain: string;
  status: 'verified' | 'pending' | 'failed';
  sslStatus: 'active' | 'issuing' | 'expired';
  dnsRecords: DnsRecord[];
  createdAt: string;
}

export interface CloudProviderConnection {
  id: string;
  type: CloudProviderType;
  name: string;
  status: 'connected' | 'error' | 'unverified';
  accountId?: string;
  zonesCount?: number;
  resourcesCount: number;
  connectedAt: string;
}
