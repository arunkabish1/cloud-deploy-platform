import React, { useState } from 'react';
import { CustomDomain } from '../../types';
import { Globe, Plus, ShieldCheck, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';

interface DomainManagerProps {
  initialDomains: CustomDomain[];
}

export const DomainManager: React.FC<DomainManagerProps> = ({ initialDomains }) => {
  const [domains, setDomains] = useState<CustomDomain[]>(initialDomains);
  const [newDomain, setNewDomain] = useState('');

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain) return;

    const domainObj: CustomDomain = {
      id: `dom-${Date.now()}`,
      domain: newDomain.toLowerCase(),
      status: 'verified',
      sslStatus: 'active',
      dnsRecords: [
        { type: 'CNAME', name: newDomain.split('.')[0] || 'app', value: 'nexus-storefront.pages.dev', status: 'active' },
        { type: 'TXT', name: '_cf-custom-hostname', value: `cf-verify-${Math.random().toString(36).substring(2, 8)}`, status: 'active' },
      ],
      createdAt: new Date().toISOString(),
    };

    setDomains([...domains, domainObj]);
    setNewDomain('');
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">
            Phase 11 Custom Domains & Edge SSL
          </span>
          <h1 className="text-xl font-bold text-slate-100">Custom Domains</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure custom domains, automatic Cloudflare SSL certificates, and DNS records.
          </p>
        </div>
      </div>

      {/* Add Domain Form */}
      <form onSubmit={handleAddDomain} className="glass-panel p-5 rounded-2xl flex items-center gap-3">
        <div className="relative flex-1">
          <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={newDomain}
            onChange={e => setNewDomain(e.target.value)}
            placeholder="store.yourdomain.com"
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 outline-none focus:border-orange-500"
          />
        </div>
        <button
          type="submit"
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold shadow-md shadow-orange-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Domain</span>
        </button>
      </form>

      {/* Domains List */}
      <div className="space-y-4">
        {domains.map(dom => (
          <div key={dom.id} className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100 font-mono">{dom.domain}</h3>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                    <span className="flex items-center space-x-1 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>DNS Verified</span>
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400">SSL Certificate Active (Universal Edge SSL)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* DNS Records Table */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-900 font-mono text-xs space-y-2">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Required DNS Records</div>
              {dom.dnsRecords.map((r, i) => (
                <div key={i} className="flex flex-wrap items-center justify-between text-slate-300 py-1 border-b border-slate-900/60 last:border-0">
                  <span className="w-16 text-orange-400 font-bold">{r.type}</span>
                  <span className="flex-1 text-slate-300 truncate">{r.name}</span>
                  <span className="text-slate-400 truncate max-w-[200px]">{r.value}</span>
                  <span className="text-emerald-400 text-[10px] ml-4 font-sans font-semibold">Active</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
