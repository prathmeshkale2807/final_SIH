import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { LocationPicker } from '../../components/auth/LocationPicker';
import { firestoreService } from '../../services/firestoreService';

// ─── COMPREHENSIVE CROP DATABASE (CATEGORY ➔ COMMODITY ➔ VARIETY) ───────────
export const CROP_DATABASE = {
  'Vegetables (भाज्या)': {
    'Onion (कांदा)': [
      'Nashik Red / Garwa (नाशिक लाल)',
      'Fursungi Light Red (फुर्सुंगी)',
      'Gavran / Local Desi (गावरान)',
      'Bhima Super / Shakti (भीमा सुपर)',
      'White Onion (पांढरा कांदा)',
      'Agrifound Dark Red',
      'Panchaganga Special'
    ],
    'Tomato (टोमॅटो)': [
      'Abhinav F1 (अभिनव)',
      'Saaho 3251 (साहो)',
      'Aryaman F1 (आर्यमान)',
      'Namdhari NS-598',
      'Heemsohna (हिमसोना)',
      'Desi / Local Sour (गावरान आंबट)'
    ],
    'Potato (बटाटा)': [
      'Kufri Jyoti (कुफरी ज्योती)',
      'Kufri Pukhraj (कुफरी पुखराज)',
      'Kufri Chipsona (चिप्सोना - Processing)',
      'Kufri Lauvkar (लवकर)',
      'Desi Red Potato (लाल बटाटा)'
    ],
    'Garlic (लसूण)': [
      'G-282 Yamuna Safed (यमुना सफेद)',
      'Godavari Mahabeej (गोदावरी)',
      'Agrifound Parvati',
      'Desi Single Clove (एक पाकळी गावरान)'
    ],
    'Ginger (आले / अद्रक)': [
      'Mahim Fresh (माहीम)',
      'Varada (वरदा)',
      'Rio de Janeiro',
      'Desi Gavran Ginger (गावरान आले)'
    ],
    'Green Chilli (हिरवी मिरची)': [
      'G-4 Bhagirathi (जी-४)',
      'Sitara F1 (सितारा)',
      'Teja 44 (तेजा)',
      'Jwalamukhi (ज्वालामुखी)',
      'Pusa Jwala (पुसा ज्वाला)'
    ],
    'Cauliflower (फ्लॉवर)': [
      'White Marble F1 (व्हाइट मार्बल)',
      'Pusa Snowball (पुसा स्नोबॉल)',
      'Barkha F1 (बरखा)',
      'Meenakshi (मीनाक्षी)'
    ],
    'Cabbage (कोबी)': [
      'Golden Acre (गोल्डन एकर)',
      'Green Hero F1 (ग्रीन हिरो)',
      'Pusa Mukta (पुसा मुक्ता)',
      'Saint F1'
    ],
    'Brinjal / Eggplant (वांगी)': [
      'Manjari Gota (मांजरी गोटा)',
      'Panchaganga F1',
      'Pusa Purple Long',
      'Gavran Barshi Green (बार्शी गावरान)'
    ],
    'Okra / Lady Finger (भेंडी)': [
      'Radhika Advanta (राधिका)',
      'Singham F1 (सिंघम)',
      'Pusa Sawani (पुसा सावनी)',
      'Anamika (अनामिका)'
    ],
    'Capsicum / Bell Pepper (ढोबळी मिरची)': [
      'Indra F1 Green (इंद्रा)',
      'Bachata Yellow (पिवळी ढोबळी)',
      'Inspector Red (लाल ढोबळी)',
      'Green Bell Standard'
    ],
    'Green Peas (मटार / वाटाणा)': [
      'GS-10 Advanta (जीएस-१०)',
      'Arkel Early (आर्केल)',
      'Pusa Pragati (पुसा प्रगती)',
      'Azad Pea 1 (आझाद मटार)'
    ]
  },
  'Fruits (फळे)': {
    'Pomegranate (डाळिंब)': [
      'Bhagwa / Sindhuri (भगवा / सिंदूरी)',
      'Arakta (आरक्ता)',
      'Ganesh (गणेश)',
      'Ruby Super'
    ],
    'Grapes (द्राक्षे)': [
      'Thomson Seedless (थॉमसन)',
      'Tas-A-Ganesh (तास-ए-गणेश)',
      'Sonaka Super (सोनाका)',
      'Jumbo Seedless Black (जंबो काळी द्राक्षे)',
      'Flame Seedless (फ्लेम)'
    ],
    'Banana (केळी)': [
      'Grand Naine G-9 (जी-९)',
      'Robusta (रोबस्टा)',
      'Shrimanti (श्रीमंती)',
      'Rasthali / Elakki (वेलची केळी)'
    ],
    'Mango (आंबा)': [
      'Alphonso / Hapus (हापूस - देवगड/रत्नागिरी)',
      'Kesar (केशर)',
      'Dasheri (दशेरी)',
      'Totapuri (तोतापुरी)',
      'Langra (लंगडा)'
    ],
    'Orange / Mandarin (संत्रा)': [
      'Nagpur Mandarin (नागपूर संत्रा)',
      'Kinnow (किन्नू)',
      'Jaffa Sweet Orange'
    ],
    'Sweet Lime / Mosambi (मोसंबी)': [
      'Katol Gold (काटोल गोल्ड)',
      'Jalna Mosambi Standard (जालना मोसंबी)',
      'Nucellar (न्युसेलर)'
    ],
    'Papaya (पपई)': [
      'Taiwan Red Lady 786 (रेड लेडी)',
      'Pusa Delicious (पुसा डिलिशिअस)',
      'Coorg Honey Dew'
    ],
    'Guava (पेरू)': [
      'Sardar Lucknow 49 / L-49 (सरदार लखनौ)',
      'Allahabad Safeda (सफेदा)',
      'VNR Bihi Jumbo (व्हीएनआर बिही)',
      'Taiwan Pink (तायवान पिंक)'
    ],
    'Custard Apple (सीताफळ)': [
      'Balanagar (बालानगर)',
      'Golden NMK-1 (सुपर गोल्डन एनएमके)',
      'Arka Sahan (अर्का सहन)'
    ],
    'Watermelon (कलिंगड)': [
      'Kiran Sakata (किरण)',
      'Max Sugar Baby (मॅक्स)',
      'Apoorva Black (अपूर्वा)'
    ]
  },
  'Grains & Cereals (धान्य व तृणधान्ये)': {
    'Wheat (गहू)': [
      'Lokwan 148 Golden (लोकवान)',
      'Sharbati MP Premium (शरबती)',
      'MACS 6222 (मॅक्स)',
      'Samadhan HD-2967 (समाधान)',
      'GW 496 (जीडब्ल्यू ४९६)',
      'Kalyansona (कल्याणसोना)'
    ],
    'Rice / Paddy (भात / धान)': [
      'Indrayani Scented (इंद्रायणी)',
      'Wada Kolam (वाडा कोलम)',
      'Basmati 1121 Pusa (बासमती)',
      'Sona Masoori (सोना मसूरी)',
      'Ambemohar (आंबेमोहर)',
      'BPT 5204 (सांबा मसुरी)'
    ],
    'Maize / Corn (मका)': [
      'Pioneer P3396 (पायोनियर)',
      'DKC 9108 Bayer (डेकाल्ब)',
      'Sweet Corn Sugar 75 (स्वीट कॉर्न)',
      'Desi Yellow Fodder (पिवळा मका)'
    ],
    'Bajra / Pearl Millet (बाजरी)': [
      'Pioneer 86M88 (पायोनियर)',
      'Shradha Hybrid (श्रद्धा)',
      'Shanti ICTP 8203 (शांती)',
      'Gavran Desi Bajra (गावरान बाजरी)'
    ],
    'Jowar / Sorghum (ज्वारी)': [
      'Maldandi M 35-1 Shalu (मालदांडी / शाळू)',
      'Parbhani Moti (परभणी मोती)',
      'Phule Suchitra (फुले सुचित्रा)',
      'CSH 14 Hybrid'
    ]
  },
  'Pulses & Legumes (कडधान्ये / डाळी)': {
    'Soybean (सोयाबीन)': [
      'Phule Sangam KDS 726 (फुले संगम)',
      'Phule Kimaya KDS 753 (फुले किमया)',
      'JS 335 Jawahar (जेएस ३३५)',
      'JS 9305 (जेएस ९३०५)',
      'JS 2034 Early',
      'MAUS 71 / MAUS 162'
    ],
    'Chickpea / Gram (हरभरा / चना)': [
      'Vijay MPKV (विजय)',
      'Digvijay (दिग्विजय)',
      'JAKI 9218 (जाकी)',
      'Kabuli Dollar Gram (डॉलर चना - Bold)',
      'Vishal (विशाल)'
    ],
    'Pigeon Pea / Toor Dal (तूर)': [
      'BDN 711 White (बीडीएन ७११ पांढरी तूर)',
      'BSMR 736 (मारुती लाल तूर)',
      'Maruti ICP 8863',
      'Asha ICPL 87119 (आशा)'
    ],
    'Green Gram / Moong (मूग)': [
      'Vaibhav (वैभव)',
      'BM 2003-2 (बीएम २००३)',
      'PKV AKM 4',
      'Pusa Vishal (पुसा विशाल)'
    ],
    'Black Gram / Urad (उडीद)': [
      'Tau-1 (ताऊ-१)',
      'TPU-4 (टीपीयू-४)',
      'Phule Udid-1 (फुले उडीद)',
      'AKU-15'
    ]
  },
  'Oilseeds (गळीत धान्ये / तेलबिया)': {
    'Groundnut / Peanut (भुईमूग)': [
      'TAG 24 (टॅग २४)',
      'JL 24 Phule Pragati (प्रगती)',
      'TG 37A (टीजी ३७ए)',
      'Western-51 Bold (वेस्टर्न ५१)'
    ],
    'Cotton (कापूस)': [
      'Bollgard II RCH 659 BT (राशी ६५९)',
      'Ajit 155 BT (अजित १५५)',
      'Brahma Super BT (ब्रह्मा)',
      'Desi Arboreum Cotton (गावरान कापूस)'
    ],
    'Sunflower (सूर्यफूल)': [
      'KBSH-44 (केबीएसएच)',
      'DRSH-1 (डीआरएसएच)',
      'Phule Bhaskar (फुले भास्कर)',
      'Modern Gold'
    ],
    'Mustard (मोहरी)': [
      'Pusa Bold (पुसा बोल्ड)',
      'Varuna T-59 (वरुणा)',
      'Kranti (क्रांती)'
    ]
  },
  'Commercial & Cash Crops (नगदी पिके)': {
    'Sugarcane (ऊस)': [
      'Co 86032 Nira (८६०३२ नीरा)',
      'CoM 0265 Phule 265 (२६५)',
      'Co 09057 (०९०५७)',
      'VSI 08005 (व्हीएसआय)'
    ],
    'Turmeric (हळद)': [
      'Salem Premium (सेलम हळद)',
      'Waigaon GI Wardha (वायगाव)',
      'Prathiba (प्रतिभा)',
      'Rajapuri Special (राजापुरी)'
    ]
  },
  'Floriculture & Flowers (फुलशेती)': {
    'Marigold (झेंडू)': [
      'Kolkata Orange Super (कोलकाता ऑरेंज)',
      'Maxi Yellow F1 (मॅक्सी येलो)',
      'Pusa Narangi (पुसा नारंगी)'
    ],
    'Rose (गुलाब)': [
      'Dutch Red Rose Export (डच लाल गुलाब)',
      'Top Secret (टॉप सिक्रेट)',
      'Local Desi Fragrant (गावरान सुगंधी गुलाब)'
    ]
  }
};

