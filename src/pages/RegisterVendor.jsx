import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Store, Package, Tag, 
  Phone, MapPin, Image as ImageIcon, 
  Truck, CheckCircle, Loader2 
} from 'lucide-react';

export default function RegisterVendor({ user, lang }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isEn = lang === 'en';

  if (user?.role !== 'Vendor') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
        <div className="bg-white p-12 rounded-[3rem] text-center shadow-2xl max-w-sm border border-stone-100">
          <Store size={48} className="text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-stone-800 mb-2">Vendor Access Only</h2>
          <button onClick={() => navigate('/vendors')} className="w-full py-4 bg-stone-900 text-white rounded-2xl font-black mt-4">Back</button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { shopName, productName, price, actionType, category, phone, location, imageUrl, delivery } = e.target.elements;

    try {
      await addDoc(collection(db, "vendors"), {
        shopName: shopName.value,
        productName: productName.value,
        price: price.value,
        actionType: actionType.value,
        category: category.value,
        phone: phone.value,
        location: location.value,
        imageUrl: imageUrl.value || "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=400",
        delivery: delivery.checked,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      navigate('/vendors');
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <section className="bg-emerald-950 pt-20 pb-32 px-6 text-center text-white relative">
        <button 
          onClick={() => navigate('/vendors')}
          className="absolute top-10 left-6 p-3 bg-white/10 rounded-full hover:bg-white/20 transition text-white"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-black">{isEn ? 'List Your Product' : 'ഉൽപ്പന്നം ചേർക്കുക'}</h1>
        <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest mt-2">Grow your business with AgriConnect</p>
      </section>

      <div className="max-w-4xl mx-auto px-6 -mt-16">
        <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] shadow-2xl p-10 md:p-14 border border-stone-100 animate-slideUp">
          <h2 className="text-3xl font-black text-emerald-950 mb-8">{isEn ? 'Product Details' : 'വിവരങ്ങൾ'}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Shop Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Shop/Business Name</label>
              <div className="relative">
                <Store className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                <input name="shopName" placeholder="e.g. Kerala Agro Traders" className="w-full pl-14 p-5 bg-stone-50 rounded-2xl outline-none font-bold focus:ring-2 ring-emerald-500 transition" required />
              </div>
            </div>

            {/* Product Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Item Name</label>
              <div className="relative">
                <Package className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                <input name="productName" placeholder="e.g. Power Tiller" className="w-full pl-14 p-5 bg-stone-50 rounded-2xl outline-none font-bold focus:ring-2 ring-emerald-500 transition" required />
              </div>
            </div>

            {/* Price & Action */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Price (₹)</label>
                <input name="price" placeholder="500" className="w-full p-5 bg-stone-50 rounded-2xl outline-none font-bold focus:ring-2 ring-emerald-500 transition" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Type</label>
                <select name="actionType" className="w-full p-5 bg-emerald-50 text-emerald-700 rounded-2xl outline-none font-black appearance-none">
                  <option value="Rent">For Rent</option>
                  <option value="Buy">For Sale</option>
                </select>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Category</label>
              <select name="category" className="w-full p-5 bg-stone-50 rounded-2xl outline-none font-bold appearance-none focus:ring-2 ring-emerald-500">
                <option value="Machinery">Machinery</option>
                <option value="Seeds">Seeds & Plants</option>
                <option value="Irrigation">Irrigation</option>
                <option value="Tools">Small Tools</option>
              </select>
            </div>

            {/* Contact Phone */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Contact Number</label>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                <input name="phone" placeholder="+91" className="w-full pl-14 p-5 bg-stone-50 rounded-2xl outline-none font-bold focus:ring-2 ring-emerald-500 transition" required />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                <input name="location" placeholder="e.g. Palakkad, Kerala" className="w-full pl-14 p-5 bg-stone-50 rounded-2xl outline-none font-bold focus:ring-2 ring-emerald-500 transition" required />
              </div>
            </div>

            {/* Image URL */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Product Image Link (Optional)</label>
              <div className="relative">
                <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                <input name="imageUrl" placeholder="Paste image URL here" className="w-full pl-14 p-5 bg-stone-50 rounded-2xl outline-none font-bold focus:ring-2 ring-emerald-500 transition" />
              </div>
            </div>

            {/* Delivery Checkbox */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 p-5 bg-emerald-50 rounded-2xl cursor-pointer hover:bg-emerald-100 transition">
                <input type="checkbox" name="delivery" className="w-6 h-6 accent-emerald-600" />
                <div className="flex items-center gap-2">
                  <Truck size={20} className="text-emerald-600" />
                  <span className="text-sm font-black text-emerald-800 uppercase tracking-widest">Provide Home Delivery</span>
                </div>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-6 rounded-[1.5rem] font-black text-xl mt-12 shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <CheckCircle />}
            {isEn ? 'Submit' : 'സമർപ്പിക്കുക'}
          </button>
        </form>
      </div>
    </div>
  );
}