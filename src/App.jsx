import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Component & Page Imports
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import SellCrop from './pages/SellCrop';
import ExpertAdvice from './pages/ExpertAdvice';
import RegisterExpert from './pages/RegisterExpert';
import DiseaseGuide from './pages/DiseaseGuide';
import Subsidies from './pages/Subsidies';
import Help from './pages/Help';
import Vendors from './pages/Vendors';
import RegisterVendor from './pages/RegisterVendor';
function App() {
  // 1. Initialize State
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState('en');
  const [loading, setLoading] = useState(true);

  // 2. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        try {
          // Fetch the role-based data from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            setUser({ uid: firebaseUser.uid, ...userDoc.data() });
          } else {
            // Fallback for users with no Firestore doc yet
            setUser(firebaseUser); 
          }
        } catch (error) {
          console.error("Auth sync error:", error);
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-stone-50">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-stone-50">
        <Navbar user={user} lang={lang} setLang={setLang} />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home lang={lang} />} />
          
          {/* 3. CRITICAL: Pass setUser to Login page */}
          <Route path="/login" element={<Login setUser={setUser} lang={lang} />} />
          
          <Route path="/marketplace" element={<Marketplace user={user} lang={lang} />} />
          <Route path="/experts" element={<ExpertAdvice user={user} lang={lang} />} />
          <Route path="/disease" element={<DiseaseGuide user={user} lang={lang} />} />
          <Route path="/subsidies" element={<Subsidies user={user} lang={lang} />} />
          <Route path="/vendors" element={<Vendors user={user} lang={lang} />} />
          <Route path="/help" element={<Help user={user} lang={lang} />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} lang={lang} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/sell" 
            element={user ? <SellCrop user={user} lang={lang} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/register-expert" 
            element={user ? <RegisterExpert user={user} lang={lang} /> : <Navigate to="/login" />} 
          />

          <Route 
  path="/register-vendor" 
  element={user ? <RegisterVendor user={user} lang={lang} /> : <Navigate to="/login" />} 
/>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;