const DISTRICTS = [
  'Nashik', 'Pune', 'Solapur', 'Latur', 'Ahmednagar', 'Jalna', 'Akola', 'Amravati', 'Buldhana', 'Nagpur', 'Chhatrapati Sambhajinagar', 'Wardha', 'Yavatmal'
];

const TALUKAS = {
  'Nashik': ['Nashik', 'Niphad', 'Sinnar', 'Dindori', 'Malegaon', 'Yeola', 'Kalwan', 'Baglan', 'Chandwad', 'Igatpuri'],
  'Pune': ['Pune City', 'Junnar', 'Ambegaon', 'Khed', 'Haveli', 'Baramati', 'Shirur', 'Indapur', 'Daund'],
  'Solapur': ['North Solapur', 'South Solapur', 'Barshi', 'Pandharpur', 'Akkalkot'],
  'Latur': ['Latur', 'Ausa', 'Udgir', 'Nilanga', 'Ahmedpur'],
  'Ahmednagar': ['Ahmednagar', 'Sangamner', 'Kopargaon', 'Rahata', 'Rahuri', 'Shrirampur', 'Nevasa'],
  'Jalna': ['Jalna', 'Badnapur', 'Ambad', 'Partur'],
  'Akola': ['Akola', 'Akot', 'Balapur'],
  'Buldhana': ['Buldhana', 'Mehkar', 'Khamgaon', 'Chikhli', 'Malkapur', 'Nandura', 'Lonar'],
  'Amravati': ['Amravati', 'Achalpur', 'Warud', 'Morshi'],
  'Nagpur': ['Nagpur', 'Katol', 'Saoner', 'Umred'],
  'Chhatrapati Sambhajinagar': ['Chhatrapati Sambhajinagar', 'Paithan', 'Vaijapur', 'Gangapur', 'Kannad'],
  'Wardha': ['Wardha', 'Hinganghat', 'Deoli', 'Arvi'],
  'Yavatmal': ['Yavatmal', 'Pusad', 'Umarkhed', 'Darwha']
};

