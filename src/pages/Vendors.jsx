import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { 
  Store, MapPin, Truck, Plus, Search, Filter, 
  Tractor, Droplets, Leaf, Wrench, Trash2, ShieldCheck ,Landmark,ShoppingCart
} from 'lucide-react';

export default function Vendors({ user, lang }) {
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const isEn = lang === 'en';
  const navigate = useNavigate();

  const categories = [
    { id: 'All', en: 'All', ml: 'എല്ലാം', icon: <Filter size={16}/> },
    { id: 'Machinery', en: 'Machinery', ml: 'യന്ത്രങ്ങൾ', icon: <Tractor size={16}/> },
    { id: 'Seeds', en: 'Seeds & Plants', ml: 'വിത്തുകൾ', icon: <Leaf size={16}/> },
    { id: 'Irrigation', en: 'Irrigation', ml: 'ജലസേചനം', icon: <Droplets size={16}/> },
    { id: 'Tools', en: 'Small Tools', ml: 'ഉപകരണങ്ങൾ', icon: <Wrench size={16}/> },
  ];

  useEffect(() => {
    const q = query(collection(db, "vendors"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setVendors(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm(isEn ? "Remove this listing?" : "ഈ ലിസ്റ്റിംഗ് നീക്കം ചെയ്യണോ?")) {
      await deleteDoc(doc(db, "vendors", id));
    }
  };

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.shopName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         v.productName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || v.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
         
      <section className="bg-emerald-900 pt-20 pb-32 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-400 rounded-full blur-3xl"></div>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 relative z-10">
          {isEn ? 'Equipment' : 'ഉപകരണങ്ങൾ'} <span className="text-emerald-400 italic">Hub</span>
        </h1>

        <div className="max-w-2xl mx-auto relative mb-8 group z-10">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600" size={20} />
          <input 
            type="text" 
            placeholder={isEn ? "Search tools or shops..." : "തിരയുക..."}
            className="w-full bg-white p-6 pl-16 rounded-[2rem] border-none outline-none font-bold text-emerald-950 shadow-2xl"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      <ShoppingCart className="absolute -bottom-10 -right-10 text-white/5 w-64 h-64" />
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto mb-8 relative z-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all ${
                activeCategory === cat.id 
                ? "bg-emerald-400 text-emerald-950 shadow-lg scale-105" 
                : "bg-emerald-800 text-emerald-100 hover:bg-emerald-700"
              }`}
            >
              {cat.icon}
              {isEn ? cat.en : cat.ml}
            </button>
          ))}
        </div>

        {user?.role === 'Vendor' && (
          <button 
            onClick={() => navigate('/register-vendor')}
            className="bg-emerald-500 text-emerald-950 px-10 py-4 rounded-2xl font-black flex items-center gap-2 shadow-2xl hover:bg-white transition-all mx-auto relative z-10"
          >
            <Plus size={20} /> {isEn ? 'List New Product' : 'പുതിയ ഉൽപ്പന്നം ചേർക്കുക'}
          </button>
        )}
      </section>

      <div className="max-w-7xl mx-auto px-6 -mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredVendors.map(vendor => (
          <div key={vendor.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all relative group">
            {user?.uid === vendor.userId && (
              <button 
                onClick={() => handleDelete(vendor.id)}
                className="absolute top-4 right-4 z-10 p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            )}
            <div className="h-44 w-full bg-stone-100">
              <img src={vendor.imageUrl} alt="" className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                {vendor.actionType}
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-black text-stone-800">{vendor.productName}</h3>
                <span className="text-emerald-600 font-black">₹{vendor.price}</span>
              </div>
              <p className="text-[10px] font-bold text-stone-400 uppercase mb-4 flex items-center gap-1">
                <Store size={12}/> {vendor.shopName}
              </p>
              <div className="space-y-2 text-xs text-stone-500 font-bold mb-6">
                <div className="flex items-center gap-2"><MapPin size={14} className="text-emerald-500"/> {vendor.location}</div>
                <div className="flex items-center gap-2"><Truck size={14} className="text-emerald-500"/> {vendor.delivery ? 'Home Delivery' : 'Pickup Only'}</div>
              </div>
              <a href={`tel:${vendor.phone}`} className="block text-center bg-stone-900 text-white py-4 rounded-2xl font-black hover:bg-emerald-600 transition no-underline">
                {isEn ? 'Call Vendor' : 'വിളിക്കുക'}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}