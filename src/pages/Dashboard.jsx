import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { 
  collection, query, where, onSnapshot, 
  doc, deleteDoc, updateDoc 
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, GraduationCap, Award, 
  ShieldCheck, CalendarCheck,  
  Clock, CheckCircle2, Sprout, ShoppingBag, 
  Trash2, Plus, Wrench, 
  Calendar, Check, X
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

    // 4. BOOKINGS LOGIC:
    // Experts filter by "expertUserId", Farmers filter by "farmerId"
    const bookingField = user.role === 'Agricultural Expert' ? "expertUserId" : "farmerId";
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

  // HANDLE APPOINTMENT STATUS (Approve/Reject)
 const handleStatusUpdate = async (bookingId, newStatus) => {
    if (!bookingId) return;
    try {
      // 1. Get reference to the specific booking document
      const bookingRef = doc(db, "bookings", bookingId);
      
      // 2. Update the status field
      await updateDoc(bookingRef, { 
        status: newStatus 
      });
      
      // UI will update automatically because of the onSnapshot listener in useEffect
    } catch (err) {
      console.error("Firebase Update Error:", err);
      alert(isEn ? "Failed to update status. Please check your internet or permissions." : "മാറ്റം വരുത്താൻ കഴിഞ്ഞില്ല.");
    }
  };

  const handleDelete = async (col, id) => {
    if (window.confirm(isEn ? "Are you sure you want to delete this?" : "ഇത് ഒഴിവാക്കണോ?")) {
      try { 
        await deleteDoc(doc(db, col, id)); 
      } catch (err) { 
        console.error("Delete Error:", err); 
      }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-emerald-900 uppercase tracking-widest">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* --- UNIFIED HEADER --- */}
      <section className="bg-emerald-900 pt-16 pb-32 px-6 text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-emerald-800 rounded-2xl flex items-center justify-center text-emerald-400 font-black text-2xl border border-emerald-700 uppercase">
              {user.name?.[0] || 'U'}
            </div>
            <div>
              <h1 className="text-4xl font-black">{isEn ? 'Dashboard' : 'ഡാഷ്ബോർഡ്'}</h1>
              <p className="opacity-70 font-bold uppercase tracking-widest text-[10px] mt-1">
                {user.name} • <span className="text-emerald-400">{user.role}</span>
              </p>
            </div>
          </div>
          
          <div className="bg-white/10 p-5 px-8 rounded-3xl backdrop-blur-md border border-white/10 text-center min-w-[160px]">
              <p className="text-3xl font-black text-emerald-400">
                {user.role === 'Agricultural Expert' ? data.bookings.length : (data.crops.length + data.equipments.length)}
              </p>
              <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">
                {user.role === 'Agricultural Expert' ? 'Total Bookings' : 'My Listings'}
              </p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 -mt-16 space-y-8 relative z-20">

        {/* --- EXPERT VIEW --- */}
        {user.role === 'Agricultural Expert' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar: Profile Info */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-stone-100 h-fit">
              <h3 className="text-xl font-black text-emerald-950 mb-6 flex items-center gap-2">
                <ShieldCheck className="text-emerald-500" /> {isEn ? 'Expert Profile' : 'വിദഗ്ദ്ധ പ്രൊഫൈൽ'}
              </h3>
              {data.expertProfile ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-stone-600 font-bold text-sm">
                    <Briefcase size={18} className="text-emerald-600"/> {data.expertProfile.specialty}
                  </div>
                  <div className="flex items-center gap-3 text-stone-600 font-bold text-sm">
                    <GraduationCap size={18} className="text-emerald-600"/> {data.expertProfile.education}
                  </div>
                  <div className="flex items-center gap-3 text-stone-600 font-bold text-sm">
                    <Award size={18} className="text-emerald-600"/> {data.expertProfile.experience} {isEn ? 'Years Exp' : 'വർഷം പരിചയം'}
                  </div>
                  <button onClick={() => navigate('/register-expert')} className="text-emerald-600 text-xs font-black underline mt-4">Edit Profile</button>
                </div>
              ) : (
                <button onClick={() => navigate('/register-expert')} className="w-full py-4 border-2 border-dashed rounded-2xl text-stone-400 font-bold">Register Expert Details</button>
              )}
            </div>

            {/* Main Content: Manage Bookings */}
            <div className="lg:col-span-2 space-y-6">
                <h3 className="text-2xl font-black text-emerald-950 flex items-center gap-3">
                  <CalendarCheck className="text-emerald-600" /> {isEn ? 'Booking Requests' : 'ബുക്കിംഗ് അഭ്യർത്ഥനകൾ'}
                </h3>
                <div className="grid gap-4">
                  {data.bookings.length > 0 ? data.bookings.map(b => (
                    <div key={b.id} className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center font-black text-emerald-600 uppercase">{b.farmerName?.[0]}</div>
                         <div>
                           <h4 className="font-black text-stone-800">{b.farmerName}</h4>
                           <div className="flex flex-wrap gap-2 mt-1">
                             <span className="text-[9px] font-black bg-stone-100 text-stone-500 px-2 py-1 rounded-md uppercase">
                               <Calendar size={10} className="inline mr-1"/> {b.appointmentDate}
                             </span>
                             <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md uppercase">
                               {b.serviceType}
                             </span>
                           </div>
                         </div>
                      </div>
                      
                      {b.status === 'pending' ? (
                        <div className="flex gap-2 w-full md:w-auto">
                          <button onClick={() => handleStatusUpdate(b.id, 'approved')} className="flex-1 md:flex-none bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1 active:scale-95 transition-all shadow-lg shadow-emerald-100"><Check size={14}/> Approve</button>
                          <button onClick={() => handleStatusUpdate(b.id, 'rejected')} className="flex-1 md:flex-none bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1 active:scale-95 transition-all"><X size={14}/> Reject</button>
                        </div>
                      ) : (
                        <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase ${b.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                          {b.status}
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className="p-12 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-stone-200 text-stone-400 font-bold italic">No bookings received yet</div>
                  )}
                </div>
            </div>
          </div>
        )}

        {/* --- FARMER VIEW --- */}
        {user.role === 'Farmer' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-10">
              {/* Farmer Section 1: Crops */}
              <section>
                <h2 className="text-2xl font-black text-emerald-950 mb-4 flex items-center gap-3">
                  <ShoppingBag className="text-emerald-600" /> {isEn ? 'Your Crop Listings' : 'നിങ്ങളുടെ ഉൽപ്പന്നങ്ങൾ'}
                </h2>
                <div className="grid gap-4">
                  {data.crops.map(crop => (
                    <div key={crop.id} className="bg-white p-6 rounded-3xl shadow-sm flex justify-between items-center border border-stone-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600"><Sprout size={24}/></div>
                        <div>
                          <h4 className="font-black text-stone-800">{crop.cropName}</h4>
                          <p className="text-emerald-600 font-bold text-sm">₹{crop.price} / {crop.unit}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDelete('market', crop.id)} className="p-3 text-stone-300 hover:text-red-500 transition"><Trash2 size={20}/></button>
                    </div>
                  ))}
                  <button onClick={() => navigate('/sell')} className="border-2 border-dashed p-6 rounded-3xl text-stone-400 font-black flex items-center justify-center gap-2 hover:bg-stone-50 transition"><Plus size={20}/> Add New Listing</button>
                </div>
              </section>

              {/* Farmer Section 2: Bookings Tracking */}
              <section>
                <h2 className="text-2xl font-black text-emerald-950 mb-4 flex items-center gap-3">
                  <Clock className="text-emerald-600" /> {isEn ? 'Sent Appointments' : 'അയച്ച ബുക്കിംഗുകൾ'}
                </h2>
                <div className="grid gap-4">
                  {data.bookings.length > 0 ? data.bookings.map(b => (
                    <div key={b.id} className="bg-white p-6 rounded-3xl shadow-sm flex justify-between items-center border border-stone-100">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${b.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : (b.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600')}`}>
                          {b.status === 'approved' ? <CheckCircle2 size={20}/> : (b.status === 'rejected' ? <X size={20}/> : <Clock size={20}/>)}
                        </div>
                        <div>
                          <h4 className="font-black text-stone-800">Expert: {b.expertName}</h4>
                          <div className="flex gap-2 mt-1">
                            <span className="text-[9px] font-black text-stone-400 uppercase"><Calendar size={10} className="inline mr-1"/> {b.appointmentDate}</span>
                            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">• {b.serviceType}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase ${b.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : (b.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600')}`}>
                        {b.status === 'approved' ? (isEn ? 'Confirmed' : 'സ്ഥിരീകരിച്ചു') : (b.status === 'rejected' ? (isEn ? 'Rejected' : 'നിരസിച്ചു') : (isEn ? 'Pending' : 'കാത്തിരിക്കുന്നു'))}
                      </div>
                    </div>
                  )) : (
                    <div className="p-10 bg-white rounded-3xl text-center border-2 border-dashed text-stone-400 font-bold italic">
                       No appointments booked. <span onClick={() => navigate('/experts')} className="text-emerald-600 underline cursor-pointer font-black not-italic ml-1">Browse Experts</span>
                    </div>
                  )}
                </div>
              </section>
            </div>
            
            <aside>
              <div className="bg-emerald-950 p-8 rounded-[2.5rem] text-white shadow-xl sticky top-6">
                 <h3 className="font-black text-xl mb-4">Direct Advice</h3>
                 <p className="text-emerald-200/60 text-sm font-bold mb-8 leading-relaxed italic">Consult with verified experts regarding pests, irrigation, or crop diseases.</p>
                 <button onClick={() => navigate('/experts')} className="w-full bg-emerald-500 text-emerald-950 py-4 rounded-2xl font-black hover:bg-white transition-all active:scale-95 shadow-lg shadow-emerald-900/50">Find Experts</button>
              </div>
            </aside>
          </div>
        )}

        {/* --- VENDOR VIEW --- */}
        {user.role === 'Vendor' && (
          <section>
            <h2 className="text-2xl font-black text-emerald-950 mb-6 flex items-center gap-3">
              <Wrench className="text-emerald-600" /> Equipment for Rent/Sale
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.equipments.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-stone-100 group">
                  <div className="w-full h-44 bg-stone-50 rounded-[2rem] mb-4 overflow-hidden relative">
                    <img src={item.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={item.name} />
                    <button onClick={() => handleDelete('vendors', item.id)} className="absolute top-4 right-4 p-2 bg-white/90 text-red-500 rounded-xl shadow-md active:scale-90 transition-all"><Trash2 size={18}/></button>
                  </div>
                  <h4 className="font-black text-stone-800 text-lg">{item.name}</h4>
                  <div className="flex justify-between items-center mt-4">
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">{item.category}</span>
                    <p className="font-black text-emerald-600 text-xl">₹{item.price}</p>
                  </div>
                </div>
              ))}
              <button onClick={() => navigate('/vendors')} className="h-full min-h-[260px] border-4 border-dashed border-stone-200 rounded-[2.5rem] flex flex-col items-center justify-center text-stone-300 hover:text-emerald-500 hover:border-emerald-200 transition-all active:scale-95">
                <Plus size={48} />
                <span className="font-black mt-4 uppercase tracking-widest">Add Equipment</span>
              </button>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}