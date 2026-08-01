import React, { useState, useEffect } from 'react';
import { LogEntry, LogLevel } from '../../types';
import { 
  Terminal, 
  Search, 
  Filter, 
  Pause, 
  Play, 
  Trash2, 
  Download, 
  ArrowDown, 
  ShieldAlert, 
  CheckCircle2, 
  Info, 
  Bug 
} from 'lucide-react';

interface LiveLogsViewerProps {
  logs: LogEntry[];
  projectName: string;
}

export const LiveLogsViewer: React.FC<LiveLogsViewerProps> = ({ logs, projectName }) => {
  const [logList, setLogList] = useState<LogEntry[]>(logs);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);

  // Live log simulation interval if not paused
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const services = ['Cloudflare Workers', 'Cloudflare Pages', 'D1 Database Engine', 'R2 Edge Bucket', 'Router Middleware'];
      const levels: LogLevel[] = ['INFO', 'INFO', 'INFO', 'WARN', 'DEBUG'];
      const messages = [
        'GET /api/v1/products status=200 duration=12ms region=iad',
        'Executing query SELECT * FROM catalog WHERE category = "electronics" on D1',
        'CACHE HIT for key "session_token_99182" in Cloudflare KV',
        'POST /api/checkout status=201 duration=45ms region=fra',
        'Worker runtime garbage collection completed in 0.8ms',
        'Edge health check returned 200 OK across 240 PoP locations',
      ];

      const newEntry: LogEntry = {
        id: `log-live-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString() + '.' + Math.floor(Math.random() * 900),
        level: levels[Math.floor(Math.random() * levels.length)],
        service: services[Math.floor(Math.random() * services.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        requestId: `req_${Math.random().toString(36).substring(2, 9)}`,
      };

      setLogList(prev => [...prev.slice(-300), newEntry]);
    }, 1500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const filteredLogs = logList.filter(l => {
    const matchesSearch = 
      l.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.requestId && l.requestId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLevel = selectedLevel === 'ALL' || l.level === selectedLevel;

    return matchesSearch && matchesLevel;
  });

  const handleDownload = () => {
    const text = logList.map(l => `[${l.timestamp}] [${l.level}] [${l.service}] (${l.requestId || 'n/a'}): ${l.message}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}-live-logs.log`;
    a.click();
  };

  const getLevelBadge = (level: LogLevel) => {
    switch (level) {
      case 'ERROR':
        return <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-mono text-[10px] font-bold">ERR</span>;
      case 'WARN':
        return <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-[10px] font-bold">WRN</span>;
      case 'DEBUG':
        return <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono text-[10px] font-bold">DBG</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">INF</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="flex items-center space-x-3 flex-1 min-w-[240px]">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search logs, request IDs, services..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Level Filters */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          {['ALL', 'INFO', 'WARN', 'ERROR', 'DEBUG'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedLevel === lvl
                  ? 'bg-orange-500 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isPaused
                ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'Resume Stream' : 'Pause'}</span>
          </button>

          <button
            onClick={() => setLogList([])}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 transition-all"
            title="Clear Logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownload}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all"
            title="Download Logs"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Viewport */}
      <div className="terminal-window rounded-2xl p-5 border border-slate-800 space-y-2 h-[520px] overflow-y-auto font-mono text-xs shadow-2xl">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            No log entries match your filter criteria.
          </div>
        ) : (
          filteredLogs.map(l => (
            <div
              key={l.id}
              className="flex items-start space-x-3 py-1 hover:bg-slate-900/60 px-2 rounded transition-colors group"
            >
              <span className="text-slate-600 select-none min-w-[90px]">{l.timestamp}</span>
              <div className="min-w-[40px]">{getLevelBadge(l.level)}</div>
              <span className="text-orange-400 font-semibold min-w-[150px] truncate">{l.service}</span>
              {l.requestId && (
                <span className="text-slate-500 font-mono text-[10px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 select-all">
                  {l.requestId}
                </span>
              )}
              <span className="text-slate-200 flex-1 break-all">{l.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
