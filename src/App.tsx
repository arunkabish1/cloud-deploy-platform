import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ProjectOverview } from './components/dashboard/ProjectOverview';
import { ProjectWizard } from './components/wizard/ProjectWizard';
import { DeploymentMonitor } from './components/deployments/DeploymentMonitor';
import { LiveLogsViewer } from './components/logs/LiveLogsViewer';
import { InfrastructureCanvas } from './components/infrastructure/InfrastructureCanvas';
import { EnvVarManager } from './components/env/EnvVarManager';
import { DomainManager } from './components/domains/DomainManager';
import { ProviderSettings } from './components/providers/ProviderSettings';
import { ApiTokenManager } from './components/credentials/ApiTokenManager';

import { 
  INITIAL_PROJECTS, 
  INITIAL_DEPLOYMENTS, 
  INITIAL_ENV_VARS, 
  INITIAL_DOMAINS, 
  INITIAL_PROVIDERS 
} from './data/mockData';

import { Project, Deployment, ProjectTemplate } from './types';
import { deploymentRunner } from './services/deploymentRunner';
import { InfrastructureSelection } from './services/opentofu';
import { FolderPlus, Rocket, Plus } from 'lucide-react';

export const App: React.FC = () => {
  const [runnerMode, setRunnerMode] = useState<'browser' | 'external'>('browser');
  const [activeTab, setActiveTab] = useState<string>('credentials'); // Open Credentials tab by default for clear setup!

  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeProject, setActiveProject] = useState<Project | null>(INITIAL_PROJECTS[0] || null);

  const [deployments, setDeployments] = useState<Deployment[]>(INITIAL_DEPLOYMENTS);
  const [activeDeployment, setActiveDeployment] = useState<Deployment | null>(INITIAL_DEPLOYMENTS[0] || null);

  // Toggle Runner Mode Option
  const handleToggleRunnerMode = () => {
    setRunnerMode(prev => (prev === 'browser' ? 'external' : 'browser'));
  };

  // Trigger New Deployment
  const handleTriggerDeployment = async (targetProj?: Project) => {
    const projToDeploy = targetProj || activeProject;
    if (!projToDeploy) return;

    setActiveTab('deployments');
    const newDep = await deploymentRunner.startDeployment(
      projToDeploy.name,
      'Cloudflare + Next.js + Tailwind',
      'Pages, Workers, D1, R2, KV',
      updatedDep => {
        setActiveDeployment(updatedDep);
        setDeployments(prev => {
          const idx = prev.findIndex(d => d.id === updatedDep.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = updatedDep;
            return next;
          }
          return [updatedDep, ...prev];
        });
      },
      runnerMode
    );
    setActiveDeployment(newDep);
  };

  // Complete Wizard Creation
  const handleCompleteWizard = async (
    projectName: string,
    template: ProjectTemplate,
    infra: InfrastructureSelection
  ) => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: projectName,
      slug: projectName.toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
      organization: 'arunkabish1',
      templateId: template.id,
      repoUrl: `github.com/arunkabish1/${projectName}`,
      branch: 'main',
      status: 'deploying',
      environment: 'production',
      liveUrl: `https://${projectName}.pages.dev`,
      primaryProvider: 'cloudflare',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resources: [
        {
          id: `r-${Date.now()}-1`,
          category: 'frontend',
          provider: 'cloudflare',
          serviceName: infra.frontend,
          type: 'Web Application Engine',
          status: 'active',
          details: { Subdomain: `${projectName}.pages.dev`, Framework: template.title },
        },
        {
          id: `r-${Date.now()}-2`,
          category: 'backend',
          provider: 'cloudflare',
          serviceName: infra.backend,
          type: 'Edge Middleware',
          status: 'active',
          details: { Routes: '/api/*', AccountID: '39cd6e21a6317ad90e471a9b70a463af' },
        },
        {
          id: `r-${Date.now()}-3`,
          category: 'database',
          provider: 'cloudflare',
          serviceName: infra.database,
          type: 'Relational Database',
          status: 'active',
          details: { DBName: `${projectName}_db` },
        },
      ],
    };

    setProjects([newProj, ...projects]);
    setActiveProject(newProj);

    // Launch pipeline
    await handleTriggerDeployment(newProj);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      {/* Header Bar */}
      <Header
        runnerMode={runnerMode}
        onToggleRunnerMode={handleToggleRunnerMode}
        onNewProject={() => setActiveTab('wizard')}
        activeTab={activeTab}
        onTabChange={tab => setActiveTab(tab)}
      />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={tab => setActiveTab(tab)}
          activeProjectName={activeProject?.name || 'No Project Selected'}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 p-8 overflow-y-auto max-w-7xl">
          {activeTab === 'credentials' && <ApiTokenManager />}

          {activeTab === 'overview' && (
            <ProjectOverview
              project={activeProject}
              recentDeployments={deployments}
              onTriggerDeploy={() => handleTriggerDeployment()}
              onNavigateTab={tab => setActiveTab(tab)}
              onCreateProject={() => setActiveTab('wizard')}
            />
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-slate-100">All Cloud Projects</h1>
                  <p className="text-xs text-slate-400">Deployed across Cloudflare Account 39cd6e21a6317ad90e471a9b70a463af</p>
                </div>
                <button
                  onClick={() => setActiveTab('wizard')}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-lg shadow-orange-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Project</span>
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="glass-panel p-12 rounded-2xl text-center space-y-4">
                  <FolderPlus className="w-12 h-12 text-slate-500 mx-auto" />
                  <p className="text-sm text-slate-300">No active projects found.</p>
                  <button
                    onClick={() => setActiveTab('wizard')}
                    className="px-6 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-semibold"
                  >
                    Launch Project Creation Wizard
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setActiveProject(p);
                        setActiveTab('overview');
                      }}
                      className="glass-card p-5 rounded-2xl cursor-pointer hover:border-orange-500 transition-all border border-slate-800"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-bold text-slate-100">{p.name}</h3>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono">
                          {p.status}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-slate-400">{p.liveUrl}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'wizard' && (
            <ProjectWizard
              onCompleteWizard={handleCompleteWizard}
              onCancel={() => setActiveTab('overview')}
            />
          )}

          {activeTab === 'deployments' && (
            activeDeployment ? (
              <DeploymentMonitor
                deployment={activeDeployment}
                onViewLogs={() => setActiveTab('logs')}
              />
            ) : (
              <div className="glass-panel p-12 rounded-2xl text-center space-y-4">
                <Rocket className="w-12 h-12 text-slate-500 mx-auto" />
                <p className="text-sm text-slate-300">No active deployment executions yet.</p>
                <button
                  onClick={() => setActiveTab('wizard')}
                  className="px-6 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-semibold"
                >
                  Create & Deploy Project
                </button>
              </div>
            )
          )}

          {activeTab === 'infrastructure' && (
            <InfrastructureCanvas
              resources={activeProject ? activeProject.resources : []}
              projectName={activeProject ? activeProject.name : 'No Project'}
            />
          )}

          {activeTab === 'logs' && (
            <LiveLogsViewer
              logs={activeDeployment ? activeDeployment.logs : []}
              projectName={activeProject ? activeProject.name : 'System'}
            />
          )}

          {activeTab === 'env' && <EnvVarManager initialVars={INITIAL_ENV_VARS} />}

          {activeTab === 'domains' && <DomainManager initialDomains={INITIAL_DOMAINS} />}

          {activeTab === 'providers' && <ProviderSettings providers={INITIAL_PROVIDERS} />}

          {activeTab === 'settings' && (
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h1 className="text-xl font-bold text-slate-100">Platform Settings</h1>
              <p className="text-xs text-slate-400">Configure deployment execution runner and API tokens.</p>
              
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Execution Mode:</span>
                  <span className="text-orange-400 font-bold">{runnerMode.toUpperCase()} RUNNER</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cloudflare Account ID:</span>
                  <span className="text-slate-200">39cd6e21a6317ad90e471a9b70a463af</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">GitHub Owner:</span>
                  <span className="text-slate-200">arunkabish1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">OpenTofu CLI Version:</span>
                  <span className="text-slate-200">v1.6.2</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
