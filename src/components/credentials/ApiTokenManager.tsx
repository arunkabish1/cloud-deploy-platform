import React, { useState, useEffect } from 'react';
import { getApiConfig, setApiConfig } from '../../services/realCloudApi';
import { Key, ShieldCheck, Check, Save, Github, Cloud, ExternalLink } from 'lucide-react';

export const ApiTokenManager: React.FC = () => {
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-orange-500/30">
        <div>
          <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider flex items-center space-x-1">
            <Key className="w-3.5 h-3.5" />
            <span>Cloud API Authentication</span>
          </span>
          <h1 className="text-xl font-bold text-slate-100">Live API Tokens & Credentials</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Enter your Cloudflare and GitHub tokens below to execute live provisioning on Cloudflare Account <span className="text-orange-400 font-mono font-bold">39cd6e21a6317ad90e471a9b70a463af</span> and GitHub <span className="text-amber-400 font-mono font-bold">arunkabish1</span>.
          </p>
        </div>
      </div>

      {/* Main Credentials Form */}
      <form onSubmit={handleSave} className="glass-panel p-8 rounded-2xl space-y-6 shadow-2xl">
        {/* 1. Cloudflare API Token */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-200">
              <Cloud className="w-4 h-4 text-orange-400" />
              <span>1. Cloudflare API Token</span>
            </div>
            <a
              href="https://dash.cloudflare.com/profile/api-tokens"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-orange-400 hover:text-orange-300 font-medium flex items-center space-x-1"
            >
              <span>Get Token from Cloudflare</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <input
            type="password"
            value={cfToken}
            onChange={e => setCfToken(e.target.value)}
            placeholder="Paste Cloudflare API Token..."
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-100 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Target Account ID: <span className="text-orange-400 font-bold">{cfAccountId}</span></span>
            <span className="text-slate-500">Arunkabish1@gmail.com's Account</span>
          </div>
        </div>

        {/* 2. GitHub PAT Token */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-200">
              <Github className="w-4 h-4 text-amber-400" />
              <span>2. GitHub Personal Access Token (PAT)</span>
            </div>
            <a
              href="https://github.com/settings/tokens/new"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center space-x-1"
            >
              <span>Generate Token on GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <input
            type="password"
            value={ghToken}
            onChange={e => setGhToken(e.target.value)}
            placeholder="ghp_..."
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-100 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Target GitHub Owner: <span className="text-amber-400 font-bold">{ghOwner}</span></span>
            <span className="text-slate-500">github.com/arunkabish1</span>
          </div>
        </div>

        {/* Save Action */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-400">
            Tokens are stored locally in your browser to authorize live API calls.
          </span>

          <button
            type="submit"
            className="flex items-center space-x-2 px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-xl shadow-orange-500/25 transition-all transform active:scale-95"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-200" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Credentials Saved!' : 'Save Credentials'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
