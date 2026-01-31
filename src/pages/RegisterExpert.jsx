import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { 
  Award, GraduationCap, Briefcase, 
  Phone, User, CheckCircle, Loader2, BookOpen, X, ArrowLeft 
} from 'lucide-react';

export default function RegisterExpert({ user, lang }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isEn = lang === 'en';

  if (user?.role !== 'Agricultural Expert') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
        <div className="bg-white p-12 rounded-[3rem] text-center shadow-2xl max-w-sm border border-stone-100">
          <Award size={48} className="text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-stone-800 mb-2">Expert Portal Only</h2>
          <button onClick={() => navigate('/experts')} className="w-full py-4 bg-stone-900 text-white rounded-2xl font-black mt-4">Back</button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { expertName, specialty, experience, qualification, bio, phone } = e.target.elements;

    try {
      await addDoc(collection(db, "experts"), {
        name: expertName.value,
        email: user.email,
        userId: user.uid,
        specialty: specialty.value,
        experience: experience.value,
        education: qualification.value,
        bio: bio.value,
        phone: phone.value,
        callRequests: 0,
        createdAt: serverTimestamp()
      });
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
        <button 
          onClick={() => navigate('/experts')}
          className="absolute top-10 left-6 p-3 bg-white/10 rounded-full hover:bg-white/20 transition text-white"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-black">{isEn ? 'Expert Profile' : 'വിദഗ്ധ പ്രൊഫൈൽ'}</h1>
        <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest mt-2">Create your professional presence</p>
      </section>

      <div className="max-w-2xl mx-auto px-6 -mt-16">
       
        <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] shadow-2xl p-10 md:p-14 border border-stone-100 animate-slideUp">
          
          <h2 className="text-3xl font-black text-emerald-950 mb-8">{isEn ? 'Professional Details' : 'വിവരങ്ങൾ'}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Name Input */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Full Name (with Title)</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                <input name="expertName" defaultValue={user.name} placeholder="e.g. Dr. Sarah Johnson" className="w-full pl-14 p-5 bg-stone-50 rounded-2xl outline-none font-bold focus:ring-2 ring-emerald-500 transition" required />
              </div>
            </div>

            {/* Qualification */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Highest Qualification</label>
              <div className="relative">
                <GraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                <select name="qualification" className="w-full pl-14 p-5 bg-stone-50 rounded-2xl outline-none font-bold appearance-none focus:ring-2 ring-emerald-500">
                  <option value="PhD Agricultural Science">PhD Agricultural Science</option>
                  <option value="MSc Agronomy">MSc Agronomy</option>
                  <option value="MSc Horticulture">MSc Horticulture</option>
                  <option value="BSc Agriculture">BSc Agriculture</option>
                  <option value="B.Tech Agricultural Engineering">B.Tech Agricultural Engineering</option>
                </select>
              </div>
            </div>

            {/* Specialty */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Area of Expertise</label>
              <div className="relative">
                <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                <input name="specialty" placeholder="e.g. Soil Health" className="w-full pl-14 p-5 bg-stone-50 rounded-2xl outline-none font-bold focus:ring-2 ring-emerald-500" required />
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Years of Experience</label>
              <div className="relative">
                <Award className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                <input name="experience" placeholder="e.g. 10 Years" className="w-full pl-14 p-5 bg-stone-50 rounded-2xl outline-none font-bold focus:ring-2 ring-emerald-500" required />
              </div>
            </div>

            {/* Phone */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Contact Number</label>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                <input name="phone" placeholder="+91" className="w-full pl-14 p-5 bg-stone-50 rounded-2xl outline-none font-bold focus:ring-2 ring-emerald-500" required />
              </div>
            </div>

            {/* Bio */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Professional Bio</label>
              <div className="relative">
                <BookOpen className="absolute left-5 top-6 text-emerald-500" size={20} />
                <textarea name="bio" rows="4" className="w-full pl-14 p-5 bg-stone-50 rounded-2xl outline-none font-bold resize-none focus:ring-2 ring-emerald-500 transition" placeholder="Tell farmers how you can help them..."></textarea>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-6 rounded-[1.5rem] font-black text-xl mt-12 shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <CheckCircle />}
            {isEn ? 'Register' : 'പ്രൊഫൈൽ സമർപ്പിക്കുക'}
          </button>
        </form>
      </div>
    </div>
  );
}