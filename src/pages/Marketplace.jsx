import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Search, Sprout, MapPin, Plus, ArrowRight, ShoppingBag, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Marketplace({ user, lang }) {
  const [crops, setCrops] = useState([]);
  const [search, setSearch] = useState("");
  const isEn = lang === 'en';
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "market"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setCrops(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  const filteredCrops = crops.filter(c => 
    c.cropName?.toLowerCase().includes(search.toLowerCase()) ||
    c.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <section className="bg-emerald-900 pt-20 pb-32 px-6 text-center text-white relative overflow-hidden">
        <h1 className="text-4xl md:text-6xl font-black mb-4 relative z-10">
          {isEn ? 'Agri' : 'കാർഷിക'} <span className="text-emerald-400 italic">{isEn ? 'Market' : 'വിപണി'}</span>
        </h1>
        <div className="max-w-2xl mx-auto mt-8 relative z-10">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input 
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isEn ? "Search crops or location..." : "വിളകളോ സ്ഥലമോ തിരയുക..."}
            className="w-full p-5 pl-14 rounded-3xl text-stone-900 shadow-2xl outline-none border-none"
          />
        </div>
        <ShoppingBag className="absolute -bottom-10 -right-10 text-white/5 w-64 h-64" />
      </section>

      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        {user?.role === 'Farmer' && (
          <div className="flex justify-center mb-12">
            <button 
              onClick={() => navigate('/sell')}
              className="bg-emerald-500 text-emerald-950 px-10 py-5 rounded-[2rem] font-black flex items-center gap-3 shadow-2xl hover:scale-105 transition"
            >
              <Plus size={24}/> {isEn ? 'Sell Your Crop' : 'വിളകൾ വിൽക്കുക'}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCrops.map(crop => (
            <div key={crop.id} className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
              
              {/* Quality Badge */}
              <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl text-[10px] font-black uppercase tracking-widest ${
                crop.quality === 'Premium' ? 'bg-amber-400 text-amber-950' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {crop.quality || 'Standard'}
              </div>

              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Sprout size={28}/>
                </div>
                <div className="text-right pr-4">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{isEn ? 'Price' : 'വില'}</p>
                  <p className="text-2xl font-black text-emerald-600">₹{crop.price}<span className="text-sm text-stone-400">/{crop.unit}</span></p>
                </div>
              </div>

              <h3 className="text-2xl font-black text-stone-800 mb-2">{crop.cropName}</h3>
              <div className="flex items-center gap-2 text-stone-500 text-sm font-bold mb-6">
                <MapPin size={16} className="text-emerald-500"/> {crop.location}
              </div>

              <a href={`tel:${crop.phone}`} className="w-full py-4 bg-stone-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-emerald-600 transition no-underline">
                {isEn ? 'Call Seller' : 'വിൽപ്പനക്കാരനെ വിളിക്കുക'} <ArrowRight size={18}/>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}