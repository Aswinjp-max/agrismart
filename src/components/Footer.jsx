import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer({ lang }) {
  const isEn = lang === 'en';
  const year = new Date().getFullYear();

  return (
    <footer className="bg-stone-50 border-t border-stone-200 pt-20 pb-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-emerald-700 font-black text-2xl tracking-tighter">
              <Leaf size={28} fill="currentColor" />
              <span>AgriConnect</span>
            </div>
            <p className="text-stone-500 text-sm leading-relaxed">
              {isEn 
                ? "Empowering farmers through technology and community-driven insights. Built by students for a sustainable future." 
                : "സാങ്കേതികവിദ്യയിലൂടെയും കമ്മ്യൂണിറ്റി അറിവുകളിലൂടെയും കർഷകരെ ശാക്തീകരിക്കുന്നു. ഒരു സുസ്ഥിര ഭാവിയിലേക്കായി വിദ്യാർത്ഥികൾ നിർമ്മിച്ചത്."}
            </p>
            <div className="flex gap-4 text-stone-400">
              <Facebook size={20} className="hover:text-emerald-600 cursor-pointer transition-colors" />
              <Twitter size={20} className="hover:text-emerald-600 cursor-pointer transition-colors" />
              <Instagram size={20} className="hover:text-emerald-600 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-stone-900 mb-6 uppercase tracking-widest text-xs">
              {isEn ? "Quick Links" : "ലിങ്കുകൾ"}
            </h4>
            <ul className="space-y-4 text-sm text-stone-500 font-medium">
              <li><Link to="/" className="hover:text-emerald-600 transition-colors">{isEn ? "Home" : "ഹോം"}</Link></li>
              <li><Link to="/marketplace" className="hover:text-emerald-600 transition-colors">{isEn ? "Marketplace" : "വിപണി"}</Link></li>
              <li><Link to="/experts" className="hover:text-emerald-600 transition-colors">{isEn ? "Experts" : "വിദഗ്ധർ"}</Link></li>
              <li><Link to="/subsidies" className="hover:text-emerald-600 transition-colors">{isEn ? "Subsidies" : "സബ്സിഡികൾ"}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-stone-900 mb-6 uppercase tracking-widest text-xs">
              {isEn ? "Support" : "പിന്തുണ"}
            </h4>
            <ul className="space-y-4 text-sm text-stone-500 font-medium">
              <li><Link to="/help" className="hover:text-emerald-600 transition-colors">{isEn ? "Help Center" : "സഹായ കേന്ദ്രം"}</Link></li>
              <li><Link to="/privacy" className="hover:text-emerald-600 transition-colors">{isEn ? "Privacy Policy" : "സ്വകാര്യതാ നയം"}</Link></li>
              <li>{isEn ? "Terms of Use" : "നിബന്ധനകൾ"}</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-bold text-stone-900 mb-6 uppercase tracking-widest text-xs">
              {isEn ? "Contact Us" : "ബന്ധപ്പെടുക"}
            </h4>
            <div className="flex items-start gap-3 text-sm text-stone-500">
              <MapPin size={18} className="text-emerald-600 shrink-0" />
              <p>{isEn ? "Wayanad, Kerala, India" : "വയനാട്, കേരളം, ഇന്ത്യ"}</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-stone-500">
              <Mail size={18} className="text-emerald-600 shrink-0" />
              <p>support@agriconnect.com</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-stone-500">
              <Phone size={18} className="text-emerald-600 shrink-0" />
              <p>+91 8078836325</p>
            </div>
          </div>
  
        </div>

        <div className="border-t border-stone-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest text-center md:text-left">
            © {year} AgriConnect. {isEn ? "All Rights Reserved." : "എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം."}
          </p>
            
            
            
          
        </div>
      </div>
    </footer>
  );
}