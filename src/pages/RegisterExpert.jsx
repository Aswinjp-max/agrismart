import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { 
  Award, GraduationCap, Briefcase, 
  Phone, User, CheckCircle, Loader2, ArrowLeft, Lock 
} from 'lucide-react';

export default function RegisterExpert({ user, lang }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isEn = lang === 'en';

  if (!user) return <div className="p-10 text-center font-black">LOADING...</div>;

  if (user.role !== 'Agricultural Expert') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
        <div className="bg-white p-12 rounded-[3rem] text-center shadow-2xl max-w-sm border border-stone-100">
          <Lock size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-stone-800 mb-2">Access Denied</h2>
          <button onClick={() => navigate(-1)} className="w-full py-4 bg-stone-900 text-white rounded-2xl font-black">Go Back</button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    try {
      await addDoc(collection(db, "experts"), {
        name: formData.get("expertName"),
        userId: user.uid, // Required for the delete button to work
        specialty: formData.get("specialty"),
        experience: formData.get("experience"),
        education: formData.get("qualification"),
        phone: formData.get("phone"),
        bio: formData.get("bio"),
        verified: true,
        createdAt: serverTimestamp()
      });
      alert(isEn ? "Profile Registered!" : "പ്രൊഫൈൽ രജിസ്റ്റർ ചെയ്തു!");
      navigate('/experts');
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <section className="bg-emerald-900 pt-20 pb-32 px-6 text-center text-white relative">
        <button onClick={() => navigate(-1)} className="absolute top-10 left-6 p-3 bg-white/10 rounded-full hover:bg-white/20 transition">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-black">{isEn ? 'Expert Registration' : 'വിദഗ്ധ രജിസ്ട്രേഷൻ'}</h1>
      </section>

      <div className="max-w-2xl mx-auto px-6 -mt-16">
        <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] shadow-2xl p-10 border border-stone-100 space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase text-stone-400 ml-2">Full Name</label>
            <input name="expertName" defaultValue={user.name || user.displayName} className="w-full p-5 bg-stone-50 rounded-2xl outline-none font-bold" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black uppercase text-stone-400 ml-2">Specialty</label>
              <input name="specialty" placeholder="e.g. Plant Pathology" className="w-full p-5 bg-stone-50 rounded-2xl outline-none font-bold" required />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-stone-400 ml-2">Experience</label>
              <input name="experience" placeholder="e.g. 8 Years" className="w-full p-5 bg-stone-50 rounded-2xl outline-none font-bold" required />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-stone-400 ml-2">Qualification</label>
            <select name="qualification" className="w-full p-5 bg-stone-50 rounded-2xl outline-none font-bold appearance-none">
              <option value="PhD Agriculture">PhD Agriculture</option>
              <option value="MSc Agronomy">MSc Agronomy</option>
              <option value="BSc Agriculture">BSc Agriculture</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-stone-400 ml-2">Phone Number</label>
            <input name="phone" placeholder="+91" className="w-full p-5 bg-stone-50 rounded-2xl outline-none font-bold" required />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-stone-400 ml-2">Bio / Description</label>
            <textarea name="bio" rows="4" className="w-full p-5 bg-stone-50 rounded-2xl outline-none font-bold resize-none" placeholder="Briefly describe your expertise..."></textarea>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white py-6 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all hover:bg-emerald-700 active:scale-95">
            {loading ? <Loader2 className="animate-spin" /> : <CheckCircle />}
            {isEn ? 'Submit Profile' : 'സമർപ്പിക്കുക'}
          </button>
        </form>
      </div>
    </div>
  );
}