import { Deployment, DeploymentStep, LogEntry } from '../types';

export type DeploymentListener = (deployment: Deployment) => void;

class DeploymentRunner {
  private listeners: Map<string, Set<DeploymentListener>> = new Map();

  public subscribe(deploymentId: string, listener: DeploymentListener) {
    if (!this.listeners.has(deploymentId)) {
      this.listeners.set(deploymentId, new Set());
    }
    this.listeners.get(deploymentId)!.add(listener);

    return () => {
      this.listeners.get(deploymentId)?.delete(listener);
    };
  }

  private notify(deployment: Deployment) {
    const set = this.listeners.get(deployment.id);
    if (set) {
      set.forEach(cb => cb(deployment));
    }
  }

  public async startDeployment(
    projectName: string,
    templateName: string,
    infraDetails: string,
    onUpdate: (dep: Deployment) => void
  ): Promise<Deployment> {
    const deploymentId = `dep-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    
    const initialSteps: DeploymentStep[] = [
      { id: 'step-1', name: 'Create GitHub Repository & Sync Template', status: 'pending' },
      { id: 'step-2', name: 'Generate OpenTofu HCL Infrastructure Blueprint', status: 'pending' },
      { id: 'step-3', name: 'OpenTofu Init & Plan Execution', status: 'pending' },
      { id: 'step-4', name: 'Provision Cloud Resources (Cloudflare / AWS)', status: 'pending' },
      { id: 'step-5', name: 'Inject Encrypted Secrets & Environment Variables', status: 'pending' },
      { id: 'step-6', name: 'Build Source Bundle & Deploy Edge CDN Artifacts', status: 'pending' },
      { id: 'step-7', name: 'Verify Edge Health Checks & DNS Propagation', status: 'pending' },
    ];

    const currentDeployment: Deployment = {
      id: deploymentId,
      projectId: 'proj-nexus-app',
      projectName: projectName,
      deploymentNumber: Math.floor(40 + Math.random() * 50),
      commitHash: Math.random().toString(16).substring(2, 9),
      commitMessage: `deploy: initialize ${projectName} (${templateName})`,
      author: 'Arun Dev',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'QUEUED',
      startedAt: now.toISOString(),
      currentStep: 'Initializing execution context...',
      steps: initialSteps,
      logs: [
        {
          id: 'log-0',
          timestamp: new Date().toLocaleTimeString(),
          level: 'INFO',
          service: 'Orchestrator',
          message: `Queued deployment #${deploymentId} for project '${projectName}'`,
        },
      ],
    };

    onUpdate(currentDeployment);

    // Run async steps simulation
    this.runPipeline(currentDeployment, onUpdate);

    return currentDeployment;
  }

  private async runPipeline(deployment: Deployment, onUpdate: (dep: Deployment) => void) {
    const stepsConfig = [
      {
        stepIdx: 0,
        currentStepMsg: 'Setting up GitHub Repository...',
        logs: [
          { service: 'GitHub App', level: 'INFO' as const, msg: 'Connecting to GitHub Account arunkabish1...' },
          { service: 'GitHub App', level: 'INFO' as const, msg: `Repository arunkabish1/${projectName} created successfully.` },
          { service: 'GitHub App', level: 'INFO' as const, msg: 'Pushed template starter code to branch main.' },
        ],
        delay: 1500,
      },
      {
        stepIdx: 1,
        currentStepMsg: 'Synthesizing OpenTofu Manifest...',
        logs: [
          { service: 'OpenTofu Engine', level: 'INFO' as const, msg: 'Analyzing project infrastructure selection...' },
          { service: 'OpenTofu Engine', level: 'INFO' as const, msg: 'Generated HCL blueprint for Cloudflare Pages, Workers, D1 & R2.' },
        ],
        delay: 1800,
      },
      {
        stepIdx: 2,
        currentStepMsg: 'Running OpenTofu Init & Plan...',
        logs: [
          { service: 'OpenTofu Runner', level: 'INFO' as const, msg: 'Initializing provider plugins (cloudflare v4.25.0)...' },
          { service: 'OpenTofu Runner', level: 'INFO' as const, msg: `Connected to Cloudflare Account 39cd6e21a6317ad90e471a9b70a463af.` },
          { service: 'OpenTofu Runner', level: 'INFO' as const, msg: 'Plan: 4 to add, 0 to change, 0 to destroy.' },
        ],
        delay: 2200,
      },
      {
        stepIdx: 3,
        currentStepMsg: 'Provisioning Cloud Resources...',
        logs: [
          { service: 'Cloudflare Provider', level: 'INFO' as const, msg: `Creating Cloudflare Pages project ${projectName}...` },
          { service: 'Cloudflare Provider', level: 'INFO' as const, msg: `Allocating Cloudflare D1 Relational DB ${projectName}_db...` },
          { service: 'Cloudflare Provider', level: 'INFO' as const, msg: `Creating Cloudflare R2 bucket ${projectName}-storage-bucket...` },
          { service: 'Cloudflare Provider', level: 'INFO' as const, msg: 'Apply complete! Resources: 4 added, 0 changed, 0 destroyed.' },
        ],
        delay: 3000,
      },
      {
        stepIdx: 4,
        currentStepMsg: 'Configuring Environment Secrets...',
        logs: [
          { service: 'Secret Manager', level: 'INFO' as const, msg: 'Encrypting secrets for Production environment...' },
          { service: 'Secret Manager', level: 'INFO' as const, msg: `Synced binding DATABASE_URL -> d1://${projectName}_db` },
        ],
        delay: 1500,
      },
      {
        stepIdx: 5,
        currentStepMsg: 'Building Application Bundle...',
        logs: [
          { service: 'Build Engine', level: 'INFO' as const, msg: 'Executing build pipeline...' },
          { service: 'Build Engine', level: 'INFO' as const, msg: 'Compiled application bundle & edge functions.' },
          { service: 'Cloudflare CDN', level: 'INFO' as const, msg: 'Deployed artifacts across Cloudflare global edge network.' },
        ],
        delay: 2800,
      },
      {
        stepIdx: 6,
        currentStepMsg: 'Running Final Edge Health Checks...',
        logs: [
          { service: 'Health Check', level: 'INFO' as const, msg: `Ping GET https://${projectName}.pages.dev -> 200 OK (12ms)` },
          { service: 'Health Check', level: 'INFO' as const, msg: 'Deployment finished cleanly. Edge status: ACTIVE' },
        ],
        delay: 1200,
      },
    ];

    deployment.status = 'BUILDING';
    onUpdate({ ...deployment });

    for (const config of stepsConfig) {
      // Mark step in progress
      deployment.steps[config.stepIdx].status = 'in_progress';
      deployment.currentStep = config.currentStepMsg;
      onUpdate({ ...deployment });

      await new Promise(r => setTimeout(r, config.delay));

      // Append logs
      for (const l of config.logs) {
        const entry: LogEntry = {
          id: `log-${Math.random()}`,
          timestamp: new Date().toLocaleTimeString(),
          level: l.level,
          service: l.service,
          message: l.msg,
        };
        deployment.logs.push(entry);
      }

      deployment.steps[config.stepIdx].status = 'completed';
      onUpdate({ ...deployment });
    }

    deployment.status = 'SUCCESS';
    deployment.currentStep = 'Deployment Ready & Active';
    deployment.durationMs = 14200;
    onUpdate({ ...deployment });
  }
}

export const deploymentRunner = new DeploymentRunner();
