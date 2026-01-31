import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Sprout, Tag, MapPin, 
  Phone, Weight, CheckCircle2, Loader2, Award, FileText 
} from 'lucide-react';

export default function SellCrop({ user, lang }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isEn = lang === 'en';

  // --- DEBUGGING ---
  // If the form isn't showing, check your browser console (F12) to see this:
  console.log("Logged in user:", user);

  // 1. Check if user exists
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center p-10 bg-white rounded-[2rem] shadow-xl">
          <p className="font-bold mb-4">{isEn ? 'Please log in to sell crops.' : 'വിൽക്കുന്നതിനായി ലോഗിൻ ചെയ്യുക.'}</p>
          <button onClick={() => navigate('/login')} className="bg-emerald-600 text-white px-8 py-2 rounded-xl">Login</button>
        </div>
      </div>
    );
  }

  // 2. Check Role (Matches 'Farmer', 'farmer', etc.)
  if (user.role?.toLowerCase() !== 'farmer') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
        <div className="bg-white p-12 rounded-[3rem] text-center shadow-2xl border border-stone-100 max-w-sm">
          <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sprout size={40} />
          </div>
          <h2 className="text-2xl font-black text-stone-800 mb-2">Farmer Access Only</h2>
          <p className="text-stone-500 font-medium mb-8">
            Your current role is <b className="text-emerald-600">{user.role}</b>. Only users registered as Farmers can post listings.
          </p>
          <button onClick={() => navigate('/marketplace')} className="w-full py-4 bg-stone-900 text-white rounded-2xl font-black shadow-lg">
            Back to Market
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { cropName, price, unit, location, phone, quality, description } = e.target.elements;

    try {
      await addDoc(collection(db, "market"), {
        cropName: cropName.value,
        price: Number(price.value),
        unit: unit.value,
        location: location.value,
        phone: phone.value,
        quality: quality.value,
        description: description.value,
        sellerName: user.name,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      
      navigate('/marketplace');
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* HEADER SECTION */}
      <section className="bg-emerald-900 pt-16 pb-32 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="p-3 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-black text-white">
              {isEn ? 'List New Crop' : 'പുതിയ വിള ചേർക്കുക'}
            </h1>
            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Farmer Portal</p>
          </div>
          <div className="w-12"></div>
        </div>
      </section>

      {/* FORM SECTION */}
      <div className="max-w-3xl mx-auto px-6 -mt-16">
        <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border border-stone-100">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Crop Name */}
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2 mb-2 block">Crop Name</label>
              <div className="relative">
                <Sprout className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                <input name="cropName" placeholder="e.g. Organic Ginger" className="w-full pl-14 p-4 bg-stone-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition font-bold" required />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2 mb-2 block">Price (₹)</label>
              <div className="relative">
                <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                <input name="price" type="number" placeholder="500" className="w-full pl-14 p-4 bg-stone-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition font-bold" required />
              </div>
            </div>

            {/* Unit */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2 mb-2 block">Unit</label>
              <div className="relative">
                <Weight className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                <select name="unit" className="w-full pl-14 p-4 bg-stone-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition font-bold appearance-none">
                  <option value="kg">Per Kg</option>
                  <option value="quintal">Per Quintal</option>
                  <option value="piece">Per Piece</option>
                </select>
              </div>
            </div>

            {/* Quality */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2 mb-2 block">Quality Grade</label>
              <div className="relative">
                <Award className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                <select name="quality" className="w-full pl-14 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl outline-none font-bold appearance-none">
                  <option value="Premium">Premium / Organic</option>
                  <option value="Grade A">Grade A</option>
                  <option value="Grade B">Grade B</option>
                </select>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2 mb-2 block">Contact Number</label>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                <input name="phone" placeholder="+91" className="w-full pl-14 p-4 bg-stone-50 rounded-2xl outline-none font-bold" required />
              </div>
            </div>

            {/* Location */}
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2 mb-2 block">Location</label>
              <div className="relative">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                <input name="location" placeholder="Town, District" className="w-full pl-14 p-4 bg-stone-50 rounded-2xl outline-none font-bold" required />
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2 mb-2 block">Details</label>
              <textarea name="description" rows="3" placeholder="Additional details..." className="w-full p-4 bg-stone-50 rounded-2xl outline-none font-bold"></textarea>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg mt-8 shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
            {isEn ? 'Confirm and Post' : 'സമർപ്പിക്കുക'}
          </button>
        </form>
      </div>
    </div>
  );
}