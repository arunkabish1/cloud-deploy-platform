import React from 'react';
import { Project, Deployment } from '../../types';
import { 
  Globe, 
  GitBranch, 
  CheckCircle2, 
  ExternalLink, 
  RefreshCw, 
  Terminal, 
  Network, 
  ShieldCheck, 
  Database, 
  HardDrive, 
  Zap, 
  Layers, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  Clock,
  Trash2
} from 'lucide-react';

interface ProjectOverviewProps {
  project: Project;
  recentDeployments: Deployment[];
  onTriggerDeploy: () => void;
  onNavigateTab: (tab: string) => void;
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  project,
  recentDeployments,
  onTriggerDeploy,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
        {/* Background Accent Blur */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono font-semibold flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>CLOUDFLARE + NEXT.JS + TAILWIND</span>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>HEALTHY & ACTIVE</span>
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center space-x-3">
                <span>{project.name}</span>
                <span className="text-sm font-normal text-slate-400 font-mono">({project.slug})</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1 flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <GitBranch className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-mono text-slate-300">{project.branch}</span>
                </span>
                <span>•</span>
                <span className="text-slate-300">{project.repoUrl}</span>
                <span>•</span>
                <span className="text-slate-400">Org: {project.organization}</span>
              </p>
            </div>

            {/* Live URL */}
            <div className="flex items-center space-x-2 pt-1">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-orange-400 hover:text-orange-300 text-xs font-mono font-medium hover:border-orange-500/40 transition-all shadow-sm group"
              >
                <Globe className="w-3.5 h-3.5 text-orange-400 group-hover:scale-110 transition-transform" />
                <span>{project.liveUrl}</span>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-orange-400" />
              </a>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onTriggerDeploy}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/25 transition-all transform active:scale-95"
            >
              <RefreshCw className="w-4 h-4 stroke-[2.5]" />
              <span>Redeploy Application</span>
            </button>

            <button
              onClick={() => onNavigateTab('logs')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-all"
            >
              <Terminal className="w-4 h-4 text-slate-400" />
              <span>View Live Logs</span>
            </button>

            <button
              onClick={() => onNavigateTab('infrastructure')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-all"
            >
              <Network className="w-4 h-4 text-slate-400" />
              <span>Topology</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Requests (24h)</span>
            <Activity className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 font-mono">1,482,910</div>
          <div className="flex items-center space-x-1 text-[11px] text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2% vs yesterday</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Avg Edge Latency</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 font-mono">18.4 ms</div>
          <div className="text-[11px] text-slate-400">Global Cloudflare PoPs</div>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Bandwidth Served</span>
            <ArrowUpRight className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 font-mono">42.8 GB</div>
          <div className="text-[11px] text-slate-400">Edge Cache Hit Rate: 98.4%</div>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Error Rate (5xx)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono">0.002%</div>
          <div className="text-[11px] text-slate-400">Health checks passing</div>
        </div>
      </div>

      {/* Infrastructure Components Grid (Cloudflare Pages, Workers, D1, R2, KV) */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-orange-400" />
              <span>Active Infrastructure Components</span>
            </h2>
            <p className="text-xs text-slate-400">Provisioned via OpenTofu Cloudflare Provider Adapter</p>
          </div>
          <button
            onClick={() => onNavigateTab('infrastructure')}
            className="text-xs text-orange-400 hover:text-orange-300 font-medium flex items-center space-x-1"
          >
            <span>View Full Topology</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.resources.map(res => (
            <div key={res.id} className="glass-card p-4 rounded-xl border border-slate-800 hover:border-orange-500/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-slate-800 text-slate-300">
                  {res.category}
                </span>
                <span className="flex items-center space-x-1 text-[10px] font-medium text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="capitalize">{res.status}</span>
                </span>
              </div>
              
              <h3 className="text-sm font-semibold text-slate-200">{res.serviceName}</h3>
              <p className="text-xs text-slate-400 mb-3">{res.type}</p>

              {res.details && (
                <div className="p-2.5 rounded-lg bg-slate-950/60 font-mono text-[11px] text-slate-300 space-y-1 border border-slate-900">
                  {Object.entries(res.details).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-slate-500">{k}:</span>
                      <span className="text-orange-300 truncate max-w-[160px]">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Deployments List */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-orange-400" />
              <span>Recent Deployments</span>
            </h2>
            <p className="text-xs text-slate-400">Automated builds & OpenTofu executions</p>
          </div>
          <button
            onClick={() => onNavigateTab('deployments')}
            className="text-xs text-orange-400 hover:text-orange-300 font-medium flex items-center space-x-1"
          >
            <span>View All Deployments</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {recentDeployments.map(dep => (
            <div
              key={dep.id}
              onClick={() => onNavigateTab('deployments')}
              className="glass-card p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/40 transition-all border border-slate-800/80"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={dep.avatarUrl}
                  alt={dep.author}
                  className="w-9 h-9 rounded-full border border-slate-700 object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-200">#{dep.deploymentNumber}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-semibold">
                      {dep.status}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{dep.commitHash}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">{dep.commitMessage}</p>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-xs text-slate-400 font-mono">
                <div>Duration: {dep.durationMs ? `${(dep.durationMs / 1000).toFixed(1)}s` : '14.2s'}</div>
                <div>{new Date(dep.startedAt).toLocaleTimeString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
