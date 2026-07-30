
const platformLayers = [
  {
    number: "01",
    title: "Infinite Purpose & Ethical Governance",
    description: "Decentralized AI-driven decision-making grounded in universal ethics, ensuring transparent governance through DAO participation.",
    stat: "12,450+",
    statLabel: "Governance Participants",
    statDesc: "Active DAO members",
    features: ["Moral AI Protocols", "DAO Governance", "Values Engine", "Ethical Frameworks", "Sacred Land Protection"]
  },
  {
    number: "02", 
    title: "Regenerative Value Exchange",
    description: "Seamless exchange of regenerative assets including carbon credits, ecosystem restoration credits, and cultural preservation funds.",
    stat: "$1.84B",
    statLabel: "Trading Volume",
    statDesc: "Total value exchanged",
    features: ["Blockchain Records", "AI-Powered Oracles", "Living Smart Contracts", "RIU Trading", "Impact Verification"]
  },
  {
    number: "03",
    title: "Data Integration & Metrics Engine", 
    description: "Measure real-world regenerative impact across agriculture, oceanic, healthcare, and circular economy sectors.",
    stat: "15,000+",
    statLabel: "Data Points",
    statDesc: "IoT sensors active",
    features: ["Big Data Analytics", "AI Forecasting", "Ecosystem Mapping", "Satellite Integration", "IoT Sensor Networks"]
  },
  {
    number: "04",
    title: "Cultural & Knowledge Impact",
    description: "Build and share a global knowledge ecosystem through impact stories, collaboration, and ethical AI research.",
    stat: "8,500+", 
    statLabel: "Knowledge Assets",
    statDesc: "Stories & resources",
    features: ["Impact Stories", "Global Hub", "AI Library", "Cultural Preservation", "Knowledge Sharing"]
  },
  {
    number: "05",
    title: "Global Impact Economy",
    description: "Enable financial flows supporting regenerative businesses through impact investing, DeFi, and microfinance.",
    stat: "$4.2B",
    statLabel: "Value Generated", 
    statDesc: "Economic impact",
    features: ["Impact Marketplace", "Sustainable Finance", "Microfinance Platform", "DeFi Integration", "Impact Bonds"]
  }
];

const PlatformArchitecture = () => (
  <section className="py-32 bg-slate-800 relative">
    <div className="max-w-7xl mx-auto px-8">
      <div className="text-center mb-20">
        <h2 className="text-6xl font-black mb-6">PLATFORM ARCHITECTURE</h2>
        <h3 className="text-3xl text-emerald-500 mb-8">Five Layers of Regeneration</h3>
        <p className="text-xl text-slate-400 max-w-4xl mx-auto text-center">
          A multi-layered ecosystem designed to preserve humanity and the planet, blending impact finance with ethical technology.
        </p>
      </div>

      <div className="space-y-12">
        {platformLayers.map((layer, index) => (
          <div key={index} className="grid md:grid-cols-12 gap-12 glass p-12 rounded-3xl hover-lift">
            <div className="md:col-span-3 text-center">
              <div className="text-8xl font-black text-emerald-500 mb-4">{layer.number}</div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">{layer.stat}</div>
              <div className="text-lg font-semibold text-white mb-1">{layer.statLabel}</div>
              <div className="text-sm text-slate-400">{layer.statDesc}</div>
            </div>
            
            <div className="md:col-span-6">
              <h4 className="text-3xl font-bold mb-6">{layer.title}</h4>
              <p className="text-xl text-slate-400 mb-8 leading-relaxed">{layer.description}</p>
            </div>
            
            <div className="md:col-span-3">
              <div className="grid grid-cols-1 gap-4">
                {layer.features.map((feature, i) => (
                  <div key={i} className="bg-emerald-500/10 px-6 py-4 rounded-xl text-center border border-emerald-500/20">
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-12 text-xl text-slate-400">
        Each layer interconnects to create a unified regenerative ecosystem
      </div>
    </div>
  </section>
);

export default PlatformArchitecture;
