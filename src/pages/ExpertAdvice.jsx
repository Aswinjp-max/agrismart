import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, increment } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Star, Award, PhoneOutgoing, Plus, GraduationCap, Search, UserCheck, Briefcase,Stethoscope } from 'lucide-react';

export default function ExpertAdvice({ user, lang }) {
  const [experts, setExperts] = useState([]);
  const [search, setSearch] = useState("");
  const isEn = lang === 'en';
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "experts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setExperts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  const handleCallTracking = async (expertId) => {
    try {
      const expertRef = doc(db, "experts", expertId);
      await updateDoc(expertRef, { callRequests: increment(1) });
    } catch (err) {
      console.error("Error tracking call:", err);
    }
  };

  const filtered = experts.filter(e => 
    e.name?.toLowerCase().includes(search.toLowerCase()) || 
    e.specialty?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* HERO SECTION - Matching Vendor Style */}
      <section className="bg-emerald-900 pt-20 pb-32 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-400 rounded-full blur-3xl"></div>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 relative z-10">
          {isEn ? 'Expert' : 'വിദഗ്ധ'} <span className="text-emerald-400 italic">Panel</span>
        </h1>
        <p className="text-emerald-100 font-bold mb-8 opacity-80 uppercase tracking-widest text-xs">
          {isEn ? 'Professional Guidance for Your Farm' : 'നിങ്ങളുടെ കൃഷിക്കായി വിദഗ്ധ നിർദ്ദേശങ്ങൾ'}
        </p>

        {/* SEARCH BAR - Matching Vendor Style */}
        <div className="max-w-2xl mx-auto relative mb-8 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600 group-focus-within:scale-110 transition-transform" size={20} />
          <input 
            onChange={(e) => setSearch(e.target.value)}
            type="text" 
            placeholder={isEn ? "Search specialty (e.g. Soil, Pests)..." : "തിരയുക..."}
            className="w-full bg-white/95 backdrop-blur-md p-6 pl-16 rounded-[2rem] border-none outline-none font-bold text-emerald-950 shadow-2xl"
          />
        </div>
        <Stethoscope  className="absolute -bottom-10 -right-10 text-white/5 w-64 h-64" />

        {user?.role === 'Agricultural Expert' && (
          <button 
            onClick={() => navigate('/register-expert')}
            className="bg-emerald-500 text-emerald-950 px-10 py-4 rounded-2xl font-black flex items-center gap-2 shadow-2xl hover:bg-white transition-all mx-auto active:scale-95"
          >
            <Plus size={20} /> {isEn ? "Join Panel" : "സമിതിയിൽ ചേരുക"}
          </button>
        )}
      </section>

      {/* EXPERT GRID */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(exp => (
          <div key={exp.id} className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
            
            <div className="flex justify-between items-start mb-6">
              <div className="w-20 h-20 bg-emerald-900 rounded-[1.5rem] flex items-center justify-center text-emerald-400 font-black text-2xl shadow-lg group-hover:rotate-3 transition-transform">
                {exp.name?.[0]}
              </div>
              <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck size={12}/> Verified
              </div>
            </div>

            <h3 className="text-2xl font-black text-stone-800 mb-1">{exp.name}</h3>
            <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <Briefcase size={12}/> {exp.specialty}
            </p>
            
            <div className="space-y-3 text-sm text-stone-500 font-bold mb-8 border-t border-stone-50 pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-stone-50 rounded-lg text-emerald-600"><GraduationCap size={16}/></div>
                {exp.education}
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-stone-50 rounded-lg text-emerald-600"><Award size={16}/></div>
                {exp.experience} {isEn ? 'Experience' : 'പരിചയം'}
              </div>
            </div>

            <a 
              href={`tel:${exp.phone}`} 
              onClick={() => handleCallTracking(exp.id)}
              className="flex items-center justify-center gap-3 bg-stone-900 text-white py-5 rounded-2xl font-black hover:bg-emerald-600 transition shadow-xl no-underline"
            >
              <PhoneOutgoing size={18}/> {isEn ? "Call Expert" : "വിളിക്കുക"}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}