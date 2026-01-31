import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Leaf, ShieldCheck, Users, ShoppingCart, 
  Wrench, Landmark, MessageSquare, CloudSun, Wind, 
  Droplets, MapPin, RefreshCcw, AlertTriangle, Lightbulb 
} from 'lucide-react';

export default function Home({ lang }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const isEn = lang === 'en';

  // --- CONFIGURATION ---
  // Replace with your actual OpenWeatherMap API Key
  const API_KEY = "7598c67d3e012b4c247bfc87d04e4841"; 
  const CITY = "Kochi"; 

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&appid=${API_KEY}`
        );
        const data = await res.json();
        if (data.cod === 200) setWeather(data);
        setLoading(false);
      } catch (error) {
        console.error("Weather failed:", error);
        setLoading(false);
      }
    };
    fetchWeather();
  }, [API_KEY]);

  // --- SMART ADVISORY LOGIC ---
  const getFarmingTip = () => {
    if (!weather) return null;
    const condition = weather.weather[0].main.toLowerCase();
    const temp = weather.main.temp;

    if (condition.includes('rain')) {
      return {
        en: "Rain detected. Delay pesticide spraying and check drainage in banana and tuber plots.",
        ml: "മഴയ്ക്ക് സാധ്യത. കീടനാശിനി പ്രയോഗം ഒഴിവാക്കുക, തോട്ടങ്ങളിൽ വെള്ളക്കെട്ട് ഇല്ലെന്ന് ഉറപ്പാക്കുക.",
        icon: <AlertTriangle className="text-orange-400" />,
        color: "bg-blue-950 border-blue-800"
      };
    } else if (temp > 32) {
      return {
        en: "High heat! Ensure mulching for young saplings and irrigate during early morning or late evening.",
        ml: "കഠിനമായ ചൂട്! തൈകൾക്ക് പുതയിടുക, നനയ്ക്കുന്നത് അതിരാവിലെയോ വൈകുന്നേരമോ ആക്കുക.",
        icon: <Droplets className="text-blue-400" />,
        color: "bg-orange-950 border-orange-800"
      };
    } else {
      return {
        en: "Favorable conditions. Good time for organic manuring and weeding in coconut groves.",
        ml: "അനുകൂല കാലാവസ്ഥ. തെങ്ങിൻ തോട്ടങ്ങളിൽ വളമിടാനും കള നീക്കം ചെയ്യാനും അനുയോജ്യമായ സമയം.",
        icon: <Lightbulb className="text-yellow-400" />,
        color: "bg-emerald-950 border-emerald-800"
      };
    }
  };

  const tip = getFarmingTip();

  return (
    <div className="w-full bg-white text-stone-900 overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full min-h-[90vh] flex items-center px-6 md:px-12 bg-stone-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-900 clip-path-slant hidden lg:block" />
        
        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center w-full">
          <div className="animate-slideUp">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
              <Leaf size={16} /> {isEn ? "2026 Smart Farming Portal" : "സ്മാർട്ട് ഫാമിംഗ് പോർട്ടൽ"}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] text-emerald-950 mb-8 tracking-tighter">
              {isEn ? "Grow More," : "Grow More,"} <br />
              <span className="text-emerald-600">{isEn ? "Grow Better" :"Grow Better"}.</span>
            </h1>

            {/* LIVE WEATHER & TIP CARD */}
            <div className="flex flex-col gap-4 max-w-md mb-8">
              {/* Weather Mini-Card */}
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-stone-200 shadow-xl">
                {loading ? (
                   <div className="flex items-center gap-2 font-bold text-stone-400 animate-pulse"><RefreshCcw className="animate-spin"/> Syncing Weather...</div>
                ) : weather ? (
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="flex items-center gap-1 text-[10px] font-black text-stone-400 uppercase tracking-widest"><MapPin size={12}/> {weather.name}</p>
                      <h2 className="text-4xl font-black text-emerald-900 mt-1">{Math.round(weather.main.temp)}°C</h2>
                    </div>
                    <div className="text-right">
                      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} className="w-16 h-16" alt="weather icon" />
                      <p className="text-xs font-bold text-stone-500 capitalize">{weather.weather[0].description}</p>
                    </div>
                  </div>
                ) : <p>Weather Offline</p>}
              </div>

              {/* Dynamic Advisory Card */}
              {tip && (
                <div className={`p-6 rounded-[2rem] border-2 shadow-2xl text-white transition-all ${tip.color}`}>
                  <div className="flex items-center gap-2 mb-3">
                    {tip.icon}
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
                      {isEn ? "Farmer Advisory" : "കർഷക നിർദ്ദേശം"}
                    </span>
                  </div>
                  <p className="text-lg font-bold leading-tight">{isEn ? tip.en : tip.ml}</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/marketplace" className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-emerald-700 transition shadow-xl shadow-emerald-200">
                {isEn ? "Go to Market" : "വിപണിയിലേക്ക്"} <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          {/* Visual Grid */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
             <div className="space-y-4 pt-12">
                <img src="https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?auto=format&fit=crop&q=80&w=400" className="h-64 w-full object-cover rounded-[3rem] shadow-2xl" alt="Rice Field" />
                <div className="bg-orange-400 h-40 rounded-[2.5rem] p-8 flex flex-col justify-end text-white">
                  <span className="text-4xl font-black">100%</span>
                  <p className="font-bold text-sm uppercase">Verified Sellers</p>
                </div>
             </div>
             <div className="space-y-4">
                <div className="bg-emerald-500 h-40 rounded-[2.5rem] p-8 flex flex-col justify-end text-white">
                  <span className="text-4xl font-black">24/7</span>
                  <p className="font-bold text-sm uppercase">Expert Support</p>
                </div>
                <img src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=400" className="h-64 w-full object-cover rounded-[3rem] shadow-2xl" alt="Vegetables" />
             </div>
          </div>
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard icon={<ShoppingCart size={32}/>} title={isEn ? "Marketplace" : "വിപണി"} link="/marketplace" color="bg-emerald-50 text-emerald-600" />
          <ServiceCard icon={<Users size={32}/>} title={isEn ? "Experts" : "വിദഗ്ധർ"} link="/experts" color="bg-blue-50 text-blue-600" />
          <ServiceCard icon={<Wrench size={32}/>} title={isEn ? "Vendors" : "വെണ്ടർമാർ"} link="/vendors" color="bg-orange-50 text-orange-600" />
          <ServiceCard icon={<ShieldCheck size={32}/>} title={isEn ? "Diseases" : "രോഗങ്ങൾ"} link="/disease" color="bg-red-50 text-red-600" />
          <ServiceCard icon={<Landmark size={32}/>} title={isEn ? "Subsidies" : "സബ്സിഡി"} link="/subsidies" color="bg-purple-50 text-purple-600" />
          <ServiceCard icon={<MessageSquare size={32}/>} title={isEn ? "Help Center" : "സഹായം"} link="/help" color="bg-stone-100 text-stone-700" />
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ icon, title, link, color }) {
  return (
    <Link to={link} className="group bg-white p-8 rounded-[2rem] border border-stone-100 hover:shadow-2xl hover:border-emerald-200 transition-all">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${color}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-emerald-950 flex items-center justify-between">
        {title} <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
      </h3>
    </Link>
  );
}