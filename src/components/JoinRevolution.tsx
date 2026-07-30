import { Link } from "react-router-dom";

const JoinRevolution = () => (
  <section className="py-32 bg-slate-900 relative">
    <div className="max-w-7xl mx-auto px-8 text-center">
      <h2 className="text-6xl font-black mb-6">JOIN THE REVOLUTION</h2>
      <p className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto">
        Be part of the regenerative transformation. Every action counts.
      </p>
      <div className="flex justify-center gap-6">
        <Link to="/auth" className="btn-glow px-8 py-4 rounded-xl font-bold text-lg">
          Start Regenerating
        </Link>
        <Link to="/marketplace" className="glass px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-700/50">
          Explore Platform
        </Link>
      </div>
    </div>
  </section>
);

export default JoinRevolution;
