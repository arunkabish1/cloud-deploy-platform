import React, { useState } from 'react';
import { EnvVariable } from '../../types';
import { KeyRound, Plus, Lock, Eye, EyeOff, Trash2, CheckCircle2 } from 'lucide-react';

interface EnvVarManagerProps {
  initialVars: EnvVariable[];
}

export const EnvVarManager: React.FC<EnvVarManagerProps> = ({ initialVars }) => {
  const [vars, setVars] = useState<EnvVariable[]>(initialVars);
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [isSecret, setIsSecret] = useState(true);

  const toggleShow = (id: string) => {
    setShowValues(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey || !newValue) return;

    const newVar: EnvVariable = {
      id: `env-${Date.now()}`,
      key: newKey.toUpperCase().replace(/[^A_Z0-9_]/g, '_'),
      value: newValue,
      environments: ['development', 'preview', 'production'],
      isSecret: isSecret,
      updatedAt: new Date().toISOString(),
    };

    setVars([...vars, newVar]);
    setNewKey('');
    setNewValue('');
  };

  const handleDelete = (id: string) => {
    setVars(vars.filter(v => v.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">
            Phase 10 Secrets Engine
          </span>
          <h1 className="text-xl font-bold text-slate-100">Environment Variables & Secrets</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Encrypted variables automatically injected into Cloudflare Pages & Workers deployments.
          </p>
        </div>
      </div>

      {/* Add Secret Form */}
      <form onSubmit={handleAdd} className="glass-panel p-5 rounded-2xl flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={newKey}
          onChange={e => setNewKey(e.target.value)}
          placeholder="VARIABLE_NAME (e.g. API_KEY)"
          className="flex-1 min-w-[200px] px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 outline-none focus:border-orange-500"
        />

        <input
          type="text"
          value={newValue}
          onChange={e => setNewValue(e.target.value)}
          placeholder="Value"
          className="flex-1 min-w-[200px] px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 outline-none focus:border-orange-500"
        />

        <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer px-2">
          <input
            type="checkbox"
            checked={isSecret}
            onChange={e => setIsSecret(e.target.checked)}
            className="rounded bg-slate-950 border-slate-800 text-orange-500 focus:ring-0"
          />
          <span>Encrypt Secret</span>
        </label>

        <button
          type="submit"
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold shadow-md shadow-orange-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Variable</span>
        </button>
      </form>

      {/* Secrets List */}
      <div className="glass-panel p-6 rounded-2xl space-y-3">
        {vars.map(v => {
          const isVisible = showValues[v.id];
          return (
            <div
              key={v.id}
              className="glass-card p-4 rounded-xl flex items-center justify-between gap-4 border border-slate-800"
            >
              <div className="flex items-center space-x-4">
                <KeyRound className="w-4 h-4 text-orange-400" />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-200 font-mono">{v.key}</span>
                    {v.isSecret && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-orange-400 font-mono">
                        SECRET
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-1">
                    {v.isSecret && !isVisible ? '••••••••••••••••' : v.value}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {v.isSecret && (
                  <button
                    onClick={() => toggleShow(v.id)}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  >
                    {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                )}
                <button
                  onClick={() => handleDelete(v.id)}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
