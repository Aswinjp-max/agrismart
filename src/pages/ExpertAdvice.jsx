import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Search, GraduationCap, Award, Briefcase, Calendar, Lock, CheckCircle, X, Phone, Trash2, Plus } from 'lucide-react';

export default function ExpertAdvice({ user, lang }) {
  const [experts, setExperts] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [bookingData, setBookingData] = useState({ service: '', date: '' });
  
  const navigate = useNavigate();
  const isEn = lang === 'en';

  useEffect(() => {
    const q = query(collection(db, "experts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setExperts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm(isEn ? "Delete your expert profile?" : "നിങ്ങളുടെ പ്രൊഫൈൽ നീക്കം ചെയ്യണോ?")) {
      try {
        await deleteDoc(doc(db, "experts", id));
      } catch (err) { alert(err.message); }
    }
  };

  const handleOpenBooking = (expert) => {
    if (!user || user.role !== 'Farmer') {
      alert(isEn ? "Only Farmers can book experts" : "കർഷകർക്ക് മാത്രമേ ബുക്ക് ചെയ്യാൻ കഴിയൂ");
      return;
    }
    setSelectedExpert(expert);
    setShowModal(true);
  };

  const confirmBooking = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "bookings"), {
        expertId: selectedExpert.id,
        expertName: selectedExpert.name,
        expertUserId: selectedExpert.userId, // CRITICAL: Links to the Expert's Dashboard
        farmerId: user.uid,
        farmerName: user.name || user.displayName || "Farmer",
        serviceType: bookingData.service,
        appointmentDate: bookingData.date,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      alert(isEn ? "Booking Request Sent!" : "അഭ്യർത്ഥന അയച്ചു!");
      setShowModal(false);
    } catch (err) { alert(err.message); }
  };

  const filtered = experts.filter(e => 
    e.name?.toLowerCase().includes(search.toLowerCase()) || 
    e.specialty?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* --- MODAL CODE REMAINS THE SAME AS PREVIOUS --- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-emerald-950/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black">{isEn ? 'Book Appointment' : 'ബുക്കിംഗ്'}</h2>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>
            <form onSubmit={confirmBooking} className="space-y-6">
              <select required className="w-full p-4 bg-stone-50 rounded-2xl font-bold" onChange={(e) => setBookingData({...bookingData, service: e.target.value})}>
                <option value="">{isEn ? "-- Choose Service --" : "-- തിരഞ്ഞെടുക്കുക --"}</option>
                <option value="Video Call">Video Call</option>
                <option value="Farm Visit">Farm Visit</option>
              </select>
              <input type="date" required className="w-full p-4 bg-stone-50 rounded-2xl font-bold" onChange={(e) => setBookingData({...bookingData, date: e.target.value})} />
              <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black">Send Request</button>
            </form>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <section className="bg-emerald-950 pt-20 pb-32 px-6 text-center text-white">
        <h1 className="text-4xl font-black mb-6">{isEn ? 'Agricultural' : 'കാർഷിക'} <span className="text-emerald-400">Experts</span></h1>
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-800" />
          <input onChange={(e) => setSearch(e.target.value)} placeholder="Search specialty..." className="w-full p-6 pl-14 rounded-full text-stone-900 font-bold" />
        </div>
      </section>

      {/* --- REGISTER BUTTON FOR EXPERTS --- */}
      {user?.role === 'Agricultural Expert' && (
        <div className="max-w-2xl mx-auto px-6 mb-8 -mt-8 relative z-10">
          <button 
            onClick={() => navigate('/register-expert')}
            className="w-full py-5 bg-white border-2 border-dashed border-emerald-200 text-emerald-700 rounded-[2rem] font-black flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all shadow-xl"
          >
            <Plus size={20}/> {isEn ? "Create Expert Profile" : "വിദഗ്ധ പ്രൊഫൈൽ സൃഷ്ടിക്കുക"}
          </button>
        </div>
      )}

      {/* --- EXPERTS LIST --- */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(exp => (
          <div key={exp.id} className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm relative">
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 bg-emerald-900 rounded-2xl flex items-center justify-center text-white font-black text-2xl uppercase">{exp.name?.[0]}</div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black"><CheckCircle size={10} /> VERIFIED</div>
                {/* DELETE BUTTON FOR OWNER */}
                {user?.uid === exp.userId && (
                  <button onClick={() => handleDelete(exp.id)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100"><Trash2 size={16} /></button>
                )}
              </div>
            </div>
            <h3 className="text-2xl font-black text-stone-800">{exp.name}</h3>
            <p className="text-emerald-600 text-[10px] font-black uppercase mb-6 flex items-center gap-2"><Briefcase size={12}/> {exp.specialty}</p>
            <div className="space-y-3 mb-8 border-t pt-6 text-sm font-bold text-stone-500">
                <div className="flex items-center gap-3"><GraduationCap size={18} className="text-emerald-500" /> {exp.education}</div>
                <div className="flex items-center gap-3"><Award size={18} className="text-emerald-500" /> {exp.experience} Experience</div>
            </div>
            <button onClick={() => handleOpenBooking(exp)} className={`w-full py-5 rounded-2xl font-black flex items-center justify-center gap-2 ${user?.role === 'Farmer' ? "bg-emerald-600 text-white shadow-lg" : "bg-stone-100 text-stone-400 cursor-not-allowed"}`}>
              {user?.role === 'Farmer' ? <Calendar size={18}/> : <Lock size={18}/>} {isEn ? "Book Appointment" : "ബുക്ക് ചെയ്യുക"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}