const VILLAGES = {
  'Nashik': ['Panchavati', 'Satpur', 'Adgaon', 'Makhmalabad', 'Mhasrul', 'Gangapur', 'Deolali', 'Ambad', 'Pathardi', 'Vilholi', 'Girnare', 'Dugaon'],
  'Niphad': ['Pimpalgaon Baswant', 'Lasalgaon', 'Niphad', 'Ozar', 'Kundewadi', 'Saikheda', 'Ranwad', 'Vinchur', 'Khedle Jhunge', 'Kokangaon'],
  'Sinnar': ['Sinnar', 'Musalgaon', 'Gonde', 'Wavi', 'Dodi', 'Pangri', 'Dubere', 'Baragaon Pimpri', 'Khambale', 'Pandhurli'],
  'Dindori': ['Dindori', 'Vani', 'Janori', 'Khedgaon', 'Nanashi', 'Umrale', 'Varvandi', 'Koshimbe'],
  'Malegaon': ['Malegaon Camp', 'Sayane', 'Dabhadi', 'Nimgaon', 'Soundane', 'Zodge', 'Tehare', 'Kargaon'],
  'Yeola': ['Yeola', 'Andarsul', 'Nagarsul', 'Mukhed', 'Savargaon', 'Ranjangaon', 'Kotamgaon'],
  'Kalwan': ['Kalwan', 'Abhona', 'Kanashi', 'Manur', 'Bej', 'Dalwat'],
  'Baglan': ['Satana', 'Taharabod', 'Jaigaon', 'Brahmangaon', 'Virgaon', 'Nampur'],
  'Chandwad': ['Chandwad', 'Vadbare', 'Kundewadi', 'Rahud', 'Dahiwad', 'Mangrul'],
  'Igatpuri': ['Igatpuri', 'Ghoti', 'Bhavali', 'Kasarwadi', 'Waki', 'Kavnai'],
  'Junnar': ['Narayangaon', 'Otur', 'Alephata', 'Junnar', 'Belhe', 'Rajur', 'Kusur', 'Dingore'],
  'Ambegaon': ['Manchar', 'Ghodegaon', 'Avsari', 'Pabal', 'Loni', 'Shindodi', 'Kalamb'],
  'Khed': ['Rajgurunagar', 'Chakan', 'Alandi', 'Waki', 'Kadus', 'Shelgaon', 'Pait'],
  'Pune City': ['Gultekdi', 'Shivajinagar', 'Kothrud', 'Khadki', 'Baner', 'Hinjawadi', 'Dhankawadi'],
  'Baramati': ['Baramati', 'Malegaon Budruk', 'Koregaon', 'Songaon', 'Morgaon', 'Supa'],
  'Latur': ['Latur', 'Murud', 'Harangul', 'Babhalgaon', 'Kasar Kheda', 'Gangapur'],
  'North Solapur': ['Solapur', 'Kegaon', 'Degaon', 'Tirole', 'Kavthe', 'Pakni'],
  'Ahmednagar': ['Ahmednagar', 'Bhor', 'Kedgaon', 'Nalegaon', 'Bhingar', 'Savedi'],
  'Kopargaon': ['Kopargaon', 'Kolpewadi', 'Pohegaon', 'Dhamori', 'Savalvihir'],
  'Jalna': ['Jalna', 'Daregaon', 'Ramnagar', 'Sewli', 'Wadgaon'],
  'Akola': ['Akola', 'Borgaon Manju', 'Malkapur', 'Kapshi', 'Karanja'],
  'Mehkar': ['Mehkar', 'Janefal', 'Dongaon', 'Janephal', 'Bramhapuri', 'Hiwarkhed', 'Ukali'],
  'Khamgaon': ['Khamgaon', 'Ghanegaon', 'Pahurjira', 'Gondhanapur', 'Sutala', 'Rohinkhed'],
  'Amravati': ['Amravati', 'Nandgaon Peth', 'Walgaon', 'Badnera', 'Mahuli'],
  'Nagpur': ['Wadi', 'Hingna', 'Mahadula', 'Besa', 'Pipla', 'Kamptee'],
  'Chhatrapati Sambhajinagar': ['Chhatrapati Sambhajinagar', 'Chittegaon', 'Waluj', 'Shendra', 'Bidkin'],
  'Wardha': ['Wardha', 'Sindi', 'Pawanar', 'Sewagram', 'Waigaon'],
  'Yavatmal': ['Yavatmal', 'Lohara', 'Wadgaon', 'Pimpalgaon Yavatmal', 'Arni']
};

