import React, { useState, useEffect } from 'react';
import { INITIAL_TEMPLATES } from '../../data/mockData';
import { ProjectTemplate } from '../../types';
import { generateOpenTofuHcl, InfrastructureSelection } from '../../services/opentofu';
import { getApiConfig, setApiConfig } from '../../services/realCloudApi';
import { 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Code2, 
  Rocket, 
  Key, 
  Copy, 
  Check,
  AlertCircle
} from 'lucide-react';

interface ProjectWizardProps {
  onCompleteWizard: (projectName: string, template: ProjectTemplate, infra: InfrastructureSelection) => void;
  onCancel: () => void;
}

export const ProjectWizard: React.FC<ProjectWizardProps> = ({
  onCompleteWizard,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [projectName, setProjectName] = useState<string>('my-cloud-app');
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate>(INITIAL_TEMPLATES[0]); // Cloudflare + Next.js + Tailwind default!
  
  // API Tokens state
  const [cfToken, setCfToken] = useState('');
  const [ghToken, setGhToken] = useState('');

  useEffect(() => {
    const config = getApiConfig();
    setCfToken(config.cloudflareToken);
    setGhToken(config.githubToken);
  }, []);

  // Infrastructure Matrix state
  const [infra, setInfra] = useState<InfrastructureSelection>({
    frontend: 'Cloudflare Pages',
    backend: 'Cloudflare Workers',
    database: 'Cloudflare D1',
    storage: 'Cloudflare R2',
    cache: 'Cloudflare KV',
    queue: 'Cloudflare Queues',
  });

  const [copiedHcl, setCopiedHcl] = useState(false);

  const generatedHcl = generateOpenTofuHcl(projectName, selectedTemplate, infra);

  const handleCopyHcl = () => {
    navigator.clipboard.writeText(generatedHcl);
    setCopiedHcl(true);
    setTimeout(() => setCopiedHcl(false), 2000);
  };

  const handleFinish = () => {
    // Save tokens if entered in wizard
    setApiConfig({
      cloudflareToken: cfToken,
      githubToken: ghToken,
    });
    onCompleteWizard(projectName, selectedTemplate, infra);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Wizard Header Progress Bar */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-orange-400">
              Phase 5 & 6 Orchestrator
            </span>
            <h1 className="text-xl font-bold text-slate-100">Project Creation Wizard</h1>
          </div>
          <button
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
          >
            Cancel
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          {[
            { step: 1, label: '1. Project Info' },
            { step: 2, label: '2. Select Template' },
            { step: 3, label: '3. Select Infrastructure' },
            { step: 4, label: '4. OpenTofu Blueprint' },
            { step: 5, label: '5. Deploy' },
          ].map(s => {
            const isDone = currentStep > s.step;
            const isCurrent = currentStep === s.step;
            return (
              <div
                key={s.step}
                onClick={() => isDone && setCurrentStep(s.step)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-orange-500/10 border-orange-500 text-orange-400 font-semibold shadow-md shadow-orange-500/10'
                    : isDone
                    ? 'bg-slate-900 border-slate-700 text-emerald-400'
                    : 'bg-slate-950/40 border-slate-900 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-center space-x-1.5">
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                  <span>{s.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Project Details */}
      {currentStep === 1 && (
        <div className="glass-panel p-8 rounded-2xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-100">Project & Repository Details</h2>
            <p className="text-xs text-slate-400">Give your deployment a unique name and target account.</p>
          </div>

          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm font-mono focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                placeholder="my-cloud-app"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Cloudflare Account</label>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                <span className="text-slate-500">Account ID: </span>
                <span className="text-orange-400 font-bold">39cd6e21a6317ad90e471a9b70a463af</span>
                <span className="text-slate-400 block text-[10px] mt-0.5">Arunkabish1@gmail.com's Account</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">GitHub Repository Target</label>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center space-x-3">
                <Code2 className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="font-semibold text-slate-200">GitHub Repository URL</p>
                  <p className="text-[11px] font-mono text-slate-400">github.com/arunkabish1/{projectName || 'my-cloud-app'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 transition-all"
            >
              <span>Next: Select Template</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Template Selection */}
      {currentStep === 2 && (
        <div className="glass-panel p-8 rounded-2xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Select Application Template</h2>
            <p className="text-xs text-slate-400">Choose a pre-configured architecture template. Cloudflare + Next.js + Tailwind is recommended.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INITIAL_TEMPLATES.map(tpl => {
              const isSelected = selectedTemplate.id === tpl.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`glass-card p-5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-orange-500 text-white' : 'bg-slate-800 text-orange-400'}`}>
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-100">{tpl.title}</h3>
                        <span className="text-[10px] font-mono text-slate-400">{tpl.name}</span>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-orange-400" />}
                  </div>

                  <p className="text-xs text-slate-300 mb-4">{tpl.description}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {tpl.tags.map(t => (
                      <span
                        key={t}
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          t === 'Recommended'
                            ? 'bg-orange-500 text-white font-bold'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 transition-all"
            >
              <span>Next: Select Infrastructure</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Infrastructure Selection */}
      {currentStep === 3 && (
        <div className="glass-panel p-8 rounded-2xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Select Modular Infrastructure</h2>
            <p className="text-xs text-slate-400">Pick only the cloud services required for this application.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <label className="block text-xs font-bold text-orange-400 uppercase tracking-wider">Frontend</label>
              <select
                value={infra.frontend}
                onChange={e => setInfra({ ...infra, frontend: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 outline-none"
              >
                <option>Cloudflare Pages</option>
                <option>AWS Amplify / S3 CDN</option>
              </select>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <label className="block text-xs font-bold text-orange-400 uppercase tracking-wider">Backend Engine</label>
              <select
                value={infra.backend}
                onChange={e => setInfra({ ...infra, backend: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 outline-none"
              >
                <option>Cloudflare Workers</option>
                <option>AWS ECS Fargate</option>
              </select>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <label className="block text-xs font-bold text-orange-400 uppercase tracking-wider">Database</label>
              <select
                value={infra.database}
                onChange={e => setInfra({ ...infra, database: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 outline-none"
              >
                <option>Cloudflare D1 (SQLite Edge)</option>
                <option>AWS RDS PostgreSQL</option>
              </select>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <label className="block text-xs font-bold text-orange-400 uppercase tracking-wider">Storage</label>
              <select
                value={infra.storage}
                onChange={e => setInfra({ ...infra, storage: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 outline-none"
              >
                <option>Cloudflare R2 Object Storage</option>
                <option>AWS S3 Bucket</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 transition-all"
            >
              <span>Next: View OpenTofu Code</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Live OpenTofu HCL Preview */}
      {currentStep === 4 && (
        <div className="glass-panel p-8 rounded-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Phase 6 & 7 OpenTofu Synthesis
              </span>
              <h2 className="text-lg font-bold text-slate-100">Generated OpenTofu HCL Blueprint</h2>
            </div>
            <button
              onClick={handleCopyHcl}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white"
            >
              {copiedHcl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedHcl ? 'Copied HCL!' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Terminal HCL Display */}
          <div className="terminal-window rounded-xl p-4 overflow-x-auto max-h-96 text-xs font-mono text-slate-300 border border-slate-800">
            <pre>{generatedHcl}</pre>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(3)}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(5)}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 transition-all"
            >
              <span>Next: Review & Provision</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Deploy & Review */}
      {currentStep === 5 && (
        <div className="glass-panel p-8 rounded-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center mx-auto shadow-xl shadow-orange-500/30">
              <Rocket className="w-8 h-8 text-white stroke-[2.5]" />
            </div>

            <h2 className="text-xl font-bold text-slate-100">Ready to Deploy {projectName}!</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Provisioning Cloudflare Pages, Workers, D1 database, and R2 bucket under Cloudflare Account 39cd6e21a6317ad90e471a9b70a463af.
            </p>
          </div>

          {/* API Token Input Credentials Box */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 max-w-xl mx-auto text-xs">
            <div className="flex items-center space-x-2 text-orange-400 font-bold">
              <Key className="w-4 h-4" />
              <span>Real Cloud API Authentication Credentials</span>
            </div>

            {(!cfToken || !ghToken) && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Please enter your Cloudflare API Token and GitHub Token below to execute live creation on Cloudflare (Account 39cd6e21a6317ad90e471a9b70a463af) and GitHub (arunkabish1).
                </span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Cloudflare API Token</label>
                <input
                  type="password"
                  value={cfToken}
                  onChange={e => setCfToken(e.target.value)}
                  placeholder="Paste Cloudflare API Token..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">GitHub Personal Access Token (PAT)</label>
                <input
                  type="password"
                  value={ghToken}
                  onChange={e => setGhToken(e.target.value)}
                  placeholder="ghp_..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4 pt-2">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold"
            >
              Back
            </button>
            <button
              onClick={handleFinish}
              className="flex items-center space-x-2 px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-xl shadow-orange-500/30 transition-all transform active:scale-95"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Deploy Project Now</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
