import React from 'react';
import { 
  Cloud, 
  ChevronDown, 
  Plus, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Bell, 
  ExternalLink,
  Activity
} from 'lucide-react';

interface HeaderProps {
  runnerMode: 'browser' | 'external';
  onToggleRunnerMode: () => void;
  onNewProject: () => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({
  runnerMode,
  onToggleRunnerMode,
  onNewProject,
}) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-[#0d1322]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand & Organization */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Cloud className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                NIMBUS
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/30 rounded-full">
                CLOUDFLARE+
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Deployment Orchestration Engine</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-6 w-[1px] bg-slate-800" />

        {/* Organization Switcher */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-200 cursor-pointer hover:bg-slate-800/60 transition-all">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>arunkabish1</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* Center Actions: Runner Mode Toggle & Status */}
      <div className="flex items-center space-x-4">
        {/* Runner Mode Switcher (User Option) */}
        <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-1 text-xs">
          <button
            onClick={onToggleRunnerMode}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md font-medium transition-all ${
              runnerMode === 'browser'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Fast in-browser simulated OpenTofu runner"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>In-Browser Runner</span>
          </button>
          <button
            onClick={onToggleRunnerMode}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md font-medium transition-all ${
              runnerMode === 'external'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            title="External Node.js / OpenTofu API Runner Service"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>External API Runner</span>
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        {/* Create Project Button */}
        <button
          onClick={onNewProject}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/25 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Project</span>
        </button>

        <div className="h-6 w-[1px] bg-slate-800" />

        {/* Notifications & User Profile */}
        <button className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500" />
        </button>

        <div className="flex items-center space-x-2.5 pl-2">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            alt="User avatar"
            className="w-8 h-8 rounded-full border border-orange-500/40 object-cover ring-2 ring-orange-500/20"
          />
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-200">Arun Dev</p>
            <p className="text-[10px] text-slate-400">Platform Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};
