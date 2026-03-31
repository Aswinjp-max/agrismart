import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { 
  Award, GraduationCap, Briefcase, 
  Phone, User, CheckCircle, Loader2, ArrowLeft, Lock, FileText 
} from 'lucide-react';

export default function RegisterExpert({ user, lang }) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [existingData, setExistingData] = useState(null);
  const navigate = useNavigate();
  const isEn = lang === 'en';

  // Check if expert already has a profile to pre-fill the form
  useEffect(() => {
    async function checkExisting() {
      if (user?.uid) {
        const docRef = doc(db, "experts", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setExistingData(docSnap.data());
        }
      }
      setFetching(false);
    }
    checkExisting();
  }, [user]);

  if (!user) return <div className="p-10 text-center font-black animate-pulse text-emerald-800">LOADING USER...</div>;
  if (fetching) return <div className="p-10 text-center font-black text-stone-400 uppercase tracking-widest">Fetching Profile...</div>;

  // Security Guard
  if (user.role !== 'Agricultural Expert') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
        <div className="bg-white p-12 rounded-[3rem] text-center shadow-2xl max-w-sm border border-stone-100">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={40} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-stone-800 mb-2">Access Denied</h2>
          <p className="text-stone-500 font-bold text-sm mb-8 leading-relaxed">
            This area is reserved for verified Agricultural Experts only.
          </p>
          <button onClick={() => navigate(-1)} className="w-full py-4 bg-stone-900 text-white rounded-2xl font-black shadow-lg active:scale-95 transition-all">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    try {
      // Use setDoc with user.uid so each expert has exactly ONE unique profile document
      await setDoc(doc(db, "experts", user.uid), {
        name: formData.get("expertName"),
        userId: user.uid, 
        specialty: formData.get("specialty"),
        experience: formData.get("experience"),
        education: formData.get("qualification"),
        phone: formData.get("phone"),
        bio: formData.get("bio"),
        verified: true,
        updatedAt: serverTimestamp(),
        createdAt: existingData?.createdAt || serverTimestamp()
      });

      alert(isEn ? "Expert Profile Updated!" : "പ്രൊഫൈൽ പുതുക്കി!");
      navigate('/dashboard'); // Direct to dashboard to see the new profile
    } catch (err) {
      console.error("Registration Error:", err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* --- HEADER --- */}
      <section className="bg-emerald-950 pt-20 pb-32 px-6 text-center text-white relative">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-10 left-6 p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all active:scale-90"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="w-20 h-20 bg-emerald-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/10">
            <Award size={40} className="text-emerald-400" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black mb-2">
            {isEn ? 'Expert Registration' : 'വിദഗ്ധ രജിസ്ട്രേഷൻ'}
        </h1>
        <p className="text-emerald-400/60 font-bold uppercase tracking-widest text-[10px]">
            Verified Professional Identity
        </p>
      </section>

      <div className="max-w-2xl mx-auto px-6 -mt-16 relative z-10">
        <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border border-stone-100 space-y-6">
          
          {/* Full Name */}
          <div>
            <label className="text-[10px] font-black uppercase text-stone-400 ml-2 flex items-center gap-2 mb-2">
                <User size={12}/> Full Name
            </label>
            <input 
              name="expertName" 
              defaultValue={existingData?.name || user.name || user.displayName} 
              className="w-full p-5 bg-stone-50 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-emerald-500/20 focus:bg-white transition-all" 
              required 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Specialty */}
            <div>
              <label className="text-[10px] font-black uppercase text-stone-400 ml-2 flex items-center gap-2 mb-2">
                <Briefcase size={12}/> Specialty
              </label>
              <input 
                name="specialty" 
                defaultValue={existingData?.specialty}
                placeholder="e.g. Soil Science" 
                className="w-full p-5 bg-stone-50 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-emerald-500/20 focus:bg-white transition-all" 
                required 
              />
            </div>
            {/* Experience */}
            <div>
              <label className="text-[10px] font-black uppercase text-stone-400 ml-2 flex items-center gap-2 mb-2">
                <Award size={12}/> Experience
              </label>
              <input 
                name="experience" 
                defaultValue={existingData?.experience}
                placeholder="e.g. 5 Years" 
                className="w-full p-5 bg-stone-50 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-emerald-500/20 focus:bg-white transition-all" 
                required 
              />
            </div>
          </div>

          {/* Qualification */}
          <div>
            <label className="text-[10px] font-black uppercase text-stone-400 ml-2 flex items-center gap-2 mb-2">
                <GraduationCap size={12}/> Highest Qualification
            </label>
            <div className="relative">
                <select 
                  name="qualification" 
                  defaultValue={existingData?.education || "BSc Agriculture"}
                  className="w-full p-5 bg-stone-50 rounded-2xl outline-none font-bold appearance-none cursor-pointer border-2 border-transparent focus:border-emerald-500/20 focus:bg-white transition-all"
                >
                  <option value="PhD Agriculture">PhD Agriculture</option>
                  <option value="MSc Agronomy">MSc Agronomy</option>
                  <option value="BSc Agriculture">BSc Agriculture</option>
                  <option value="Diploma in Farming">Diploma in Farming</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                    <CheckCircle size={18} />
                </div>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-[10px] font-black uppercase text-stone-400 ml-2 flex items-center gap-2 mb-2">
                <Phone size={12}/> Contact Number
            </label>
            <input 
              name="phone" 
              defaultValue={existingData?.phone}
              placeholder="+91 0000 000 000" 
              className="w-full p-5 bg-stone-50 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-emerald-500/20 focus:bg-white transition-all" 
              required 
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-[10px] font-black uppercase text-stone-400 ml-2 flex items-center gap-2 mb-2">
                <FileText size={12}/> Professional Bio
            </label>
            <textarea 
              name="bio" 
              defaultValue={existingData?.bio}
              rows="4" 
              className="w-full p-5 bg-stone-50 rounded-2xl outline-none font-bold resize-none border-2 border-transparent focus:border-emerald-500/20 focus:bg-white transition-all" 
              placeholder="Tell farmers how you can help them..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-emerald-600 text-white py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 transition-all hover:bg-emerald-700 active:scale-95 shadow-xl shadow-emerald-100 disabled:opacity-50 disabled:active:scale-100"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <CheckCircle size={24} />
            )}
            {isEn ? 'Save Profile' : 'പ്രൊഫൈൽ സേവ് ചെയ്യുക'}
          </button>
        </form>
      </div>
    </div>
  );
}