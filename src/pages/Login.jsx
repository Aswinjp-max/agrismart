import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Sprout, LogIn, UserPlus, Globe, ShieldCheck, Loader2 } from 'lucide-react';

export default function Login({ setUser, lang }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('Farmer');
  const navigate = useNavigate();
  const isEn = lang === 'en';

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { email, password, fullName } = e.target.elements;

    try {
      let userCredential;
      if (isRegistering) {
        // 1. Create User
        userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const userData = {
          uid: userCredential.user.uid,
          name: fullName.value,
          email: email.value,
          role: role,
          createdAt: new Date().toISOString()
        };
        // 2. Save Role to Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), userData);
        setUser(userData); // Sync to App.jsx
      } else {
        // 3. Login User
        userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        setUser({ uid: userCredential.user.uid, ...userDoc.data() });
      }
      navigate('/dashboard');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      
      if (!userDoc.exists()) {
        // If new user via Google, default to Farmer
        const userData = {
          uid: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          role: 'Farmer',
        };
        await setDoc(doc(db, "users", result.user.uid), userData);
        setUser(userData);
      } else {
        setUser({ uid: result.user.uid, ...userDoc.data() });
      }
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-stone-50 px-6 py-12">
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl shadow-emerald-100 border border-stone-100 overflow-hidden">
        
        <div className="p-10">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="bg-emerald-600 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 shadow-lg">
              <Sprout className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-black text-stone-900 tracking-tighter">
              {isRegistering 
                ? (isEn ? 'Join AgriConnect' : 'അഗ്രികണക്റ്റിൽ ചേരുക') 
                : (isEn ? 'Welcome Back' : 'വീണ്ടും സ്വാഗതം')}
            </h2>
            <p className="text-stone-400 font-bold text-sm mt-2">
              {isEn ? 'Empowering Kerala Farmers' : 'കേരളത്തിലെ കർഷകർക്കായി'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {isRegistering && (
              <input 
                name="fullName" 
                placeholder={isEn ? "Full Name" : "പൂർണ്ണനാമം"} 
                className="w-full p-4 bg-stone-50 rounded-2xl border-none outline-none font-bold focus:ring-2 ring-emerald-500 transition" 
                required 
              />
            )}
            
            <input 
              name="email" 
              type="email" 
              placeholder={isEn ? "Email Address" : "ഇമെയിൽ വിലാസം"} 
              className="w-full p-4 bg-stone-50 rounded-2xl border-none outline-none font-bold focus:ring-2 ring-emerald-500 transition" 
              required 
            />
            
            <input 
              name="password" 
              type="password" 
              placeholder={isEn ? "Password" : "പാസ്‌വേഡ്"} 
              className="w-full p-4 bg-stone-50 rounded-2xl border-none outline-none font-bold focus:ring-2 ring-emerald-500 transition" 
              required 
            />

            {isRegistering && (
              <div className="py-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2 ml-2">
                  {isEn ? 'Select Your Role' : 'നിങ്ങളുടെ റോൾ തിരഞ്ഞെടുക്കുക'}
                </p>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-4 bg-emerald-50 text-emerald-700 rounded-2xl border-none outline-none font-black appearance-none cursor-pointer"
                >
                  <option value="Farmer">Farmer / കർഷകൻ</option>
                  <option value="Vendor">Vendor / കച്ചവടക്കാരൻ</option>
                  <option value="Agricultural Expert">Expert / വിദഗ്ധൻ</option>
                </select>
              </div>
            )}

            <button 
              disabled={loading}
              className="w-full bg-stone-900 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-emerald-600 transition shadow-xl active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : (isRegistering ? <UserPlus size={20}/> : <LogIn size={20}/>)}
              {isRegistering ? (isEn ? 'Create Account' : 'അക്കൗണ്ട് ഉണ്ടാക്കുക') : (isEn ? 'Sign In' : 'ലോഗിൻ')}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-stone-100 w-full"></div>
              <span className="bg-white px-4 text-[10px] font-black text-stone-300 uppercase absolute uppercase tracking-widest italic">Or continue with</span>
            </div>
            
            <button 
              onClick={handleGoogleLogin}
              className="w-full bg-white border border-stone-200 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-stone-50 transition"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/pwa/google.svg" className="w-5" alt="Google" />
              Google
            </button>
          </div>

          {/* Toggle */}
          <p className="text-center mt-8 text-sm font-bold text-stone-500">
            {isRegistering ? (isEn ? "Already have an account?" : "അക്കൗണ്ട് ഉണ്ടോ?") : (isEn ? "New to AgriConnect?" : "പുതിയ കർഷകനാണോ?")}{' '}
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-emerald-600 font-black hover:underline underline-offset-4"
            >
              {isRegistering ? (isEn ? 'Login' : 'ലോഗിൻ') : (isEn ? 'Register Now' : 'രജിസ്റ്റർ ചെയ്യുക')}
            </button>
          </p>
        </div>

        <div className="bg-stone-50 p-6 text-center border-t border-stone-100">
          <p className="flex items-center justify-center gap-2 text-[10px] font-black text-stone-400 uppercase tracking-widest">
            <ShieldCheck size={14} /> {isEn ? 'Secure Direct Authentication' : 'സുരക്ഷിതമായ ലോഗിൻ'}
          </p>
        </div>
      </div>
    </div>
  );
}