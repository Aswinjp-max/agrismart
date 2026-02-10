import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Award, Calendar, Plus, GraduationCap, Search, Briefcase, Stethoscope, ChevronDown, Lock } from 'lucide-react';

export default function ExpertAdvice({ user, lang }) {
  const [experts, setExperts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState({}); // Track service per expert ID
  const isEn = lang === 'en';
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "experts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setExperts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  const handleBooking = async (expert) => {
    // 1. Check if the user is a Farmer
    if (user?.role !== 'Farmer') {
      alert(isEn 
        ? "Only registered Farmers can book appointments." 
        : "രജിസ്റ്റർ ചെയ്ത കർഷകർക്ക് മാത്രമേ അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യാൻ കഴിയൂ.");
      return;
    }

    const serviceType = selectedService[expert.id];
    
    if (!serviceType) {
      alert(isEn ? "Please select a service type first" : "ദയവായി ഒരു സേവനം തിരഞ്ഞെടുക്കുക");
      return;
    }

    try {
      // Create a booking record in Firestore
      await addDoc(collection(db, "bookings"), {
        expertId: expert.id,
        expertName: expert.name,
        expertUserId: expert.userId, // Required for Expert Dashboard
        userId: user?.uid || 'anonymous',
        userName: user?.displayName || user?.name || 'Guest',
        serviceType: serviceType,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      alert(isEn ? `Booking request sent for ${serviceType}!` : "ബുക്കിംഗ് അഭ്യർത്ഥന അയച്ചു!");
    } catch (err) {
      console.error("Error booking expert:", err);
    }
  };

  const handleServiceChange = (expertId, value) => {
    setSelectedService(prev => ({ ...prev, [expertId]: value }));
  };

  const filtered = experts.filter(e => 
    e.name?.toLowerCase().includes(search.toLowerCase()) || 
    e.specialty?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* HERO SECTION */}
      <section className="bg-emerald-900 pt-20 pb-32 px-6 text-center  overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-400 rounded-full blur-3xl"></div>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 relative z-10">
          {isEn ? 'Expert' : 'വിദഗ്ധ'} <span className="text-emerald-400 italic">Panel</span>
        </h1>
        
        <div className="max-w-2xl mx-auto relative mb-8 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600" size={20} />
          <input 
            onChange={(e) => setSearch(e.target.value)}
            type="text" 
            placeholder={isEn ? "Search specialty..." : "തിരയുക..."}
            className="w-full bg-white/95 backdrop-blur-md p-6 pl-16 rounded-[2rem] border-none outline-none font-bold text-emerald-950 shadow-2xl"
          />
        </div>
      </section>

      {/* EXPERT GRID */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(exp => (
          <div key={exp.id} className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm hover:shadow-2xl transition-all group">
            
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 bg-emerald-900 rounded-2xl flex items-center justify-center text-emerald-400 font-black text-xl">
                {exp.name?.[0]}
              </div>
              <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black">
                <ShieldCheck size={12}/> VERIFIED
              </div>
            </div>

            <h3 className="text-2xl font-black text-stone-800">{exp.name}</h3>
            <p className="text-emerald-600 text-[10px] font-black uppercase mb-6 flex items-center gap-2">
              <Briefcase size={12}/> {exp.specialty}
            </p>
            
            <div className="space-y-3 text-sm text-stone-500 font-bold mb-6 border-t pt-6">
              <div className="flex items-center gap-3">
                <GraduationCap size={16} className="text-emerald-600"/> {exp.education}
              </div>
              <div className="flex items-center gap-3">
                <Award size={16} className="text-emerald-600"/> {exp.experience} {isEn ? 'Experience' : 'പരിചയം'}
              </div>
            </div>

            {/* SERVICE SELECTION DROPDOWN */}
            <div className="relative mb-4">
              <select 
                onChange={(e) => handleServiceChange(exp.id, e.target.value)}
                disabled={user?.role !== 'Farmer'}
                className={`w-full border-none p-4 rounded-xl font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-emerald-500 transition-all ${
                    user?.role === 'Farmer' ? "bg-stone-100 text-stone-700" : "bg-stone-50 text-stone-300 cursor-not-allowed"
                }`}
                defaultValue=""
              >
                <option value="" disabled>{isEn ? "Select Service Type" : "സേവനം തിരഞ്ഞെടുക്കുക"}</option>
                <option value="Farm Visit">{isEn ? "Farm Visit" : "ഫാം സന്ദർശനം"}</option>
                <option value="Video Call">{isEn ? "Video Call" : "വീഡിയോ കോൾ"}</option>
                <option value="Voice Call">{isEn ? "Voice Call" : "വോയിസ് കോൾ"}</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400" size={18} />
            </div>

            {/* BOOKING BUTTON */}
            <button 
              onClick={() => handleBooking(exp)}
              disabled={user?.role !== 'Farmer'}
              className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-black transition shadow-lg active:scale-95 ${
                user?.role === 'Farmer' 
                  ? "bg-emerald-600 text-white hover:bg-stone-900" 
                  : "bg-stone-200 text-stone-400 cursor-not-allowed shadow-none"
              }`}
            >
              {user?.role === 'Farmer' ? <Calendar size={18}/> : <Lock size={18}/>}
              {isEn ? "Book Appointment" : "അപ്പോയിന്റ്മെന്റ് എടുക്കുക"}
            </button>

            {user?.role !== 'Farmer' && (
              <p className="text-[9px] text-red-400 font-bold mt-3 text-center uppercase tracking-tighter">
                {isEn ? "Farmer account required" : "കർഷക അക്കൗണ്ട് ആവശ്യമാണ്"}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}