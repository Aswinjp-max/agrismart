import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Search, GraduationCap, Award, Briefcase, Calendar, ChevronDown, Lock, CheckCircle, UserPlus, Trash2 } from 'lucide-react';

export default function ExpertAdvice({ user, lang }) {
  const [experts, setExperts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState({});
  const navigate = useNavigate();
  const isEn = lang === 'en';

  useEffect(() => {
    const q = query(collection(db, "experts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setExperts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  const handleDelete = async (expertId) => {
    if (window.confirm(isEn ? "Delete this profile?" : "ഈ പ്രൊഫൈൽ നീക്കംചെയ്യണോ?")) {
      try {
        await deleteDoc(doc(db, "experts", expertId));
        alert(isEn ? "Deleted successfully" : "വിജയകരമായി നീക്കംചെയ്തു");
      } catch (err) {
        alert("Error: " + err.message);
      }
    }
  };

  const filtered = experts.filter(e => 
    e.name?.toLowerCase().includes(search.toLowerCase()) || 
    e.specialty?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <section className="bg-emerald-950 pt-20 pb-32 px-6 text-center text-white">
        
        <h1 className="text-4xl md:text-6xl font-black mb-4">
          {isEn ? 'Agricultural' : 'കാർഷിക'} <span className="text-emerald-400">Experts</span>
        </h1>
        {user?.role === 'Agricultural Expert' && (
          <button onClick={() => navigate('/register-expert')} className="bg-white text-emerald-900 px-6 py-3 rounded-2xl font-black flex items-center gap-2 mx-auto mb-8 shadow-xl hover:scale-105 transition-transform">
            <UserPlus size={20} /> {isEn ? "Add Your Details" : "വിവരങ്ങൾ ചേർക്കുക"}
          </button>
        )}
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-800" />
          <input onChange={(e) => setSearch(e.target.value)} placeholder={isEn ? "Search specialty..." : "തിരയുക..."} className="w-full p-6 pl-14 rounded-full text-stone-900 font-bold outline-none" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 -mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(exp => (
          <div key={exp.id} className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm relative group transition-all hover:shadow-xl">
            
            {/* DELETE BUTTON: Only visible to the owner */}
            {user?.uid === exp.userId && (
              <button onClick={() => handleDelete(exp.id)} className="absolute top-6 right-6 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all">
                <Trash2 size={20} />
              </button>
            )}

            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 bg-emerald-900 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-inner uppercase">
                {exp.name?.[0]}
              </div>
              
            </div>

            <h3 className="text-2xl font-black text-stone-800">{exp.name}</h3>
            <p className="text-emerald-600 text-[10px] font-black uppercase mb-6 flex items-center gap-2">
              <Briefcase size={12}/> {exp.specialty}
            </p>

            <div className="space-y-3 mb-8 border-t pt-6">
              <div className="flex items-center gap-3 text-sm font-bold text-stone-500">
                <GraduationCap size={18} className="text-emerald-500" /> {exp.education}
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-stone-500">
                <Award size={18} className="text-emerald-500" /> {exp.experience} {isEn ? ' Years of Experience' : ' വർഷം പരിചയം'}
              </div>
               <div className="flex items-center gap-3 text-sm font-bold text-stone-500">
                <Award size={18} className="text-emerald-500" /> {exp.phone} 
              </div>
            </div>

            <button className={`w-full py-5 rounded-2xl font-black flex items-center justify-center gap-2 ${user?.role === 'Farmer' ? "bg-emerald-600 text-white" : "bg-stone-200 text-stone-400 cursor-not-allowed"}`}>
              {user?.role === 'Farmer' ? <Calendar size={18}/> : <Lock size={18}/>}
              {isEn ? "Book Appointment" : "ബുക്ക് ചെയ്യുക"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}