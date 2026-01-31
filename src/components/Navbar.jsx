import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { 
  Menu, X, Sprout, LayoutDashboard, LogOut, Globe, 
  ChevronDown, HeartPulse, ShoppingCart, Users, 
  CircleDollarSign, LifeBuoy, Home as HomeIcon, Store 
} from 'lucide-react';

export default function Navbar({ user, lang, setLang }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isEn = lang === 'en';

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  // The complete list of navigation links with icons
  const navLinks = [
    { name: isEn ? 'Home' : 'ഹോം', path: '/', icon: <HomeIcon size={18}/> },
    { name: isEn ? 'Disease' : 'രോഗനിർണ്ണയം', path: '/disease', icon: <HeartPulse size={18}/> },
    { name: isEn ? 'Market' : 'വിപണി', path: '/marketplace', icon: <ShoppingCart size={18}/> },
    { name: isEn ? 'Experts' : 'വിദഗ്ധർ', path: '/experts', icon: <Users size={18}/> },
    { name: isEn ? 'Vendors' : 'കടകൾ', path: '/vendors', icon: <Store size={18}/> },
    { name: isEn ? 'Subsidies' : 'സബ്സിഡികൾ', path: '/subsidies', icon: <CircleDollarSign size={18}/> },
    { name: isEn ? 'Help' : 'സഹായം', path: '/help', icon: <LifeBuoy size={18}/> },
  ];

  const activeClass = (path) => 
    location.pathname === path 
      ? "text-emerald-600 bg-emerald-50 shadow-sm" 
      : "text-stone-600 hover:bg-stone-50 hover:text-emerald-500";

  return (
    <nav className="sticky top-0 z-[100] bg-white/90 backdrop-blur-xl border-b border-stone-200">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
        
        {/* --- BRAND LOGO --- */}
        <Link to="/" className="flex items-center gap-2 no-underline group shrink-0">
          <div className="bg-emerald-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-emerald-200">
            <Sprout className="text-white" size={24} />
          </div>
          <span className="text-xl font-black tracking-tighter text-stone-900 hidden lg:block">
            Agri<span className="text-emerald-600 font-serif italic">Connect</span>
          </span>
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <div className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-black uppercase tracking-wider no-underline transition-all ${activeClass(link.path)}`}
            >
              <span className="shrink-0">{link.icon}</span>
              {link.name}
            </Link>
          ))}
        </div>

        {/* --- RIGHT SIDE ACTIONS --- */}
        <div className="flex items-center gap-3">
          
          {/* Language Switcher */}
          <button 
            onClick={() => setLang(isEn ? 'ml' : 'en')}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-stone-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-stone-200 transition active:scale-95 border border-stone-200"
          >
            <Globe size={14} className="text-emerald-600" /> {isEn ? 'Malayalam' : 'English'}
          </button>

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 pr-3 bg-white rounded-full border border-stone-200 shadow-sm hover:border-emerald-300 transition"
              >
                <div className="w-8 h-8 bg-emerald-700 rounded-full flex items-center justify-center text-white font-black text-xs uppercase">
                  {user.name?.[0] || 'U'}
                </div>
                <ChevronDown size={14} className={`text-stone-400 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-[2rem] shadow-2xl border border-stone-100 p-3 animate-in fade-in zoom-in-95 origin-top-right overflow-hidden">
                  <div className="px-4 py-4 border-b border-stone-50 mb-2">
                    <p className="font-black text-stone-800 truncate leading-tight">{user.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <p className="text-[10px] text-emerald-600 font-black uppercase tracking-tighter">{user.role}</p>
                    </div>
                  </div>
                  
                  <Link to="/dashboard" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 p-3 hover:bg-stone-50 rounded-2xl no-underline text-stone-700 font-bold transition">
                    <LayoutDashboard size={18} className="text-emerald-500" /> {isEn ? 'Dashboard' : 'ഡാഷ്ബോർഡ്'}
                  </Link>
                  
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-2xl text-red-500 font-bold text-left transition mt-1 border-none bg-transparent">
                    <LogOut size={18} /> {isEn ? 'Sign Out' : 'പുറത്തിറങ്ങുക'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest no-underline hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition active:scale-95">
              {isEn ? 'Login' : 'ലോഗിൻ'}
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button className="xl:hidden p-2 text-stone-800 hover:bg-stone-100 rounded-xl transition" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* --- MOBILE NAVIGATION DRAWER --- */}
      {isOpen && (
        <div className="xl:hidden bg-white border-b border-stone-200 p-6 space-y-2 animate-in slide-in-from-top-4 duration-300">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-4 p-4 text-base font-black text-stone-800 no-underline rounded-2xl active:bg-emerald-50 ${location.pathname === link.path ? 'bg-emerald-50 text-emerald-600' : ''}`}
            >
              <span className="text-emerald-600">{link.icon}</span>
              {link.name}
            </Link>
          ))}
          <div className="pt-4 mt-4 border-t border-stone-100">
            <button 
               onClick={() => { setLang(isEn ? 'ml' : 'en'); setIsOpen(false); }}
               className="w-full p-4 bg-stone-100 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 border-none"
            >
              <Globe size={16} className="text-emerald-600"/> {isEn ? 'Switch to Malayalam' : 'English മാറ്റുക'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}