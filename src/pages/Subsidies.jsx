import React, { useState } from 'react';
import { 
  Landmark, FileText, ChevronRight, Clock, 
  ExternalLink, Search, CheckCircle2, TrendingUp ,BadgeIndianRupee
} from 'lucide-react';

export default function Subsidies({ lang }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const isEn = lang === 'en';

  const schemes = [
    {
      id: 1,
      title: isEn ? "Kuttanad Package 2.0" : "കുട്ടനാട് പാക്കേജ് 2.0",
      dept: isEn ? "Dept. of Agriculture" : "കൃഷി വകുപ്പ്",
      amount: "₹2,50,000",
      category: "Infrastructure",
      deadline: "2026-03-15",
      status: "Open"
    },
    {
      id: 2,
      title: isEn ? "Organic Manure Subsidy" : "ജൈവവള സബ്സിഡി",
      dept: isEn ? "Krishi Bhavan" : "കൃഷി ഭവൻ",
      amount: "75% Subsidy",
      category: "Organic",
      deadline: "2026-04-01",
      status: "Open"
    },
    {
      id: 3,
      title: isEn ? "PM-Kisan Samman Nidhi" : "പി.എം കിസാൻ",
      dept: isEn ? "Central Govt" : "കേന്ദ്ര സർക്കാർ",
      amount: "₹6,000/year",
      category: "Direct Benefit",
      deadline: "Ongoing",
      status: "Active"
    }
  ];

  const filters = ["All", "Infrastructure", "Organic", "Direct Benefit"];

  return (
    <div className="min-h-screen bg-stone-50 pb-20 relative-">
      {/* --- HERO SECTION --- */}
      <section className="bg-emerald-900 pt-20 pb-40 px-6 text-center text-white">
        <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-xs font-bold mb-6">
          <Landmark size={14} className="text-emerald-400" />
          {isEn ? "Government Support Portal" : "സർക്കാർ സഹായ പോർട്ടൽ"}
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-6 italic">
          {isEn ? "Subsidies &" : "സബ്സിഡികളും"} <br/>
          <span className="text-emerald-400 not-italic">Financial Grants.</span>
        </h1>
        
      </section>
 <BadgeIndianRupee  className="absolute -top-1 -right-10 text-white/5 w-64 h-64" />
      {/* --- FILTER & SEARCH --- */}
      <div className="max-w-6xl mx-auto px-6 -mt-20">
        <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl flex flex-wrap gap-2 justify-center mb-12 border border-stone-100">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                activeFilter === f 
                ? 'bg-emerald-600 text-white' 
                : 'text-stone-400 hover:bg-stone-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* --- SCHEME LIST --- */}
        <div className="space-y-6">
          {schemes.filter(s => activeFilter === 'All' || s.category === activeFilter).map(scheme => (
            <div key={scheme.id} className="group bg-white rounded-[2.5rem] p-8 border border-stone-100 flex flex-col md:flex-row items-center justify-between gap-8 hover:shadow-2xl transition-all">
              <div className="flex items-center gap-6 flex-1">
                <div className="w-16 h-16 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center text-emerald-600">
                  <FileText size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                      {scheme.category}
                    </span>
                    <span className="text-stone-400 text-xs font-bold">• {scheme.dept}</span>
                  </div>
                  <h3 className="text-2xl font-black text-stone-800">{scheme.title}</h3>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-10">
                <div className="text-center md:text-left">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">{isEn ? "Grant Value" : "സഹായ തുക"}</p>
                  <p className="text-xl font-black text-emerald-600">{scheme.amount}</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">{isEn ? "Deadline" : "അവസാന തീയതി"}</p>
                  <div className="flex items-center gap-1.5 text-stone-800 font-bold">
                    <Clock size={14} className="text-orange-500"/> {scheme.deadline}
                  </div>
                </div>
                <button className="bg-stone-900 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-lg">
                  {isEn ? "Apply Now" : "അപേക്ഷിക്കുക"} <ChevronRight size={18}/>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- ELIGIBILITY CARD --- */}
        <div className="mt-16 bg-emerald-950 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden">
           <div className="relative z-10 max-w-xl">
             <TrendingUp size={48} className="text-emerald-400 mb-6" />
             <h2 className="text-3xl font-black mb-4">{isEn ? "Check Your Eligibility" : "അർഹത പരിശോധിക്കുക"}</h2>
             <p className="text-emerald-200/60 mb-8 leading-relaxed">
               {isEn 
                ? "Enter your land details and crop type to find customized subsidies tailored for your farm." 
                : "നിങ്ങളുടെ കൃഷിഭൂമിയുടെ വിവരങ്ങൾ നൽകി അർഹമായ സബ്സിഡികൾ കണ്ടെത്തുക."}
             </p>
             <button className="bg-emerald-500 text-emerald-950 px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition">
               {isEn ? "Start Check" : "പരിശോധന തുടങ്ങുക"} <ExternalLink size={18}/>
             </button>
           </div>
           <Landmark size={200} className="absolute -bottom-10 -right-10 text-white opacity-5" />
        </div>
      </div>
    </div>
  );
}