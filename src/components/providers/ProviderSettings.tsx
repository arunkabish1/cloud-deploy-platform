import React, { useState, useEffect } from 'react';
import { CloudProviderConnection } from '../../types';
import { getApiConfig, setApiConfig } from '../../services/realCloudApi';
import { Plug, CheckCircle2, ShieldCheck, Key, Github, Save, Check } from 'lucide-react';

interface ProviderSettingsProps {
  providers: CloudProviderConnection[];
}

export const ProviderSettings: React.FC<ProviderSettingsProps> = ({ providers }) => {
  const [cfToken, setCfToken] = useState('');
  const [cfAccountId, setCfAccountId] = useState('39cd6e21a6317ad90e471a9b70a463af');
  const [ghToken, setGhToken] = useState('');
  const [ghOwner, setGhOwner] = useState('arunkabish1');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const config = getApiConfig();
    setCfToken(config.cloudflareToken);
    setCfAccountId(config.cloudflareAccountId);
    setGhToken(config.githubToken);
    setGhOwner(config.githubOwner);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setApiConfig({
      cloudflareToken: cfToken,
      cloudflareAccountId: cfAccountId,
      githubToken: ghToken,
      githubOwner: ghOwner,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">
            Phase 4 Cloud Credentials & Real Execution Engine
          </span>
          <h1 className="text-xl font-bold text-slate-100">Live API Tokens & Provider Settings</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure real API credentials for Cloudflare Account 39cd6e21a6317ad90e471a9b70a463af and GitHub arunkabish1.
          </p>
        </div>
      </div>

      {/* Form for Real API Tokens */}
      <form onSubmit={handleSave} className="glass-panel p-6 rounded-2xl space-y-5">
        <h2 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
          <Key className="w-4 h-4 text-orange-400" />
          <span>Real Cloud API Authentication Tokens</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cloudflare API Token */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Cloudflare API Token</label>
            <input
              type="password"
              value={cfToken}
              onChange={e => setCfToken(e.target.value)}
              placeholder="Paste Cloudflare API Token..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 outline-none focus:border-orange-500"
            />
            <p className="text-[10px] text-slate-500">
              Account ID: <span className="font-mono text-orange-400 font-bold">{cfAccountId}</span> (Arunkabish1@gmail.com's Account)
            </p>
          </div>

          {/* GitHub Token */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">GitHub Personal Access Token (PAT)</label>
            <input
              type="password"
              value={ghToken}
              onChange={e => setGhToken(e.target.value)}
              placeholder="ghp_..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 outline-none focus:border-orange-500"
            />
            <p className="text-[10px] text-slate-500">
              GitHub Owner: <span className="font-mono text-slate-300 font-bold">{ghOwner}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-400">
            Tokens are stored securely in local browser storage for client-side API execution.
          </span>

          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600 transition-all"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Tokens Saved!' : 'Save Credentials'}</span>
          </button>
        </div>
      </form>

      {/* Cloud Providers Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <span>Target Account Configured</span>
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 font-mono text-xs text-slate-300 space-y-1.5 border border-slate-900">
            <div className="flex justify-between">
              <span className="text-slate-500">Account ID:</span>
              <span className="text-orange-400 font-bold">39cd6e21a6317ad90e471a9b70a463af</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Owner Account:</span>
              <span className="text-slate-200">Arunkabish1@gmail.com's Account</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Supported Capabilities:</span>
              <span className="text-emerald-400">Pages, Workers, D1, R2, KV, Queues</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border-2 border-amber-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                GH
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">GitHub App Integration</h3>
                <span className="text-[11px] text-emerald-400 font-medium flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Owner Ready</span>
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 font-mono text-xs text-slate-300 space-y-1.5 border border-slate-900">
            <div className="flex justify-between">
              <span className="text-slate-500">GitHub Owner:</span>
              <span className="text-amber-400 font-bold">arunkabish1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Capabilities:</span>
              <span className="text-slate-200">Repository Creation, Webhooks, Push Code</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
