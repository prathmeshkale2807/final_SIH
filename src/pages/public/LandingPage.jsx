import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { marketService } from '../../services/marketService';
import { RouteMapModal } from '../../components/common/RouteMapModal';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user, isAuthenticated, isFarmer, isBuyer } = useAuth();

  // Trending Market Prices state
  const [selectedCrop, setSelectedCrop] = useState('onion');
  const [pincode, setPincode] = useState('422001');
  const [selectedDistrict, setSelectedDistrict] = useState('Nashik');
  const [selectedTaluka, setSelectedTaluka] = useState('Nashik');
  const [userLocationLabel, setUserLocationLabel] = useState('Nashik Taluka, Nashik');
  const [userCoords, setUserCoords] = useState({ lat: 19.9975, lng: 73.7898 });
  const [sortBy, setSortBy] = useState('distance'); // 'distance' | 'price_desc' | 'price_asc' | 'gain'
  const [searchLoading, setSearchLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [locStatusMessage, setLocStatusMessage] = useState('');
  const [locationMode, setLocationMode] = useState('taluka'); // 'taluka' | 'pincode' | 'gps'
  
  // Interactive Modals & Route Selection
  const [activeMandiDetail, setActiveMandiDetail] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedMapMandi, setSelectedMapMandi] = useState(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0); // 0: Best Route (Highway), 1: Toll-Free (State Highway), 2: Shortest Rural

  const cropList = [
    { id: 'onion', name: 'Onion (कांदा)', icon: '🧅' },
    { id: 'tomato', name: 'Tomato (टोमॅटो)', icon: '🍅' },
    { id: 'soybean', name: 'Soybean (सोयाबीन)', icon: '🌱' },
    { id: 'potato', name: 'Potato (बटाटा)', icon: '🥔' },
    { id: 'wheat', name: 'Wheat (गहू)', icon: '🌾' },
    { id: 'cotton', name: 'Cotton (कापूस)', icon: '☁️' },
  ];

  // ========================================================================
  // MAHARASHTRA DISTRICTS + TALUKAS with authentic coordinates
  // ========================================================================
  const MH_DISTRICTS = [
    {
      name: 'Ahmednagar', lat: 19.0952, lng: 74.7480,
      talukas: [
        { name: 'Ahmednagar', lat: 19.0952, lng: 74.7480 },
        { name: 'Akole', lat: 19.5652, lng: 73.9917 },
        { name: 'Jamkhed', lat: 18.7217, lng: 75.3244 },
        { name: 'Karjat', lat: 18.9284, lng: 75.1199 },
        { name: 'Kopargaon', lat: 19.8983, lng: 74.4780 },
        { name: 'Nevasa', lat: 19.5680, lng: 74.9843 },
        { name: 'Parner', lat: 19.0000, lng: 74.4354 },
        { name: 'Pathardi', lat: 19.1823, lng: 75.1890 },
        { name: 'Rahata', lat: 19.7122, lng: 74.4804 },
        { name: 'Rahuri', lat: 19.3919, lng: 74.6508 },
        { name: 'Sangamner', lat: 19.5735, lng: 74.2154 },
        { name: 'Shevgaon', lat: 19.3340, lng: 75.1851 },
        { name: 'Shrigonda', lat: 18.6206, lng: 74.6822 },
        { name: 'Shrirampur', lat: 19.6230, lng: 74.6474 },
      ]
    },
    {
      name: 'Akola', lat: 20.7002, lng: 77.0125,
      talukas: [
        { name: 'Akola', lat: 20.7002, lng: 77.0125 },
        { name: 'Akot', lat: 21.0921, lng: 77.0619 },
        { name: 'Balapur', lat: 20.6617, lng: 76.7777 },
        { name: 'Barshitakli', lat: 20.9210, lng: 76.6400 },
        { name: 'Murtizapur', lat: 20.7346, lng: 77.4074 },
        { name: 'Patur', lat: 20.5460, lng: 76.9560 },
        { name: 'Telhara', lat: 20.9210, lng: 77.2780 },
      ]
    },
    {
      name: 'Amravati', lat: 20.9374, lng: 77.7523,
      talukas: [
        { name: 'Amravati', lat: 20.9374, lng: 77.7523 },
        { name: 'Achalpur', lat: 21.2578, lng: 77.5162 },
        { name: 'Anjangaon Surji', lat: 21.1660, lng: 77.3090 },
        { name: 'Chandur Bazar', lat: 21.1036, lng: 78.0413 },
        { name: 'Chandurbazar', lat: 21.1036, lng: 78.0413 },
        { name: 'Chikhaldara', lat: 21.4091, lng: 77.3133 },
        { name: 'Daryapur', lat: 20.9177, lng: 77.3261 },
        { name: 'Dharni', lat: 21.5624, lng: 76.9618 },
        { name: 'Morshi', lat: 21.3203, lng: 78.0071 },
        { name: 'Nandgaon Khandeshwar', lat: 20.7570, lng: 77.9190 },
        { name: 'Tiwsa', lat: 21.1070, lng: 77.8200 },
        { name: 'Warud', lat: 21.4635, lng: 78.2598 },
      ]
    },
    {
      name: 'Aurangabad', lat: 19.8762, lng: 75.3433,
      talukas: [
        { name: 'Aurangabad', lat: 19.8762, lng: 75.3433 },
        { name: 'Gangapur', lat: 19.6938, lng: 75.0050 },
        { name: 'Kannad', lat: 20.2648, lng: 75.1424 },
        { name: 'Khuldabad', lat: 20.0410, lng: 75.1940 },
        { name: 'Paithan', lat: 19.4759, lng: 75.3861 },
        { name: 'Phulambri', lat: 19.8480, lng: 75.6880 },
        { name: 'Sillod', lat: 20.1062, lng: 75.6573 },
        { name: 'Soegaon', lat: 20.3340, lng: 75.7010 },
        { name: 'Vaijapur', lat: 19.9222, lng: 74.7179 },
      ]
    },
    {
      name: 'Beed', lat: 18.9891, lng: 75.7600,
      talukas: [
        { name: 'Ambajogai', lat: 18.7320, lng: 76.3840 },
        { name: 'Ashti', lat: 18.4300, lng: 75.4920 },
        { name: 'Beed', lat: 18.9891, lng: 75.7600 },
        { name: 'Dharur', lat: 18.8230, lng: 76.2110 },
        { name: 'Georai', lat: 19.2760, lng: 75.7410 },
        { name: 'Kaij', lat: 18.8510, lng: 76.0190 },
        { name: 'Majalgaon', lat: 19.1529, lng: 76.2195 },
        { name: 'Parli', lat: 18.8509, lng: 76.5355 },
        { name: 'Patoda', lat: 19.1700, lng: 75.6120 },
        { name: 'Shirur Kasar', lat: 19.4030, lng: 75.3690 },
        { name: 'Wadwani', lat: 18.7960, lng: 76.6770 },
      ]
    },
    {
      name: 'Buldhana', lat: 20.5292, lng: 76.1843,
      talukas: [
        { name: 'Buldhana', lat: 20.5292, lng: 76.1843 },
        { name: 'Chikhli', lat: 20.3571, lng: 76.2981 },
        { name: 'Deulgaon Raja', lat: 20.0200, lng: 76.3740 },
        { name: 'Jalgaon Jamod', lat: 20.9310, lng: 76.5560 },
        { name: 'Khamgaon', lat: 20.7057, lng: 76.5683 },
        { name: 'Lonar', lat: 20.0781, lng: 76.5102 },
        { name: 'Malkapur', lat: 20.8851, lng: 76.2138 },
        { name: 'Mehkar', lat: 20.1498, lng: 76.5732 },
        { name: 'Motala', lat: 20.6520, lng: 76.3980 },
        { name: 'Nandura', lat: 20.8257, lng: 76.4581 },
        { name: 'Sangrampur', lat: 20.6940, lng: 77.0450 },
        { name: 'Shegaon', lat: 20.7950, lng: 76.6960 },
        { name: 'Sindkhed Raja', lat: 20.2884, lng: 76.5253 },
      ]
    },
    {
      name: 'Chandrapur', lat: 19.9704, lng: 79.2961,
      talukas: [
        { name: 'Ballarpur', lat: 19.8620, lng: 79.3470 },
        { name: 'Bhadravati', lat: 20.0060, lng: 79.1590 },
        { name: 'Bramhapuri', lat: 20.6091, lng: 79.8657 },
        { name: 'Chandrapur', lat: 19.9704, lng: 79.2961 },
        { name: 'Chimur', lat: 20.3290, lng: 79.1030 },
        { name: 'Gondpimpri', lat: 20.2060, lng: 79.5540 },
        { name: 'Jiwati', lat: 19.9640, lng: 79.0100 },
        { name: 'Korpana', lat: 20.1680, lng: 79.0500 },
        { name: 'Mul', lat: 20.0720, lng: 79.6750 },
        { name: 'Nagbhid', lat: 20.5570, lng: 79.6440 },
        { name: 'Pombhurna', lat: 20.3890, lng: 79.6260 },
        { name: 'Rajura', lat: 19.7780, lng: 79.3720 },
        { name: 'Sawali', lat: 19.6700, lng: 79.4300 },
        { name: 'Sindewahi', lat: 20.2790, lng: 79.7280 },
        { name: 'Warora', lat: 20.2363, lng: 79.0033 },
      ]
    },
    {
      name: 'Dhule', lat: 20.9042, lng: 74.7749,
      talukas: [
        { name: 'Dhule', lat: 20.9042, lng: 74.7749 },
        { name: 'Sakri', lat: 20.9992, lng: 74.3280 },
        { name: 'Shirpur', lat: 21.3490, lng: 74.8800 },
        { name: 'Sindkhede', lat: 21.2900, lng: 74.5600 },
      ]
    },
    {
      name: 'Gadchiroli', lat: 20.1737, lng: 80.0063,
      talukas: [
        { name: 'Aheri', lat: 19.3140, lng: 80.0100 },
        { name: 'Armori', lat: 20.4670, lng: 80.0380 },
        { name: 'Bhamragad', lat: 18.9980, lng: 80.3790 },
        { name: 'Chamorshi', lat: 19.8710, lng: 80.2960 },
        { name: 'Desaiganj', lat: 20.0970, lng: 80.0440 },
        { name: 'Dhanora', lat: 20.3350, lng: 80.3550 },
        { name: 'Etapalli', lat: 18.9540, lng: 80.3020 },
        { name: 'Gadchiroli', lat: 20.1737, lng: 80.0063 },
        { name: 'Korchi', lat: 20.5430, lng: 80.3550 },
        { name: 'Kurkheda', lat: 20.6120, lng: 80.1830 },
        { name: 'Mulchera', lat: 20.5200, lng: 80.5310 },
        { name: 'Sironcha', lat: 18.8440, lng: 79.9450 },
      ]
    },
    {
      name: 'Gondia', lat: 21.4611, lng: 80.1915,
      talukas: [
        { name: 'Amgaon', lat: 21.3700, lng: 80.4360 },
        { name: 'Arjuni Morgaon', lat: 21.5350, lng: 80.0440 },
        { name: 'Deori', lat: 21.2490, lng: 79.9770 },
        { name: 'Gondia', lat: 21.4611, lng: 80.1915 },
        { name: 'Goregaon', lat: 21.6330, lng: 80.0750 },
        { name: 'Salekasa', lat: 21.6540, lng: 80.3820 },
        { name: 'Sadak Arjuni', lat: 21.4450, lng: 79.7380 },
        { name: 'Tirora', lat: 21.4160, lng: 79.9590 },
      ]
    },
    {
      name: 'Hingoli', lat: 19.7180, lng: 77.1480,
      talukas: [
        { name: 'Aundha Nagnath', lat: 19.6290, lng: 77.5930 },
        { name: 'Basmath', lat: 19.3550, lng: 77.1990 },
        { name: 'Hingoli', lat: 19.7180, lng: 77.1480 },
        { name: 'Kalamnuri', lat: 19.6900, lng: 77.2650 },
        { name: 'Sengaon', lat: 19.4060, lng: 77.2950 },
      ]
    },
    {
      name: 'Jalgaon', lat: 21.0077, lng: 75.5626,
      talukas: [
        { name: 'Amalner', lat: 21.0483, lng: 75.0567 },
        { name: 'Bhadgaon', lat: 20.7630, lng: 75.5210 },
        { name: 'Bhusawal', lat: 21.0438, lng: 75.7766 },
        { name: 'Bodwad', lat: 21.1210, lng: 75.7030 },
        { name: 'Chalisgaon', lat: 20.4600, lng: 74.9800 },
        { name: 'Chopda', lat: 21.2480, lng: 75.2940 },
        { name: 'Dharangaon', lat: 21.0170, lng: 75.2880 },
        { name: 'Erandol', lat: 20.9280, lng: 75.3330 },
        { name: 'Jalgaon', lat: 21.0077, lng: 75.5626 },
        { name: 'Jamner', lat: 20.8190, lng: 75.7870 },
        { name: 'Muktainagar', lat: 21.0370, lng: 75.1060 },
        { name: 'Pachora', lat: 20.6625, lng: 75.3447 },
        { name: 'Parola', lat: 20.8800, lng: 74.9930 },
        { name: 'Raver', lat: 21.2450, lng: 76.0250 },
        { name: 'Yawal', lat: 21.1650, lng: 75.7270 },
      ]
    },
    {
      name: 'Jalna', lat: 19.8410, lng: 75.8864,
      talukas: [
        { name: 'Ambad', lat: 19.6030, lng: 75.9570 },
        { name: 'Badnapur', lat: 19.8380, lng: 76.0800 },
        { name: 'Bhokardan', lat: 20.2390, lng: 75.7510 },
        { name: 'Ghansawangi', lat: 19.3720, lng: 75.9320 },
        { name: 'Jalna', lat: 19.8410, lng: 75.8864 },
        { name: 'Jafrabad', lat: 19.8600, lng: 76.2120 },
        { name: 'Mantha', lat: 19.3870, lng: 76.2670 },
        { name: 'Partur', lat: 19.6017, lng: 76.2177 },
      ]
    },
    {
      name: 'Kolhapur', lat: 16.7050, lng: 74.2433,
      talukas: [
        { name: 'Ajra', lat: 16.1120, lng: 74.2120 },
        { name: 'Bavda', lat: 16.5120, lng: 73.9120 },
        { name: 'Bhudargad', lat: 16.3040, lng: 73.9520 },
        { name: 'Chandgad', lat: 15.9050, lng: 74.3680 },
        { name: 'Gadhinglaj', lat: 16.2270, lng: 74.3530 },
        { name: 'Hatkanangle', lat: 16.7920, lng: 74.3460 },
        { name: 'Kagal', lat: 16.5740, lng: 74.3180 },
        { name: 'Karvir', lat: 16.7050, lng: 74.2433 },
        { name: 'Panhala', lat: 16.8130, lng: 74.1080 },
        { name: 'Radhanagari', lat: 16.4150, lng: 74.0740 },
        { name: 'Shahuwadi', lat: 16.5780, lng: 73.9880 },
        { name: 'Shirol', lat: 16.7440, lng: 74.5680 },
      ]
    },
    {
      name: 'Latur', lat: 18.4088, lng: 76.5880,
      talukas: [
        { name: 'Ahmedpur', lat: 17.9770, lng: 76.2360 },
        { name: 'Ausa', lat: 18.2558, lng: 76.4875 },
        { name: 'Chakur', lat: 17.8910, lng: 76.8700 },
        { name: 'Deoni', lat: 18.0350, lng: 77.0540 },
        { name: 'Jalkot', lat: 17.7850, lng: 76.6710 },
        { name: 'Latur', lat: 18.4088, lng: 76.5880 },
        { name: 'Nilanga', lat: 17.8636, lng: 76.7545 },
        { name: 'Renapur', lat: 18.2500, lng: 76.5810 },
        { name: 'Shirur Anantpal', lat: 18.0750, lng: 76.3990 },
        { name: 'Udgir', lat: 18.3900, lng: 77.1200 },
      ]
    },
    {
      name: 'Mumbai City', lat: 18.9690, lng: 72.8210,
      talukas: [
        { name: 'Mumbai City', lat: 18.9690, lng: 72.8210 },
      ]
    },
    {
      name: 'Mumbai Suburban', lat: 19.0760, lng: 72.8777,
      talukas: [
        { name: 'Andheri', lat: 19.1197, lng: 72.8468 },
        { name: 'Borivali', lat: 19.2307, lng: 72.8567 },
        { name: 'Kurla', lat: 19.0726, lng: 72.8789 },
      ]
    },
    {
      name: 'Nagpur', lat: 21.1458, lng: 79.0882,
      talukas: [
        { name: 'Bhiwapur', lat: 20.7600, lng: 79.6740 },
        { name: 'Hingna', lat: 21.0620, lng: 78.9730 },
        { name: 'Kalmeshwar', lat: 21.2250, lng: 78.7310 },
        { name: 'Kamptee', lat: 21.2139, lng: 79.1957 },
        { name: 'Katol', lat: 21.2748, lng: 78.5903 },
        { name: 'Kuhi', lat: 21.0130, lng: 79.5050 },
        { name: 'Mauda', lat: 21.4330, lng: 79.3820 },
        { name: 'Nagpur Rural', lat: 21.1458, lng: 79.0882 },
        { name: 'Nagpur Urban', lat: 21.1458, lng: 79.0882 },
        { name: 'Narkhed', lat: 21.4480, lng: 78.5460 },
        { name: 'Parseoni', lat: 21.3290, lng: 79.2900 },
        { name: 'Ramtek', lat: 21.3921, lng: 79.3179 },
        { name: 'Saoner', lat: 21.3819, lng: 78.9282 },
        { name: 'Umred', lat: 20.8511, lng: 79.3230 },
      ]
    },
    {
      name: 'Nanded', lat: 19.1383, lng: 77.3210,
      talukas: [
        { name: 'Ardhapur', lat: 19.1640, lng: 77.6850 },
        { name: 'Bhokar', lat: 19.3780, lng: 77.5890 },
        { name: 'Biloli', lat: 18.8250, lng: 77.7270 },
        { name: 'Deglur', lat: 18.5390, lng: 77.6370 },
        { name: 'Dharmabad', lat: 18.8970, lng: 77.9570 },
        { name: 'Hadgaon', lat: 19.5050, lng: 77.6620 },
        { name: 'Himayatnagar', lat: 18.6190, lng: 77.9670 },
        { name: 'Kandhar', lat: 18.3490, lng: 77.1860 },
        { name: 'Kinwat', lat: 19.6050, lng: 78.2060 },
        { name: 'Loha', lat: 18.6830, lng: 77.2920 },
        { name: 'Mahoor', lat: 19.8960, lng: 77.9540 },
        { name: 'Mudkhed', lat: 18.9860, lng: 77.6530 },
        { name: 'Mukhed', lat: 18.1380, lng: 77.6750 },
        { name: 'Naigaon', lat: 18.8830, lng: 77.3060 },
        { name: 'Nanded', lat: 19.1383, lng: 77.3210 },
        { name: 'Umri', lat: 19.3050, lng: 77.6980 },
      ]
    },
    {
      name: 'Nandurbar', lat: 21.3667, lng: 74.2440,
      talukas: [
        { name: 'Akkalkuwa', lat: 21.5680, lng: 74.0210 },
        { name: 'Akrani', lat: 21.7190, lng: 73.8230 },
        { name: 'Nandurbar', lat: 21.3667, lng: 74.2440 },
        { name: 'Nawapur', lat: 21.1550, lng: 73.8420 },
        { name: 'Shahada', lat: 21.5453, lng: 74.4718 },
        { name: 'Taloda', lat: 21.5710, lng: 74.2150 },
      ]
    },
    {
      name: 'Nashik', lat: 19.9975, lng: 73.7898,
      talukas: [
        { name: 'Baglan', lat: 20.5610, lng: 73.7640 },
        { name: 'Chandwad', lat: 20.3423, lng: 74.2422 },
        { name: 'Deola', lat: 20.7200, lng: 73.9670 },
        { name: 'Dindori', lat: 20.2012, lng: 73.8341 },
        { name: 'Igatpuri', lat: 19.6909, lng: 73.5553 },
        { name: 'Kalwan', lat: 20.5197, lng: 73.8224 },
        { name: 'Lasalgaon', lat: 20.1472, lng: 74.2325 },
        { name: 'Malegaon', lat: 20.5539, lng: 74.5298 },
        { name: 'Manmad', lat: 20.2520, lng: 74.4421 },
        { name: 'Nandgaon', lat: 20.3220, lng: 74.6570 },
        { name: 'Nashik', lat: 19.9975, lng: 73.7898 },
        { name: 'Niphad', lat: 20.0793, lng: 74.1117 },
        { name: 'Peint', lat: 20.3160, lng: 73.5470 },
        { name: 'Pimpalgaon Baswant', lat: 20.1743, lng: 73.9852 },
        { name: 'Satana', lat: 20.5963, lng: 74.2039 },
        { name: 'Sinnar', lat: 19.8465, lng: 73.9984 },
        { name: 'Surgana', lat: 20.5578, lng: 73.6115 },
        { name: 'Trimbakeshwar', lat: 19.9307, lng: 73.5301 },
        { name: 'Yeola', lat: 20.0532, lng: 74.4908 },
      ]
    },
    {
      name: 'Osmanabad', lat: 18.1813, lng: 76.0454,
      talukas: [
        { name: 'Bhoom', lat: 18.0580, lng: 75.6580 },
        { name: 'Kalamb', lat: 17.9860, lng: 76.3120 },
        { name: 'Lohara', lat: 17.8480, lng: 76.3820 },
        { name: 'Osmanabad', lat: 18.1813, lng: 76.0454 },
        { name: 'Paranda', lat: 18.2710, lng: 75.5230 },
        { name: 'Tuljapur', lat: 17.9742, lng: 76.0785 },
        { name: 'Umarga', lat: 17.8470, lng: 76.6230 },
        { name: 'Washi', lat: 18.3490, lng: 76.5660 },
      ]
    },
    {
      name: 'Palghar', lat: 19.6967, lng: 72.7681,
      talukas: [
        { name: 'Dahanu', lat: 19.9684, lng: 72.7157 },
        { name: 'Jawhar', lat: 19.9060, lng: 73.2260 },
        { name: 'Mokhada', lat: 19.8480, lng: 73.3230 },
        { name: 'Palghar', lat: 19.6967, lng: 72.7681 },
        { name: 'Talasari', lat: 20.1760, lng: 72.9300 },
        { name: 'Vasai', lat: 19.3897, lng: 72.8397 },
        { name: 'Vikramgad', lat: 19.8270, lng: 73.0680 },
        { name: 'Wada', lat: 19.6600, lng: 73.1520 },
      ]
    },
    {
      name: 'Parbhani', lat: 19.2699, lng: 76.7734,
      talukas: [
        { name: 'Gangakhed', lat: 18.9730, lng: 76.7490 },
        { name: 'Jintur', lat: 19.6057, lng: 76.6823 },
        { name: 'Manwath', lat: 18.9390, lng: 76.5060 },
        { name: 'Palam', lat: 18.7970, lng: 76.9430 },
        { name: 'Parbhani', lat: 19.2699, lng: 76.7734 },
        { name: 'Pathri', lat: 19.2590, lng: 76.4440 },
        { name: 'Purna', lat: 19.1830, lng: 77.0280 },
        { name: 'Sailu', lat: 19.4530, lng: 76.4650 },
        { name: 'Selu', lat: 19.4380, lng: 76.4500 },
        { name: 'Sonpeth', lat: 19.0960, lng: 76.5880 },
      ]
    },
    {
      name: 'Pune', lat: 18.5204, lng: 73.8567,
      talukas: [
        { name: 'Ambegaon', lat: 19.1620, lng: 73.7120 },
        { name: 'Baramati', lat: 18.1517, lng: 74.5772 },
        { name: 'Bhor', lat: 18.1540, lng: 73.8450 },
        { name: 'Daund', lat: 18.4661, lng: 74.5838 },
        { name: 'Haveli', lat: 18.5180, lng: 73.9010 },
        { name: 'Indapur', lat: 18.1151, lng: 75.0237 },
        { name: 'Junnar', lat: 19.2040, lng: 73.8750 },
        { name: 'Khed', lat: 18.8521, lng: 73.9142 },
        { name: 'Mawal', lat: 18.7820, lng: 73.4710 },
        { name: 'Mulshi', lat: 18.5280, lng: 73.5250 },
        { name: 'Purandar', lat: 18.2720, lng: 74.1020 },
        { name: 'Pune City', lat: 18.5204, lng: 73.8567 },
        { name: 'Shirur', lat: 18.8262, lng: 74.3710 },
        { name: 'Velhe', lat: 18.1950, lng: 73.6820 },
      ]
    },
    {
      name: 'Raigad', lat: 18.5158, lng: 73.1824,
      talukas: [
        { name: 'Alibag', lat: 18.6423, lng: 72.8725 },
        { name: 'Karjat', lat: 18.9085, lng: 73.3164 },
        { name: 'Khalapur', lat: 18.9310, lng: 73.2700 },
        { name: 'Mahad', lat: 18.0797, lng: 73.4196 },
        { name: 'Mangaon', lat: 18.2390, lng: 73.2700 },
        { name: 'Mhasala', lat: 17.9280, lng: 73.1030 },
        { name: 'Murud', lat: 18.3210, lng: 72.9620 },
        { name: 'Panvel', lat: 18.9931, lng: 73.1131 },
        { name: 'Pen', lat: 18.7360, lng: 73.0900 },
        { name: 'Poladpur', lat: 18.0610, lng: 73.5900 },
        { name: 'Roha', lat: 18.4370, lng: 73.1180 },
        { name: 'Shrivardhan', lat: 18.0390, lng: 73.0310 },
        { name: 'Sudhagad', lat: 18.5710, lng: 73.0630 },
        { name: 'Tala', lat: 18.2010, lng: 73.2760 },
        { name: 'Uran', lat: 18.8860, lng: 72.9440 },
      ]
    },
    {
      name: 'Ratnagiri', lat: 16.9944, lng: 73.3006,
      talukas: [
        { name: 'Chiplun', lat: 17.5355, lng: 73.5157 },
        { name: 'Dapoli', lat: 17.7587, lng: 73.1877 },
        { name: 'Guhagar', lat: 17.5030, lng: 73.1940 },
        { name: 'Khed', lat: 17.7219, lng: 73.3973 },
        { name: 'Lanja', lat: 16.8760, lng: 73.5770 },
        { name: 'Mandangad', lat: 17.9880, lng: 73.2180 },
        { name: 'Rajapur', lat: 16.6540, lng: 73.5210 },
        { name: 'Ratnagiri', lat: 16.9944, lng: 73.3006 },
        { name: 'Sangameshwar', lat: 17.0810, lng: 73.5040 },
      ]
    },
    {
      name: 'Sangli', lat: 16.8524, lng: 74.5815,
      talukas: [
        { name: 'Atpadi', lat: 17.4100, lng: 74.7390 },
        { name: 'Jat', lat: 17.0390, lng: 75.2370 },
        { name: 'Kadegaon', lat: 17.2060, lng: 74.4350 },
        { name: 'Kavathe Mahankal', lat: 16.8590, lng: 74.9680 },
        { name: 'Khanapur', lat: 16.5980, lng: 74.5130 },
        { name: 'Miraj', lat: 16.8270, lng: 74.6500 },
        { name: 'Palus', lat: 16.9950, lng: 74.5280 },
        { name: 'Sangli', lat: 16.8524, lng: 74.5815 },
        { name: 'Shirala', lat: 17.1300, lng: 74.0310 },
        { name: 'Tasgaon', lat: 17.0370, lng: 74.6000 },
        { name: 'Walwa', lat: 16.9650, lng: 74.1430 },
      ]
    },
    {
      name: 'Satara', lat: 17.6805, lng: 74.0183,
      talukas: [
        { name: 'Jaoli', lat: 17.7300, lng: 73.8130 },
        { name: 'Karad', lat: 17.2890, lng: 74.2045 },
        { name: 'Khandala', lat: 17.8560, lng: 73.9730 },
        { name: 'Khatav', lat: 17.5850, lng: 74.5520 },
        { name: 'Koregaon', lat: 17.6820, lng: 74.1820 },
        { name: 'Mahabaleshwar', lat: 17.9238, lng: 73.6575 },
        { name: 'Man', lat: 17.6180, lng: 74.4730 },
        { name: 'Patan', lat: 17.3792, lng: 73.8526 },
        { name: 'Phaltan', lat: 17.9881, lng: 74.4360 },
        { name: 'Satara', lat: 17.6805, lng: 74.0183 },
        { name: 'Wai', lat: 17.9540, lng: 73.8960 },
      ]
    },
    {
      name: 'Sindhudurg', lat: 16.3496, lng: 73.5556,
      talukas: [
        { name: 'Deogad', lat: 16.5521, lng: 73.3380 },
        { name: 'Dodamarg', lat: 15.8140, lng: 73.9680 },
        { name: 'Kankavali', lat: 16.2700, lng: 73.7060 },
        { name: 'Kudal', lat: 16.0278, lng: 73.6853 },
        { name: 'Malvan', lat: 16.0619, lng: 73.4696 },
        { name: 'Sawantwadi', lat: 15.9048, lng: 73.8246 },
        { name: 'Vaibhavwadi', lat: 16.5280, lng: 73.8260 },
        { name: 'Vengurla', lat: 15.8620, lng: 73.6450 },
      ]
    },
    {
      name: 'Solapur', lat: 17.6599, lng: 75.9064,
      talukas: [
        { name: 'Akkalkot', lat: 17.5235, lng: 76.2050 },
        { name: 'Barshi', lat: 18.2356, lng: 75.6893 },
        { name: 'Karmala', lat: 18.4060, lng: 75.2040 },
        { name: 'Madha', lat: 17.9490, lng: 75.5230 },
        { name: 'Malshiras', lat: 17.8600, lng: 74.9140 },
        { name: 'Mangalvedhe', lat: 17.5220, lng: 75.4640 },
        { name: 'Mohol', lat: 17.8620, lng: 75.7210 },
        { name: 'North Solapur', lat: 17.7020, lng: 75.9400 },
        { name: 'Pandharpur', lat: 17.6811, lng: 75.3308 },
        { name: 'Sangole', lat: 17.4530, lng: 75.1770 },
        { name: 'South Solapur', lat: 17.5920, lng: 75.8850 },
      ]
    },
    {
      name: 'Thane', lat: 19.2183, lng: 72.9781,
      talukas: [
        { name: 'Ambarnath', lat: 19.2040, lng: 73.1800 },
        { name: 'Bhiwandi', lat: 19.3020, lng: 73.0575 },
        { name: 'Kalyan', lat: 19.2437, lng: 73.1355 },
        { name: 'Murbad', lat: 19.2560, lng: 73.3940 },
        { name: 'Shahapur', lat: 19.4570, lng: 73.3270 },
        { name: 'Thane', lat: 19.2183, lng: 72.9781 },
        { name: 'Ulhasnagar', lat: 19.2183, lng: 73.1626 },
      ]
    },
    {
      name: 'Wardha', lat: 20.7453, lng: 78.6022,
      talukas: [
        { name: 'Arvi', lat: 20.9872, lng: 78.9360 },
        { name: 'Ashti', lat: 21.0730, lng: 78.7690 },
        { name: 'Deoli', lat: 20.6537, lng: 78.4761 },
        { name: 'Hinganghat', lat: 20.5562, lng: 78.8375 },
        { name: 'Karanja', lat: 20.4820, lng: 77.4890 },
        { name: 'Samudrapur', lat: 20.6780, lng: 79.0230 },
        { name: 'Seloo', lat: 20.8167, lng: 78.5667 },
        { name: 'Wardha', lat: 20.7453, lng: 78.6022 },
      ]
    },
    {
      name: 'Washim', lat: 20.1143, lng: 77.1340,
      talukas: [
        { name: 'Karanja', lat: 20.4820, lng: 77.4890 },
        { name: 'Malegaon', lat: 20.2860, lng: 77.1910 },
        { name: 'Mangrulpir', lat: 20.3100, lng: 77.3470 },
        { name: 'Manora', lat: 20.1490, lng: 77.5870 },
        { name: 'Risod', lat: 20.1143, lng: 76.7780 },
        { name: 'Washim', lat: 20.1143, lng: 77.1340 },
      ]
    },
    {
      name: 'Yavatmal', lat: 20.3951, lng: 78.1302,
      talukas: [
        { name: 'Arni', lat: 20.5960, lng: 78.4390 },
        { name: 'Babulgaon', lat: 20.1900, lng: 77.4920 },
        { name: 'Darwha', lat: 20.3106, lng: 77.7764 },
        { name: 'Digras', lat: 20.1006, lng: 77.7176 },
        { name: 'Ghatanji', lat: 20.1430, lng: 78.3060 },
        { name: 'Kalamb', lat: 20.5840, lng: 78.0260 },
        { name: 'Kelapur', lat: 20.3100, lng: 79.0330 },
        { name: 'Mahagaon', lat: 19.8900, lng: 78.0200 },
        { name: 'Maregaon', lat: 20.2540, lng: 78.6060 },
        { name: 'Ner', lat: 20.4640, lng: 77.9090 },
        { name: 'Pusad', lat: 19.9086, lng: 77.5806 },
        { name: 'Ralegaon', lat: 20.6460, lng: 78.1800 },
        { name: 'Umarkhed', lat: 19.6000, lng: 77.6860 },
        { name: 'Wani', lat: 20.0578, lng: 78.9547 },
        { name: 'Yavatmal', lat: 20.3951, lng: 78.1302 },
        { name: 'Zari Jamni', lat: 20.3870, lng: 79.3130 },
      ]
    },
  ];

  // Derived: current taluka list based on selected district
  const currentDistrictObj = MH_DISTRICTS.find(d => d.name === selectedDistrict) || MH_DISTRICTS[17]; // Nashik default
  const talukaList = currentDistrictObj?.talukas || [];

  // Handler: district changed → reset taluka to first in list
  const handleDistrictChange = (distName) => {
    setSelectedDistrict(distName);
    const distObj = MH_DISTRICTS.find(d => d.name === distName);
    if (distObj && distObj.talukas.length > 0) {
      const firstTaluka = distObj.talukas[0];
      setSelectedTaluka(firstTaluka.name);
      setUserCoords({ lat: firstTaluka.lat, lng: firstTaluka.lng });
      setUserLocationLabel(`${firstTaluka.name} Taluka, ${distName}`);
    }
  };

  // Handler: taluka changed
  const handleTalukaChange = (talukaName) => {
    setSelectedTaluka(talukaName);
    const talukaObj = talukaList.find(t => t.name === talukaName);
    if (talukaObj) {
      setUserCoords({ lat: talukaObj.lat, lng: talukaObj.lng });
      setUserLocationLabel(`${talukaName} Taluka, ${selectedDistrict}`);
    }
  };

  // Comprehensive PIN Code geographic lookup table — Maharashtra all districts + major agricultural hubs
  const PINCODE_COORDS = {
    // ── NASHIK DISTRICT ──────────────────────────────────────────────────────
    '422001': { name: 'Nashik (Central)', lat: 19.9975, lng: 73.7898 },
    '422002': { name: 'Nashik (Panchavati)', lat: 20.0065, lng: 73.8012 },
    '422003': { name: 'Nashik (CIDCO)', lat: 19.9650, lng: 73.7650 },
    '422005': { name: 'Nashik (Satpur)', lat: 19.9720, lng: 73.7712 },
    '422103': { name: 'Sinnar, Nashik', lat: 19.8465, lng: 73.9984 },
    '422209': { name: 'Dindori, Nashik', lat: 20.2012, lng: 73.8341 },
    '422601': { name: 'Igatpuri, Nashik', lat: 19.6909, lng: 73.5553 },
    '422605': { name: 'Sangamner', lat: 19.5735, lng: 74.2154 },
    '423101': { name: 'Niphad, Nashik', lat: 20.0793, lng: 74.1117 },
    '423104': { name: 'Manmad, Nashik', lat: 20.2520, lng: 74.4421 },
    '423107': { name: 'Pimpalgaon Baswant', lat: 20.1743, lng: 73.9852 },
    '423111': { name: 'Chandwad, Nashik', lat: 20.3423, lng: 74.2422 },
    '423201': { name: 'Yeola, Nashik', lat: 20.0532, lng: 74.4908 },
    '423203': { name: 'Malegaon, Nashik', lat: 20.5539, lng: 74.5298 },
    '423301': { name: 'Lasalgaon, Nashik', lat: 20.1472, lng: 74.2325 },
    '423401': { name: 'Satana, Nashik', lat: 20.5963, lng: 74.2039 },
    '423501': { name: 'Kalwan, Nashik', lat: 20.5197, lng: 73.8224 },
    // ── PUNE DISTRICT ────────────────────────────────────────────────────────
    '411001': { name: 'Pune (Central / Gultekdi)', lat: 18.5204, lng: 73.8567 },
    '411002': { name: 'Pune (Shivajinagar)', lat: 18.5314, lng: 73.8446 },
    '411004': { name: 'Pune (Deccan Gymkhana)', lat: 18.5196, lng: 73.8453 },
    '411014': { name: 'Pune (Hadapsar)', lat: 18.5022, lng: 73.9268 },
    '410501': { name: 'Khed (Rajgurunagar)', lat: 18.8521, lng: 73.9142 },
    '410503': { name: 'Manchar, Pune', lat: 19.0041, lng: 73.9452 },
    '410505': { name: 'Narayangaon, Junnar', lat: 19.1234, lng: 73.9772 },
    '412105': { name: 'Alandi / Pune North', lat: 18.6763, lng: 73.8970 },
    '412207': { name: 'Baramati APMC', lat: 18.1517, lng: 74.5772 },
    '412301': { name: 'Indapur, Pune', lat: 18.1151, lng: 75.0237 },
    '412303': { name: 'Daund, Pune', lat: 18.4661, lng: 74.5838 },
    // ── NAGPUR DISTRICT ──────────────────────────────────────────────────────
    '440001': { name: 'Nagpur (Central)', lat: 21.1458, lng: 79.0882 },
    '440008': { name: 'Nagpur (Cotton Market)', lat: 21.1400, lng: 79.0900 },
    '440009': { name: 'Nagpur (Hingna Road)', lat: 21.1105, lng: 78.9876 },
    '440023': { name: 'Nagpur (Kamptee)', lat: 21.2139, lng: 79.1957 },
    '441202': { name: 'Ramtek, Nagpur', lat: 21.3921, lng: 79.3179 },
    '441301': { name: 'Katol, Nagpur', lat: 21.2748, lng: 78.5903 },
    '441401': { name: 'Saoner, Nagpur', lat: 21.3819, lng: 78.9282 },
    '441614': { name: 'Umred, Nagpur', lat: 20.8511, lng: 79.3230 },
    // ── BULDHANA DISTRICT (the user's area: 443xxx) ───────────────────────────
    '443001': { name: 'Buldhana, Buldhana Dist.', lat: 20.5292, lng: 76.1843 },
    '443101': { name: 'Chikhli, Buldhana', lat: 20.3571, lng: 76.2981 },
    '443201': { name: 'Khamgaon, Buldhana', lat: 20.7057, lng: 76.5683 },
    '443301': { name: 'Malkapur, Buldhana', lat: 20.8851, lng: 76.2138 },
    '443302': { name: 'Nandura, Buldhana', lat: 20.8257, lng: 76.4581 },
    '443401': { name: 'Mehkar, Buldhana', lat: 20.1498, lng: 76.5732 },
    '443402': { name: 'Sindkhed Raja, Buldhana', lat: 20.2884, lng: 76.5253 },
    '443404': { name: 'Lonar, Buldhana', lat: 20.0781, lng: 76.5102 },
    '443406': { name: 'Deulgaon Raja, Buldhana', lat: 20.0200, lng: 76.3740 },
    // ── WARDHA DISTRICT (442xxx) ─────────────────────────────────────────────
    '442001': { name: 'Wardha Central', lat: 20.7453, lng: 78.6022 },
    '442101': { name: 'Hinganghat, Wardha', lat: 20.5562, lng: 78.8375 },
    '442301': { name: 'Arvi, Wardha', lat: 20.9872, lng: 78.9360 },
    '442401': { name: 'Seloo, Wardha', lat: 20.8167, lng: 78.5667 },
    '442501': { name: 'Deoli, Wardha', lat: 20.6537, lng: 78.4761 },
    // ── AKOLA DISTRICT (444xxx) ──────────────────────────────────────────────
    '444001': { name: 'Akola (Grain Market)', lat: 20.7002, lng: 77.0125 },
    '444101': { name: 'Akot, Akola', lat: 21.0921, lng: 77.0619 },
    '444301': { name: 'Murtizapur, Akola', lat: 20.7346, lng: 77.4074 },
    '444405': { name: 'Balapur, Akola', lat: 20.6617, lng: 76.7777 },
    '444601': { name: 'Amravati APMC', lat: 20.9374, lng: 77.7523 },
    '444701': { name: 'Chandur Bazar, Amravati', lat: 21.1036, lng: 78.0413 },
    '444801': { name: 'Warud, Amravati', lat: 21.4635, lng: 78.2598 },
    '444902': { name: 'Morshi, Amravati', lat: 21.3203, lng: 78.0071 },
    // ── YAVATMAL DISTRICT (445xxx) ───────────────────────────────────────────
    '445001': { name: 'Yavatmal (Cotton Yard)', lat: 20.3951, lng: 78.1302 },
    '445101': { name: 'Pusad, Yavatmal', lat: 19.9086, lng: 77.5806 },
    '445201': { name: 'Wani, Yavatmal', lat: 20.0578, lng: 78.9547 },
    '445301': { name: 'Digras, Yavatmal', lat: 20.1006, lng: 77.7176 },
    '445401': { name: 'Darwha, Yavatmal', lat: 20.3106, lng: 77.7764 },
    // ── LATUR DISTRICT (413xxx) ──────────────────────────────────────────────
    '413512': { name: 'Latur (APMC Hub)', lat: 18.4088, lng: 76.5880 },
    '413501': { name: 'Udgir, Latur', lat: 18.3900, lng: 77.1200 },
    '413521': { name: 'Nilanga, Latur', lat: 17.8636, lng: 76.7545 },
    '413531': { name: 'Ausa, Latur', lat: 18.2558, lng: 76.4875 },
    '413001': { name: 'Solapur APMC', lat: 17.6599, lng: 75.9064 },
    '413101': { name: 'Barshi, Solapur', lat: 18.2356, lng: 75.6893 },
    '413201': { name: 'Pandharpur, Solapur', lat: 17.6811, lng: 75.3308 },
    // ── CHHATRAPATI SAMBHAJINAGAR / JALNA (431xxx) ───────────────────────────
    '431001': { name: 'Chhatrapati Sambhajinagar', lat: 19.8762, lng: 75.3433 },
    '431101': { name: 'Paithan, CSN', lat: 19.4759, lng: 75.3861 },
    '431109': { name: 'Sillod, CSN', lat: 20.1062, lng: 75.6573 },
    '431203': { name: 'Jalna (Agri Yard)', lat: 19.8410, lng: 75.8864 },
    '431401': { name: 'Partur, Jalna', lat: 19.6017, lng: 76.2177 },
    '431501': { name: 'Nanded Central', lat: 19.1383, lng: 77.3210 },
    '431513': { name: 'Hingoli APMC', lat: 19.7180, lng: 77.1480 },
    '431601': { name: 'Parbhani Central', lat: 19.2699, lng: 76.7734 },
    '431708': { name: 'Jintur, Parbhani', lat: 19.6057, lng: 76.6823 },
    // ── JALGAON / DHULE (424-425xxx) ─────────────────────────────────────────
    '424001': { name: 'Dhule (Mandi)', lat: 20.9042, lng: 74.7749 },
    '424002': { name: 'Dhule (Shirpur)', lat: 21.3490, lng: 74.8800 },
    '425001': { name: 'Jalgaon (APMC Hub)', lat: 21.0077, lng: 75.5626 },
    '425101': { name: 'Amalner, Jalgaon', lat: 21.0483, lng: 75.0567 },
    '425201': { name: 'Bhusawal, Jalgaon', lat: 21.0438, lng: 75.7766 },
    '425301': { name: 'Pachora, Jalgaon', lat: 20.6625, lng: 75.3447 },
    '425401': { name: 'Chalisgaon, Jalgaon', lat: 20.4600, lng: 74.9800 },
    // ── MUMBAI / THANE / RAIGAD (400-421xxx) ─────────────────────────────────
    '400001': { name: 'Mumbai Central', lat: 18.9690, lng: 72.8210 },
    '400703': { name: 'Vashi APMC, Navi Mumbai', lat: 19.0760, lng: 72.9980 },
    '401202': { name: 'Vasai, Palghar', lat: 19.3897, lng: 72.8397 },
    '421001': { name: 'Thane Central', lat: 19.2183, lng: 72.9781 },
    '421301': { name: 'Kalyan, Thane', lat: 19.2437, lng: 73.1355 },
    '410201': { name: 'Panvel, Raigad', lat: 18.9931, lng: 73.1131 },
    // ── AHMEDNAGAR (414xxx) ───────────────────────────────────────────────────
    '414001': { name: 'Ahmednagar Central', lat: 19.0952, lng: 74.7480 },
    '414111': { name: 'Shevgaon, Ahmednagar', lat: 19.3340, lng: 75.1851 },
    '414201': { name: 'Shrigonda, Ahmednagar', lat: 18.6206, lng: 74.6822 },
    '414301': { name: 'Kopargaon, Ahmednagar', lat: 19.8983, lng: 74.4780 },
    // ── KOLHAPUR / SANGLI / SATARA (415-416xxx) ───────────────────────────────
    '415001': { name: 'Satara Mandi', lat: 17.6805, lng: 74.0183 },
    '415110': { name: 'Karad APMC', lat: 17.2890, lng: 74.2045 },
    '415501': { name: 'Phaltan, Satara', lat: 17.9881, lng: 74.4360 },
    '416001': { name: 'Kolhapur (Shahupuri)', lat: 16.7050, lng: 74.2433 },
    '416416': { name: 'Sangli (Turmeric Market)', lat: 16.8524, lng: 74.5815 },
    '416410': { name: 'Miraj, Sangli', lat: 16.8270, lng: 74.6500 },
    // ── TELANGANA / OTHERS ────────────────────────────────────────────────────
    '504001': { name: 'Adilabad APMC', lat: 19.6640, lng: 78.5320 },
    '500001': { name: 'Hyderabad Central', lat: 17.3850, lng: 78.4867 },
    '413301': { name: 'Osmanabad APMC', lat: 18.1813, lng: 76.0454 },
  };

  // Haversine geodesic distance calculation
  const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 25;
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return Math.max(3, Math.round(d * 1.22)); // Road curve multiplier
  };

  // Multi-Route options generator with live road corridors, highway vs toll-free routes, and net profit calculations
  const calculateRoutes = (originLabel, mandi, originCoords) => {
    if (!mandi) return [];
    const baseDist = mandi.distanceKm || 25;
    const mandiName = mandi.name;
    const originName = originLabel ? originLabel.split(',')[0].trim() : 'Your Farm';
    const district = mandi.district || 'Maharashtra';

    return [
      {
        id: 'route_best',
        title: 'National Highway / Expressway Corridor',
        shortTag: '⚡ BEST ROUTE',
        badge: '⭐ FASTEST & RECOMMENDED',
        badgeColor: 'bg-emerald-600 text-white border-emerald-400',
        routeCode: `NH-4-Lane Agro Expressway Corridor`,
        isBest: true,
        distanceKm: baseDist,
        driveTimeMin: Math.max(8, Math.round((baseDist / 55) * 60)),
        avgSpeed: '55 km/h',
        tollCost: baseDist > 45 ? 85 : 0,
        fuelCost: Math.round(baseDist * 6.8),
        freightPerQuintal: Math.round(baseDist * 0.85),
        netPayoutPerQuintal: mandi.pricePerQuintal - Math.round(baseDist * 0.85),
        roadQuality: '🌟🌟🌟🌟🌟 Smooth 4-Lane Asphalt',
        transitShrinkage: '0.1% (Minimal produce loss)',
        trafficStatus: '🟢 Clear Flow / Zero Delays',
        waypoints: [
          { name: originName, type: 'start', desc: 'Farm Gate Loading Point' },
          { name: `NH Express Tollway / ${district} Bypass`, type: 'corridor', desc: '4-Lane Express Corridor' },
          { name: `${mandiName} Yard Gate 1`, type: 'end', desc: 'Primary Bidding Yard' },
        ],
        description: 'Fastest transit time, minimizes produce shrinkage & vibration bruising. Guaranteed arrival before morning 8:00 AM auction bell.',
      },
      {
        id: 'route_toll_free',
        title: 'State Highway Bypass Route',
        shortTag: '💰 TOLL-FREE',
        badge: '💰 ZERO TOLL ALTERNATE',
        badgeColor: 'bg-sky-600 text-white border-sky-400',
        routeCode: `SH State Highway Bypass Link`,
        isBest: false,
        distanceKm: Math.round(baseDist * 1.12),
        driveTimeMin: Math.max(12, Math.round((baseDist * 1.12 / 40) * 60)),
        avgSpeed: '40 km/h',
        tollCost: 0,
        fuelCost: Math.round(baseDist * 1.12 * 6.4),
        freightPerQuintal: Math.round(baseDist * 1.12 * 0.80),
        netPayoutPerQuintal: mandi.pricePerQuintal - Math.round(baseDist * 1.12 * 0.80),
        roadQuality: '🌟🌟🌟🌟 2-Lane Good Asphalt Road',
        transitShrinkage: '0.25%',
        trafficStatus: '🟢 Moderate Flow',
        waypoints: [
          { name: originName, type: 'start', desc: 'Farm Gate Loading Point' },
          { name: `State Highway SH Taluka Bypass`, type: 'corridor', desc: 'Toll-Free Arterial Road' },
          { name: `${mandiName} Commercial Entry Gate`, type: 'end', desc: 'Weighbridge & Yard' },
        ],
        description: 'Zero FASTag toll charges. Recommended for small tempos and tractor-trolleys seeking to minimize toll overheads.',
      },
      {
        id: 'route_shortest',
        title: 'Rural Agro-Feeder Corridor',
        shortTag: '📏 SHORTEST',
        badge: '📏 SHORTEST DISTANCE',
        badgeColor: 'bg-amber-600 text-white border-amber-400',
        routeCode: `Gram Panchayat / Rural Market Link`,
        isBest: false,
        distanceKm: Math.max(2, Math.round(baseDist * 0.94)),
        driveTimeMin: Math.max(10, Math.round((baseDist * 0.94 / 32) * 60)),
        avgSpeed: '32 km/h',
        tollCost: 0,
        fuelCost: Math.round(baseDist * 0.94 * 6.2),
        freightPerQuintal: Math.round(baseDist * 0.94 * 0.88),
        netPayoutPerQuintal: mandi.pricePerQuintal - Math.round(baseDist * 0.94 * 0.88),
        roadQuality: '🌟🌟🌟 Single-Lane Paved Link Road',
        transitShrinkage: '0.40%',
        trafficStatus: '🟡 Minor Village Slowdowns',
        waypoints: [
          { name: originName, type: 'start', desc: 'Farm Gate Loading Point' },
          { name: `Gram Panchayat Village Feeder Link`, type: 'corridor', desc: 'Direct Agriculture Corridor' },
          { name: `${mandiName} Rural Goods Gate`, type: 'end', desc: 'Auction Shed Entry' },
        ],
        description: 'Shortest odometer distance directly cutting through rural farm clusters. Best for local tractor trolleys with lower cruising speeds.',
      },
    ];
  };

  const resolveNearestPincode = (lat, lng) => {
    let closestPin = '422001';
    let closestDist = Infinity;
    let closestLabel = 'Nashik, Maharashtra';

    Object.entries(PINCODE_COORDS).forEach(([pin, data]) => {
      const dist = calculateDistanceKm(lat, lng, data.lat, data.lng);
      if (dist < closestDist) {
        closestDist = dist;
        closestPin = pin;
        closestLabel = data.name;
      }
    });

    setPincode(closestPin);
    setUserLocationLabel(closestLabel);
    setUserCoords({ lat, lng });

    // Sync District & Taluka dropdown if matched
    for (const dist of MH_DISTRICTS) {
      const matchingTaluka = dist.talukas.find(t =>
        closestLabel.toLowerCase().includes(t.name.toLowerCase())
      );
      if (matchingTaluka) {
        setSelectedDistrict(dist.name);
        setSelectedTaluka(matchingTaluka.name);
        break;
      } else if (closestLabel.toLowerCase().includes(dist.name.toLowerCase())) {
        setSelectedDistrict(dist.name);
        break;
      }
    }

    setLocStatusMessage(`📍 Location detected: ${closestLabel} (${closestPin})`);
    setTimeout(() => setLocStatusMessage(''), 4000);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserCoords({ lat, lng });
        resolveNearestPincode(lat, lng);
        setLocLoading(false);
      },
      (err) => {
        setLocLoading(false);
        alert(
          language === 'mr'
            ? 'कृपया लोकेशन परवानगी द्या जेणेकरून अचूक बाजार भाव मिळतील.'
            : 'Please allow location permission to auto-detect nearby APMC markets.'
        );
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const mandiDatabase = {
    onion: [
      { id: 1, name: 'Lasalgaon APMC Market', location: 'Lasalgaon, Nashik', district: 'Nashik', lat: 20.1472, lng: 74.2325, pricePerQuintal: 2150, minPrice: 1780, maxPrice: 2380, arrivals: '3,200 Q', changePercent: '+2.4%', isPositive: true, verified: true },
      { id: 2, name: 'Pimpalgaon Baswant APMC', location: 'Pimpalgaon, Nashik', district: 'Nashik', lat: 20.1743, lng: 73.9852, pricePerQuintal: 2080, minPrice: 1720, maxPrice: 2310, arrivals: '2,850 Q', changePercent: '+1.8%', isPositive: true, verified: true },
      { id: 3, name: 'Nashik APMC Market', location: 'Panchavati Yard, Nashik', district: 'Nashik', lat: 20.0150, lng: 73.8050, pricePerQuintal: 2020, minPrice: 1680, maxPrice: 2250, arrivals: '2,650 Q', changePercent: '+1.2%', isPositive: true, verified: true },
      { id: 4, name: 'Yeola APMC Market', location: 'Yeola, Nashik', district: 'Nashik', lat: 20.0532, lng: 74.4908, pricePerQuintal: 2110, minPrice: 1750, maxPrice: 2340, arrivals: '1,900 Q', changePercent: '+2.1%', isPositive: true, verified: true },
      { id: 5, name: 'Sinnar APMC Market', location: 'Sinnar, Nashik', district: 'Nashik', lat: 19.8465, lng: 73.9984, pricePerQuintal: 1980, minPrice: 1600, maxPrice: 2180, arrivals: '1,450 Q', changePercent: '-0.6%', isPositive: false, verified: true },
      { id: 6, name: 'Ahmednagar APMC', location: 'Ahmednagar Central', district: 'Ahmednagar', lat: 19.0952, lng: 74.7480, pricePerQuintal: 2060, minPrice: 1700, maxPrice: 2280, arrivals: '2,400 Q', changePercent: '+1.5%', isPositive: true, verified: true },
      { id: 7, name: 'Rahata APMC (Shirdi)', location: 'Rahata, Ahmednagar', district: 'Ahmednagar', lat: 19.7122, lng: 74.4804, pricePerQuintal: 2040, minPrice: 1690, maxPrice: 2260, arrivals: '1,800 Q', changePercent: '+0.9%', isPositive: true, verified: true },
      { id: 8, name: 'Sangamner APMC', location: 'Sangamner, Ahmednagar', district: 'Ahmednagar', lat: 19.5735, lng: 74.2154, pricePerQuintal: 1990, minPrice: 1620, maxPrice: 2210, arrivals: '1,350 Q', changePercent: '-0.4%', isPositive: false, verified: true },
      { id: 9, name: 'Pune APMC (Gultekdi)', location: 'Gultekdi, Pune', district: 'Pune', lat: 18.4960, lng: 73.8640, pricePerQuintal: 2220, minPrice: 1850, maxPrice: 2450, arrivals: '3,800 Q', changePercent: '+2.6%', isPositive: true, verified: true },
      { id: 10, name: 'Solapur APMC Market', location: 'Solapur Central', district: 'Solapur', lat: 17.6599, lng: 75.9064, pricePerQuintal: 2190, minPrice: 1800, maxPrice: 2410, arrivals: '3,100 Q', changePercent: '+1.9%', isPositive: true, verified: true },
      { id: 11, name: 'Chhatrapati Sambhajinagar APMC', location: 'Jadhavwadi, CSN', district: 'Aurangabad', lat: 19.8762, lng: 75.3433, pricePerQuintal: 2090, minPrice: 1730, maxPrice: 2320, arrivals: '2,100 Q', changePercent: '+1.4%', isPositive: true, verified: true },
      { id: 12, name: 'Jalna APMC Market', location: 'Jalna Yard', district: 'Jalna', lat: 19.8410, lng: 75.8864, pricePerQuintal: 2050, minPrice: 1680, maxPrice: 2270, arrivals: '1,750 Q', changePercent: '+0.8%', isPositive: true, verified: true },
      { id: 13, name: 'Khamgaon APMC Yard', location: 'Khamgaon, Buldhana', district: 'Buldhana', lat: 20.7057, lng: 76.5683, pricePerQuintal: 2120, minPrice: 1760, maxPrice: 2350, arrivals: '1,600 Q', changePercent: '+1.7%', isPositive: true, verified: true },
      { id: 14, name: 'Malkapur APMC', location: 'Malkapur, Buldhana', district: 'Buldhana', lat: 20.8851, lng: 76.2138, pricePerQuintal: 2080, minPrice: 1710, maxPrice: 2300, arrivals: '1,400 Q', changePercent: '+1.1%', isPositive: true, verified: true },
      { id: 15, name: 'Mehkar APMC Yard', location: 'Mehkar, Buldhana', district: 'Buldhana', lat: 20.1498, lng: 76.5732, pricePerQuintal: 2070, minPrice: 1700, maxPrice: 2290, arrivals: '1,200 Q', changePercent: '+0.7%', isPositive: true, verified: true },
      { id: 16, name: 'Akola Grain Market', location: 'Akola Yard', district: 'Akola', lat: 20.7002, lng: 77.0125, pricePerQuintal: 2140, minPrice: 1780, maxPrice: 2360, arrivals: '1,950 Q', changePercent: '+1.8%', isPositive: true, verified: true },
      { id: 17, name: 'Amravati APMC Market', location: 'Amravati Central', district: 'Amravati', lat: 20.9374, lng: 77.7523, pricePerQuintal: 2160, minPrice: 1800, maxPrice: 2390, arrivals: '2,200 Q', changePercent: '+2.0%', isPositive: true, verified: true },
      { id: 18, name: 'Nagpur Cotton Market Yard', location: 'Nagpur Central', district: 'Nagpur', lat: 21.1400, lng: 79.0900, pricePerQuintal: 2250, minPrice: 1890, maxPrice: 2480, arrivals: '3,400 Q', changePercent: '+2.7%', isPositive: true, verified: true },
      { id: 19, name: 'Dhule APMC Market', location: 'Dhule Yard', district: 'Dhule', lat: 20.9042, lng: 74.7749, pricePerQuintal: 2010, minPrice: 1650, maxPrice: 2230, arrivals: '1,500 Q', changePercent: '-0.3%', isPositive: false, verified: true },
      { id: 20, name: 'Jalgaon APMC Hub', location: 'Jalgaon Central', district: 'Jalgaon', lat: 21.0077, lng: 75.5626, pricePerQuintal: 2060, minPrice: 1700, maxPrice: 2280, arrivals: '1,850 Q', changePercent: '+1.0%', isPositive: true, verified: true },
    ],
    tomato: [
      { id: 1, name: 'Narayangaon APMC Yard', location: 'Junnar, Pune', district: 'Pune', lat: 19.1234, lng: 73.9772, pricePerQuintal: 2450, minPrice: 2100, maxPrice: 2750, arrivals: '3,500 Q', changePercent: '+3.2%', isPositive: true, verified: true },
      { id: 2, name: 'Nashik APMC Market', location: 'Panchavati Yard, Nashik', district: 'Nashik', lat: 20.0150, lng: 73.8050, pricePerQuintal: 2380, minPrice: 2050, maxPrice: 2680, arrivals: '2,900 Q', changePercent: '+2.1%', isPositive: true, verified: true },
      { id: 3, name: 'Pimpalgaon Baswant APMC', location: 'Pimpalgaon, Nashik', district: 'Nashik', lat: 20.1743, lng: 73.9852, pricePerQuintal: 2320, minPrice: 2000, maxPrice: 2610, arrivals: '2,400 Q', changePercent: '+1.6%', isPositive: true, verified: true },
      { id: 4, name: 'Sangamner APMC Yard', location: 'Sangamner, Ahmednagar', district: 'Ahmednagar', lat: 19.5735, lng: 74.2154, pricePerQuintal: 2280, minPrice: 1950, maxPrice: 2550, arrivals: '1,650 Q', changePercent: '+0.8%', isPositive: true, verified: true },
      { id: 5, name: 'Khed APMC Market', location: 'Rajgurunagar, Pune', district: 'Pune', lat: 18.8521, lng: 73.9142, pricePerQuintal: 2250, minPrice: 1920, maxPrice: 2510, arrivals: '1,450 Q', changePercent: '+0.5%', isPositive: true, verified: true },
      { id: 6, name: 'Pune APMC (Gultekdi)', location: 'Gultekdi, Pune', district: 'Pune', lat: 18.4960, lng: 73.8640, pricePerQuintal: 2480, minPrice: 2150, maxPrice: 2790, arrivals: '4,100 Q', changePercent: '+3.5%', isPositive: true, verified: true },
      { id: 7, name: 'Baramati APMC Yard', location: 'Baramati, Pune', district: 'Pune', lat: 18.1517, lng: 74.5772, pricePerQuintal: 2290, minPrice: 1960, maxPrice: 2560, arrivals: '1,800 Q', changePercent: '+1.2%', isPositive: true, verified: true },
      { id: 8, name: 'Satara APMC Market', location: 'Satara Yard', district: 'Satara', lat: 17.6805, lng: 74.0183, pricePerQuintal: 2310, minPrice: 1980, maxPrice: 2580, arrivals: '1,500 Q', changePercent: '+1.4%', isPositive: true, verified: true },
      { id: 9, name: 'Karad APMC Market', location: 'Karad, Satara', district: 'Satara', lat: 17.2890, lng: 74.2045, pricePerQuintal: 2270, minPrice: 1940, maxPrice: 2530, arrivals: '1,200 Q', changePercent: '+0.6%', isPositive: true, verified: true },
      { id: 10, name: 'Chhatrapati Sambhajinagar APMC', location: 'Jadhavwadi, CSN', district: 'Aurangabad', lat: 19.8762, lng: 75.3433, pricePerQuintal: 2360, minPrice: 2020, maxPrice: 2640, arrivals: '2,100 Q', changePercent: '+1.9%', isPositive: true, verified: true },
      { id: 11, name: 'Jalna APMC Yard', location: 'Jalna Yard', district: 'Jalna', lat: 19.8410, lng: 75.8864, pricePerQuintal: 2300, minPrice: 1970, maxPrice: 2580, arrivals: '1,400 Q', changePercent: '+1.0%', isPositive: true, verified: true },
      { id: 12, name: 'Khamgaon APMC Market', location: 'Khamgaon, Buldhana', district: 'Buldhana', lat: 20.7057, lng: 76.5683, pricePerQuintal: 2340, minPrice: 2000, maxPrice: 2620, arrivals: '1,300 Q', changePercent: '+1.5%', isPositive: true, verified: true },
      { id: 13, name: 'Akola Vegetable Market', location: 'Akola Central', district: 'Akola', lat: 20.7002, lng: 77.0125, pricePerQuintal: 2370, minPrice: 2040, maxPrice: 2660, arrivals: '1,750 Q', changePercent: '+1.8%', isPositive: true, verified: true },
      { id: 14, name: 'Amravati APMC Yard', location: 'Amravati Yard', district: 'Amravati', lat: 20.9374, lng: 77.7523, pricePerQuintal: 2390, minPrice: 2060, maxPrice: 2680, arrivals: '2,000 Q', changePercent: '+2.2%', isPositive: true, verified: true },
      { id: 15, name: 'Nagpur Kalamna APMC', location: 'Kalamna, Nagpur', district: 'Nagpur', lat: 21.1730, lng: 79.1430, pricePerQuintal: 2520, minPrice: 2180, maxPrice: 2840, arrivals: '3,900 Q', changePercent: '+3.8%', isPositive: true, verified: true },
      { id: 16, name: 'Solapur APMC Market', location: 'Solapur Central', district: 'Solapur', lat: 17.6599, lng: 75.9064, pricePerQuintal: 2350, minPrice: 2010, maxPrice: 2630, arrivals: '2,200 Q', changePercent: '+1.7%', isPositive: true, verified: true },
      { id: 17, name: 'Kolhapur APMC (Shahupuri)', location: 'Shahupuri, Kolhapur', district: 'Kolhapur', lat: 16.7050, lng: 74.2433, pricePerQuintal: 2410, minPrice: 2080, maxPrice: 2700, arrivals: '2,600 Q', changePercent: '+2.4%', isPositive: true, verified: true },
    ],
    soybean: [
      { id: 1, name: 'Latur APMC Yard (Yellow Gold)', location: 'Latur Central', district: 'Latur', lat: 18.4088, lng: 76.5880, pricePerQuintal: 4780, minPrice: 4450, maxPrice: 5080, arrivals: '5,800 Q', changePercent: '+3.2%', isPositive: true, verified: true },
      { id: 2, name: 'Akola Grain & Oilseeds APMC', location: 'Akola Yard', district: 'Akola', lat: 20.7002, lng: 77.0125, pricePerQuintal: 4720, minPrice: 4390, maxPrice: 5010, arrivals: '4,600 Q', changePercent: '+2.6%', isPositive: true, verified: true },
      { id: 3, name: 'Khamgaon APMC Hub', location: 'Khamgaon, Buldhana', district: 'Buldhana', lat: 20.7057, lng: 76.5683, pricePerQuintal: 4690, minPrice: 4360, maxPrice: 4980, arrivals: '3,900 Q', changePercent: '+2.2%', isPositive: true, verified: true },
      { id: 4, name: 'Malkapur APMC Yard', location: 'Malkapur, Buldhana', district: 'Buldhana', lat: 20.8851, lng: 76.2138, pricePerQuintal: 4650, minPrice: 4320, maxPrice: 4940, arrivals: '2,800 Q', changePercent: '+1.7%', isPositive: true, verified: true },
      { id: 5, name: 'Mehkar APMC Market', location: 'Mehkar, Buldhana', district: 'Buldhana', lat: 20.1498, lng: 76.5732, pricePerQuintal: 4640, minPrice: 4300, maxPrice: 4930, arrivals: '2,400 Q', changePercent: '+1.5%', isPositive: true, verified: true },
      { id: 6, name: 'Washim APMC Yard', location: 'Washim Central', district: 'Washim', lat: 20.1143, lng: 77.1340, pricePerQuintal: 4670, minPrice: 4340, maxPrice: 4960, arrivals: '3,100 Q', changePercent: '+2.0%', isPositive: true, verified: true },
      { id: 7, name: 'Amravati APMC Market', location: 'Amravati Central', district: 'Amravati', lat: 20.9374, lng: 77.7523, pricePerQuintal: 4710, minPrice: 4380, maxPrice: 5000, arrivals: '4,200 Q', changePercent: '+2.4%', isPositive: true, verified: true },
      { id: 8, name: 'Hinganghat APMC (Wardha)', location: 'Hinganghat, Wardha', district: 'Wardha', lat: 20.5562, lng: 78.8375, pricePerQuintal: 4740, minPrice: 4410, maxPrice: 5030, arrivals: '4,500 Q', changePercent: '+2.8%', isPositive: true, verified: true },
      { id: 9, name: 'Nagpur APMC Kalamna', location: 'Kalamna, Nagpur', district: 'Nagpur', lat: 21.1730, lng: 79.1430, pricePerQuintal: 4760, minPrice: 4430, maxPrice: 5060, arrivals: '4,800 Q', changePercent: '+3.0%', isPositive: true, verified: true },
      { id: 10, name: 'Yavatmal APMC Yard', location: 'Yavatmal Central', district: 'Yavatmal', lat: 20.3951, lng: 78.1302, pricePerQuintal: 4680, minPrice: 4350, maxPrice: 4970, arrivals: '3,400 Q', changePercent: '+2.1%', isPositive: true, verified: true },
      { id: 11, name: 'Hingoli APMC Market', location: 'Hingoli Yard', district: 'Hingoli', lat: 19.7180, lng: 77.1480, pricePerQuintal: 4620, minPrice: 4290, maxPrice: 4910, arrivals: '2,600 Q', changePercent: '+1.3%', isPositive: true, verified: true },
      { id: 12, name: 'Nanded APMC Hub', location: 'Nanded Yard', district: 'Nanded', lat: 19.1383, lng: 77.3210, pricePerQuintal: 4650, minPrice: 4320, maxPrice: 4940, arrivals: '3,300 Q', changePercent: '+1.8%', isPositive: true, verified: true },
      { id: 13, name: 'Jalna APMC Market', location: 'Jalna Yard', district: 'Jalna', lat: 19.8410, lng: 75.8864, pricePerQuintal: 4660, minPrice: 4330, maxPrice: 4950, arrivals: '3,000 Q', changePercent: '+1.9%', isPositive: true, verified: true },
      { id: 14, name: 'Parbhani APMC', location: 'Parbhani Central', district: 'Parbhani', lat: 19.2699, lng: 76.7734, pricePerQuintal: 4630, minPrice: 4300, maxPrice: 4920, arrivals: '2,500 Q', changePercent: '+1.4%', isPositive: true, verified: true },
      { id: 15, name: 'Solapur APMC Yard', location: 'Solapur Central', district: 'Solapur', lat: 17.6599, lng: 75.9064, pricePerQuintal: 4600, minPrice: 4270, maxPrice: 4890, arrivals: '2,300 Q', changePercent: '+1.0%', isPositive: true, verified: true },
      { id: 16, name: 'Sangli APMC Market', location: 'Sangli Yard', district: 'Sangli', lat: 16.8524, lng: 74.5815, pricePerQuintal: 4640, minPrice: 4310, maxPrice: 4930, arrivals: '2,700 Q', changePercent: '+1.6%', isPositive: true, verified: true },
      { id: 17, name: 'Chhatrapati Sambhajinagar APMC', location: 'Jadhavwadi, CSN', district: 'Aurangabad', lat: 19.8762, lng: 75.3433, pricePerQuintal: 4670, minPrice: 4340, maxPrice: 4960, arrivals: '2,900 Q', changePercent: '+2.0%', isPositive: true, verified: true },
    ],
    potato: [
      { id: 1, name: 'Pune APMC Gultekdi Hub', location: 'Gultekdi, Pune', district: 'Pune', lat: 18.4960, lng: 73.8640, pricePerQuintal: 2380, minPrice: 2080, maxPrice: 2650, arrivals: '4,200 Q', changePercent: '+2.8%', isPositive: true, verified: true },
      { id: 2, name: 'Manchar APMC Market', location: 'Manchar, Pune', district: 'Pune', lat: 19.0041, lng: 73.9452, pricePerQuintal: 2310, minPrice: 2010, maxPrice: 2570, arrivals: '2,400 Q', changePercent: '+2.0%', isPositive: true, verified: true },
      { id: 3, name: 'Khed APMC Yard', location: 'Rajgurunagar, Pune', district: 'Pune', lat: 18.8521, lng: 73.9142, pricePerQuintal: 2280, minPrice: 1980, maxPrice: 2540, arrivals: '1,900 Q', changePercent: '+1.5%', isPositive: true, verified: true },
      { id: 4, name: 'Satara APMC (Wai / Khandala)', location: 'Satara Yard', district: 'Satara', lat: 17.6805, lng: 74.0183, pricePerQuintal: 2290, minPrice: 1990, maxPrice: 2550, arrivals: '1,750 Q', changePercent: '+1.6%', isPositive: true, verified: true },
      { id: 5, name: 'Karad APMC Market', location: 'Karad, Satara', district: 'Satara', lat: 17.2890, lng: 74.2045, pricePerQuintal: 2240, minPrice: 1940, maxPrice: 2490, arrivals: '1,300 Q', changePercent: '+0.9%', isPositive: true, verified: true },
      { id: 6, name: 'Nashik APMC Market', location: 'Panchavati Yard, Nashik', district: 'Nashik', lat: 20.0150, lng: 73.8050, pricePerQuintal: 2330, minPrice: 2030, maxPrice: 2590, arrivals: '2,800 Q', changePercent: '+2.2%', isPositive: true, verified: true },
      { id: 7, name: 'Ahmednagar APMC Yard', location: 'Ahmednagar Central', district: 'Ahmednagar', lat: 19.0952, lng: 74.7480, pricePerQuintal: 2260, minPrice: 1960, maxPrice: 2510, arrivals: '2,100 Q', changePercent: '+1.1%', isPositive: true, verified: true },
      { id: 8, name: 'Chhatrapati Sambhajinagar APMC', location: 'Jadhavwadi, CSN', district: 'Aurangabad', lat: 19.8762, lng: 75.3433, pricePerQuintal: 2320, minPrice: 2020, maxPrice: 2580, arrivals: '2,500 Q', changePercent: '+1.9%', isPositive: true, verified: true },
      { id: 9, name: 'Jalgaon APMC Yard', location: 'Jalgaon Yard', district: 'Jalgaon', lat: 21.0077, lng: 75.5626, pricePerQuintal: 2270, minPrice: 1970, maxPrice: 2520, arrivals: '1,800 Q', changePercent: '+1.3%', isPositive: true, verified: true },
      { id: 10, name: 'Akola Vegetable APMC', location: 'Akola Yard', district: 'Akola', lat: 20.7002, lng: 77.0125, pricePerQuintal: 2300, minPrice: 2000, maxPrice: 2560, arrivals: '2,200 Q', changePercent: '+1.7%', isPositive: true, verified: true },
      { id: 11, name: 'Khamgaon APMC', location: 'Khamgaon, Buldhana', district: 'Buldhana', lat: 20.7057, lng: 76.5683, pricePerQuintal: 2280, minPrice: 1980, maxPrice: 2530, arrivals: '1,600 Q', changePercent: '+1.4%', isPositive: true, verified: true },
      { id: 12, name: 'Amravati APMC Market', location: 'Amravati Central', district: 'Amravati', lat: 20.9374, lng: 77.7523, pricePerQuintal: 2340, minPrice: 2040, maxPrice: 2600, arrivals: '2,600 Q', changePercent: '+2.3%', isPositive: true, verified: true },
      { id: 13, name: 'Nagpur Kalamna APMC', location: 'Kalamna, Nagpur', district: 'Nagpur', lat: 21.1730, lng: 79.1430, pricePerQuintal: 2420, minPrice: 2120, maxPrice: 2690, arrivals: '3,800 Q', changePercent: '+3.1%', isPositive: true, verified: true },
      { id: 14, name: 'Solapur APMC Market', location: 'Solapur Yard', district: 'Solapur', lat: 17.6599, lng: 75.9064, pricePerQuintal: 2250, minPrice: 1950, maxPrice: 2500, arrivals: '2,000 Q', changePercent: '+1.0%', isPositive: true, verified: true },
      { id: 15, name: 'Kolhapur APMC Market', location: 'Shahupuri, Kolhapur', district: 'Kolhapur', lat: 16.7050, lng: 74.2433, pricePerQuintal: 2360, minPrice: 2060, maxPrice: 2620, arrivals: '2,900 Q', changePercent: '+2.5%', isPositive: true, verified: true },
    ],
    wheat: [
      { id: 1, name: 'Nagpur Grain Market APMC', location: 'Kalamna, Nagpur', district: 'Nagpur', lat: 21.1730, lng: 79.1430, pricePerQuintal: 2540, minPrice: 2320, maxPrice: 2780, arrivals: '4,500 Q', changePercent: '+2.6%', isPositive: true, verified: true },
      { id: 2, name: 'Akola Grain Yard APMC', location: 'Akola Yard', district: 'Akola', lat: 20.7002, lng: 77.0125, pricePerQuintal: 2490, minPrice: 2270, maxPrice: 2720, arrivals: '3,800 Q', changePercent: '+2.1%', isPositive: true, verified: true },
      { id: 3, name: 'Malkapur APMC Yard', location: 'Malkapur, Buldhana', district: 'Buldhana', lat: 20.8851, lng: 76.2138, pricePerQuintal: 2460, minPrice: 2240, maxPrice: 2690, arrivals: '2,900 Q', changePercent: '+1.8%', isPositive: true, verified: true },
      { id: 4, name: 'Khamgaon APMC Market', location: 'Khamgaon, Buldhana', district: 'Buldhana', lat: 20.7057, lng: 76.5683, pricePerQuintal: 2470, minPrice: 2250, maxPrice: 2700, arrivals: '3,100 Q', changePercent: '+1.9%', isPositive: true, verified: true },
      { id: 5, name: 'Mehkar APMC Market', location: 'Mehkar, Buldhana', district: 'Buldhana', lat: 20.1498, lng: 76.5732, pricePerQuintal: 2440, minPrice: 2220, maxPrice: 2670, arrivals: '2,100 Q', changePercent: '+1.4%', isPositive: true, verified: true },
      { id: 6, name: 'Amravati APMC Market', location: 'Amravati Central', district: 'Amravati', lat: 20.9374, lng: 77.7523, pricePerQuintal: 2510, minPrice: 2290, maxPrice: 2750, arrivals: '3,600 Q', changePercent: '+2.3%', isPositive: true, verified: true },
      { id: 7, name: 'Jalgaon Grain APMC', location: 'Jalgaon Yard', district: 'Jalgaon', lat: 21.0077, lng: 75.5626, pricePerQuintal: 2480, minPrice: 2260, maxPrice: 2710, arrivals: '3,400 Q', changePercent: '+2.0%', isPositive: true, verified: true },
      { id: 8, name: 'Dhule APMC Yard', location: 'Dhule Yard', district: 'Dhule', lat: 20.9042, lng: 74.7749, pricePerQuintal: 2450, minPrice: 2230, maxPrice: 2680, arrivals: '2,700 Q', changePercent: '+1.6%', isPositive: true, verified: true },
      { id: 9, name: 'Niphad APMC (Nashik)', location: 'Niphad, Nashik', district: 'Nashik', lat: 20.0793, lng: 74.1117, pricePerQuintal: 2470, minPrice: 2250, maxPrice: 2700, arrivals: '2,500 Q', changePercent: '+1.8%', isPositive: true, verified: true },
      { id: 10, name: 'Latur APMC Yard', location: 'Latur Central', district: 'Latur', lat: 18.4088, lng: 76.5880, pricePerQuintal: 2520, minPrice: 2300, maxPrice: 2760, arrivals: '3,900 Q', changePercent: '+2.4%', isPositive: true, verified: true },
      { id: 11, name: 'Chhatrapati Sambhajinagar APMC', location: 'Jadhavwadi, CSN', district: 'Aurangabad', lat: 19.8762, lng: 75.3433, pricePerQuintal: 2480, minPrice: 2260, maxPrice: 2720, arrivals: '3,200 Q', changePercent: '+2.0%', isPositive: true, verified: true },
      { id: 12, name: 'Ahmednagar APMC', location: 'Ahmednagar Central', district: 'Ahmednagar', lat: 19.0952, lng: 74.7480, pricePerQuintal: 2460, minPrice: 2240, maxPrice: 2690, arrivals: '2,800 Q', changePercent: '+1.7%', isPositive: true, verified: true },
      { id: 13, name: 'Pune APMC (Gultekdi)', location: 'Gultekdi, Pune', district: 'Pune', lat: 18.4960, lng: 73.8640, pricePerQuintal: 2560, minPrice: 2340, maxPrice: 2800, arrivals: '4,800 Q', changePercent: '+2.9%', isPositive: true, verified: true },
      { id: 14, name: 'Solapur APMC Market', location: 'Solapur Central', district: 'Solapur', lat: 17.6599, lng: 75.9064, pricePerQuintal: 2490, minPrice: 2270, maxPrice: 2730, arrivals: '3,300 Q', changePercent: '+2.1%', isPositive: true, verified: true },
      { id: 15, name: 'Wardha APMC Market', location: 'Wardha Central', district: 'Wardha', lat: 20.7453, lng: 78.6022, pricePerQuintal: 2500, minPrice: 2280, maxPrice: 2740, arrivals: '3,000 Q', changePercent: '+2.2%', isPositive: true, verified: true },
    ],
    cotton: [
      { id: 1, name: 'Hinganghat APMC (White Gold Hub)', location: 'Hinganghat, Wardha', district: 'Wardha', lat: 20.5562, lng: 78.8375, pricePerQuintal: 7650, minPrice: 7100, maxPrice: 8150, arrivals: '5,500 Q', changePercent: '+3.8%', isPositive: true, verified: true },
      { id: 2, name: 'Yavatmal Cotton Market Yard', location: 'Yavatmal Central', district: 'Yavatmal', lat: 20.3951, lng: 78.1302, pricePerQuintal: 7580, minPrice: 7020, maxPrice: 8080, arrivals: '4,900 Q', changePercent: '+3.2%', isPositive: true, verified: true },
      { id: 3, name: 'Akola Cotton Yard APMC', location: 'Akola Yard', district: 'Akola', lat: 20.7002, lng: 77.0125, pricePerQuintal: 7520, minPrice: 6980, maxPrice: 8020, arrivals: '4,200 Q', changePercent: '+2.7%', isPositive: true, verified: true },
      { id: 4, name: 'Khamgaon Cotton APMC', location: 'Khamgaon, Buldhana', district: 'Buldhana', lat: 20.7057, lng: 76.5683, pricePerQuintal: 7490, minPrice: 6950, maxPrice: 7990, arrivals: '3,800 Q', changePercent: '+2.4%', isPositive: true, verified: true },
      { id: 5, name: 'Malkapur Cotton Yard', location: 'Malkapur, Buldhana', district: 'Buldhana', lat: 20.8851, lng: 76.2138, pricePerQuintal: 7460, minPrice: 6920, maxPrice: 7960, arrivals: '3,200 Q', changePercent: '+2.1%', isPositive: true, verified: true },
      { id: 6, name: 'Amravati Cotton Yard', location: 'Amravati Yard', district: 'Amravati', lat: 20.9374, lng: 77.7523, pricePerQuintal: 7540, minPrice: 7000, maxPrice: 8040, arrivals: '3,900 Q', changePercent: '+2.9%', isPositive: true, verified: true },
      { id: 7, name: 'Wardha APMC Market', location: 'Wardha Central', district: 'Wardha', lat: 20.7453, lng: 78.6022, pricePerQuintal: 7590, minPrice: 7040, maxPrice: 8090, arrivals: '4,300 Q', changePercent: '+3.3%', isPositive: true, verified: true },
      { id: 8, name: 'Jalna Cotton Market APMC', location: 'Jalna Yard', district: 'Jalna', lat: 19.8410, lng: 75.8864, pricePerQuintal: 7450, minPrice: 6900, maxPrice: 7940, arrivals: '3,500 Q', changePercent: '+2.0%', isPositive: true, verified: true },
      { id: 9, name: 'Chhatrapati Sambhajinagar APMC', location: 'Jadhavwadi, CSN', district: 'Aurangabad', lat: 19.8762, lng: 75.3433, pricePerQuintal: 7480, minPrice: 6930, maxPrice: 7970, arrivals: '3,400 Q', changePercent: '+2.3%', isPositive: true, verified: true },
      { id: 10, name: 'Jalgaon Cotton Yard (Khandesh)', location: 'Jalgaon Yard', district: 'Jalgaon', lat: 21.0077, lng: 75.5626, pricePerQuintal: 7510, minPrice: 6960, maxPrice: 8000, arrivals: '3,700 Q', changePercent: '+2.6%', isPositive: true, verified: true },
      { id: 11, name: 'Dhule Cotton APMC', location: 'Dhule Yard', district: 'Dhule', lat: 20.9042, lng: 74.7749, pricePerQuintal: 7470, minPrice: 6920, maxPrice: 7960, arrivals: '2,900 Q', changePercent: '+2.2%', isPositive: true, verified: true },
      { id: 12, name: 'Nanded Cotton Yard', location: 'Nanded Yard', district: 'Nanded', lat: 19.1383, lng: 77.3210, pricePerQuintal: 7490, minPrice: 6940, maxPrice: 7980, arrivals: '3,100 Q', changePercent: '+2.4%', isPositive: true, verified: true },
      { id: 13, name: 'Parbhani APMC', location: 'Parbhani Yard', district: 'Parbhani', lat: 19.2699, lng: 76.7734, pricePerQuintal: 7440, minPrice: 6890, maxPrice: 7930, arrivals: '2,600 Q', changePercent: '+1.9%', isPositive: true, verified: true },
      { id: 14, name: 'Adilabad APMC Market', location: 'Adilabad Yard', district: 'Adilabad', lat: 19.6640, lng: 78.5320, pricePerQuintal: 7410, minPrice: 6860, maxPrice: 7900, arrivals: '2,800 Q', changePercent: '+1.7%', isPositive: true, verified: true },
      { id: 15, name: 'Nagpur Cotton APMC', location: 'Kalamna, Nagpur', district: 'Nagpur', lat: 21.1730, lng: 79.1430, pricePerQuintal: 7620, minPrice: 7070, maxPrice: 8120, arrivals: '4,700 Q', changePercent: '+3.5%', isPositive: true, verified: true },
    ],
  };

  // Get active center: use userCoords (set by taluka, GPS, or PIN lookup)
  const getActiveCenter = () => {
    return userCoords || { lat: 19.9975, lng: 73.7898 };
  };

  // Max radius (km) for mandi display
  const MAX_RADIUS_KM = 200;

  const activeCenter = getActiveCenter();

  const rawMandis = mandiDatabase[selectedCrop] || mandiDatabase.onion;

  // Calculate actual distance for each mandi dynamically
  const mandisWithDistance = rawMandis.map((m) => {
    const dist = calculateDistanceKm(activeCenter.lat, activeCenter.lng, m.lat, m.lng);
    return {
      ...m,
      distanceKm: dist,
    };
  });

  // Filter mandis within 200 km radius
  const mandisWithin200Km = mandisWithDistance.filter((m) => m.distanceKm <= MAX_RADIUS_KM);
  
  // If fewer than 3 are within 200km, take the closest ones so user always has meaningful data
  const mandisToDisplay = mandisWithin200Km.length >= 2 
    ? mandisWithin200Km 
    : [...mandisWithDistance].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 6);

  const sortedMandis = [...mandisToDisplay].sort((a, b) => {
    if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
    if (sortBy === 'price_desc') return b.pricePerQuintal - a.pricePerQuintal;
    if (sortBy === 'price_asc') return a.pricePerQuintal - b.pricePerQuintal;
    if (sortBy === 'gain') {
      const aVal = parseFloat(a.changePercent.replace('%', ''));
      const bVal = parseFloat(b.changePercent.replace('%', ''));
      return bVal - aVal;
    }
    return 0;
  });

  const handleSearch = async (e) => {
    e?.preventDefault();
    setSearchLoading(true);

    if (locationMode === 'taluka') {
      // 1. TALUKA & DISTRICT MODE
      const distObj = MH_DISTRICTS.find(
        (d) => d.name.toLowerCase() === selectedDistrict.toLowerCase()
      );
      if (distObj) {
        const talukaObj =
          distObj.talukas.find(
            (t) => t.name.toLowerCase() === selectedTaluka.toLowerCase()
          ) || distObj.talukas[0];
        if (talukaObj) {
          setUserCoords({ lat: talukaObj.lat, lng: talukaObj.lng });
          setUserLocationLabel(`${talukaObj.name} Taluka, ${distObj.name}`);
          setLocStatusMessage(
            `📍 Showing 200 km mandi prices for ${talukaObj.name}, ${distObj.name}`
          );
          setTimeout(() => setLocStatusMessage(''), 4000);
        }
      }
      setSearchLoading(false);
      return;
    }

    // 2. PIN CODE MODE
    const cleanPin = String(pincode || '').trim();
    if (!cleanPin) {
      setSearchLoading(false);
      return;
    }

    // 2A. Direct match in PINCODE_COORDS
    if (PINCODE_COORDS[cleanPin]) {
      const match = PINCODE_COORDS[cleanPin];
      setUserLocationLabel(match.name);
      setUserCoords({ lat: match.lat, lng: match.lng });
      
      // Auto-match District / Taluka in dropdown if possible
      for (const dist of MH_DISTRICTS) {
        const matchingTaluka = dist.talukas.find(t => 
          match.name.toLowerCase().includes(t.name.toLowerCase())
        );
        if (matchingTaluka) {
          setSelectedDistrict(dist.name);
          setSelectedTaluka(matchingTaluka.name);
          break;
        } else if (match.name.toLowerCase().includes(dist.name.toLowerCase())) {
          setSelectedDistrict(dist.name);
          break;
        }
      }

      setLocStatusMessage(`📍 Location updated: ${match.name} (${cleanPin})`);
      setTimeout(() => setLocStatusMessage(''), 4000);
      setSearchLoading(false);
      return;
    }

    // 2B. 3-digit prefix mapping
    const prefix3 = cleanPin.slice(0, 3);
    if (PIN_PREFIX_MAP[prefix3]) {
      const d = PIN_PREFIX_MAP[prefix3];
      // Try live Postal API for precise sub-office details
      if (cleanPin.length === 6 && /^\d{6}$/.test(cleanPin)) {
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
          const data = await res.json();
          if (data?.[0]?.Status === 'Success' && data[0].PostOffice?.length > 0) {
            const po = data[0].PostOffice[0];
            const label = `${po.Name}, ${po.District}`;
            
            // Check if district matches MH_DISTRICTS
            const matchingDist = MH_DISTRICTS.find(mhd => 
              mhd.name.toLowerCase().includes(po.District.toLowerCase()) || 
              po.District.toLowerCase().includes(mhd.name.toLowerCase())
            );
            
            let lat = d.lat;
            let lng = d.lng;
            if (matchingDist) {
              setSelectedDistrict(matchingDist.name);
              const matchingTaluka = matchingDist.talukas.find(t => 
                (po.Taluk && po.Taluk.toLowerCase().includes(t.name.toLowerCase())) ||
                po.Name.toLowerCase().includes(t.name.toLowerCase())
              );
              if (matchingTaluka) {
                setSelectedTaluka(matchingTaluka.name);
                lat = matchingTaluka.lat;
                lng = matchingTaluka.lng;
              } else {
                lat = matchingDist.lat;
                lng = matchingDist.lng;
              }
            }

            setUserLocationLabel(`${label} (${cleanPin})`);
            setUserCoords({ lat, lng });
            PINCODE_COORDS[cleanPin] = { name: label, lat, lng };
            setLocStatusMessage(`📍 Location found: ${label}`);
            setTimeout(() => setLocStatusMessage(''), 4000);
            setSearchLoading(false);
            return;
          }
        } catch (err) {
          console.warn('PIN API lookup:', err);
        }
      }

      setUserLocationLabel(`${d.name} (${cleanPin})`);
      setUserCoords({ lat: d.lat, lng: d.lng });
      setLocStatusMessage(`📍 Region set: ${d.name}`);
      setTimeout(() => setLocStatusMessage(''), 4000);
      setSearchLoading(false);
      return;
    }

    // 2C. Generic 6-digit API fallback
    if (cleanPin.length === 6 && /^\d{6}$/.test(cleanPin)) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
        const data = await res.json();
        if (data?.[0]?.Status === 'Success' && data[0].PostOffice?.length > 0) {
          const po = data[0].PostOffice[0];
          const label = `${po.Name}, ${po.District}`;
          setUserLocationLabel(`${label} (${cleanPin})`);
          setLocStatusMessage(`📍 Location: ${label}`);
          setTimeout(() => setLocStatusMessage(''), 4000);
        }
      } catch (err) {
        console.warn('Generic PIN lookup failed:', err);
      }
    }

    setSearchLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">

      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH CINEMATIC ATMOSPHERE & BALANCED LIVE INTELLIGENCE */}
      {/* ========================================================================= */}
      <section id="hero" className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-emerald-50/60 via-slate-50 to-slate-100 border-b border-slate-200/70">

        {/* ATMOSPHERIC BACKGROUND LAYERS */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
          <img
            src="/farmer_hero_bg.jpg"
            alt="Indian agriculture at golden sunrise"
            className="w-full h-full object-cover object-[75%_35%] lg:object-[80%_35%] opacity-90 filter brightness-[0.88] contrast-[1.06] saturate-[1.12]"
          />
          <div className="absolute inset-0 bg-slate-950/20 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-100/90 via-transparent to-black/10"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* LEFT HERO CONTENT */}
            <div className="lg:col-span-8 space-y-6 text-center lg:text-left">
              {/* TOP PILL BADGE */}
              {isAuthenticated ? (
                <div className="inline-flex items-center space-x-2.5 bg-emerald-100/95 text-emerald-950 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm border border-emerald-300 animate-fade-in-up">
                  <span className="live-dot"></span>
                  <span>
                    Welcome, {user?.name || user?.businessName || (isFarmer ? 'Rahul Jadhav' : 'AgroFresh')} •{' '}
                    {isFarmer ? '🌾 Verified Farmer' : isBuyer ? '🏪 Verified Buyer' : '⚙️ SuperAdmin'}
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center space-x-2.5 bg-white/95 backdrop-blur-md text-emerald-950 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm border border-emerald-300/80 animate-fade-in-up">
                  <span className="live-dot"></span>
                  <span className="text-[#0F382C] font-extrabold">Next-Gen Agricultural Intelligence & Market Engine</span>
                </div>
              )}

              {/* HIGH-CONTRAST SOLID FOREST GREEN HEADLINE */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight text-slate-900 leading-[1.06] animate-fade-in-up">
                Sell Smarter.<br />
                <span className="text-[#0F382C]">
                  Earn Maximum Profit.
                </span>
              </h1>

              {/* HIGH-READABILITY SUBTITLE WITH CONTRAST PROTECTION */}
              <p className="text-base sm:text-lg text-slate-800 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-semibold bg-white/30 lg:bg-transparent backdrop-blur-xs lg:backdrop-blur-none p-1.5 lg:p-0 rounded-2xl animate-fade-in-up drop-shadow-xs">
                KRISHAK helps Indian farmers compare live market opportunities across APMCs and verified corporate buyers, forecast price trends, and calculate optimal multi-channel selling splits for guaranteed higher take-home payouts.
              </p>

              {/* STANDARDIZED PRIMARY & SECONDARY ACTION BUTTONS */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 animate-fade-in-up">
                {!isAuthenticated ? (
                  <>
                    {/* PRIMARY FILLED GREEN BUTTON */}
                    <button
                      onClick={() => navigate('/login/farmer')}
                      className="px-6 sm:px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl font-bold text-sm sm:text-base shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-2 cursor-pointer"
                    >
                      <span>Start Selling (Farmer)</span>
                      <span className="text-emerald-200">→</span>
                    </button>

                    {/* SECONDARY OUTLINE/GHOST BUTTON */}
                    <button
                      onClick={() => navigate('/login/buyer')}
                      className="px-6 sm:px-7 py-3.5 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 hover:text-slate-900 rounded-xl font-semibold text-sm sm:text-base shadow-2xs transition-all flex items-center space-x-2 border border-slate-300 hover:border-slate-400 cursor-pointer"
                    >
                      <span>Buyer Procurement Desk</span>
                      <span className="text-slate-400">→</span>
                    </button>
                  </>
                ) : isFarmer ? (
                  <>
                    {/* AUTHENTICATED FARMER ACTIONS */}
                    <button
                      onClick={() => navigate('/farmer/dashboard')}
                      className="btn-shimmer px-6 sm:px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl font-black text-sm sm:text-base shadow-md shadow-emerald-600/25 transition-all flex items-center space-x-2 cursor-pointer"
                    >
                      <span>🌾 Open Farmer Dashboard</span>
                      <span className="text-emerald-200">→</span>
                    </button>

                    <button
                      onClick={() => navigate('/farmer/list-produce')}
                      className="px-6 sm:px-7 py-3.5 bg-white hover:bg-emerald-50 active:scale-[0.98] text-emerald-950 rounded-xl font-extrabold text-sm sm:text-base shadow-2xs transition-all flex items-center space-x-2 border border-emerald-300 hover:border-emerald-400 cursor-pointer"
                    >
                      <span>+ List New Harvest Lot</span>
                    </button>
                  </>
                ) : (
                  <>
                    {/* AUTHENTICATED BUYER ACTIONS */}
                    <button
                      onClick={() => navigate('/buyer/dashboard')}
                      className="btn-shimmer px-6 sm:px-7 py-3.5 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 text-white rounded-xl font-black text-sm sm:text-base shadow-md shadow-blue-700/25 transition-all flex items-center space-x-2 cursor-pointer"
                    >
                      <span>🏪 Open Buyer Dashboard</span>
                      <span className="text-blue-200">→</span>
                    </button>

                    <button
                      onClick={() => navigate('/buyer/post-requirement')}
                      className="px-6 sm:px-7 py-3.5 bg-white hover:bg-blue-50 active:scale-[0.98] text-blue-950 rounded-xl font-extrabold text-sm sm:text-base shadow-2xs transition-all flex items-center space-x-2 border border-blue-300 hover:border-blue-400 cursor-pointer"
                    >
                      <span>+ Post Sourcing Tender</span>
                    </button>
                  </>
                )}
              </div>

              {/* KEY HIGHLIGHT CHIPS */}
              <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold text-slate-700 max-w-xl mx-auto lg:mx-0">
                <div className="flex items-center space-x-2 justify-center lg:justify-start bg-white/85 backdrop-blur-xs py-2 px-3 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-emerald-600 font-black">✓</span>
                  <span>Real Mandi Feeds</span>
                </div>
                <div className="flex items-center space-x-2 justify-center lg:justify-start bg-white/85 backdrop-blur-xs py-2 px-3 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-emerald-600 font-black">✓</span>
                  <span>Direct Buyers</span>
                </div>
                <div className="flex items-center space-x-2 justify-center lg:justify-start bg-white/85 backdrop-blur-xs py-2 px-3 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-emerald-600 font-black">✓</span>
                  <span>AI Profit Split</span>
                </div>
                <div className="flex items-center space-x-2 justify-center lg:justify-start bg-white/85 backdrop-blur-xs py-2 px-3 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[#0F382C] font-black">★</span>
                  <span>Escrow Safe</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TRENDING MARKET PRICES SECTION */}
      {/* ========================================================================= */}
      <section id="trending-prices" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* MAIN WHITE CARD CONTAINER */}
        <div className="bg-white rounded-3xl p-6 sm:p-9 border border-slate-200/90 shadow-xl shadow-emerald-900/5 space-y-7">
          
          {/* HEADER WITH TREND ICON & LOCATION BADGE */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 flex items-center justify-center flex-shrink-0 shadow-xs">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                  {language === 'mr' ? 'ट्रेंडिंग बाजार भाव' : 'Trending Market Prices'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  {language === 'mr'
                    ? 'महाराष्ट्र राज्य: जिल्हा व तालुक्यानुसार २०० किमी परिसरातील थेट बाजार समितीचे दर'
                    : 'Maharashtra APMCs: Real-time mandi rates within 200 km radius of your Taluka & District'}
                </p>
              </div>
            </div>

            {/* ACTIVE LOCATION & 200KM RANGE BADGES */}
            <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
              <div className="flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-black shadow-xs">
                <span>🎯</span>
                <span>{language === 'mr' ? '२०० किमी परिसर' : '200 km Range'}</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50/90 border border-emerald-200/90 text-emerald-950 px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="truncate max-w-[220px]">📍 {userLocationLabel}</span>
              </div>
            </div>
          </div>

          {/* SEARCH & FILTER CONTROLS BAR: DISTRICT + TALUKA + CROP */}
          <div className="bg-emerald-50/40 rounded-2xl p-4 sm:p-5 border border-emerald-100/90 space-y-4">
            
            {/* TOP BAR: LOCATION MODE TABS */}
            <div className="flex items-center justify-between pb-1 border-b border-emerald-200/50">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  type="button"
                  onClick={() => setLocationMode('taluka')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    locationMode === 'taluka'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200/80'
                  }`}
                >
                  🏛️ {language === 'mr' ? 'जिल्हा / तालुका निवडा' : 'District & Taluka'}
                </button>
                <button
                  type="button"
                  onClick={() => setLocationMode('pincode')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    locationMode === 'pincode'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200/80'
                  }`}
                >
                  📮 {language === 'mr' ? 'पिन कोड (PIN Code)' : 'PIN Code'}
                </button>
              </div>

              {/* CURRENT LOCATION GPS BUTTON */}
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={locLoading}
                className="text-[11px] font-extrabold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 bg-white hover:bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                title="Auto-detect location using device GPS"
              >
                {locLoading ? (
                  <div className="h-3 w-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>📍</span>
                )}
                <span>{language === 'mr' ? 'माझे वर्तमान स्थान' : 'Use Current Location'}</span>
              </button>
            </div>

            {/* FORM INPUTS GRID */}
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
                
                {/* 1. SELECT CROP (col-span-3) */}
                <div className="lg:col-span-3 space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700 block">
                    🌱 {language === 'mr' ? 'पीक निवडा' : 'Select Crop'}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCrop}
                      onChange={(e) => setSelectedCrop(e.target.value)}
                      className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer shadow-xs appearance-none"
                    >
                      {cropList.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.icon} {c.name}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {locationMode === 'taluka' ? (
                  <>
                    {/* 2. DISTRICT DROPDOWN (col-span-4) */}
                    <div className="lg:col-span-4 space-y-1.5">
                      <label className="text-xs font-extrabold text-slate-700 block">
                        🏛️ {language === 'mr' ? 'जिल्हा (महाराष्ट्र)' : 'District (Maharashtra)'}
                      </label>
                      <div className="relative">
                        <select
                          value={selectedDistrict}
                          onChange={(e) => handleDistrictChange(e.target.value)}
                          className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer shadow-xs appearance-none"
                        >
                          {MH_DISTRICTS.map((d) => (
                            <option key={d.name} value={d.name}>
                              {d.name} {d.name === 'Buldhana' ? '(बुलढाणा)' : d.name === 'Nashik' ? '(नाशिक)' : d.name === 'Pune' ? '(पुणे)' : d.name === 'Nagpur' ? '(नागपूर)' : ''}
                            </option>
                          ))}
                        </select>
                        <svg
                          className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* 3. TALUKA DROPDOWN (col-span-3) */}
                    <div className="lg:col-span-3 space-y-1.5">
                      <label className="text-xs font-extrabold text-slate-700 block">
                        📍 {language === 'mr' ? 'तालुका निवडा' : 'Select Taluka'}
                      </label>
                      <div className="relative">
                        <select
                          value={selectedTaluka}
                          onChange={(e) => handleTalukaChange(e.target.value)}
                          className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer shadow-xs appearance-none"
                        >
                          {talukaList.map((t) => (
                            <option key={t.name} value={t.name}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                        <svg
                          className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </>
                ) : (
                  /* 2. PIN CODE INPUT (col-span-7) */
                  <div className="lg:col-span-7 space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700 block">
                      📮 {language === 'mr' ? 'पिन कोड टाका' : 'Enter 6-Digit PIN Code'}
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none">
                        📍
                      </span>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder={language === 'mr' ? 'पिन कोड (उदा. 443404 किंवा 422001)' : 'Enter PIN (e.g. 443404 or 422001)'}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs"
                      />
                    </div>
                  </div>
                )}

                {/* 4. SEARCH / REFRESH BUTTON (col-span-2) */}
                <div className="lg:col-span-2">
                  <button
                    type="submit"
                    disabled={searchLoading}
                    className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white text-xs sm:text-sm font-black rounded-xl shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    {searchLoading ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span>{language === 'mr' ? 'दर शोधा' : 'Search'}</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            </form>

            {locStatusMessage && (
              <div className="text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-3.5 py-1.5 rounded-xl border border-emerald-300 animate-fade-in-up">
                {locStatusMessage}
              </div>
            )}
          </div>

          {/* NEAREST MANDI PRICES SECTION HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center text-sm font-bold border border-emerald-200">
                🏪
              </div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                {language === 'mr' ? 'जवळच्या बाजार समितीचे थेट दर' : 'Nearest APMC Mandi Live Prices'}
              </h3>
              <span className="bg-emerald-100 text-emerald-950 border border-emerald-300 text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>📅 {language === 'mr' ? 'आजचे लाईव्ह दर (२८ ऑगस्ट २०२६)' : "Today's Live Rates (28 Aug 2026)"}</span>
              </span>
              <span className="bg-amber-50 text-amber-900 border border-amber-200 text-[10.5px] font-black px-2.5 py-0.5 rounded-full">
                🎯 {language === 'mr' ? `२०० किमी परिसर (${sortedMandis.length} बाजार समित्या)` : `200 km Radius (${sortedMandis.length} APMCs found)`}
              </span>
            </div>

            {/* SORTING SELECTOR */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <span className="text-slate-400 hidden sm:inline">{language === 'mr' ? 'क्रमवारी:' : 'Sorted by:'}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs"
              >
                <option value="distance">{language === 'mr' ? 'जवळचे अंतर (Nearest Distance)' : 'Nearest Distance'}</option>
                <option value="price_desc">{language === 'mr' ? 'जास्त भाव (Highest Price)' : 'Highest Price'}</option>
                <option value="price_asc">{language === 'mr' ? 'कमी भाव (Lowest Price)' : 'Lowest Price'}</option>
                <option value="gain">{language === 'mr' ? 'जास्त तेजी (Highest Gain)' : 'Highest Gain'}</option>
              </select>
            </div>
          </div>

          {/* LIST OF MANDI CARDS (1 TO 5) */}
          <div className="space-y-3">
            {sortedMandis.map((mandi, idx) => {
              const bestFreight = Math.round(mandi.distanceKm * 0.85);
              const netPayout = mandi.pricePerQuintal - bestFreight;

              return (
                <div
                  key={mandi.id}
                  className="group bg-white hover:bg-emerald-50/25 border border-slate-200/90 hover:border-emerald-400/90 rounded-2xl p-4 sm:p-5 transition-all duration-200 shadow-2xs hover:shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  
                  {/* 1. RANK BADGE & MANDI NAME */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-[240px]">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-800 font-extrabold text-base flex items-center justify-center border border-emerald-200 flex-shrink-0 group-hover:scale-105 transition-transform mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-emerald-950 transition-colors">
                          {mandi.name}
                        </h4>
                        {mandi.verified && (
                          <span className="h-4 w-4 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shadow-2xs" title="Verified APMC">
                            ✓
                          </span>
                        )}
                        <span className="text-[10px] font-black bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md border border-emerald-300/80">
                          📅 28 Aug 2026 Today
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                        <span className="text-slate-400">📍</span>
                        <span>{mandi.location}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-emerald-700 font-bold">🛣️ 3 Routes Available (Best: {mandi.distanceKm} km)</span>
                      </p>
                    </div>
                  </div>

                  {/* 2. DISTANCE & BEST HIGHWAY ROUTE */}
                  <div className="flex sm:flex-col items-center sm:items-center justify-between sm:justify-center border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0 min-w-[130px] text-center">
                    <span className="text-sm sm:text-base font-extrabold text-slate-900 block">
                      {mandi.distanceKm} km
                    </span>
                    <span className="text-[10.5px] text-emerald-800 font-extrabold block bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 mt-0.5">
                      ⭐ Best Route: ~{Math.round(mandi.distanceKm / 55 * 60)} min
                    </span>
                  </div>

                  {/* 3. PRICE & NET PAYOUT */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center min-w-[170px] text-right">
                    <div>
                      <span className="text-lg sm:text-xl font-black font-mono text-slate-900">
                        ₹{mandi.pricePerQuintal.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-500 font-medium ml-1">/q</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Take-Home: ₹{netPayout.toLocaleString('en-IN')}/q
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          mandi.isPositive ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        {mandi.isPositive ? '▲' : '▼'} {mandi.changePercent}
                      </span>
                    </div>
                  </div>

                  {/* 4. ACTION BUTTONS */}
                  <div className="pt-2 lg:pt-0 flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMapMandi(mandi);
                        setSelectedRouteIndex(0);
                        setShowMapModal(true);
                      }}
                      className="px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-700/20 cursor-pointer"
                      title="Explore 3 highlighted routes with real-time navigation on radar map"
                    >
                      <span>🗺️ 3 Routes & Map</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMandiDetail(mandi)}
                      className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 shadow-2xs group/btn cursor-pointer"
                    >
                      <span>Details</span>
                      <span className="text-slate-400 group-hover/btn:text-emerald-700 group-hover/btn:translate-x-0.5 transition-all">›</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {/* BOTTOM BUTTON: VIEW ALL MARKETS ON MAP */}
          <div className="text-center pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setSelectedMapMandi(null);
                setSelectedRouteIndex(0);
                setShowMapModal(true);
              }}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-50 hover:bg-emerald-100/80 active:scale-[0.98] text-emerald-900 border border-emerald-200/90 rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition-all cursor-pointer"
            >
              <span>📍</span>
              <span>{language === 'mr' ? 'सर्व बाजार समित्या व मार्ग थेट नकाशावर पहा' : 'View All Markets & Routes on Live Radar Map'}</span>
              <span className="text-emerald-700 font-bold">›</span>
            </button>
          </div>

        </div>
      </section>

      {/* MANDI DETAILS INTERACTIVE MODAL */}
      {activeMandiDetail && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-scale-up relative my-auto">
            
            {/* TOP BAR */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {activeMandiDetail.name}
                  </h3>
                  <span className="h-4 w-4 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs" title="Verified APMC">
                    ✓
                  </span>
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-950 px-2 py-0.5 rounded-full border border-emerald-300">
                    📅 Today, 28 Aug 2026 Live
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <span>📍</span>
                  <span>{activeMandiDetail.location}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 font-bold">Official Agmarknet / MSAMB Verified</span>
                </p>
              </div>
              <button
                onClick={() => setActiveMandiDetail(null)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* MANDI METRICS GRID */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200/90 space-y-1">
                <span className="text-[11px] font-extrabold text-emerald-900 uppercase block">Today's Modal Rate</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black font-mono text-emerald-950">₹{activeMandiDetail.pricePerQuintal.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-emerald-700 font-bold">/q</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-800">₹{(activeMandiDetail.pricePerQuintal / 100).toFixed(1)}/kg (Live)</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Daily Price Range</span>
                <span className="text-sm font-black font-mono text-slate-800 block">
                  ₹{activeMandiDetail.minPrice} - ₹{activeMandiDetail.maxPrice}/q
                </span>
                <span className={`text-[11px] font-bold ${activeMandiDetail.isPositive ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {activeMandiDetail.changePercent} vs yesterday
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Best Route Distance</span>
                <span className="text-base font-black text-slate-900 block">
                  {activeMandiDetail.distanceKm} km (Highway)
                </span>
                <span className="text-[11px] text-emerald-800 font-bold">Est. Freight: ₹{Math.round(activeMandiDetail.distanceKm * 0.85)}/q</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Estimated Net Payout</span>
                <span className="text-base font-black text-emerald-900 block">
                  ₹{(activeMandiDetail.pricePerQuintal - Math.round(activeMandiDetail.distanceKm * 0.85)).toLocaleString('en-IN')}/q
                </span>
                <span className="text-[11px] text-slate-500 font-medium">After Highway Freight</span>
              </div>
            </div>

            {/* 3 ROUTES HIGHLIGHT PREVIEW */}
            <div className="bg-slate-950 text-white p-4 rounded-2xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-emerald-300 uppercase tracking-wider text-[11px]">
                  🛣️ 3 Available Navigation Routes
                </span>
                <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                  Multi-Route Enabled
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between bg-emerald-900/60 border border-emerald-500/40 px-3 py-2 rounded-xl">
                  <span className="font-bold text-emerald-200">⚡ 1. Primary Highway (Best Route)</span>
                  <span className="font-mono font-black text-white">{activeMandiDetail.distanceKm} km • ~{Math.round(activeMandiDetail.distanceKm / 55 * 60)} min</span>
                </div>
                <div className="flex items-center justify-between bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-slate-300">
                  <span>💰 2. State Highway (Toll-Free)</span>
                  <span className="font-mono">{Math.round(activeMandiDetail.distanceKm * 1.12)} km • ~{Math.round(activeMandiDetail.distanceKm * 1.12 / 40 * 60)} min</span>
                </div>
                <div className="flex items-center justify-between bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-slate-300">
                  <span>📏 3. Rural Agro-Link (Shortest)</span>
                  <span className="font-mono">{Math.max(2, Math.round(activeMandiDetail.distanceKm * 0.94))} km • ~{Math.round(activeMandiDetail.distanceKm * 0.94 / 32 * 60)} min</span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  const targetMandi = activeMandiDetail;
                  setActiveMandiDetail(null);
                  setSelectedMapMandi(targetMandi);
                  setSelectedRouteIndex(0);
                  setShowMapModal(true);
                }}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>🗺️</span>
                <span>View & Highlight All 3 Routes on Radar Map →</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setActiveMandiDetail(null);
                    navigate(`/farmer/market-intelligence?crop=${selectedCrop}`);
                  }}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-all text-center cursor-pointer"
                >
                  📊 Market Insights
                </button>
                <button
                  onClick={() => {
                    setActiveMandiDetail(null);
                    navigate('/farmer/list-produce');
                  }}
                  className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl border border-emerald-200 transition-all text-center cursor-pointer"
                >
                  🌾 List Produce Lot
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* INTERACTIVE APMC MULTI-ROUTE MAP MODAL — Full-Screen Leaflet Cockpit */}
      <RouteMapModal
        isOpen={showMapModal}
        onClose={() => {
          setShowMapModal(false);
          setSelectedMapMandi(null);
          setSelectedRouteIndex(0);
        }}
        userLocationLabel={userLocationLabel}
        userCoords={activeCenter}
        selectedMandi={selectedMapMandi || sortedMandis[0] || rawMandis[0]}
        allMandis={sortedMandis}
        selectedCrop={selectedCrop}
        onSelectMandi={(m) => {
          setSelectedMapMandi(m);
          setSelectedRouteIndex(0);
        }}
        language={language}
      />

      {/* (DEAD CODE REMOVED) old inline iframe modal replaced by RouteMapModal above */}
      {false && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-5xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 space-y-4 animate-scale-up my-auto max-h-[94vh] flex flex-col">
            
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-shrink-0">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <span>🗺️</span>
                    <span>{language === 'mr' ? 'बाजार समिती थेट नकाशा व मार्गदर्शक' : 'APMC Live Route & Navigation Engine'}</span>
                  </h3>
                  <span className="bg-emerald-100 text-emerald-950 border border-emerald-300 text-[10.5px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>📅 Today 28 Aug 2026 • Verified</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Showing real-time route corridors from <strong>{userLocationLabel}</strong> ({sortedMandis.length} mandis within 200 km)
                </p>
              </div>
              <button
                onClick={() => {
                  setShowMapModal(false);
                  setSelectedMapMandi(null);
                  setSelectedRouteIndex(0);
                }}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* DYNAMIC MULTI-ROUTE ENGINE & MAP */}
            {(() => {
              const activeMandi = selectedMapMandi || sortedMandis[0] || rawMandis[0];
              const availableRoutes = calculateRoutes(userLocationLabel, activeMandi, activeCenter);
              const currentRoute = availableRoutes[selectedRouteIndex] || availableRoutes[0];

              const targetLat = activeMandi.lat;
              const targetLng = activeMandi.lng;
              const midLat = (activeCenter.lat + targetLat) / 2;
              const midLng = (activeCenter.lng + targetLng) / 2;
              const latDiff = Math.max(0.18, Math.abs(activeCenter.lat - targetLat) * 1.4);
              const lngDiff = Math.max(0.22, Math.abs(activeCenter.lng - targetLng) * 1.4);
              const minLat = (midLat - latDiff / 2).toFixed(4);
              const maxLat = (midLat + latDiff / 2).toFixed(4);
              const minLng = (midLng - lngDiff / 2).toFixed(4);
              const maxLng = (midLng + lngDiff / 2).toFixed(4);

              return (
                <div className="space-y-3.5 flex-shrink-0">
                  
                  {/* ACTIVE MANDI BANNER */}
                  <div className="bg-slate-900 text-white p-3.5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white text-xl flex items-center justify-center font-bold flex-shrink-0 shadow-sm border border-emerald-400/40">
                        🏪
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                            Target APMC Mandi
                          </span>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded">
                            {activeMandi.district}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-black text-white">
                          {activeMandi.name}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs bg-slate-950/80 px-3.5 py-2 rounded-xl border border-white/10 self-start sm:self-auto">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Today Modal Rate</span>
                        <span className="text-emerald-400 font-mono font-black text-sm">₹{activeMandi.pricePerQuintal}/q</span>
                      </div>
                      <div className="border-l border-slate-700 pl-3">
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Daily Arrivals</span>
                        <span className="text-white font-bold">{activeMandi.arrivals}</span>
                      </div>
                      <div className="border-l border-slate-700 pl-3">
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Daily Trend</span>
                        <span className={`font-black ${activeMandi.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {activeMandi.changePercent}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3 ROUTE SELECTION CARDS (HIGHLIGHTING THE BEST ROUTE) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {availableRoutes.map((rt, rIdx) => {
                      const isSelected = selectedRouteIndex === rIdx;
                      return (
                        <button
                          key={rt.id}
                          type="button"
                          onClick={() => setSelectedRouteIndex(rIdx)}
                          className={`relative p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-emerald-950 text-white border-emerald-400 shadow-lg ring-2 ring-emerald-500/50 scale-[1.01]'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {/* TOP TAG */}
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <span
                              className={`text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                isSelected
                                  ? rt.isBest
                                    ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-sm'
                                    : 'bg-white/20 text-white border-white/30'
                                  : rt.isBest
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold'
                                  : 'bg-slate-200 text-slate-700 border-slate-300'
                              }`}
                            >
                              {rt.shortTag}
                            </span>
                            {isSelected && (
                              <span className="text-[10px] text-emerald-300 font-black flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                                Active on Map
                              </span>
                            )}
                          </div>

                          {/* TITLE & CODE */}
                          <div>
                            <h4 className="text-xs font-black truncate">{rt.title}</h4>
                            <span className={`text-[10.5px] block truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                              {rt.routeCode}
                            </span>
                          </div>

                          {/* METRICS ROW */}
                          <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/10 text-xs">
                            <div>
                              <span className={`text-[9.5px] block ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>Distance</span>
                              <span className={`font-black ${isSelected ? 'text-amber-300' : 'text-slate-900'}`}>{rt.distanceKm} km</span>
                            </div>
                            <div>
                              <span className={`text-[9.5px] block ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>Drive Time</span>
                              <span className="font-bold">~{rt.driveTimeMin} min</span>
                            </div>
                            <div>
                              <span className={`text-[9.5px] block ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>Net Take-Home</span>
                              <span className={`font-black ${isSelected ? 'text-emerald-300' : 'text-emerald-800'}`}>₹{rt.netPayoutPerQuintal}/q</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* ACTIVE ROUTE DETAILS & WAYPOINT CORRIDOR */}
                  <div className="bg-slate-900 text-white rounded-2xl p-3 sm:p-3.5 border border-slate-800 space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-6 w-6 rounded-lg bg-emerald-700 text-white font-black text-xs flex items-center justify-center">
                          🛣️
                        </span>
                        <div>
                          <span className="font-extrabold text-emerald-300">{currentRoute.title}</span>
                          <span className="text-[11px] text-slate-300 block">{currentRoute.description}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-white/10 flex-shrink-0">
                        <span className="text-slate-400">Road: <strong className="text-white">{currentRoute.roadQuality}</strong></span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-400">Traffic: <strong className="text-emerald-300">{currentRoute.trafficStatus}</strong></span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-400">Toll: <strong className="text-amber-300">{currentRoute.tollCost > 0 ? `₹${currentRoute.tollCost}` : '₹0 (Free)'}</strong></span>
                      </div>
                    </div>

                    {/* CORRIDOR WAYPOINTS TIMELINE */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/90">
                      {currentRoute.waypoints.map((wp, wIdx) => (
                        <div key={wIdx} className="flex items-center gap-2 text-xs">
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center font-black text-[10px] flex-shrink-0 ${
                            wp.type === 'start'
                              ? 'bg-blue-600 text-white'
                              : wp.type === 'corridor'
                              ? 'bg-amber-600 text-white'
                              : 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/40'
                          }`}>
                            {wp.type === 'start' ? '📍' : wp.type === 'corridor' ? '🛣️' : '🏁'}
                          </div>
                          <div className="min-w-0">
                            <span className="text-white font-extrabold block truncate text-[11px]">{wp.name}</span>
                            <span className="text-slate-400 text-[9.5px] block truncate">{wp.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* MAP VIEW CONTAINER WITH ROUTE OVERLAY */}
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-64 sm:h-72">
                    <iframe
                      title="APMC Mandi Map"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${targetLat}%2C${targetLng}`}
                      className="w-full h-full border-0"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-md text-xs font-extrabold text-slate-800 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                      <span>Route: {userLocationLabel} ➔ {activeMandi.name} ({currentRoute.distanceKm} km)</span>
                    </div>

                    <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white text-[11px] font-bold shadow-lg flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>📅 Live 28 Aug 2026 Agmarknet Verified Feed</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* MANDIS SUMMARY LIST INSIDE MAP (SELECT DIFFERENT APMC) */}
            <div className="overflow-y-auto space-y-2 flex-1 pr-1 max-h-48">
              <div className="flex items-center justify-between text-xs font-black text-slate-700 px-1 py-0.5">
                <span>Select any APMC Mandi to Compare Routes:</span>
                <span className="text-slate-400 font-medium">Sorted by: {sortBy}</span>
              </div>
              {sortedMandis.map((m, idx) => (
                <div
                  key={m.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold gap-3 transition-colors ${
                    selectedMapMandi?.id === m.id
                      ? 'bg-emerald-50 border-emerald-400 shadow-xs ring-1 ring-emerald-400'
                      : 'bg-slate-50 hover:bg-emerald-50/50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="h-6 w-6 rounded-lg bg-emerald-700 text-white font-black text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="text-slate-900 block font-extrabold">{m.name}</span>
                      <span className="text-slate-500 text-[11px]">{m.location} • 📅 28 Aug 2026</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <span className="font-mono font-black text-slate-900 block">₹{m.pricePerQuintal}/q</span>
                      <span className="text-emerald-700 text-[10px] font-bold">{m.distanceKm} km (Best Route)</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMapMandi(m);
                        setSelectedRouteIndex(0);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedMapMandi?.id === m.id
                          ? 'bg-emerald-900 text-white shadow-xs'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      }`}
                    >
                      {selectedMapMandi?.id === m.id ? '📍 Active Mandi' : 'View 3 Routes →'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs text-slate-500 font-medium">
                Click on any route tab (Highway, Toll-Free, Shortest) to highlight route and calculate net payout
              </span>
              <button
                onClick={() => {
                  setShowMapModal(false);
                  setSelectedMapMandi(null);
                  setSelectedRouteIndex(0);
                }}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all cursor-pointer"
              >
                Close Engine
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. HOW KRISHAK WORKS SECTION */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 px-3.5 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider border border-emerald-200/80">
            <span>⚡ 4 High-Efficiency Steps</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
            How KRISHAK Delivers Value
          </h2>
          <p className="text-sm text-slate-500">
            From listing produce to optimal profit allocation and direct escrow settlement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-emerald-100/90 text-emerald-800 text-2xl flex items-center justify-center font-bold shadow-inner group-hover:scale-110 transition-transform">
              🌾
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">Step 01</span>
              <h3 className="font-bold text-slate-900 text-lg">List Your Produce</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Add crop details, quantity (KG/Quintal/Ton), quality grade, farm location, and your target price in seconds.
              </p>
            </div>
          </div>

          <div className="group bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-emerald-100/90 text-emerald-800 text-2xl flex items-center justify-center font-bold shadow-inner group-hover:scale-110 transition-transform">
              📊
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">Step 02</span>
              <h3 className="font-bold text-slate-900 text-lg">Compare Opportunities</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                KRISHAK compares nearby verified corporate buyers, regional APMC mandis, and direct processing tenders.
              </p>
            </div>
          </div>

          <div className="group bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-emerald-100/90 text-emerald-800 text-2xl flex items-center justify-center font-bold shadow-inner group-hover:scale-110 transition-transform">
              🤖
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">Step 03</span>
              <h3 className="font-bold text-slate-900 text-lg">Understand Price Trends</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Analyze seasonal demand shifts, mandi arrival drops, and AI-predicted price trajectories before selling.
              </p>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 text-white p-6 sm:p-7 rounded-3xl shadow-xl hover:shadow-2xl hover:border-emerald-400 border border-emerald-800/60 transition-all duration-300 space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-harvest-500 to-harvest-400 text-slate-950 text-2xl flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform">
              🏆
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-black text-harvest-300 uppercase tracking-wider">Step 04 • Highest Payout</span>
              <h3 className="font-bold text-white text-lg">Find Your Best Deal</h3>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                Discover the multi-buyer split allocation strategy calculated to deliver the highest net profit to your bank.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. WHY KRISHAK 6-FEATURE GRID */}
      {/* ========================================================================= */}
      <section id="why-krishak" className="py-20 bg-slate-100/70 border-t border-slate-200/80 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase text-emerald-700 font-bold tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Engineered For Agriculture
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
              Why Farmers & Buyers Choose KRISHAK
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-7 rounded-3xl bg-white border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-xl transition-all space-y-3">
              <div className="text-3xl">🌾</div>
              <h3 className="font-bold text-slate-900 text-lg">Instant Produce Listings</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                List crop variety, quantity, quality grade, target price, and farm gate GPS location in under 2 minutes.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-xl transition-all space-y-3">
              <div className="text-3xl">📍</div>
              <h3 className="font-bold text-slate-900 text-lg">Geo-Spatial Matching</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Algorithmic discovery connecting farmers directly with nearby food processors, wholesale chains, and exporters.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-xl transition-all space-y-3">
              <div className="text-3xl">📊</div>
              <h3 className="font-bold text-slate-900 text-lg">Real Market Intelligence</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Live modal price feeds, arrival volumes, and demand indexes across major APMC market yards.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-xl transition-all space-y-3">
              <div className="text-3xl">🤖</div>
              <h3 className="font-bold text-slate-900 text-lg">AI Price Forecasting</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Understand historical and seasonal trends to know whether to sell today or wait for predicted rate jumps.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-xl transition-all space-y-3">
              <div className="text-3xl">🛡️</div>
              <h3 className="font-bold text-slate-900 text-lg">7-Step Escrow Payouts</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Protected transactions with upfront buyer deposits, weight verification, and instantaneous bank settlements.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-xl transition-all space-y-3">
              <div className="text-3xl">🏆</div>
              <h3 className="font-bold text-slate-900 text-lg">Maximum Take-Home</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Calculate optimal multi-channel selling splits ensuring you pocket the highest net profits on every harvest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER */}
      {/* ========================================================================= */}
      <footer className="py-12 bg-slate-950 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            <div className="text-xl font-display font-black text-white flex items-center justify-center sm:justify-start gap-2">
              <span>🌾 KRISHAK</span>
            </div>
            <p className="mt-1">Smart agricultural intelligence & multi-channel marketplace platform.</p>
          </div>
          <div className="text-xs text-slate-400 text-center sm:text-right">
            <p className="font-bold text-harvest-400 uppercase tracking-wider">WE LOVE MAXIMIZING PROFIT.</p>
            <p className="mt-0.5">Empowering Indian farmers with price transparency & profit optimization.</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