const TALUKA_COORDS_LOOKUP = [
  { district: 'Nashik', taluka: 'Nashik', village: 'Panchavati', lat: 19.9975, lng: 73.7898 },
  { district: 'Nashik', taluka: 'Niphad', village: 'Pimpalgaon Baswant', lat: 20.0793, lng: 74.1117 },
  { district: 'Nashik', taluka: 'Sinnar', village: 'Sinnar', lat: 19.8465, lng: 73.9984 },
  { district: 'Nashik', taluka: 'Dindori', village: 'Dindori', lat: 20.2012, lng: 73.8341 },
  { district: 'Nashik', taluka: 'Malegaon', village: 'Malegaon Camp', lat: 20.5539, lng: 74.5298 },
  { district: 'Nashik', taluka: 'Yeola', village: 'Yeola', lat: 20.0532, lng: 74.4908 },
  { district: 'Pune', taluka: 'Junnar', village: 'Narayangaon', lat: 19.2083, lng: 73.8744 },
  { district: 'Pune', taluka: 'Ambegaon', village: 'Manchar', lat: 19.0112, lng: 73.8378 },
  { district: 'Pune', taluka: 'Khed', village: 'Chakan', lat: 18.8524, lng: 73.8893 },
  { district: 'Pune', taluka: 'Pune City', village: 'Gultekdi', lat: 18.5204, lng: 73.8567 },
  { district: 'Pune', taluka: 'Baramati', village: 'Baramati', lat: 18.1517, lng: 74.5772 },
  { district: 'Latur', taluka: 'Latur', village: 'Latur', lat: 18.4088, lng: 76.5604 },
  { district: 'Solapur', taluka: 'North Solapur', village: 'Solapur', lat: 17.6599, lng: 75.9064 },
  { district: 'Ahmednagar', taluka: 'Ahmednagar', village: 'Ahmednagar', lat: 19.0948, lng: 74.7480 },
  { district: 'Ahmednagar', taluka: 'Kopargaon', village: 'Kopargaon', lat: 19.8827, lng: 74.4820 },
  { district: 'Jalna', taluka: 'Jalna', village: 'Jalna', lat: 19.8347, lng: 75.8816 },
  { district: 'Akola', taluka: 'Akola', village: 'Akola', lat: 20.7002, lng: 77.0082 },
  { district: 'Buldhana', taluka: 'Mehkar', village: 'Mehkar', lat: 20.1558, lng: 76.5702 },
  { district: 'Buldhana', taluka: 'Khamgaon', village: 'Khamgaon', lat: 20.6865, lng: 76.5645 },
  { district: 'Amravati', taluka: 'Amravati', village: 'Amravati', lat: 20.9374, lng: 77.7796 },
  { district: 'Nagpur', taluka: 'Nagpur', village: 'Wadi', lat: 21.1458, lng: 79.0882 },
  { district: 'Chhatrapati Sambhajinagar', taluka: 'Chhatrapati Sambhajinagar', village: 'Waluj', lat: 19.8762, lng: 75.3433 },
  { district: 'Wardha', taluka: 'Wardha', village: 'Waigaon', lat: 20.7453, lng: 78.6022 },
  { district: 'Yavatmal', taluka: 'Yavatmal', village: 'Yavatmal', lat: 20.3888, lng: 78.1204 }
];

