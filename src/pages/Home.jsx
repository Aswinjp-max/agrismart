import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Leaf, ShieldCheck, Users, ShoppingCart, 
  Wrench, Landmark, MessageSquare, RefreshCcw, 
  AlertTriangle, Lightbulb, MapPin, Droplets, Wind,
  Loader2,Snowflake
} from 'lucide-react';

export default function Home({ lang }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationStatus, setLocationStatus] = useState("detecting"); // detecting, found, denied
  const isEn = lang === 'en';

  const API_KEY = "7598c67d3e012b4c247bfc87d04e4841"; 

  // --- WEATHER & LOCATION LOGIC ---
  const initWeather = useCallback(() => {
    setLoading(true);
    setLocationStatus("detecting");

    const fetchByCoords = async (lat, lon) => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        const data = await res.json();
        if (data.cod === 200) {
          setWeather(data);
          setLocationStatus("found");
        }
      } catch (err) {
        console.error("Weather fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchByFallback = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Kochi&units=metric&appid=${API_KEY}`
        );
        const data = await res.json();
        if (data.cod === 200) {
          setWeather(data);
          setLocationStatus("denied");
        }
      } catch (err) {
        console.error("Fallback error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
        (err) => {
          console.warn("Location permission denied");
          fetchByFallback();
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      fetchByFallback();
    }
  }, [API_KEY]);

  useEffect(() => {
    initWeather();
  }, [initWeather]);

  // --- SMART ADVISORY LOGIC ---
  const getFarmingTip = () => {
    if (!weather) return null;
    const condition = weather.weather[0].main.toLowerCase();
    const temp = weather.main.temp;

    if (condition.includes('rain')) {
      return {
        en: "Rain detected. Delay pesticide spraying and check drainage in plots.",
        ml: "മഴയ്ക്ക് സാധ്യത. കീടനാശിനി പ്രയോഗം ഒഴിവാക്കുക, വെള്ളക്കെട്ട് പരിശോധിക്കുക.",
        icon: <AlertTriangle className="text-orange-400" />,
        color: "bg-blue-950 border-blue-800"
      };
    } else if (temp > 32) {
      return {
        en: "High heat! Irrigate during early morning or late evening.",
        ml: "കഠിനമായ ചൂട്! നനയ്ക്കുന്നത് അതിരാവിലെയോ വൈകുന്നേരമോ ആക്കുക.",
        icon: <Droplets className="text-blue-400" />,
        color: "bg-orange-950 border-orange-800"
      };
    } 
    else if (temp < 25) {
      return {
        en: "Cool weather! Ideal for planting and transplanting.",
        ml: "അതിന്റെ ചൂട്! വളര്‍ത്താനും പ്രത്യേകമായി വളര്‍ത്താനും അനുയോജ്യമായ കാലം.",
        icon: <Snowflake className="text-blue-400" />,
        color: "bg-blue-950 border-blue-800"
      };
    }else {
      return {
        en: "Favorable conditions. Good time for organic manuring and weeding.",
        ml: "അനുകൂല കാലാവസ്ഥ. വളമിടാനും കള നീക്കം ചെയ്യാനും അനുയോജ്യമായ സമയം.",
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
              {isEn ? "Grow More," : "കൂടുതൽ വളർത്തുക,"} <br />
              <span className="text-emerald-600">{isEn ? "Grow Better" :"മികച്ച രീതിയിൽ"}.</span>
            </h1>

            {/* LIVE WEATHER & TIP CARD */}
            <div className="flex flex-col gap-4 max-w-md mb-8">
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2.5rem] border border-stone-200 shadow-xl relative">
                
                {/* Refresh Button */}
                <button 
                  onClick={initWeather}
                  disabled={loading}
                  className="absolute top-4 right-4 p-2 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 transition-all disabled:opacity-50"
                >
                  <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
                </button>

                {loading ? (
                   <div className="flex items-center gap-3 py-4 font-black text-stone-400">
                     <Loader2 className="animate-spin text-emerald-500" size={24}/> 
                     <div className="text-xs uppercase tracking-widest">
                        {isEn ? "Detecting Location..." : "ലൊക്കേഷൻ കണ്ടെത്തുന്നു..."}
                     </div>
                   </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="flex items-center gap-1 text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">
                        <MapPin size={12} className="text-emerald-600"/> 
                        {weather?.name} {locationStatus === "denied" && <span className="text-red-400 ml-1">(Fixed)</span>}
                      </p>
                      <h2 className="text-5xl font-black text-emerald-950">{Math.round(weather?.main?.temp)}°C</h2>
                      <p className="text-[10px] font-bold text-emerald-600 mt-1 uppercase tracking-widest">
                        {weather?.weather[0].description}
                      </p>
                    </div>
                    <img 
                      src={`https://openweathermap.org/img/wn/${weather?.weather[0].icon}@4x.png`} 
                      className="w-24 h-24 -mr-4" 
                      alt="weather" 
                    />
                  </div>
                )}
              </div>

              {/* Dynamic Advisory Card */}
              {tip && !loading && (
                <div className={`p-6 rounded-[2.5rem] border-2 shadow-2xl text-white transition-all ${tip.color}`}>
                  <div className="flex items-center gap-2 mb-3">
                    {tip.icon}
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
                      {isEn ? "Live Advisory" : "തത്സമയ നിർദ്ദേശം"}
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

          {/* Visual Grid Images */}
          {/* Visual Grid Images - ENLARGED VERSION */}
{/* --- FULL WIDTH AUTO-ADJUSTING VIDEO --- */}
<div className="w-full mt-12 lg:mt-0 px-0 md:px-4">
  <div className="max-w-6xl mx-auto"> 
    <div className="relative w-full aspect-video rounded-[2rem] lg:rounded-[4rem] overflow-hidden shadow-2xl border border-stone-200">
      <video 
        src="https://res.cloudinary.com/dotzrdmve/video/upload/v1773427933/Screen_Recording_2025-10-25_161030_ijw6iz.mp4" 
        autoPlay 
        muted 
        loop 
        playsInline
        className="w-full h-full object-cover" 
      />
      
      {/* Optional: Subtle branding overlay since cards are gone */}
      <div className="absolute bottom-6 left-6 lg:bottom-1 lg:left-10 bg-white/20 backdrop-blur-md px-6 py-2 rounded-full">
         <p className="text-white font-bold text-sm lg:text-base uppercase tracking-widest">
           {isEn ? "Place your ads now" : "ഇപ്പോൾ നിങ്ങളുടെ പരസ്യങ്ങൾ ഇടുക"}
         </p>
      </div>
    </div>
  </div>
</div>
        </div>
      </section>

      {/* --- SERVICES & TESTIMONIAL SECTION --- */}
<section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
    
    {/* Left Side: Services Grid (8 columns) */}
    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <ServiceCard icon={<ShoppingCart size={32}/>} title={isEn ? "Marketplace" : "വിപണി"} link="/marketplace" color="bg-emerald-50 text-emerald-600" />
      <ServiceCard icon={<Users size={32}/>} title={isEn ? "Experts" : "വിദഗ്ധർ"} link="/experts" color="bg-blue-50 text-blue-600" />
      <ServiceCard icon={<Wrench size={32}/>} title={isEn ? "Vendors" : "വെണ്ടർമാർ"} link="/vendors" color="bg-orange-50 text-orange-600" />
      <ServiceCard icon={<ShieldCheck size={32}/>} title={isEn ? "Diseases" : "രോഗങ്ങൾ"} link="/disease" color="bg-red-50 text-red-600" />
      <ServiceCard icon={<Landmark size={32}/>} title={isEn ? "Subsidies" : "സബ്സിഡി"} link="/subsidies" color="bg-purple-50 text-purple-600" />
      <ServiceCard icon={<MessageSquare size={32}/>} title={isEn ? "Help Center" : "സഹായം"} link="/help" color="bg-stone-100 text-stone-700" />
    </div>

    {/* Right Side: Sticky Testimonial Box (4 columns) */}
   <div className="lg:col-span-4 lg:sticky lg:top-10 h-fit"> {/* Added h-fit to ensure it doesn't stretch unnecessarily */}
  <div className="bg-[#E8F5E9] p-6 sm:p-8 rounded-[2.5rem] md:rounded-[3rem] shadow-xl border border-emerald-100 relative overflow-hidden transition-all duration-300">
    
    <h2 className="text-2xl md:text-3xl font-black text-emerald-800 mb-8 text-center leading-tight">
{isEn ? "Farmer Testimonials" : "കർഷകരുടെ സാക്ഷ്യപത്രങ്ങൾ"}
    </h2>
        <div className="relative z-10">
          {/* Farmer Image from Reference */}
          <div className="w-24 h-24 rounded-3xl border-4 border-white shadow-md overflow-hidden mb-6 transform -rotate-3">
            <img 
              src="https://res.cloudinary.com/dotzrdmve/image/upload/v1774894626/pappi_kfdjfu.jpg"
              alt="Farmer" 
              className="w-full h-full object-cover"
            />
          </div>

          <p className="text-emerald-950 text-sm md:text-base leading-relaxed mb-6 font-medium italic">
            {isEn 
              ? "The agriconnect website made by these students is a welcome move for farmers like me.I have just begun to scratch the surface of what it offers and i'm eager to dive deeper to the other features"
              : "ഈ വിദ്യാർത്ഥികൾ നിർമ്മിച്ച അഗ്രികണക്റ്റ് വെബ്സൈറ്റ് എന്ന പോലുള്ള കർഷകർക്ക് സ്വാഗതം ചെയ്യപ്പെടുന്ന ഒരു നീക്കമാണ്. ഇതിന്റെ വാഗ്ദാനത്തിന്റെ ഉപരിതലത്തിൽ ഞാൻ ഇപ്പോൾ മാത്രമേ തുടക്കം കുറിച്ചിട്ടുള്ളൂ, അതിന്റെ മറ്റ് സവിശേഷതകളിലേക്ക് കൂടുതൽ ആഴത്തിൽ ചാടാൻ ഞാൻ ആഗ്രഹിക്കുന്നു."}
          </p>

          <hr className="border-emerald-200 mb-6" />

          <div className="flex justify-between items-end">
            <div>
              <h4 className="font-black text-emerald-800 text-lg">
                
                {isEn ? "Eldo O A" : "എൽഡോ ഒ എ"}
              </h4>
              <p className="text-emerald-600 font-bold text-[10px] uppercase tracking-wider">
                {isEn ? "Farmer and president of padshekara samidhi (6th ward of Muttil Gramapanchayath )" : "മുട്ടിൽ ഗ്രാമപഞ്ചായത്തിന്റെ 6-ാം വാർഡിലെ പടശേഖര സമിതി പ്രസിഡന്റും കർഷകനും"}
              </p>
            </div>
            
            <div className="flex text-yellow-500 gap-0.5 text-xs">
              {[...Array(5)].map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Small Badge under the box for extra polish */}
      <div className="mt-4 text-center">
         <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Verified Farmer Story</span>
      </div>
    </div>

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