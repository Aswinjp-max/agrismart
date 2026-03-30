import React, { useState } from 'react';
import { 
  Search, Bug, ShieldAlert, FlaskConical, 
  Activity, Thermometer, Filter, Droplet, 
  Stethoscope, Sprout, Image as ImageIcon,
  Wind, Mountain, Waves, Sun, Droplets, Info
} from 'lucide-react';

const CROP_DATABASE = [
  {
    id: "rice",
    nameEn: "Rice / Paddy",
    nameMl: "നെല്ല്",
    scientific: "Oryza sativa",
    image: "https://images.unsplash.com/photo-1536633100350-93a95612c01d?auto=format&fit=crop&q=80&w=800",
    details: {
      temp: "20°C – 35°C",
      water: "2–5 cm standing water",
      seasons: "Virippu, Mundakan, Puncha",
      harvest: "100–135 days"
    },
    threats: [
      {
        nameEn: "Blast Disease", nameMl: "കുലവാട്ടം", type: "Fungal", severity: "High",
        symptomsEn: "Diamond-shaped spots with grey centers; neck of panicle may break; empty grains.",
        remedyEn: "Avoid excess nitrogen; use resistant varieties; spray Tricyclazole."
      },
      {
        nameEn: "Sheath Blight", nameMl: "ഇലക്കരിച്ചിൽ", type: "Fungal", severity: "Medium",
        symptomsEn: "Brown patches on lower leaf sheath spreading upward; plants may fall.",
        remedyEn: "Proper spacing; remove infected stubbles; spray Validamycin."
      },
      {
        nameEn: "Bacterial Leaf Blight", nameMl: "ബാക്ടീരിയൽ ഇലവാട്ടം", type: "Bacterial", severity: "High",
        symptomsEn: "Leaf tips turn yellow and dry downward; milky liquid in water test.",
        remedyEn: "Use resistant seeds; avoid excess nitrogen; spray Streptocycline."
      },
      {
        nameEn: "Stem Borer", nameMl: "തണ്ട് തുരപ്പൻ", type: "Pest", severity: "High",
        symptomsEn: "Middle leaf dries (dead heart); white empty panicles at flowering.",
        remedyEn: "Install pheromone traps; release Trichogramma; granular insecticide."
      }
    ]
  },
  {
    id: "maize",
    nameEn: "Maize (Corn)",
    nameMl: "ചോളം",
    scientific: "Zea mays",
    image: "https://images.unsplash.com/photo-1551731359-2b34fc5d0d26?auto=format&fit=crop&q=80&w=800",
    details: {
      temp: "18°C – 32°C",
      water: "Moderate water; NO stagnation",
      seasons: "Kharif, Rabi",
      harvest: "90–110 days"
    },
    threats: [
      {
        nameEn: "Turcicum Leaf Blight", nameMl: "ടർസിക്കം ഇലവാട്ടം", type: "Fungal", severity: "Medium",
        symptomsEn: "Long brown patches on leaves; drying from bottom upward.",
        remedyEn: "Avoid overcrowding; remove infected leaves; spray Mancozeb."
      },
      {
        nameEn: "Fall Armyworm", nameMl: "ഫോൾ ആർമി വേം", type: "Pest", severity: "High",
        symptomsEn: "Big holes in leaves; sawdust-like powder inside leaf whorl.",
        remedyEn: "Check every 3-4 days; pheromone traps; spray Spinosad."
      },
      {
        nameEn: "Bacterial Stalk Rot", nameMl: "ബാക്ടീരിയൽ തണ്ട് ചീയൽ", type: "Bacterial", severity: "High",
        symptomsEn: "Lower stem becomes soft; bad smell; plant falls down.",
        remedyEn: "Improve drainage; avoid water stagnation; balanced fertilizer."
      }
    ]
  },
  {
    id: "ragi",
    nameEn: "Ragi",
    nameMl: "റാഗി",
    scientific: "Eleusine coracana",
    image: "https://images.unsplash.com/photo-1509475826633-fed5bb1930e7?auto=format&fit=crop&q=80&w=800",
    details: {
      temp: "20°C – 30°C",
      water: "Tolerates low rainfall",
      seasons: "May-Jun, Sep",
      harvest: "100–120 days"
    },
    threats: [
      {
        nameEn: "Blast Disease", nameMl: "ബ്ലാസ്റ്റ് രോഗം", type: "Fungal", severity: "High",
        symptomsEn: "Small brown/grey spots on leaves; neck blast causes ear head to dry.",
        remedyEn: "Early sowing; seed treatment with Carbendazim; avoid excess nitrogen."
      },
      {
        nameEn: "Shoot Fly", nameMl: "ശൂട്ട് ഫ്ലൈ", type: "Pest", severity: "Medium",
        symptomsEn: "Central shoot dries (dead heart); reduced tillers.",
        remedyEn: "Early sowing; proper spacing; Neem oil spray."
      }
    ]
  },
  {
    id: "coconut",
    nameEn: "Coconut",
    nameMl: "തെങ്ങ്",
    scientific: "Cocos nucifera",
    image: "https://images.unsplash.com/photo-1590779033100-9f60705a2f3b?auto=format&fit=crop&q=80&w=800",
    details: {
      temp: "20°C – 35°C",
      water: "Well-drained sandy loam",
      care: "Clean crown regularly",
      harvest: "Bearing starts 5-7 years"
    },
    threats: [
      {
        nameEn: "Bud Rot", nameMl: "കൂമ്പ് ചീയൽ", type: "Fungal", severity: "High",
        symptomsEn: "Central spindle leaf turns yellow; crown rots with bad smell.",
        remedyEn: "Remove affected tissue; apply Bordeaux paste; Copper fungicide."
      },
      {
        nameEn: "Rhinoceros Beetle", nameMl: "കൊമ്പൻ ചെല്ലി", type: "Pest", severity: "Medium",
        symptomsEn: "Holes in young leaves; characteristic V-shaped cuts.",
        remedyEn: "Use pheromone traps; apply neem cake to leaf axils."
      }
    ]
  },
  {
    id: "coffee",
    nameEn: "Coffee",
    nameMl: "കാപ്പി",
    scientific: "Coffea spp.",
    image: "https://images.unsplash.com/photo-1559056191-4917a1120164?auto=format&fit=crop&q=80&w=800",
    details: {
      temp: "18°C – 28°C",
      water: "1500–2500 mm rainfall",
      care: "Needs shade trees",
      harvest: "Nov – Feb"
    },
    threats: [
      {
        nameEn: "Coffee Leaf Rust", nameMl: "തുരുമ്പ് രോഗം", type: "Fungal", severity: "High",
        symptomsEn: "Orange/yellow powder under leaf; leaves fall early.",
        remedyEn: "Spray Copper fungicide; maintain proper shade."
      },
      {
        nameEn: "Coffee Berry Borer", nameMl: "കാപ്പി കായതുരപ്പൻ", type: "Pest", severity: "High",
        symptomsEn: "Small hole in coffee berry; powder-like material inside.",
        remedyEn: "Collect fallen berries; install traps; timely harvest."
      }
    ]
  },
  {
    id: "tea",
    nameEn: "Tea",
    nameMl: "തേയില",
    scientific: "Camellia sinensis",
    image: "https://images.unsplash.com/photo-1544739313-6fad02872377?auto=format&fit=crop&q=80&w=800",
    details: {
      temp: "18°C – 30°C",
      water: "Acidic soil (pH 4.5–5.5)",
      care: "Plucking every 7–15 days",
      harvest: "Life: 40–60 years"
    },
    threats: [
      {
        nameEn: "Blister Blight", nameMl: "ബ്ലിസ്റ്റർ ബ്ലൈറ്റ്", type: "Fungal", severity: "Medium",
        symptomsEn: "Small blister spots on young leaves; leaves curl and fall.",
        remedyEn: "Spray fungicide in rainy season; timely pruning."
      },
      {
        nameEn: "Tea Mosquito Bug", nameMl: "തേയില കൊതുക്", type: "Pest", severity: "High",
        symptomsEn: "Brown patches on young leaves; leaf drying.",
        remedyEn: "Neem spray; recommended insecticide if severe."
      }
    ]
  },
  {
    id: "cashew",
    nameEn: "Cashew",
    nameMl: "കശുവണ്ടി",
    scientific: "Anacardium occidentale",
    image: "https://images.unsplash.com/photo-1509010030550-9f60705a2f3b?auto=format&fit=crop&q=80&w=800",
    details: {
      temp: "20°C – 35°C",
      water: "Tolerates dry conditions",
      flowering: "Dec – Jan",
      harvest: "Feb – Apr"
    },
    threats: [
      {
        nameEn: "Powdery Mildew", nameMl: "ചാരപ്പൂപ്പ്", type: "Fungal", severity: "Medium",
        symptomsEn: "White powder on flowers; flower drying; poor nut setting.",
        remedyEn: "Spray wettable sulphur before flowering."
      },
      {
        nameEn: "Stem & Root Borer", nameMl: "തണ്ട് തുരപ്പൻ", type: "Pest", severity: "High",
        symptomsEn: "Gum oozing from stem; holes in trunk.",
        remedyEn: "Remove grubs; apply insecticide in holes; clean orchard."
      }
    ]
  },
  {
    id: "cocoa",
    nameEn: "Cocoa",
    nameMl: "കൊക്കോ",
    scientific: "Theobroma cacao",
    image: "https://images.unsplash.com/photo-1544415594-555e09848574?auto=format&fit=crop&q=80&w=800",
    details: {
      temp: "20°C – 32°C",
      water: "Partial shade; 1500–3000 mm",
      spacing: "3m x 3m",
      harvest: "Throughout year"
    },
    threats: [
      {
        nameEn: "Black Pod Disease", nameMl: "കായ ചീയൽ", type: "Fungal", severity: "High",
        symptomsEn: "Brown patch on pod; pod becomes black and rotten.",
        remedyEn: "Remove infected pods immediately; spray Copper fungicide."
      },
      {
        nameEn: "Mealy Bugs", nameMl: "മിലി ബഗ്", type: "Pest", severity: "Medium",
        symptomsEn: "White cotton insects; sooty mould on leaves.",
        remedyEn: "Neem oil spray; encourage natural enemies."
      }
    ]
  }
];

