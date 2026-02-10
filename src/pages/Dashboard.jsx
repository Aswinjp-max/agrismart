import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { 
  collection, query, where, onSnapshot, 
  doc, deleteDoc 
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Sprout, Store, Award, 
  Trash2, ShoppingBag, Plus, CalendarCheck,
  ChevronRight, Clock, CheckCircle2, UserCircle,
  Wrench, ShieldCheck, GraduationCap, Briefcase
} from 'lucide-react';

export default function Dashboard({ user, lang }) {
  const [data, setData] = useState({ 
    crops: [], 
    equipments: [], 
    expertProfile: null,
    bookings: [] 
  });
  const [loading, setLoading] = useState(true);
  const isEn = lang === 'en';
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.uid) return;

    // 1. DATA FOR FARMERS: Their crop listings
    const cropQ = query(collection(db, "market"), where("userId", "==", user.uid));
    const unsubCrops = onSnapshot(cropQ, (snap) => {
      setData(prev => ({ ...prev, crops: snap.docs.map(d => ({ id: d.id, ...d.data() })) }));
    });

    // 2. DATA FOR VENDORS: Their equipment listings
    const equipQ = query(collection(db, "vendors"), where("userId", "==", user.uid));
    const unsubEquip = onSnapshot(equipQ, (snap) => {
      setData(prev => ({ ...prev, equipments: snap.docs.map(d => ({ id: d.id, ...d.data() })) }));
    });

    // 3. DATA FOR EXPERTS: Their own profile details
    const expertQ = query(collection(db, "experts"), where("userId", "==", user.uid));
    const unsubExpert = onSnapshot(expertQ, (snap) => {
      setData(prev => ({ 
        ...prev, 
        expertProfile: !snap.empty ? { id: snap.docs[0].id, ...snap.docs[0].data() } : null 
      }));
    });

    // 4. DATA FOR FARMERS (Their requests) OR EXPERTS (Requests received)
    const bookingField = user.role === 'Agricultural Expert' ? "expertUserId" : "userId";
    const bookingQ = query(collection(db, "bookings"), where(bookingField, "==", user.uid));
    
    const unsubBookings = onSnapshot(bookingQ, (snap) => {
      setData(prev => ({ ...prev, bookings: snap.docs.map(d => ({ id: d.id, ...d.data() })) }));
      setLoading(false);
    });

    return () => {
      unsubCrops();
      unsubEquip();
      unsubExpert();
      unsubBookings();
    };
  }, [user]);

  const handleDelete = async (col, id) => {
    if (window.confirm(isEn ? "Are you sure you want to delete this listing?" : "ഇത് ഒഴിവാക്കണോ?")) {
      try { await deleteDoc(doc(db, col, id)); } catch (err) { console.error(err); }
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* --- UNIFIED HEADER --- */}
      <section className="bg-emerald-900 pt-16 pb-32 px-6 text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <UserCircle size={56} className="text-emerald-400" />
            <div>
              <h1 className="text-4xl font-black">{isEn ? 'Dashboard' : 'ഡാഷ്ബോർഡ്'}</h1>
              <p className="opacity-70 font-bold uppercase tracking-widest text-xs mt-1">
                {user.name} • <span className="text-emerald-400">{user.role}</span>
              </p>
            </div>
          </div>
          
          <div className="bg-white/10 p-5 px-8 rounded-3xl backdrop-blur-md border border-white/10 text-center">
             <p className="text-3xl font-black text-emerald-400">
               {user.role === 'Agricultural Expert' ? data.bookings.length : (data.crops.length + data.equipments.length)}
             </p>
             <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">
                {user.role === 'Agricultural Expert' ? 'Bookings' : 'Active Listings'}
             </p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 -mt-16 space-y-8 relative z-20">

        {/* ==========================================
            EXPERT VIEW: Profile & Booking Manager
        =========================================== */}
        {user.role === 'Agricultural Expert' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Expert Profile Details Card */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-stone-100 h-fit">
              <h3 className="text-xl font-black text-emerald-950 mb-6 flex items-center gap-2">
                <ShieldCheck className="text-emerald-500" /> Professional Details
              </h3>
              {data.expertProfile ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-stone-600 font-bold">
                    <Briefcase size={18} className="text-emerald-600"/> {data.expertProfile.specialty}
                  </div>
                  <div className="flex items-center gap-3 text-stone-600 font-bold">
                    <GraduationCap size={18} className="text-emerald-600"/> {data.expertProfile.education}
                  </div>
                  <div className="flex items-center gap-3 text-stone-600 font-bold">
                    <Award size={18} className="text-emerald-600"/> {data.expertProfile.experience} Experience
                  </div>
                </div>
              ) : <p className="text-stone-400 font-bold">No profile found</p>}
            </div>

            {/* Manage Bookings Portal */}
            <div className="lg:col-span-2">
              <button 
                onClick={() => navigate('/expert-dashboard')}
                className="w-full bg-emerald-600 text-white p-8 rounded-[2.5rem] shadow-xl flex items-center justify-between group hover:bg-emerald-700 transition-all"
              >
                <div className="flex items-center gap-6 text-left">
                  <CalendarCheck size={40} className="text-emerald-200" />
                  <div>
                    <h3 className="text-2xl font-black">Manage Bookings</h3>
                    <p className="text-sm font-bold opacity-80 uppercase tracking-widest">
                      {data.bookings.filter(b => b.status === 'pending').length} New Requests Pending
                    </p>
                  </div>
                </div>
                <ChevronRight size={30} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* ==========================================
            FARMER VIEW: Crops & Appointments
        =========================================== */}
        {user.role === 'Farmer' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* My Marketplace Listings */}
              <section>
                <h2 className="text-2xl font-black text-emerald-950 mb-4 flex items-center gap-3">
                  <ShoppingBag className="text-emerald-600" /> {isEn ? 'Crops in Marketplace' : 'വിപണിയിലെ വിളകൾ'}
                </h2>
                <div className="grid gap-4">
                  {data.crops.map(crop => (
                    <div key={crop.id} className="bg-white p-6 rounded-[2rem] shadow-sm flex justify-between items-center border border-stone-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600"><Sprout size={24}/></div>
                        <div>
                          <h4 className="font-black text-stone-800">{crop.cropName}</h4>
                          <p className="text-emerald-600 font-bold text-sm">₹{crop.price} / {crop.unit}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDelete('market', crop.id)} className="p-3 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition">
                        <Trash2 size={20}/>
                      </button>
                    </div>
                  ))}
                  <button onClick={() => navigate('/sell')} className="border-2 border-dashed border-stone-200 p-6 rounded-[2rem] text-stone-400 font-black flex items-center justify-center gap-2 hover:bg-stone-100 transition">
                    <Plus size={20}/> Add New Crop
                  </button>
                </div>
              </section>

              {/* My Appointment Status */}
              <section>
                <h2 className="text-2xl font-black text-emerald-950 mb-4 flex items-center gap-3">
                  <Clock className="text-emerald-600" /> Appointment Status
                </h2>
                <div className="grid gap-4">
                  {data.bookings.map(b => (
                    <div key={b.id} className="bg-white p-6 rounded-[2rem] shadow-sm flex justify-between items-center border border-stone-100">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${b.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {b.status === 'approved' ? <CheckCircle2 size={20}/> : <Clock size={20}/>}
                        </div>
                        <div>
                          <h4 className="font-black text-stone-800">{b.expertName}</h4>
                          <p className="text-[10px] font-black uppercase text-stone-400 tracking-wider">
                            {b.serviceType} • <span className={b.status === 'approved' ? 'text-emerald-600' : 'text-amber-600'}>{b.status}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
            
            <aside>
               <div className="bg-emerald-950 p-8 rounded-[2.5rem] text-white">
                  <h3 className="font-black text-xl mb-4">Quick Sell</h3>
                  <p className="text-emerald-200 text-sm font-bold mb-6">List your products for direct sale to users.</p>
                  <button onClick={() => navigate('/sell')} className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black">List a Product</button>
               </div>
            </aside>
          </div>
        )}

        {/* ==========================================
            VENDOR VIEW: Equipment Listings
        =========================================== */}
        {user.role === 'Vendor' && (
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-black text-emerald-950 mb-6 flex items-center gap-3">
              <Wrench className="text-emerald-600" /> Equipment & Tools Added
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.equipments.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-stone-100 flex flex-col group">
                  <div className="w-full h-40 bg-stone-100 rounded-[1.5rem] mb-4 overflow-hidden relative">
                    <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                    <button 
                      onClick={() => handleDelete('vendors', item.id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md text-red-500 rounded-xl shadow-lg"
                    >
                      <Trash2 size={18}/>
                    </button>
                  </div>
                  <h4 className="font-black text-stone-800 text-lg">{item.name}</h4>
                  <div className="mt-auto flex justify-between items-center pt-4">
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{item.category}</span>
                    <p className="font-black text-emerald-600 text-lg">₹{item.price}</p>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => navigate('/vendors')}
                className="h-full min-h-[250px] border-4 border-dashed border-stone-200 rounded-[2.5rem] flex flex-col items-center justify-center text-stone-300 hover:text-emerald-500 hover:border-emerald-200 transition-all"
              >
                <Plus size={48} />
                <span className="font-black mt-4 uppercase tracking-widest">Add Equipment</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}