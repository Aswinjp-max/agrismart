import React, { useState } from 'react';
import { 
  Search, Bug, ShieldAlert, FlaskConical, 
  AlertCircle, BugOff, Activity, Thermometer, 
  ArrowLeft, Filter, Zap, Droplet
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DISEASES = [
  { 
    id: 1, 
    category: "Fungal",
    nameEn: "Leaf Rust", 
    nameMl: "ഇല തുരുമ്പ് രോഗം", 
    cropEn: "Wheat", 
    cropMl: "ഗോതമ്പ്", 
    remedyEn: "Apply Propiconazole fungicide.", 
    remedyMl: "പ്രോപ്പിക്കൊണസോൾ എന്ന കുമിൾനാശിനി പ്രയോഗിക്കുക.",
    severity: "Medium" 
  },
  { 
    id: 2, 
    category: "Fungal",
    nameEn: "Late Blight", 
    nameMl: "അംഗമാരി രോഗം", 
    cropEn: "Potato", 
    cropMl: "ഉരുളക്കിഴങ്ങ്", 
    remedyEn: "Ensure proper drainage and use copper-based spray.", 
    remedyMl: "നല്ല നീർവാർച്ച ഉറപ്പാക്കുകയും കോപ്പർ അധിഷ്ഠിത ലായനി തളിക്കുകയും ചെയ്യുക.",
    severity: "High" 
  },
  { 
    id: 3, 
    category: "Fungal",
    nameEn: "Blast Disease", 
    nameMl: "കുലവാട്ടം", 
    cropEn: "Rice", 
    cropMl: "നെല്ല്", 
    remedyEn: "Avoid excess nitrogen; use Tricyclazole.", 
    remedyMl: "നൈട്രജൻ വളം അമിതമാകുന്നത് ഒഴിവാക്കുക; ട്രൈസൈക്ലസോൾ ഉപയോഗിക്കുക.",
    severity: "High" 
  },
  { 
    id: 4, 
    category: "Viral",
    nameEn: "Mosaic Virus", 
    nameMl: "മൊസൈക് വൈറസ്", 
    cropEn: "Tomato", 
    cropMl: "തക്കാളി", 
    remedyEn: "Remove infected plants immediately; control aphids.", 
    remedyMl: "രോഗം ബാധിച്ച ചെടികൾ ഉടൻ നീക്കം ചെയ്യുക; മുഞ്ഞകളെ നിയന്ത്രിക്കുക.",
    severity: "High" 
  }
];

export default function DiseaseGuide({ lang }) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const isEn = lang === 'en';
  const navigate = useNavigate();

  const categories = [
    { id: 'All', en: 'All', ml: 'എല്ലാം', icon: <Filter size={14}/> },
    { id: 'Fungal', en: 'Fungal', ml: 'കുമിൾ', icon: <Droplet size={14}/> },
    { id: 'Viral', en: 'Viral', ml: 'വൈറസ്', icon: <Zap size={14}/> },
  ];

  const filtered = DISEASES.filter(d => {
    const matchesSearch = d.nameEn.toLowerCase().includes(search.toLowerCase()) || 
                         d.nameMl.includes(search) ||
                         d.cropEn.toLowerCase().includes(search.toLowerCase()) ||
                         d.cropMl.includes(search);
    const matchesTab = activeTab === "All" || d.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* --- HERO SECTION --- */}
      <section className="bg-red-950 pt-20 pb-32 px-6 text-center text-white relative overflow-hidden">
        
        {/* Decorative Background Elements - Fixes BugOff Visibility */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-red-500 rounded-full blur-3xl"></div>
          <BugOff 
            className="absolute bottom-[-40px] right-[-40px] text-white/30 w-64 h-64 -rotate-12" 
          />
        </div>

        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 backdrop-blur-md">
            <Activity size={14} className="text-red-400" />
            {isEn ? "Diagnostic Hub" : "രോഗനിർണ്ണയ കേന്ദ്രം"}
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
            {isEn ? "Crop" : "വിള"} <span className="text-red-400 italic">Sanitation</span>
          </h1>
          
          {/* SEARCH BAR */}
          <div className="max-w-2xl mx-auto relative mb-8">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-red-700" size={20} />
            <input 
              type="text" 
              placeholder={isEn ? "Search disease or crop..." : "തിരയുക..."}
              className="w-full bg-white p-6 pl-16 rounded-[2rem] border-none outline-none font-bold text-stone-900 shadow-2xl"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* CATEGORY CHIPS */}
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all ${
                  activeTab === cat.id 
                  ? "bg-red-500 text-white shadow-lg scale-105" 
                  : "bg-red-900/50 text-red-200 hover:bg-red-900"
                }`}
              >
                {cat.icon}
                {isEn ? cat.en : cat.ml}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- RESULTS GRID --- */}
      <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-20">
        <div className="grid gap-6">
          {filtered.length > 0 ? filtered.map(d => (
            <div key={d.id} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-2xl transition-all flex flex-col md:flex-row gap-8 items-start group">
              
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-[1.8rem] bg-red-900 flex items-center justify-center text-red-400 shadow-lg group-hover:rotate-3 transition-transform">
                  <ShieldAlert size={36} />
                </div>
                {d.severity === 'High' && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full animate-pulse border-4 border-white">
                    <AlertCircle size={14} />
                  </div>
                )}
              </div>

              <div className="flex-1 w-full">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-stone-800 leading-tight">
                      {isEn ? d.nameEn : d.nameMl} 
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-emerald-600 font-black text-[10px] uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md">
                        {isEn ? d.cropEn : d.cropMl}
                      </span>
                      <span className="text-stone-300 font-bold text-[10px]">
                        {isEn ? d.nameMl : d.nameEn}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    d.severity === 'High' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                  }`}>
                    <Thermometer size={14} />
                    {d.severity} Risk
                  </div>
                </div>

                <div className="p-8 bg-stone-50 rounded-[2rem] border border-stone-100 relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-3">
                    <FlaskConical size={18} className="text-red-600" />
                    <p className="text-[10px] font-black text-red-700 uppercase tracking-[0.2em]">
                      {isEn ? "Recommended Treatment" : "പ്രതിവിധി"}
                    </p>
                  </div>
                  <p className="text-stone-800 font-black text-xl leading-relaxed relative z-10 mb-2">
                    {isEn ? d.remedyEn : d.remedyMl}
                  </p>
                  <p className="text-stone-400 font-bold text-sm italic">
                    {isEn ? d.remedyMl : d.remedyEn}
                  </p>
                  <Bug className="absolute -bottom-4 -right-4 text-red-900/[0.03] rotate-12" size={120} />
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-stone-200 shadow-inner">
               <Search size={32} className="text-stone-300 mx-auto mb-4" />
               <p className="text-stone-400 font-black uppercase tracking-widest text-xs">
                 No disease data found for this search
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}