import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Project {
  id: string;
  title?: string;
  name?: string;
  description: string;
  location: string;
  country?: string;
  project_type: string;
  status: string;
  price_per_credit?: number;
  available_credits?: number;
  impact_score?: number;
  confidence_level?: number;
  developer_name?: string;
  image_url?: string;
}

interface Listing {
  id: string;
  quantity: number;
  price: number;
  impact_score: number;
  confidence_interval: number;
  status: string;
}

type Step = 'browse' | 'submit' | 'purchase' | 'success';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: 'bg-emerald-900/50 text-emerald-300 border-emerald-700',
    pending_approval: 'bg-amber-900/50 text-amber-300 border-amber-700',
    approved: 'bg-blue-900/50 text-blue-300 border-blue-700',
    completed: 'bg-purple-900/50 text-purple-300 border-purple-700',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${colors[status] ?? 'bg-slate-800 text-slate-400 border-slate-600'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function ProjectCard({ project, onSelect }: { project: Project; onSelect: () => void }) {
  const name = project.title || project.name || 'Unnamed Project';
  const price = project.price_per_credit ?? 0;
  const credits = project.available_credits ?? 0;
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 flex flex-col gap-3 hover:border-emerald-600 transition-colors">
      {project.image_url && (
        <img src={project.image_url} alt={name} className="w-full h-36 object-cover rounded-lg" />
      )}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-white text-sm leading-snug">{name}</h3>
        <StatusBadge status={project.status} />
      </div>
      <p className="text-slate-400 text-xs line-clamp-2">{project.description}</p>
      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span>📍 {project.location}{project.country ? `, ${project.country}` : ''}</span>
        <span className="capitalize">🌿 {project.project_type?.replace(/_/g, ' ')}</span>
      </div>
      {project.impact_score != null && (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-700 rounded-full h-1.5">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${project.impact_score}%` }}
            />
          </div>
          <span className="text-xs text-emerald-400">{project.impact_score} impact</span>
        </div>
      )}
      <div className="flex items-center justify-between mt-1">
        <div>
          {price > 0 && <p className="text-emerald-400 font-bold">${price.toFixed(2)} <span className="text-slate-400 font-normal text-xs">/ RIU</span></p>}
          {credits > 0 && <p className="text-slate-500 text-xs">{credits.toLocaleString()} available</p>}
        </div>
        <button
          onClick={onSelect}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
        >
          Purchase RIUs
        </button>
      </div>
    </div>
  );
}

// ─── Browse Tab ───────────────────────────────────────────────────────────────

function BrowseProjects({ onPurchase }: { onPurchase: (project: Project) => void }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    apiFetch<{ items: Project[] }>('/v2/projects')
      .then(d => setProjects(d.items))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = projects.filter(p => {
    const name = (p.title || p.name || '').toLowerCase();
    const loc = (p.location || '').toLowerCase();
    const q = search.toLowerCase();
    return !q || name.includes(q) || loc.includes(q) || p.project_type?.includes(q);
  });

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search projects by name, location, or type…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
      />
      {loading && <p className="text-slate-400 text-sm text-center py-8">Loading projects…</p>}
      {error && <p className="text-red-400 text-sm text-center py-4">⚠ {error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="text-slate-500 text-sm text-center py-8">No projects found.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <ProjectCard key={p.id} project={p} onSelect={() => onPurchase(p)} />
        ))}
      </div>
    </div>
  );
}

// ─── Submit Project Tab ───────────────────────────────────────────────────────

