import React, { useState } from 'react';
import { Deployment } from '../../types';
import { 
  Rocket, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  Terminal, 
  Code2, 
  ShieldAlert, 
  Copy, 
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface DeploymentMonitorProps {
  deployment: Deployment;
  onViewLogs: () => void;
}

export const DeploymentMonitor: React.FC<DeploymentMonitorProps> = ({
  deployment,
  onViewLogs,
}) => {
  const [showHcl, setShowHcl] = useState(false);
  const [copiedHcl, setCopiedHcl] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>DEPLOYMENT SUCCESS</span>
          </span>
        );
      case 'BUILDING':
      case 'PROVISIONING':
        return (
          <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold flex items-center space-x-1.5 animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>RUNNING OPENTOFU PIPELINE</span>
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Pipeline Card */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-orange-400 font-mono">
                Deployment #{deployment.deploymentNumber} ({deployment.id})
              </span>
              {getStatusBadge(deployment.status)}
            </div>

            <h1 className="text-xl font-bold text-slate-100">{deployment.commitMessage}</h1>
            
            <p className="text-xs text-slate-400 font-mono flex items-center space-x-3">
              <span>Commit: {deployment.commitHash}</span>
              <span>•</span>
              <span>Author: {deployment.author}</span>
              <span>•</span>
              <span>Started: {new Date(deployment.startedAt).toLocaleTimeString()}</span>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onViewLogs}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold shadow-lg shadow-orange-500/20"
            >
              <Terminal className="w-4 h-4" />
              <span>Full Log Stream</span>
            </button>
          </div>
        </div>

        {/* Current Step Banner */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-3 text-xs font-mono">
          <Loader2 className="w-4 h-4 text-orange-400 animate-spin" />
          <span className="text-slate-400">Current Phase:</span>
          <span className="text-slate-200 font-semibold">{deployment.currentStep}</span>
        </div>
      </div>

      {/* Pipeline Steps Execution Timeline (Phase 8 Timeline) */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
          <Rocket className="w-4 h-4 text-orange-400" />
          <span>Execution Steps & Timeline</span>
        </h2>

        <div className="space-y-3">
          {deployment.steps.map((step, idx) => {
            const isCompleted = step.status === 'completed';
            const isInProgress = step.status === 'in_progress';
            return (
              <div
                key={step.id}
                className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                  isCompleted
                    ? 'bg-slate-900/60 border-slate-800 text-slate-200'
                    : isInProgress
                    ? 'bg-orange-500/10 border-orange-500/50 text-orange-300 shadow-md shadow-orange-500/5'
                    : 'bg-slate-950/40 border-slate-900 text-slate-600'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : isInProgress ? (
                      <Loader2 className="w-5 h-5 text-orange-400 animate-spin" />
                    ) : (
                      <span className="text-slate-600">{idx + 1}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold">{step.name}</h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {isCompleted ? 'Completed cleanly' : isInProgress ? 'Executing in runner...' : 'Waiting in pipeline'}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                  {step.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Terminal Live Stdout Stream */}
      <div className="glass-panel p-6 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
            <Terminal className="w-4 h-4 text-orange-400" />
            <span>OpenTofu Stdout Output</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Auto-scrolling</span>
        </div>

        <div className="terminal-window rounded-xl p-4 overflow-y-auto max-h-64 font-mono text-xs space-y-1 text-slate-300">
          {deployment.logs.map((l, i) => (
            <div key={i} className="flex space-x-3">
              <span className="text-slate-600 select-none">[{l.timestamp}]</span>
              <span className="text-orange-400 font-semibold font-mono">[{l.service}]</span>
              <span className="text-slate-200">{l.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
