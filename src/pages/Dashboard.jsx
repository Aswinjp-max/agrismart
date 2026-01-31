import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { 
  collection, query, where, onSnapshot, 
  doc, deleteDoc 
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Sprout, Store, Award, 
  Trash2, PhoneCall, Star, ShoppingBag, 
  Plus, ShieldCheck, MapPin, Phone
} from 'lucide-react';

export default function Dashboard({ user, lang }) {
  const [data, setData] = useState({ 
    crops: [], 
    shops: [], 
    expertProfile: null 
  });
  const [loading, setLoading] = useState(true);
  const isEn = lang === 'en';
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not logged in or doesn't have a UID yet, stop.
    if (!user?.uid) return;

    // 1. Fetch Farmer's Crop Listings
    const cropQ = query(collection(db, "market"), where("userId", "==", user.uid));
    const unsubCrops = onSnapshot(cropQ, (snap) => {
      setData(prev => ({ ...prev, crops: snap.docs.map(d => ({ id: d.id, ...d.data() })) }));
    });

    // 2. Fetch Vendor's Shop Listings
    const shopQ = query(collection(db, "vendors"), where("userId", "==", user.uid));
    const unsubShops = onSnapshot(shopQ, (snap) => {
      setData(prev => ({ ...prev, shops: snap.docs.map(d => ({ id: d.id, ...d.data() })) }));
    });

    // 3. Fetch Expert's Profile (Universal check)
    const expertQ = query(collection(db, "experts"), where("userId", "==", user.uid));
    const unsubExpert = onSnapshot(expertQ, (snap) => {
      setData(prev => ({ 
        ...prev, 
        expertProfile: !snap.empty ? { id: snap.docs[0].id, ...snap.docs[0].data() } : null 
      }));
      setLoading(false);
    });

    return () => {
      unsubCrops();
      unsubShops();
      unsubExpert();
    };
  }, [user]);

  const handleDelete = async (col, id) => {
    if (window.confirm(isEn ? "Are you sure you want to delete this?" : "ഇത് നീക്കം ചെയ്യുമെന്ന് ഉറപ്പാണോ?")) {
      try {
        await deleteDoc(doc(db, col, id));
      } catch (err) {
        console.error("Delete Error:", err);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center p-10 bg-white rounded-[2rem] shadow-xl">
          <ShieldCheck size={48} className="mx-auto text-emerald-600 mb-4" />
          <h2 className="font-black text-xl mb-4">{isEn ? 'Access Denied' : 'പ്രവേശനം നിഷേധിച്ചു'}</h2>
          <button onClick={() => navigate('/login')} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold">
            {isEn ? 'Login to Continue' : 'തുടരാൻ ലോഗിൻ ചെയ്യുക'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* --- HEADER --- */}
      <section className="bg-emerald-900 pt-16 pb-32 px-6 text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div>
            <h1 className="text-4xl font-black flex items-center gap-3">
              <LayoutDashboard size={32} className="text-emerald-400" /> 
              {isEn ? 'Dashboard' : 'ഡാഷ്ബോർഡ്'}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase px-2 py-1 rounded-md border border-emerald-500/30">
                {user.role}
              </span>
              <p className="opacity-70 font-bold text-sm tracking-tight italic">
                {user.name}
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
             <div className="bg-white/10 p-4 px-6 rounded-2xl backdrop-blur-md border border-white/10 text-center">
                <p className="text-2xl font-black text-emerald-400">{data.crops.length + data.shops.length}</p>
                <p className="text-[10px] font-black uppercase opacity-60">{isEn ? 'Listings' : 'ലിസ്റ്റിംഗുകൾ'}</p>
             </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 -mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- EXPERT SECTION: Only shows for Experts --- */}
        {user.role === 'Agricultural Expert' && (
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-stone-100 flex items-center gap-6">
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><PhoneCall size={32}/></div>
              <div>
                <p className="text-4xl font-black text-emerald-950">{data.expertProfile?.callRequests || 0}</p>
                <p className="text-xs font-black uppercase text-stone-400">{isEn ? 'Consultations' : 'കൺസൾട്ടേഷൻ'}</p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-stone-100 flex items-center gap-6">
              <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl"><Star size={32}/></div>
              <div>
                <p className="text-4xl font-black text-orange-950">5.0</p>
                <p className="text-xs font-black uppercase text-stone-400">{isEn ? 'Avg Rating' : 'റേറ്റിംഗ്'}</p>
              </div>
            </div>
          </div>
        )}

        {/* --- MAIN LISTINGS: For Farmers and Vendors --- */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-black text-emerald-950 flex items-center gap-3">
            <Sprout className="text-emerald-500" /> {isEn ? 'My Listings' : 'എന്റെ ലിസ്റ്റിംഗുകൾ'}
          </h2>

          <div className="grid gap-4">
            {/* FARMER'S CROPS */}
            {data.crops.map(crop => (
              <div key={crop.id} className="bg-white p-6 rounded-[2rem] shadow-sm flex justify-between items-center group border border-transparent hover:border-emerald-200 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600"><ShoppingBag size={20}/></div>
                  <div>
                    <h4 className="font-black text-stone-800">{crop.cropName}</h4>
                    <p className="text-emerald-600 font-bold text-xs">₹{crop.price} / {crop.unit}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete('market', crop.id)} className="p-2 text-stone-300 hover:text-red-500 transition"><Trash2 size={20}/></button>
              </div>
            ))}

            {/* VENDOR'S SHOPS */}
            {data.shops.map(shop => (
              <div key={shop.id} className="bg-white p-6 rounded-[2rem] shadow-sm flex justify-between items-center border border-transparent hover:border-emerald-200 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-stone-50 rounded-xl flex items-center justify-center text-stone-400"><Store size={20}/></div>
                  <div>
                    <h5 className="font-black text-stone-800">{shop.productName}</h5>
                    <h2 className="font-black text-stone-600">{shop.price}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin size={10} className="text-stone-400"/>
                      <p className="text-stone-400 font-bold text-[10px] uppercase">{shop.location}</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => handleDelete('vendors', shop.id)} className="p-2 text-stone-300 hover:text-red-500 transition"><Trash2 size={20}/></button>
              </div>
            ))}

            {/* EMPTY STATE */}
            {data.crops.length === 0 && data.shops.length === 0 && (
              <div className="p-16 bg-white rounded-[3rem] border-2 border-dashed border-stone-200 text-center">
                <p className="text-stone-400 font-bold italic">{isEn ? 'You haven’t listed anything yet.' : 'നിങ്ങൾ ഇതുവരെ ഒന്നും ചേർത്തിട്ടില്ല.'}</p>
                <button onClick={() => navigate('/marketplace')} className="mt-4 text-emerald-600 font-black text-xs uppercase tracking-widest border-b-2 border-emerald-600 pb-1">
                   {isEn ? 'Explore Market' : 'മാർക്കറ്റ് കാണുക'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* --- SIDEBAR: Quick Links --- */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-stone-100">
            <h3 className="font-black text-xl mb-4 text-emerald-950 flex items-center gap-2">
              <Plus size={20} className="text-emerald-500"/> {isEn ? 'Quick Action' : 'നടപടികൾ'}
            </h3>
            <p className="text-xs text-stone-500 mb-6 font-bold uppercase tracking-wider">
              {isEn ? 'Grow your agricultural presence' : 'നിങ്ങളുടെ വിവരങ്ങൾ ചേർക്കുക'}
            </p>
            
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/sell')}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black hover:bg-emerald-700 transition flex items-center justify-center gap-2"
              >
                <Sprout size={18}/> {isEn ? 'Sell Crop' : 'വിളകൾ വിൽക്കുക'}
              </button>
              
              <button 
                onClick={() => navigate('/vendors')}
                className="w-full bg-stone-100 text-stone-800 py-4 rounded-2xl font-black hover:bg-stone-200 transition flex items-center justify-center gap-2"
              >
                <Store size={18}/> {isEn ? 'Register Shop' : 'കട ചേർക്കുക'}
              </button>
            </div>
          </div>

          <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100">
             <h4 className="font-black text-amber-800 text-sm mb-2">{isEn ? 'Safety Tip' : 'സുരക്ഷാ നിർദ്ദേശം'}</h4>
             <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
               {isEn ? 'Never share your bank OTP with anyone pretending to be a buyer.' : 'വാങ്ങുന്നവർ എന്ന വ്യാജേന വരുന്നവർക്ക് ബാങ്ക് ഒടിപി നൽകരുത്.'}
             </p>
          </div>
        </div>

      </div>
    </div>
  );
}