export default function DiagnosticHub({ lang = 'en' }) {
  const [selectedCrop, setSelectedCrop] = useState(CROP_DATABASE[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const isEn = lang === 'en';

  const filteredCrops = CROP_DATABASE.filter(c => 
    c.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.nameMl.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-stone-50 pb-20 font-sans">
      {/* Header with Search */}
      <header className="bg-emerald-950 pt-16 pb-24 px-6 text-white text-center">
        <h1 className="text-4xl font-black mb-4">
          {isEn ? "Diagnostic" : "രോഗനിർണ്ണയ"} <span className="text-emerald-400">Hub</span>
        </h1>
        
        <div className="max-w-md mx-auto relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-800" size={18} />
          <input 
            type="text" 
            placeholder={isEn ? "Search crop or disease..." : "തിരയുക..."}
            className="w-full bg-white rounded-full py-4 pl-12 pr-6 text-stone-900 font-bold outline-none border-none shadow-xl"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Crop Selection Scroller */}
        <div className="flex gap-3 overflow-x-auto pb-4 px-2 no-scrollbar justify-center">
          {filteredCrops.map(crop => (
            <button
              key={crop.id}
              onClick={() => setSelectedCrop(crop)}
              className={`px-6 py-2 rounded-full whitespace-nowrap font-black text-[10px] uppercase tracking-widest transition-all ${
                selectedCrop.id === crop.id ? "bg-emerald-500 text-white shadow-lg" : "bg-emerald-900/50 text-emerald-200"
              }`}
            >
              {isEn ? crop.nameEn : crop.nameMl}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 -mt-12">
        {/* Selected Crop Profile Card */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden mb-10 border border-stone-100">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 h-64 md:h-auto overflow-hidden">
              <img src={selectedCrop.image} alt={selectedCrop.nameEn} className="w-full h-full object-cover transition-transform hover:scale-105" />
            </div>
            <div className="p-8 md:w-2/3">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-black text-stone-800 mb-1">{isEn ? selectedCrop.nameEn : selectedCrop.nameMl}</h2>
                  <p className="text-emerald-600 italic font-semibold">{selectedCrop.scientific}</p>
                </div>
                <div className="bg-emerald-50 text-emerald-700 p-3 rounded-2xl"><Sprout size={24}/></div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(selectedCrop.details).map(([key, val]) => (
                  <div key={key} className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                    <p className="text-[9px] uppercase font-black text-stone-400 mb-1">{key}</p>
                    <p className="text-xs font-bold text-stone-700">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* List of Threats (Diseases/Pests) for the Crop */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-stone-800 mb-6 flex items-center gap-2">
            <ShieldAlert className="text-red-500" />
            {isEn ? "Registry of Threats" : "രോഗങ്ങളും കീടങ്ങളും"}
          </h3>

          {selectedCrop.threats.map((threat, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-xl transition-all">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      threat.type === 'Pest' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {threat.type}
                    </span>
                    {threat.severity === 'High' && <span className="bg-red-500 text-white text-[9px] px-2 py-1 rounded-md font-black">HIGH RISK</span>}
                  </div>
                  <h4 className="text-2xl font-black text-stone-800">{isEn ? threat.nameEn : threat.nameMl}</h4>
                </div>
                <div className="p-4 bg-stone-50 rounded-2xl text-stone-400">
                  {threat.type === 'Pest' ? <Bug size={24}/> : <FlaskConical size={24}/>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <Stethoscope size={20}/>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-blue-600 mb-1">{isEn ? "Symptoms" : "ലക്ഷണങ്ങൾ"}</p>
                    <p className="text-stone-700 font-bold leading-relaxed">{threat.symptomsEn}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                    <Droplet size={20}/>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-emerald-600 mb-1">{isEn ? "Management" : "പ്രതിവിധി"}</p>
                    <p className="text-stone-700 font-bold leading-relaxed">{threat.remedyEn}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* General Management Tips for the Farmer */}
        <div className="mt-12 p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100">
          <h4 className="text-lg font-black text-amber-900 flex items-center gap-2 mb-4">
            <Info size={20}/> {isEn ? "Expert Sanitation Tips" : "പ്രധാന നിർദ്ദേശങ്ങൾ"}
          </h4>
          <ul className="grid md:grid-cols-2 gap-4 text-sm font-bold text-amber-800">
            <li className="flex gap-2"><span>•</span> {isEn ? "Avoid excess nitrogen (Urea) fertilizer." : "അമിതമായ നൈട്രജൻ വളം ഒഴിവാക്കുക."} [cite: 87, 120]</li>
            <li className="flex gap-2"><span>•</span> {isEn ? "Good drainage is very important." : "നീർവാർച്ച സൗകര്യം ഉറപ്പാക്കുക."} [cite: 90, 107]</li>
            <li className="flex gap-2"><span>•</span> {isEn ? "Regular field inspection every 10-15 days." : "10-15 ദിവസത്തിലൊരിക്കൽ പരിശോധിക്കുക."} [cite: 120, 146]</li>
            <li className="flex gap-2"><span>•</span> {isEn ? "Remove diseased plant parts immediately." : "രോഗം ബാധിച്ച ഭാഗങ്ങൾ ഉടൻ മാറ്റുക."} [cite: 62, 277]</li>
          </ul>
        </div>
      </main>
    </div>
  );
}