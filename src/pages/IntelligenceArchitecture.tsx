import { ArrowRight, BarChart3, BrainCircuit, Compass, Leaf, ScanSearch, ShieldCheck, Sparkles, Trees, Workflow } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';

const models = [
  {
    title: 'Human Flourishing Engine',
    summary: 'Measures whether people, families, and communities are genuinely thriving through health, education, income mobility, purpose, and trust.',
    outputs: ['Flourishing Score', 'Community Resilience Score', 'Future Opportunity Index', 'Risk Indicators'],
    accent: 'from-emerald-500 to-green-600',
    icon: Sparkles,
  },
  {
    title: 'Regenerative Economy Engine',
    summary: 'Tracks whether projects, businesses, and investments create ecological and human value rather than hidden extraction costs.',
    outputs: ['Regenerative Value Score', 'Ecological ROI', 'Restoration Yield', 'Circular Economy Index'],
    accent: 'from-lime-500 to-emerald-600',
    icon: BarChart3,
  },
  {
    title: 'Innovation Genesis Engine',
    summary: 'Maps opportunities across science, patents, startups, grants, and societal needs so breakthrough ideas surface earlier.',
    outputs: ['Innovation Probability Score', 'Adoption Forecast', 'Opportunity Maps', 'Breakthrough Potential Rankings'],
    accent: 'from-cyan-500 to-sky-600',
    icon: Compass,
  },
  {
    title: 'Ethical Decision Engine',
    summary: 'Evaluates proposed actions through stakeholder, environmental, economic, and governance lenses with transparent reasoning.',
    outputs: ['Ethical Risk Score', 'Human Benefit Score', 'Long-Term Sustainability Score', 'Recommended Actions'],
    accent: 'from-violet-500 to-fuchsia-600',
    icon: ShieldCheck,
  },
  {
    title: 'Ecosystem Intelligence Engine',
    summary: 'Connects satellite, sensor, weather, and biodiversity data into a living system for early warning and restoration planning.',
    outputs: ['Ecosystem Health Score', 'Restoration Opportunities', 'Environmental Alerts', 'Future Scenarios'],
    accent: 'from-amber-500 to-orange-600',
    icon: Trees,
  },
];

const architectureLayers = [
  { title: 'Data Layer', details: 'PostgreSQL, vector search, and warehouse pipelines for trusted evidence and semantic retrieval.' },
  { title: 'AI Layer', details: 'Retrieval, forecasting, classification, and recommendation systems tuned for regenerative decisions.' },
  { title: 'API Layer', details: 'REST and GraphQL endpoints enable dashboards, maps, simulators, and decision tools at scale.' },
  { title: 'Security Layer', details: 'Identity, audit trails, privacy safeguards, and explainability logs maintain ethical operation.' },
];

const IntelligenceArchitecture = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
        <div className="mx-auto flex max-w-7xl flex-col gap-10">
          <header className="rounded-3xl border border-emerald-500/20 bg-slate-900/80 p-8 shadow-2xl shadow-emerald-950/30">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">
                Mythic Engineering
              </span>
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-300">
                Regenerative Civilization Infrastructure
              </span>
            </div>
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                  Atlas Sanctum Intelligence Architecture
                </h1>
                <p className="mt-4 max-w-3xl text-lg text-slate-300">
                  A practical operating system for measuring human flourishing, ecological regeneration, innovation opportunity, and ethical action in one place.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">North Star</p>
                <p className="mt-2 text-sm text-slate-300">
                  Every model is designed to improve a decision, increase flourishing, regenerate living systems, and scale ethically.
                </p>
              </div>
            </div>
          </header>

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {models.map((model) => {
              const Icon = model.icon;
              return (
                <article key={model.title} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/20">
                  <div className={`inline-flex rounded-2xl bg-gradient-to-br ${model.accent} p-3 text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="mt-5 text-2xl font-semibold text-white">{model.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{model.summary}</p>
                  <div className="mt-5 space-y-2">
                    {model.outputs.map((output) => (
                      <div key={output} className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-800/70 px-3 py-2 text-sm text-slate-300">
                        <ScanSearch className="h-4 w-4 text-emerald-400" />
                        <span>{output}</span>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
            <div className="flex items-center gap-3">
              <Workflow className="h-6 w-6 text-cyan-400" />
              <h2 className="text-3xl font-semibold text-white">Shared Architecture</h2>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {architectureLayers.map((layer) => (
                <div key={layer.title} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                  <h3 className="text-lg font-semibold text-emerald-300">{layer.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{layer.details}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/60 to-slate-900 p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Build sequence</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">From datasets to autonomous recommendations</h2>
                <p className="mt-3 max-w-2xl text-slate-300">
                  The system is organized so data quality comes first, then metrics, then forecasts, then simulations, and finally recommendation loops.
                </p>
              </div>
              <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400">
                Explore the operating system <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default IntelligenceArchitecture;
