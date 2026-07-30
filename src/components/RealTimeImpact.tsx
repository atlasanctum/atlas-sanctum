
const impactMetrics = [
  { value: "12.4M", unit: "Hectares", label: "Land Restored", change: "+23%" },
  { value: "847K", unit: "km²", label: "Ocean Protected", change: "+18%" },
  { value: "2.8M", unit: "Lives", label: "Health Improved", change: "+45%" },
  { value: "94%", unit: "Rate", label: "Circular Economy", change: "+12%" },
  { value: "$4.2B", unit: "USD", label: "Value Generated", change: "+67%" },
  { value: "156", unit: "Nations", label: "Global Reach", change: "+8%" }
];

const RealTimeImpact = () => (
  <section className="py-32 bg-slate-900 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-8">
      <div className="text-center mb-20">
        <h2 className="text-6xl font-black mb-6">REAL-TIME IMPACT</h2>
        <h3 className="text-3xl text-emerald-500 mb-8">Measuring Regeneration</h3>
        <p className="text-xl text-slate-400 max-w-4xl mx-auto">
          Transparent, verifiable metrics powered by AI oracles and IoT sensors tracking our collective impact across all ecosystems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
        {impactMetrics.map((metric, index) => (
          <div key={index} className="glass p-10 rounded-3xl text-center hover-lift group">
            <div className="text-5xl font-black text-emerald-400 mb-3">{metric.value}</div>
            <div className="text-lg text-slate-400 mb-3">{metric.unit}</div>
            <div className="text-2xl font-bold mb-4">{metric.label}</div>
            <div className="text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full inline-block font-semibold">
              {metric.change} vs last year
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <div className="glass p-8 rounded-2xl inline-flex items-center gap-4 text-xl">
          <span className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-slate-300">Live data from 15,000+ IoT sensors worldwide</span>
        </div>
      </div>
    </div>
  </section>
);

export default RealTimeImpact;