const getTodayMMDDYYYY = () => {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
};

export const ListProducePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useApp();

  const initialCategory = 'Vegetables (भाज्या)';
  const initialCommodity = 'Onion (कांदा)';
  const initialVariety = CROP_DATABASE[initialCategory]?.[initialCommodity]?.[0] || 'Nashik Red / Garwa (नाशिक लाल)';

  const [formData, setFormData] = useState({
    category: initialCategory,
    cropName: initialCommodity,
    variety: initialVariety,
    quantity: '500',
    unit: 'Quintal',
    qualityGrade: 'Grade A (Export / Processing Quality)',
    harvestDate: getTodayMMDDYYYY(),
    freshness: 'Fresh Harvest (< 48 hrs)',
    district: user?.district || 'Nashik',
    taluka: user?.taluka || 'Nashik',
    village: user?.village || 'Panchavati',
    state: 'Maharashtra',
    gpsCoords: user?.gpsCoords || null
  });

  // Derived commodities list based on selected category
  const commodityList = Object.keys(CROP_DATABASE[formData.category] || {});

  // Derived varieties list based on selected category and commodity
  const varietyList = (CROP_DATABASE[formData.category] && CROP_DATABASE[formData.category][formData.cropName]) || ['Grade Standard'];

  // Derived talukas & villages
  const talukaList = TALUKAS[formData.district] || ['Nashik', 'Niphad', 'Sinnar', 'Dindori'];
  const villageList = VILLAGES[formData.taluka] || [
    `${formData.taluka} Central`,
    `${formData.taluka} Gram`,
    'Panchavati',
    'Main Market Village'
  ];

  // 1. Cascading Category Handler: Updates category, auto-selects first commodity & first variety
  const handleCategoryChange = (newCategory) => {
    const availableCommodities = Object.keys(CROP_DATABASE[newCategory] || {});
    const firstCommodity = availableCommodities[0] || '';
    const availableVarieties = (CROP_DATABASE[newCategory] && CROP_DATABASE[newCategory][firstCommodity]) || ['Grade Standard'];
    const firstVariety = availableVarieties[0] || 'Grade Standard';

    setFormData({
      ...formData,
      category: newCategory,
      cropName: firstCommodity,
      variety: firstVariety,
    });
  };

  // 2. Cascading Commodity Handler: Updates commodity, auto-selects its first variety
  const handleCommodityChange = (newCommodity) => {
    const availableVarieties = (CROP_DATABASE[formData.category] && CROP_DATABASE[formData.category][newCommodity]) || ['Grade Standard'];
    const firstVariety = availableVarieties[0] || 'Grade Standard';

    setFormData({
      ...formData,
      cropName: newCommodity,
      variety: firstVariety,
    });
  };

  // 3. Variety Handler
  const handleVarietyChange = (newVariety) => {
    setFormData({
      ...formData,
      variety: newVariety,
    });
  };

  // 4. District Change Handler: Updates district, sets first taluka and first village
  const handleDistrictChange = (d) => {
    const tList = TALUKAS[d] || [d];
    const firstTaluka = tList[0] || d;
    const vList = VILLAGES[firstTaluka] || [`${firstTaluka} Central`];
    setFormData({
      ...formData,
      district: d,
      taluka: firstTaluka,
      village: vList[0] || `${firstTaluka} Central`,
    });
  };

  // 5. Taluka Change Handler: Updates taluka and sets its first village
  const handleTalukaChange = (t) => {
    const vList = VILLAGES[t] || [`${t} Central`];
    setFormData({
      ...formData,
      taluka: t,
      village: vList[0] || `${t} Central`,
    });
  };

  // 6. Village Change Handler
  const handleVillageChange = (v) => {
    setFormData({
      ...formData,
      village: v,
    });
  };

  // 7. Auto-detect & auto-populate District, Taluka & Village when farmer clicks "Enable My Location"
  const handleGpsLocationSelect = (coords) => {
    if (!coords || !coords.lat || !coords.lng) return;
    const lat = parseFloat(coords.lat);
    const lng = parseFloat(coords.lng);

    let closest = TALUKA_COORDS_LOOKUP[0];
    let minDistance = Infinity;

    TALUKA_COORDS_LOOKUP.forEach((loc) => {
      const d = Math.hypot(loc.lat - lat, loc.lng - lng);
      if (d < minDistance) {
        minDistance = d;
        closest = loc;
      }
    });

    setFormData((prev) => ({
      ...prev,
      gpsCoords: coords,
      district: closest.district,
      taluka: closest.taluka,
      village: closest.village,
    }));

    if (showToast) {
      showToast(`📍 Location Auto-detected: ${closest.village}, ${closest.taluka} Taluka, ${closest.district}`);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    await firestoreService.saveProduce({
      ...formData,
      farmerId: user?.farmerId || user?.id || 'FARM-NEW',
      farmerName: user?.name || user?.farmerName || 'Farmer',
    });
    showToast(`Produce listing published! ${formData.quantity} ${formData.unit} of ${formData.cropName} is now live.`);
    navigate('/farmer/lots');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-8">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-2xl">📦</span>
          <span className="text-xs font-mono uppercase text-emerald-300 font-bold">Farmer Marketplace Listing</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
          {t('list_produce_title', 'List Produce for Sale')}
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl">
          {t('list_produce_sub', 'Provide crop details, quantity, quality grade, and your expected price to receive optimized market matches.')}
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
        <form onSubmit={handlePublish} className="space-y-6">
          
          {/* SECTION 1: CROP DETAILS (CASCADING: CATEGORY ➔ COMMODITY ➔ VARIETY) */}
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">1</span>
              <span>Crop Details</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* 1. Crop Category * (Dropdown) */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Crop Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {Object.keys(CROP_DATABASE).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* 2. Crop Commodity * (Dropdown - Filtered by Category) */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Crop Commodity *</label>
                <select
                  value={formData.cropName}
                  onChange={(e) => handleCommodityChange(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {commodityList.map((comm) => (
                    <option key={comm} value={comm}>{comm}</option>
                  ))}
                </select>
              </div>

              {/* 3. Variety * (Dropdown - Filtered by Commodity) */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Variety *</label>
                <select
                  value={formData.variety}
                  onChange={(e) => handleVarietyChange(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {varietyList.map((varItem) => (
                    <option key={varItem} value={varItem}>{varItem}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: AVAILABLE QUANTITY (in Quintals) */}
          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">2</span>
              <span>Available Quantity (in Quintals)</span>
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Available Quantity *</label>
                <input
                  type="number"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="Enter quantity in Quintals (e.g. 500)"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white font-mono text-base"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: QUALITY & HARVEST DETAILS */}
          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">3</span>
              <span>Quality &amp; Harvest Details</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Quality Grade *</label>
                <select
                  value={formData.qualityGrade}
                  onChange={(e) => setFormData({ ...formData, qualityGrade: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800"
                >
                  <option value="Grade A (Export / Processing Quality)">Grade A (Export / Processing Quality)</option>
                  <option value="Grade B (Standard Mandi Quality)">Grade B (Standard Market Quality)</option>
                  <option value="Grade C (Local Consumption)">Grade C (Local Mandi Quality)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Harvest Date (MM/DD/YYYY) *</label>
                <input
                  type="text"
                  placeholder="MM/DD/YYYY (e.g., 08/28/2026)"
                  value={formData.harvestDate}
                  onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: LOCATION & PUBLISH */}
          <div className="border-t border-slate-100 pt-6 space-y-4">

            {/* Enable My Location GPS button with auto-populate */}
            <LocationPicker onLocationSelect={handleGpsLocationSelect} />

            {/* Village, Taluka, District Dropdowns (Auto-populated from GPS or manually editable) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">District *</label>
                <select
                  value={formData.district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white cursor-pointer"
                >
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Taluka *</label>
                <select
                  value={formData.taluka}
                  onChange={(e) => handleTalukaChange(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white cursor-pointer"
                >
                  {talukaList.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Village *</label>
                <select
                  value={formData.village}
                  onChange={(e) => handleVillageChange(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white cursor-pointer"
                >
                  {villageList.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* State Text & Publish Button on the same row */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm font-bold text-slate-700">
                State: Maharashtra
              </div>
              <div className="flex flex-col items-center sm:items-end gap-1.5 w-full sm:w-auto">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-600/25 transition-all cursor-pointer"
                >
                  {t('publish_produce', 'Publish Produce Listing')} ✓
                </button>
                <p className="text-[11px] text-slate-500 text-center sm:text-right">
                  Notice: your harvest to find tirect verimed buyers and calculate maximum het pront.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
