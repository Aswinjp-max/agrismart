import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { HelpCircle, MessageSquare, Send, ChevronDown, ChevronUp } from 'lucide-react';

export default function Help({ lang, user }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [loading, setLoading] = useState(false);

  const faqs = [
    {
      q: lang === 'en' ? "How do I list my crop?" : "എന്റെ വിളകൾ എങ്ങനെ ലിസ്റ്റ് ചെയ്യാം?",
      a: lang === 'en' ? "Go to the Market page, log in as a Farmer, and click 'Sell Crops'." : "മാർക്കറ്റ് പേജിൽ പോയി, കർഷകനായി ലോഗിൻ ചെയ്ത് 'Sell Crops' ക്ലിക്ക് ചെയ്യുക."
    },
    {
      q: lang === 'en' ? "Is the Expert advice free?" : "വിദഗ്ധ ഉപദേശം സൗജന്യമാണോ?",
      a: lang === 'en' ? "Most experts provide initial consultation for free, but specialized services may vary." : "മിക്ക വിദഗ്ധരും പ്രാരംഭ കൺസൾട്ടേഷൻ സൗജന്യമായി നൽകുന്നു."
    },
    {
      q: lang === 'en' ? "How to track subsidy status?" : "സബ്സിഡി നില എങ്ങനെ അറിയാം?",
      a: lang === 'en' ? "Check the 'Subsidy Status' section in your personal Dashboard." : "നിങ്ങളുടെ വ്യക്തിഗത ഡാഷ്‌ബോർഡിലെ 'സബ്സിഡി സ്റ്റാറ്റസ്' വിഭാഗം പരിശോധിക്കുക."
    }
  ];

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { subject, message } = e.target.elements;

    try {
      await addDoc(collection(db, "support_tickets"), {
        userId: user?.uid || 'guest',
        userName: user?.name || 'Guest User',
        subject: subject.value,
        message: message.value,
        status: "Open",
        createdAt: serverTimestamp()
      });
      alert(lang === 'en' ? "Message sent! We will contact you soon." : "സന്ദേശം അയച്ചു! ഞങ്ങൾ ഉടൻ നിങ്ങളെ ബന്ധപ്പെടും.");
      e.target.reset();
    } catch (err) {
      alert("Error: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="w-full px-6 md:px-12 py-10 animate-fadeIn">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-emerald-950 mb-4">
          {lang === 'en' ? 'Help & Support' : 'സഹായവും പിന്തുണയും'}
        </h1>
        <p className="text-gray-500">{lang === 'en' ? 'Find answers or send us a message.' : 'മറുപടികൾ കണ്ടെത്തുക അല്ലെങ്കിൽ സന്ദേശം അയക്കുക.'}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
        {/* FAQ Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <HelpCircle className="text-emerald-600" /> FAQ
          </h2>
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white border rounded-2xl overflow-hidden transition-all shadow-sm">
              <button 
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex justify-between items-center p-5 text-left font-bold text-gray-800 hover:bg-stone-50"
              >
                {faq.q}
                {openFaq === index ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
              </button>
              {openFaq === index && (
                <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t pt-4 bg-stone-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Form Section */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-emerald-50">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <MessageSquare className="text-emerald-600" /> {lang === 'en' ? 'Contact Support' : 'ബന്ധപ്പെടുക'}
          </h2>
          <form onSubmit={handleSubmitTicket} className="space-y-5">
            <div>
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Subject</label>
              <input name="subject" required className="w-full bg-stone-50 p-4 rounded-2xl mt-1 outline-none focus:ring-2 focus:ring-emerald-500 transition" placeholder={lang === 'en' ? "Issue title" : "വിഷയം"} />
            </div>
            <div>
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Message</label>
              <textarea name="message" required rows="4" className="w-full bg-stone-50 p-4 rounded-2xl mt-1 outline-none focus:ring-2 focus:ring-emerald-500 transition" placeholder={lang === 'en' ? "Describe your problem..." : "നിങ്ങളുടെ പ്രശ്നം വിവരിക്കുക..."}></textarea>
            </div>
            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-emerald-700 transition shadow-lg shadow-emerald-100"
            >
              {loading ? "..." : <><Send size={18}/> {lang === 'en' ? 'Send Message' : 'സന്ദേശം അയക്കുക'}</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}