function SubmitProject({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    location: '',
    bioregion: '',
    projectType: 'reforestation',
    areaHectares: '',
    targetCO2Reduction: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const PROJECT_TYPES = [
    'reforestation', 'renewable_energy', 'methane_capture',
    'soil_carbon', 'blue_carbon', 'agroforestry', 'biodiversity',
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.name || !form.location || !form.projectType) {
      setError('Name, location, and project type are required.');
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch('/v2/projects', {
        method: 'POST',
        body: JSON.stringify({
          ownerId: 'demo-user',
          name: form.name,
          description: form.description,
          location: form.location,
          bioregion: form.bioregion,
          projectType: form.projectType,
          areaHectares: parseFloat(form.areaHectares) || 0,
          targetCO2Reduction: parseFloat(form.targetCO2Reduction) || 0,
        }),
      });
      onSuccess();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  const field = (label: string, key: keyof typeof form, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs text-slate-400 mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <p className="text-slate-400 text-sm">
        Register your regenerative project to receive Regenerative Impact Units (RIUs) once verified.
      </p>
      {field('Project Name *', 'name', 'text', 'e.g. Turkana Sacred Grove Protection')}
      <div>
        <label className="block text-xs text-slate-400 mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          rows={3}
          placeholder="Describe the ecological impact and community involvement…"
          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
        />
      </div>
      {field('Location *', 'location', 'text', 'e.g. Turkana County, Kenya')}
      {field('Bioregion', 'bioregion', 'text', 'e.g. East African Rift')}
      <div>
        <label className="block text-xs text-slate-400 mb-1">Project Type *</label>
        <select
          value={form.projectType}
          onChange={e => setForm(f => ({ ...f, projectType: e.target.value }))}
          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
        >
          {PROJECT_TYPES.map(t => (
            <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {field('Area (hectares)', 'areaHectares', 'number', '0')}
        {field('Target CO₂ Reduction (tonnes)', 'targetCO2Reduction', 'number', '0')}
      </div>
      {error && <p className="text-red-400 text-sm">⚠ {error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
      >
        {submitting ? 'Submitting…' : 'Submit Project for Verification'}
      </button>
    </form>
  );
}

// ─── Purchase Modal ───────────────────────────────────────────────────────────

function PurchaseModal({
  project,
  onClose,
  onSuccess,
}: {
  project: Project;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState('');
  const price = project.price_per_credit ?? 25;
  const total = (quantity * price).toFixed(2);

  async function handlePurchase() {
    setError('');
    setPurchasing(true);
    try {
      // Create a listing first (in a real flow this would already exist)
      const listing = await apiFetch<{ id: string; price: number }>('/v2/marketplace/riums', {
        method: 'POST',
        body: JSON.stringify({
          sellerId: 'demo-seller',
          projectId: project.id,
          quantity,
          price,
          impactScore: project.impact_score ?? 85,
        }),
      });
      // Purchase it
      await apiFetch(`/v2/marketplace/riums/${listing.id}/purchase`, {
        method: 'POST',
        body: JSON.stringify({
          buyerId: 'demo-buyer',
          quantity,
          totalPrice: parseFloat(total),
        }),
      });
      onSuccess();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setPurchasing(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-white font-semibold">Purchase RIUs</h2>
            <p className="text-slate-400 text-sm mt-0.5">{project.title || project.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-xl leading-none">×</button>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex justify-between text-slate-400">
            <span>Price per RIU</span>
            <span className="text-white">${price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Impact Score</span>
            <span className="text-emerald-400">{project.impact_score ?? 85}/100</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Verification</span>
            <span className="text-blue-400">Community Validated</span>
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Quantity (RIUs)</label>
          <input
            type="number"
            min={1}
            max={project.available_credits ?? 10000}
            value={quantity}
            onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex justify-between items-center text-sm border-t border-slate-700 pt-4">
          <span className="text-slate-400">Total</span>
          <span className="text-white font-bold text-lg">${total}</span>
        </div>

        {error && <p className="text-red-400 text-sm">⚠ {error}</p>}

        <button
          onClick={handlePurchase}
          disabled={purchasing}
          className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors"
        >
          {purchasing ? 'Processing…' : `Purchase ${quantity} RIU${quantity !== 1 ? 's' : ''} · $${total}`}
        </button>
        <p className="text-slate-600 text-xs text-center">
          Demo mode — no real payment processed
        </p>
      </div>
    </div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────

function SuccessScreen({ message, onReset }: { message: string; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
      <div className="w-20 h-20 rounded-full bg-emerald-900/50 border border-emerald-600 flex items-center justify-center text-4xl">
        🌱
      </div>
      <div>
        <h2 className="text-white text-xl font-semibold">{message}</h2>
        <p className="text-slate-400 text-sm mt-2 max-w-sm">
          Your action has been recorded on the Atlas Sanctum platform.
        </p>
      </div>
      <button
        onClick={onReset}
        className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2.5 rounded-lg text-sm transition-colors"
      >
        Back to Marketplace
      </button>
    </div>
  );
}

// ─── API Health Indicator ─────────────────────────────────────────────────────

function ApiHealth() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    fetch('http://localhost:4000/health')
      .then(r => setStatus(r.ok ? 'online' : 'offline'))
      .catch(() => setStatus('offline'));
  }, []);

  const colors = { checking: 'text-slate-400', online: 'text-emerald-400', offline: 'text-red-400' };
  const labels = { checking: '● Connecting…', online: '● API Online', offline: '● API Offline (mock data)' };

  return <span className={`text-xs ${colors[status]}`}>{labels[status]}</span>;
}

// ─── Main Prototype Page ──────────────────────────────────────────────────────

export default function Prototype() {
  const [tab, setTab] = useState<'browse' | 'submit'>('browse');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  if (successMessage) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Header tab={tab} setTab={setTab} />
        <main className="max-w-5xl mx-auto px-4 py-8">
          <SuccessScreen message={successMessage} onReset={() => setSuccessMessage('')} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header tab={tab} setTab={setTab} />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {tab === 'browse' ? (
          <BrowseProjects onPurchase={p => setSelectedProject(p)} />
        ) : (
          <SubmitProject onSuccess={() => setSuccessMessage('Project submitted for verification!')} />
        )}
      </main>

      {selectedProject && (
        <PurchaseModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onSuccess={() => {
            setSelectedProject(null);
            setSuccessMessage(`Purchase complete! Your RIUs are now in your portfolio.`);
          }}
        />
      )}
    </div>
  );
}

function Header({ tab, setTab }: { tab: string; setTab: (t: 'browse' | 'submit') => void }) {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-bold text-lg">🌍 Atlas Sanctum</span>
          <span className="text-slate-600 text-xs hidden sm:block">Regenerative Impact Units</span>
        </div>
        <nav className="flex items-center gap-1 bg-slate-800/60 rounded-lg p-1">
          {(['browse', 'submit'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                tab === t ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t === 'browse' ? '🛒 Marketplace' : '➕ Submit Project'}
            </button>
          ))}
        </nav>
        <ApiHealth />
      </div>
    </header>
  );
}
