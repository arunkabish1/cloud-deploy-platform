import React from 'react';
import { ResourceConfig } from '../../types';
import { 
  Network, 
  Globe, 
  Server, 
  Database, 
  HardDrive, 
  Zap, 
  Layers, 
  CheckCircle2, 
  RefreshCw, 
  ExternalLink,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface InfrastructureCanvasProps {
  resources: ResourceConfig[];
  projectName: string;
}

export const InfrastructureCanvas: React.FC<InfrastructureCanvasProps> = ({ resources, projectName }) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">
            Phase 12 Visual Infrastructure Engine
          </span>
          <h1 className="text-xl font-bold text-slate-100">Infrastructure Topology & Provisioned Stack</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Interconnected resources managed by OpenTofu Cloudflare Provider Blueprint.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>OpenTofu State Synced</span>
          </span>
        </div>
      </div>

      {/* Interactive Visual Graph Canvas */}
      <div className="glass-panel p-8 rounded-2xl space-y-8 relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 relative z-10 flex items-center space-x-2">
          <Network className="w-4 h-4 text-orange-400" />
          <span>Interactive Resource Graph</span>
        </div>

        {/* Nodes Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {/* Node 1: Entry Point / Frontend (Pages) */}
          <div className="glass-card p-5 rounded-2xl border-2 border-orange-500/40 relative shadow-xl shadow-orange-500/5 group hover:border-orange-500 transition-all">
            <div className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider">
              Edge Entrypoint
            </div>
            
            <div className="flex items-center space-x-3 mt-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Cloudflare Pages</h3>
                <p className="text-[11px] font-mono text-slate-400">Next.js App Router Bundle</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 font-mono text-[11px] text-slate-300 space-y-1 border border-slate-900 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Subdomain:</span>
                <span className="text-orange-300 font-bold">{projectName}.pages.dev</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Framework:</span>
                <span className="text-slate-200">Next.js + Tailwind</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-emerald-400 font-semibold">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>320 PoP Locations Active</span>
              </span>
            </div>
          </div>

          {/* Node 2: Middleware & Worker API */}
          <div className="glass-card p-5 rounded-2xl border-2 border-amber-500/40 relative shadow-xl shadow-amber-500/5 group hover:border-amber-500 transition-all">
            <div className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider">
              Serverless Edge API
            </div>

            <div className="flex items-center space-x-3 mt-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Cloudflare Workers</h3>
                <p className="text-[11px] font-mono text-slate-400">workerd V8 Isolated Runtime</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 font-mono text-[11px] text-slate-300 space-y-1 border border-slate-900 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Routes:</span>
                <span className="text-amber-300 font-bold">/api/*</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bindings:</span>
                <span className="text-slate-200">DB, R2, KV</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-emerald-400 font-semibold">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>0ms Cold Starts</span>
              </span>
            </div>
          </div>

          {/* Node 3: Storage & Databases (D1 + R2 + KV) */}
          <div className="glass-card p-5 rounded-2xl border-2 border-blue-500/40 relative shadow-xl shadow-blue-500/5 group hover:border-blue-500 transition-all space-y-3">
            <div className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider">
              Data & Storage Tier
            </div>

            <div className="flex items-center space-x-3 mt-2">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Cloudflare D1</h4>
                <p className="text-[10px] font-mono text-slate-400">SQLite Relational DB</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Cloudflare R2</h4>
                <p className="text-[10px] font-mono text-slate-400">Zero Egress Storage</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Cloudflare KV</h4>
                <p className="text-[10px] font-mono text-slate-400">Ultra Low Latency Cache</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
