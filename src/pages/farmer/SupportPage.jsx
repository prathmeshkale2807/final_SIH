import React from 'react';
import { useApp } from '../../context/AppContext';

export const SupportPage = () => {
  const { showToast } = useApp ? useApp() : { showToast: () => {} };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showToast) showToast('Your query has been submitted! Our Kisan Helpdesk will call you within 15 minutes.', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-800">
      
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Kisan Helpdesk &amp; Support</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">24x7 farmer assistance for dispute resolution, escrow payouts, and APMC modal rates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Helpline Card */}
        <div className="bg-[#062d1f] text-white p-6 rounded-3xl border border-emerald-700/60 shadow-lg space-y-4">
          <span className="text-3xl">📞</span>
          <div>
            <h3 className="text-lg font-black text-white">Toll-Free Kisan Call Center</h3>
            <div className="text-2xl font-black text-amber-300 font-mono mt-1">1800-180-1551</div>
            <p className="text-xs text-emerald-200 mt-1">Available in Marathi, Hindi, and English (6 AM - 10 PM)</p>
          </div>
          <div className="pt-3 border-t border-emerald-800 text-xs text-emerald-100 font-medium">
            WhatsApp Support: <strong className="text-emerald-300">+91 98230 45678</strong>
          </div>
        </div>

        {/* Dispute Resolution Form */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-lg">Send Query or Escrow Dispute</h3>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Topic</label>
              <select className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500">
                <option>Escrow Payout &amp; Bank Transfer Issue</option>
                <option>Buyer Weighment or Quality Grading Dispute</option>
                <option>Farm-Gate Pickup Truck Delay</option>
                <option>APMC Modal Rate Verification</option>
                <option>Account &amp; Profile Details</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Message / Details</label>
              <textarea
                rows={3}
                placeholder="Describe your query or issue with lot ID..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#008253] hover:bg-[#007047] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Submit Query →
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default SupportPage;
