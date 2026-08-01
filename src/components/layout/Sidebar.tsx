import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  PlusCircle, 
  Rocket, 
  Network, 
  Terminal, 
  KeyRound, 
  Globe, 
  Plug, 
  Settings,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  activeProjectName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  activeProjectName,
}) => {
  const menuItems = [
    { id: 'overview', label: 'Project Overview', icon: LayoutDashboard, category: 'App' },
    { id: 'projects', label: 'All Projects', icon: FolderKanban, category: 'App' },
    { id: 'wizard', label: 'Create Project Wizard', icon: PlusCircle, category: 'App', highlight: true },
    { id: 'deployments', label: 'Deployments & OpenTofu', icon: Rocket, category: 'Pipeline' },
    { id: 'infrastructure', label: 'Infrastructure Topology', icon: Network, category: 'Pipeline' },
    { id: 'logs', label: 'Live Logs Engine', icon: Terminal, category: 'Observability' },
    { id: 'env', label: 'Environment Secrets', icon: KeyRound, category: 'Management' },
    { id: 'domains', label: 'Custom Domains & SSL', icon: Globe, category: 'Management' },
    { id: 'providers', label: 'Cloud Providers', icon: Plug, category: 'Platform' },
    { id: 'settings', label: 'Platform Settings', icon: Settings, category: 'Platform' },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-[#0b0f19] flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none">
      {/* Active Project Banner */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-1">
          Active Workspace
        </div>
        <div className="flex items-center space-x-2 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500 glow-orange" />
          <span className="text-xs font-semibold text-slate-200 truncate">
            {activeProjectName}
          </span>
          <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 font-mono">
            Pages+Workers
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <div className="px-3 mb-2 text-[10px] uppercase font-bold tracking-wider text-slate-500">
            Navigation
          </div>
          <nav className="space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500/20 via-orange-500/10 to-transparent text-orange-400 border-l-2 border-orange-500 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.highlight && (
                    <span className="text-[9px] font-semibold bg-orange-500 text-white px-1.5 py-0.2 rounded-full">
                      NEW
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 text-xs">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="flex items-center space-x-1.5 text-[11px]">
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>OpenTofu v1.6.2 Engine</span>
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </div>
        <div className="text-[10px] text-slate-500">
          Cloudflare Pages + Workers + D1 + R2 + KV Integration Enabled
        </div>
      </div>
    </aside>
  );
};
