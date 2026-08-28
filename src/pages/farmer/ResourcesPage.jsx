import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const ResourcesPage = () => {
  const { showToast } = useApp ? useApp() : { showToast: () => {} };

  // Active section tab: 'guides' | 'grading' | 'warehouses' | 'fertilizer' | 'schemes'
  const [activeTab, setActiveTab] = useState('guides');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal states for interactive viewing
  const [readingGuide, setReadingGuide] = useState(null);
  const [bookingWarehouse, setBookingWarehouse] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Grading Inspector state
  const [gradingCrop, setGradingCrop] = useState('onion');

  // Fertilizer calculator state
  const [calcCrop, setCalcCrop] = useState('onion');
  const [calcAcres, setCalcAcres] = useState(5);

  // Guides & Manuals Data
  const guides = [
    {
      id: 'G-01',
      title: 'Maharashtra APMC Quality Grading Standards 2025-26',
      category: 'Quality & Sorting',
      icon: '📄',
      fileSize: '2.4 MB PDF',
      desc: 'Official AGMARK specifications for Onion, Soybean, Tomato, Grapes, and Cotton with size and moisture limits.',
      content: `
# Maharashtra APMC Quality Grading Standards (2025-26)
**Issued by:** Directorate of Marketing & Inspection, Govt of India & MSAMB

## 1. Nashik Red Onion (Garwa / Rangda)
- **Grade A (Export / Processing):** Bulb diameter > 55mm, thin neck, tight outer papery scales, moisture < 11%, zero sprouting or sun-scald.
- **Grade B (Terminal Yard Benchmark):** Bulb diameter 40mm - 55mm, intact scales, moisture < 13%, maximum 3% skin blemishes allowed.
- **Grade C (Local / Dehydration):** Diameter < 40mm, loose scales, light mechanical damage permitted up to 5%.

## 2. Soybean (JS-335 / JS-9305)
- **Grade A:** Foreign matter < 1%, damaged/weeviled seeds < 2%, moisture content strictly below 10.0%, oil content > 18.5%.
- **Grade B:** Foreign matter 1-2%, moisture 10-12%, oil content > 17%.

## 3. Hybrid Tomato (Abhinav / Shivam)
- **Grade A (Firm Ripe):** Uniform red color, firm calyx, zero cracking, diameter > 60mm.
- **Grade B (Turning Pink):** Suitable for 3-5 days transit to Mumbai/Delhi markets.
      `,
    },
    {
      id: 'G-02',
      title: 'Safe Farm-Shed Storage & Ventilation Manual',
      category: 'Post-Harvest Care',
      icon: '📦',
      fileSize: '1.8 MB PDF',
      desc: 'Scientific guidelines for traditional Kanda Chawl ventilation, bottom airflow mesh, and rot prevention.',
      content: `
# Scientific Onion Storage & Kanda Chawl Manual
**Developed by:** National Horticultural Research and Development Foundation (NHRDF)

## Key Structural Design Principles
1. **Orientation:** North-South alignment to minimize direct solar heating on sidewalls.
2. **Bottom Aeration:** Raised wooden or bamboo slat bottom 45cm above ground level for continuous natural draft.
3. **Stacking Height:** Do not exceed 1.2 meters (4 feet) stacking height to prevent pressure bruising on bottom layers.
4. **Pre-Harvest Withholding:** Stop field irrigation 10-14 days before harvest to allow neck closure and dry outer scale formation.
5. **Curing:** Field cure for 3-5 days under dry straw shade before transferring to farm storage shed.
      `,
    },
    {
      id: 'G-03',
      title: 'Government MSP Benchmark & Subsidy Handbook',
      category: 'Govt Schemes',
      icon: '🏛️',
      fileSize: '3.1 MB PDF',
      desc: 'Central and Maharashtra state minimum support prices (MSP), PM-Kisan, and Magel Tyala Solar Pump subsidies.',
      content: `
# Comprehensive Agricultural Subsidy & MSP Handbook (2025-26)

## 1. Minimum Support Price (MSP) Rates
- **Soybean (Yellow):** ₹4,892 per quintal
- **Cotton (Medium Staple):** ₹7,121 per quintal
- **Cotton (Long Staple):** ₹7,521 per quintal
- **Paddy (Common):** ₹2,300 per quintal
- **Wheat (Standard):** ₹2,425 per quintal

## 2. Key Maharashtra State Subsidies (MahaDBT)
- **Magel Tyala Solar Krishi Pump:** Up to 90% subsidy on 3HP, 5HP, and 7.5HP DC solar water pump installations for smallholders.
- **Drip & Micro-Irrigation Subsidy:** 80% subsidy for small and marginal farmers under PMKSY.
- **e-NWR Warehouse Loan:** 7% interest subvention on warehouse receipt loans up to ₹3,00,000 for 6 months.
      `,
    },
    {
      id: 'G-04',
      title: 'WDRA Cold Storage & Warehousing Directory',
      category: 'Logistics',
      icon: '❄️',
      fileSize: '1.5 MB PDF',
      desc: 'Verified list of government accredited cold chain facilities and grain silos in Pune, Nashik, Latur, and Solapur.',
      content: `
# WDRA Accredited Warehouses in Maharashtra (2025-26)

## Benefits of Storing in WDRA Warehouses:
- Issuance of electronic Negotiable Warehouse Receipts (e-NWR).
- Bank pledging of e-NWR receipts for instant low-interest credit up to 75% of produce market value.
- Guaranteed insurance against fire, burglary, flood, and pest infestation.
- Zero distress selling during post-harvest price depressions.
      `,
    },
    {
      id: 'G-05',
      title: 'Integrated Pest & Nutrient Management Chart',
      category: 'Soil & Fertilizer',
      icon: '🌱',
      fileSize: '2.0 MB PDF',
      desc: 'Balanced NPK dosage, bio-fertilizer schedule, and safe spray charts for Maharashtra soils.',
      content: `
# Integrated Nutrient Management Chart
**Soil Health Card Recommendation Base**

## Nitrogen, Phosphorus, Potassium (N:P:K) Baselines:
- **Onion:** 100:50:50 kg/hectare + 25 kg Zinc Sulfate
- **Soybean:** 30:60:40 kg/hectare + Rhizobium seed inoculation
- **Tomato:** 150:100:100 kg/hectare in 4 split fertigation doses
- **Grapes:** 100:80:120 kg/hectare split between post-pruning and berry development
      `,
    },
    {
      id: 'G-06',
      title: 'Direct Buyer Escrow & Safe Contract Guide',
      category: 'Market Safety',
      icon: '🛡️',
      fileSize: '1.2 MB PDF',
      desc: 'How digital escrow protects farmers from payment defaults, weighment cuts, and delayed settlements.',
      content: `
# KRISHAK Digital Escrow Security Protocol
1. **Upfront Buyer Deposit:** Buyer deposits 100% of purchase commitment in RBI-regulated escrow account before farm pickup.
2. **Quality Verification:** Instant digital moisture and grading report signed at farm gate.
3. **Automated Payout Release:** Payout released directly to farmer bank account via IMPS/NEFT within 2 hours of dispatch.
4. **Dispute Resolution:** In case of discrepancy, third-party APMC assessor appointed within 24 hours.
      `,
    },
  ];

  // Grading Data
  const gradingData = {
    onion: {
      crop: 'Nashik Red Onion',
      grades: [
        { grade: 'Grade A (Export / Processing)', size: '> 55 mm diameter', moisture: '< 10.5%', defect: '< 2%', premium: '+₹150 - ₹250/q premium', usage: 'Direct export to Middle East & processing plants' },
        { grade: 'Grade B (APMC Terminal Yard)', size: '40 - 55 mm diameter', moisture: '< 13.0%', defect: '< 5%', premium: 'Benchmark Modal Price', usage: 'Domestic wholesale consumption' },
        { grade: 'Grade C (Industrial / Local)', size: '< 40 mm diameter', moisture: '> 13.0%', defect: '< 8%', premium: '-₹200/q discount', usage: 'Dehydration powder and local retail' },
      ],
    },
    tomato: {
      crop: 'Hybrid Tomato (Abhinav / Shivam)',
      grades: [
        { grade: 'Grade A (Firm Red Table)', size: '> 60 mm diameter', moisture: 'Firm calyx, zero rot', defect: '< 1%', premium: '+₹120 - ₹180/q premium', usage: 'Modern retail supermarts (Reliance, BigBasket)' },
        { grade: 'Grade B (Semi-Ripe Transit)', size: '45 - 60 mm diameter', moisture: 'Turning pink', defect: '< 4%', premium: 'Standard APMC Modal', usage: 'Interstate transport to Delhi & Kolkata' },
        { grade: 'Grade C (Processing Pulp)', size: '< 45 mm diameter', moisture: 'Soft ripe', defect: '< 8%', premium: '-₹150/q discount', usage: 'Ketchup and puree processing plants' },
      ],
    },
    soybean: {
      crop: 'Yellow Soybean (JS-335)',
      grades: [
        { grade: 'Grade A (Crushing Premium)', size: 'Bold uniform grain', moisture: '< 9.5%', defect: 'Foreign matter < 1%', premium: '+₹100/q over MSP', usage: 'Direct oil crushing mills with >19% oil yield' },
        { grade: 'Grade B (Standard APMC)', size: 'Standard grain size', moisture: '9.5% - 11.5%', defect: 'Foreign matter < 2%', premium: 'Standard Mandi Rate', usage: 'Standard commercial trading' },
        { grade: 'Grade C (High Moisture)', size: 'Mixed grain size', moisture: '> 12.0%', defect: 'Foreign matter > 3%', premium: '-₹250/q deduction', usage: 'Animal feed processing' },
      ],
    },
    cotton: {
      crop: 'Bt Cotton (Long Staple)',
      grades: [
        { grade: 'Grade A (Export Spun)', size: 'Staple length > 29.5 mm', moisture: '< 8.0%', defect: 'Trash < 2.5%', premium: '+₹250/q premium', usage: 'High-count textile spinning mills' },
        { grade: 'Grade B (Standard Ginner)', size: 'Staple length 27 - 29 mm', moisture: '8.0% - 10.0%', defect: 'Trash 2.5% - 4.5%', premium: 'Standard APMC Modal', usage: 'Domestic ginning and pressing units' },
        { grade: 'Grade C (Short / Stained)', size: 'Staple length < 27 mm', moisture: '> 10.0%', defect: 'Trash > 5.0%', premium: '-₹300/q deduction', usage: 'Coarse yarn manufacturing' },
      ],
    },
  };

  // Warehouses List
  const warehouses = [
    {
      id: 'WH-01',
      name: 'MahaAgro Cold Storage & Logistics Hub',
      location: 'Chakan Industrial Zone, Pune (45 km)',
      type: 'Cold Storage (0°C to 4°C Controlled)',
      capacity: '5,000 Metric Tonnes',
      available: '1,200 MT Available Space',
      rate: '₹65 / Quintal / Month',
      wdraCertified: true,
      enwrLoanAvailable: true,
      contact: '+91 98220 12345',
    },
    {
      id: 'WH-02',
      name: 'Nashik Agri Warehouse & Curing Silos',
      location: 'Pimpalgaon Baswant, Nashik (12 km)',
      type: 'Ventilated Kanda Chawl & Grain Silo',
      capacity: '8,000 Metric Tonnes',
      available: '2,400 MT Available Space',
      rate: '₹40 / Quintal / Month',
      wdraCertified: true,
      enwrLoanAvailable: true,
      contact: '+91 98224 56789',
    },
    {
      id: 'WH-03',
      name: 'Latur Central Agmark Warehouse Co.',
      location: 'MIDC Phase II, Latur (18 km)',
      type: 'Dry Grain & Pulses Moisture Sealed',
      capacity: '12,000 Metric Tonnes',
      available: '4,100 MT Available Space',
      rate: '₹35 / Quintal / Month',
      wdraCertified: true,
      enwrLoanAvailable: true,
      contact: '+91 98229 98765',
    },
    {
      id: 'WH-04',
      name: 'Baramati Agri Food Cold Chain Hub',
      location: 'Baramati MIDC, Pune District (65 km)',
      type: 'Reefer Packhouse & Multi-Commodity Cold Chamber',
      capacity: '4,500 Metric Tonnes',
      available: '850 MT Available Space',
      rate: '₹75 / Quintal / Month',
      wdraCertified: true,
      enwrLoanAvailable: true,
      contact: '+91 98231 11223',
    },
  ];

  // Government Schemes List
  const schemes = [
    {
      id: 'SCH-01',
      name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
      authority: 'Ministry of Agriculture, Govt of India',
      benefit: '₹6,000 / year in 3 direct bank transfers',
      eligibility: 'All landholding farmer families in India',
      portal: 'pmkisan.gov.in',
      helpline: '155261 / 011-24300606',
    },
    {
      id: 'SCH-02',
      name: 'Magel Tyala Saur Krishi Pump Yojana',
      authority: 'MSEDCL & Govt of Maharashtra',
      benefit: 'Up to 90% subsidy on Solar Agriculture Water Pumps (3HP / 5HP / 7.5HP)',
      eligibility: 'Farmers with agricultural land and valid water source (well/borewell)',
      portal: 'mahadiscom.in/solar',
      helpline: '1800-233-3435',
    },
    {
      id: 'SCH-03',
      name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      authority: 'Agriculture Department, Maharashtra',
      benefit: '100% comprehensive crop loss compensation against drought, flood, pests',
      eligibility: 'All farmers growing notified crops (1 Rupee premium scheme in Maharashtra)',
      portal: 'pmfby.gov.in',
      helpline: '1800-180-1551',
    },
    {
      id: 'SCH-04',
      name: 'e-NWR Pledge Financing Scheme',
      authority: 'Warehousing Development and Regulatory Authority (WDRA)',
      benefit: 'Instant pledge loan up to 75% of produce value at 7% subsidized interest',
      eligibility: 'Farmers depositing produce in WDRA certified warehouses',
      portal: 'wdra.gov.in',
      helpline: '011-49536495',
    },
  ];

  // Fertilizer dosage computation
  const calculateFertilizer = (cropKey, acres) => {
    const formulas = {
      onion: { urea: 45 * acres, dap: 55 * acres, mop: 35 * acres, zinc: 5 * acres, cost: 3200 * acres },
      tomato: { urea: 65 * acres, dap: 70 * acres, mop: 50 * acres, zinc: 8 * acres, cost: 4600 * acres },
      soybean: { urea: 20 * acres, dap: 60 * acres, mop: 30 * acres, zinc: 5 * acres, cost: 2800 * acres },
      grapes: { urea: 80 * acres, dap: 90 * acres, mop: 110 * acres, zinc: 12 * acres, cost: 8500 * acres },
      cotton: { urea: 55 * acres, dap: 65 * acres, mop: 40 * acres, zinc: 6 * acres, cost: 3900 * acres },
    };
    return formulas[cropKey] || formulas.onion;
  };

  const currentDosage = calculateFertilizer(calcCrop, calcAcres);

  // Simulated PDF Downloader
  const handleDownloadPdf = (guide) => {
    const element = document.createElement('a');
    const file = new Blob([guide.content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${guide.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    if (showToast) {
      showToast(`📥 "${guide.title}" downloaded successfully!`, 'success');
    }
  };

  const handleBookWarehouseSubmit = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingWarehouse(null);
      if (showToast) {
        showToast(`Space reservation request sent to ${bookingWarehouse.name}! Warehouse manager will contact you.`, 'success');
      }
    }, 1200);
  };

  const filteredGuides = guides.filter((g) => {
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || g.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || g.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-800 max-w-[1400px] mx-auto pb-16">
      
      {/* ─── 1. TOP HEADER & INTERACTIVE NAVIGATION TABS ─── */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                Farmer Resource Center &amp; Tools
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
              Agricultural Resources &amp; Decision Tools
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Official AGMARK grading standards, WDRA cold storage locator, government schemes, and dosage calculators.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Language:</span>
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl">
              Marathi &amp; English
            </span>
          </div>
        </div>

        {/* Actionable Feature Navigation Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto">
          {[
            { key: 'guides', label: 'Manuals & PDF Guides', icon: '📚' },
            { key: 'grading', label: 'AGMARK Quality Grading Inspector', icon: '🔍' },
            { key: 'warehouses', label: 'WDRA Cold Storage Directory', icon: '❄️' },
            { key: 'fertilizer', label: 'Dosage & NPK Calculator', icon: '🌱' },
            { key: 'schemes', label: 'Government MSP & Subsidies', icon: '🏛️' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-[#008253] text-white shadow-sm shadow-emerald-900/20'
                  : 'bg-slate-100 hover:bg-slate-200/70 text-slate-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── TAB 1: GUIDES & MANUALS ─── */}
      {activeTab === 'guides' && (
        <div className="space-y-5">
          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guides, storage manuals, quality grading standards..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
              <span className="absolute left-3 top-2 text-slate-400 text-sm">🔍</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {['all', 'Quality', 'Post-Harvest', 'Govt Schemes', 'Logistics', 'Soil', 'Market Safety'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat === 'all' ? 'All Guides' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Guides Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGuides.map((g) => (
              <div
                key={g.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex justify-between items-start">
                    <span className="text-3xl p-2 bg-emerald-50 rounded-2xl border border-emerald-100">{g.icon}</span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      {g.category}
                    </span>
                  </div>
                  <h3 className="font-black text-slate-900 text-base leading-snug">{g.title}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{g.desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>Format: Official PDF</span>
                    <span>{g.fileSize}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setReadingGuide(g)}
                      className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>👁️</span>
                      <span>Read Online</span>
                    </button>
                    <button
                      onClick={() => handleDownloadPdf(g)}
                      className="flex-1 py-2 bg-[#008253] hover:bg-[#007047] text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>📥</span>
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 2: AGMARK QUALITY GRADING INSPECTOR ─── */}
      {activeTab === 'grading' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                AGMARK Interactive Quality Grading Inspector
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Select your crop to see the exact Government AGMARK grading parameters, moisture tolerances, and buyer price premiums.
              </p>
            </div>

            {/* Crop Selector Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              {Object.keys(gradingData).map((key) => (
                <button
                  key={key}
                  onClick={() => setGradingCrop(key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    gradingCrop === key
                      ? 'bg-[#008253] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {gradingData[key].crop.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Quality Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-[11px] font-black uppercase text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-4">Quality Grade</th>
                  <th className="p-4">Size / Dimensions</th>
                  <th className="p-4">Moisture Limit</th>
                  <th className="p-4">Max Defect Tolerance</th>
                  <th className="p-4 text-emerald-800">Price Realization</th>
                  <th className="p-4">Market Channel Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {gradingData[gradingCrop].grades.map((g, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-50 transition-colors ${
                      idx === 0 ? 'bg-emerald-50/40 font-semibold' : ''
                    }`}
                  >
                    <td className="p-4">
                      <span className="font-extrabold text-slate-900 text-sm block">{g.grade}</span>
                      {idx === 0 && (
                        <span className="inline-block mt-1 text-[9.5px] font-black bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                          ★ HIGHEST PROFIT
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-mono">{g.size}</td>
                    <td className="p-4 font-mono text-slate-800">{g.moisture}</td>
                    <td className="p-4 text-slate-600">{g.defect}</td>
                    <td className="p-4 font-black font-mono text-emerald-700 text-sm">{g.premium}</td>
                    <td className="p-4 text-slate-600">{g.usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Farmer Grading Tip Box */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <div className="font-bold text-emerald-900 text-sm">Grading &amp; Sorting Profit Multiplier Tip:</div>
              <p className="mt-0.5 leading-relaxed">
                Separating your harvest into Grade A (55mm+) and Grade B before marketing increases your aggregate realization by <strong>+₹140/quintal</strong> compared to selling unsorted (Patti) produce where buyers discount the entire lot based on the lowest quality bulb.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: WDRA COLD STORAGE & WAREHOUSES DIRECTORY ─── */}
      {activeTab === 'warehouses' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                WDRA Accredited Warehouses &amp; Cold Storage Hubs
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Locate certified warehouses in Maharashtra to store produce, avoid distress sales, and access instant e-NWR pledge loans.
              </p>
            </div>

            <div className="bg-emerald-100 text-emerald-900 px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5">
              <span>🛡️</span>
              <span>100% Insured &amp; WDRA Certified</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {warehouses.map((wh) => (
              <div
                key={wh.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{wh.id}</span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ✓ e-NWR Loan Eligible
                    </span>
                  </div>

                  <h3 className="font-black text-slate-900 text-base">{wh.name}</h3>
                  <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <span>📍</span>
                    <span>{wh.location}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Storage Type</span>
                      <span className="font-bold text-slate-800">{wh.type}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Monthly Rent</span>
                      <span className="font-black text-emerald-700 font-mono">{wh.rate}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 font-medium">
                    Available: <strong className="text-slate-900">{wh.available}</strong>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={`tel:${wh.contact}`}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1"
                    >
                      <span>📞</span>
                      <span>Call</span>
                    </a>
                    <button
                      onClick={() => setBookingWarehouse(wh)}
                      className="px-4 py-2 bg-[#008253] hover:bg-[#007047] text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
                    >
                      Book Space →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 4: FERTILIZER & NPK CALCULATOR ─── */}
      {activeTab === 'fertilizer' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Interactive Fertilizer &amp; NPK Dosage Calculator
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Calculate balanced Urea, DAP, MOP, and Zinc Sulfate requirements based on your crop and farm acreage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Input Form */}
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
                1. Configure Your Farm
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Target Crop</label>
                <select
                  value={calcCrop}
                  onChange={(e) => setCalcCrop(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs font-bold focus:outline-none focus:border-emerald-500"
                >
                  <option value="onion">Nashik Red Onion</option>
                  <option value="tomato">Hybrid Tomato</option>
                  <option value="soybean">Yellow Soybean</option>
                  <option value="grapes">Thompson Grapes</option>
                  <option value="cotton">Bt Cotton</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Farm Acreage: <strong className="text-emerald-700">{calcAcres} Acres</strong>
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={calcAcres}
                  onChange={(e) => setCalcAcres(Number(e.target.value))}
                  className="w-full accent-[#008253] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>1 Acre</span>
                  <span>25 Acres</span>
                  <span>50 Acres</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-medium">
                💡 Calculations based on Indian Council of Agricultural Research (ICAR) soil fertility guidelines.
              </div>
            </div>

            {/* Output Calculation Grid */}
            <div className="md:col-span-2 p-6 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 rounded-3xl border border-emerald-200/80 space-y-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-emerald-200/60 pb-3">
                  <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
                    2. Recommended Nutrient Dosage for {calcAcres} Acres
                  </h3>
                  <span className="text-xs font-mono font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                    Estimated Input Cost: ₹{currentDosage.cost.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <div className="p-4 bg-white rounded-2xl border border-emerald-200 shadow-2xs text-center space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Urea (46% N)</span>
                    <div className="text-2xl font-black text-slate-900 font-mono">{currentDosage.urea} kg</div>
                    <div className="text-[10px] text-slate-500 font-medium">({Math.ceil(currentDosage.urea / 45)} Bags)</div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-emerald-200 shadow-2xs text-center space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">DAP (18:46:0)</span>
                    <div className="text-2xl font-black text-slate-900 font-mono">{currentDosage.dap} kg</div>
                    <div className="text-[10px] text-slate-500 font-medium">({Math.ceil(currentDosage.dap / 50)} Bags)</div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-emerald-200 shadow-2xs text-center space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">MOP (Potash)</span>
                    <div className="text-2xl font-black text-slate-900 font-mono">{currentDosage.mop} kg</div>
                    <div className="text-[10px] text-slate-500 font-medium">({Math.ceil(currentDosage.mop / 50)} Bags)</div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-emerald-200 shadow-2xs text-center space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Zinc Sulfate</span>
                    <div className="text-2xl font-black text-slate-900 font-mono">{currentDosage.zinc} kg</div>
                    <div className="text-[10px] text-slate-500 font-medium">Micronutrient</div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-emerald-200 text-xs text-slate-700 flex justify-between items-center">
                <span>Need subsidized fertilizers at local IFFCO / KRIBHCO centers?</span>
                <button
                  onClick={() => showToast && showToast('IFFCO center coordinates located in Ausa & Latur!', 'success')}
                  className="px-4 py-1.5 bg-[#008253] text-white font-bold text-xs rounded-xl shadow-2xs"
                >
                  Find Nearby IFFCO Center
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 5: GOVERNMENT SCHEMES & SUBSIDIES ─── */}
      {activeTab === 'schemes' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Active Central &amp; Maharashtra State Agriculture Schemes
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Verified subsidy portals, online application links, and toll-free assistance for farmers.
              </p>
            </div>

            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3.5 py-1.5 rounded-xl">
              Govt Verified 2025-26
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {schemes.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{s.authority}</span>
                  <h3 className="font-black text-slate-900 text-lg">{s.name}</h3>
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-900">
                    💰 Benefit: {s.benefit}
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    <strong>Eligibility:</strong> {s.eligibility}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                  <span className="text-slate-500 font-medium">Helpline: <strong className="text-slate-900">{s.helpline}</strong></span>
                  <a
                    href={`https://${s.portal}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-[#008253] hover:bg-[#007047] text-white font-bold rounded-xl shadow-2xs transition-all flex items-center gap-1"
                  >
                    <span>Apply on Portal</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── MODAL 1: IN-APP GUIDE READER ─── */}
      {readingGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 space-y-5 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{readingGuide.icon}</span>
                <div>
                  <h3 className="font-black text-slate-900 text-base">{readingGuide.title}</h3>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">{readingGuide.category}</span>
                </div>
              </div>
              <button
                onClick={() => setReadingGuide(null)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line">
              {readingGuide.content}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center gap-3">
              <button
                onClick={() => setReadingGuide(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close Reader
              </button>
              <button
                onClick={() => handleDownloadPdf(readingGuide)}
                className="px-6 py-2 bg-[#008253] hover:bg-[#007047] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>📥</span>
                <span>Download Markdown / PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: WAREHOUSE BOOKING MODAL ─── */}
      {bookingWarehouse && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">WDRA Space Reservation</span>
                <h3 className="font-black text-slate-900 text-lg mt-1">{bookingWarehouse.name}</h3>
              </div>
              <button
                onClick={() => setBookingWarehouse(null)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {bookingSuccess ? (
              <div className="text-center py-6 space-y-2">
                <span className="text-4xl">🎉</span>
                <h4 className="font-black text-lg text-emerald-800">Space Reservation Sent!</h4>
                <p className="text-xs text-slate-600">The facility manager at {bookingWarehouse.name} will call you within 30 minutes to confirm slot allocation.</p>
              </div>
            ) : (
              <form onSubmit={handleBookWarehouseSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Crop to Store</label>
                  <select className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-emerald-500">
                    <option>Nashik Red Onion (Garwa)</option>
                    <option>Yellow Soybean (JS-335)</option>
                    <option>Hybrid Tomato</option>
                    <option>Wheat / Grain</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimated Quantity (Quintals)</label>
                  <input
                    type="number"
                    defaultValue="100"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Required Duration</label>
                  <select className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-emerald-500">
                    <option>1 Month (Rate: {bookingWarehouse.rate})</option>
                    <option>2 Months</option>
                    <option>3 Months</option>
                    <option>6 Months (Eligible for e-NWR Loan)</option>
                  </select>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 font-medium">
                  ✓ Includes insurance against spoilage, pest infestation, and market price protection.
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#008253] hover:bg-[#007047] text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Confirm Space Booking Request →
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default ResourcesPage;
