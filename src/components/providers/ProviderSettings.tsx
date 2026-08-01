import React, { useState } from 'react';
import { CloudProviderConnection } from '../../types';
import { Plug, CheckCircle2, ShieldCheck, Plus, RefreshCw, Layers } from 'lucide-react';

interface ProviderSettingsProps {
  providers: CloudProviderConnection[];
}

export const ProviderSettings: React.FC<ProviderSettingsProps> = ({ providers }) => {
  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">
            Phase 4 & 18 Provider Plugin System
          </span>
          <h1 className="text-xl font-bold text-slate-100">Connected Cloud Providers</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage connected cloud infrastructure providers and OIDC credentials.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cloudflare Connection Card */}
        <div className="glass-card p-6 rounded-2xl border-2 border-orange-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                CF
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Cloudflare Adapter Plugin</h3>
                <span className="text-[11px] text-emerald-400 font-medium flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>OAuth & API Token Verified</span>
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 font-mono text-xs text-slate-300 space-y-1.5 border border-slate-900">
            <div className="flex justify-between">
              <span className="text-slate-500">Account ID:</span>
              <span className="text-orange-400 font-bold">cf_acct_8f9a2b4d99c1e7a</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Connected Zones:</span>
              <span className="text-slate-200">4 Active Domains</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Supported Capabilities:</span>
              <span className="text-emerald-400">Pages, Workers, D1, R2, KV, Queues</span>
            </div>
          </div>
        </div>

        {/* AWS Connection Card */}
        <div className="glass-card p-6 rounded-2xl border-2 border-amber-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                AWS
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">AWS OIDC Role Adapter</h3>
                <span className="text-[11px] text-emerald-400 font-medium flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>IAM OIDC Connection Active</span>
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 font-mono text-xs text-slate-300 space-y-1.5 border border-slate-900">
            <div className="flex justify-between">
              <span className="text-slate-500">AWS Account:</span>
              <span className="text-amber-400 font-bold">984028471924 (us-east-1)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Capabilities:</span>
              <span className="text-slate-200">ECS Fargate, RDS, S3, SQS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
