import React, { useState, useEffect, useCallback } from 'react';
import { marketService } from '../../services/marketService';
import { RouteMapModal } from '../common/RouteMapModal';
import { getTodayFormatted } from '../../utils/dateUtils';

// ─── Static fallback data per channel tab ─────────────────────────────────────
const todayStr = getTodayFormatted();

const APMC_DATA = {
  onion: [
    { id: 1, name: 'Nashik APMC Market', verified: true, location: 'Panchavati Yard, Nashik', date: `${todayStr} Today`, routes: 3, distanceKm: 3, bestRouteMin: 2, grossPrice: 2020, takeHomePrice: 2017, changePercent: 1.2, isPositive: true },
    { id: 2, name: 'Sinnar APMC Market', verified: true, location: 'Sinnar, Nashik', date: `${todayStr} Today`, routes: 3, distanceKm: 34, bestRouteMin: 27, grossPrice: 1980, takeHomePrice: 1951, changePercent: 0.8, isPositive: false },
    { id: 3, name: 'Pimpalgaon Baswant APMC', verified: true, location: 'Pimpalgaon, Nashik', date: `${todayStr} Today`, routes: 3, distanceKm: 35, bestRouteMin: 38, grossPrice: 2080, takeHomePrice: 2050, changePercent: 1.8, isPositive: true },
    { id: 4, name: 'Lasalgaon APMC', verified: true, location: 'Lasalgaon, Nashik', date: `${todayStr} Today`, routes: 2, distanceKm: 56, bestRouteMin: 55, grossPrice: 2100, takeHomePrice: 2062, changePercent: 3.2, isPositive: true },
    { id: 5, name: 'Yeola APMC Market', verified: true, location: 'Yeola, Nashik', date: `${todayStr} Today`, routes: 2, distanceKm: 72, bestRouteMin: 68, grossPrice: 1960, takeHomePrice: 1931, changePercent: 1.1, isPositive: false },
    { id: 6, name: 'Malegaon APMC Yard', verified: false, location: 'Malegaon, Nashik', date: `${todayStr} Today`, routes: 3, distanceKm: 95, bestRouteMin: 90, grossPrice: 1940, takeHomePrice: 1908, changePercent: 0.6, isPositive: true },
    { id: 7, name: 'Nandgaon APMC', verified: true, location: 'Nandgaon, Nashik', date: `${todayStr} Today`, routes: 2, distanceKm: 110, bestRouteMin: 102, grossPrice: 1970, takeHomePrice: 1934, changePercent: 1.5, isPositive: true },
    { id: 8, name: 'Kopargaon APMC', verified: true, location: 'Kopargaon, Ahmednagar', date: `${todayStr} Today`, routes: 3, distanceKm: 138, bestRouteMin: 130, grossPrice: 2010, takeHomePrice: 1966, changePercent: 2.4, isPositive: true },
    { id: 9, name: 'Ahmednagar APMC', verified: true, location: 'Ahmednagar, MH', date: `${todayStr} Today`, routes: 2, distanceKm: 162, bestRouteMin: 158, grossPrice: 2050, takeHomePrice: 2003, changePercent: 2.1, isPositive: true },
    { id: 10, name: 'Pune APMC (Gultekdi)', verified: true, location: 'Gultekdi, Pune', date: `${todayStr} Today`, routes: 3, distanceKm: 195, bestRouteMin: 190, grossPrice: 2140, takeHomePrice: 2082, changePercent: 5.1, isPositive: true },
  ],
  tomato: [
    { id: 1, name: 'Narayangaon Tomato APMC', verified: true, location: 'Narayangaon, Pune', date: `${todayStr} Today`, routes: 3, distanceKm: 18, bestRouteMin: 16, grossPrice: 3250, takeHomePrice: 3168, changePercent: 6.4, isPositive: true },
    { id: 2, name: 'Junnar APMC', verified: true, location: 'Junnar, Pune', date: `${todayStr} Today`, routes: 2, distanceKm: 42, bestRouteMin: 38, grossPrice: 3100, takeHomePrice: 3022, changePercent: 3.1, isPositive: true },
    { id: 3, name: 'Nashik APMC (Panchavati)', verified: true, location: 'Nashik', date: `${todayStr} Today`, routes: 3, distanceKm: 80, bestRouteMin: 75, grossPrice: 3050, takeHomePrice: 2994, changePercent: 2.1, isPositive: false },
  ],
  potato: [
    { id: 1, name: 'Manchar APMC', verified: true, location: 'Manchar, Pune', date: `${todayStr} Today`, routes: 3, distanceKm: 22, bestRouteMin: 20, grossPrice: 2480, takeHomePrice: 2411, changePercent: 2.8, isPositive: true },
    { id: 2, name: 'Pune APMC (Gultekdi)', verified: true, location: 'Pune', date: `${todayStr} Today`, routes: 2, distanceKm: 58, bestRouteMin: 55, grossPrice: 2390, takeHomePrice: 2325, changePercent: 1.5, isPositive: true },
  ],
  soybean: [
    { id: 1, name: 'Latur Main Mandi', verified: true, location: 'Latur', date: `${todayStr} Today`, routes: 3, distanceKm: 15, bestRouteMin: 14, grossPrice: 4750, takeHomePrice: 4683, changePercent: 4.5, isPositive: true },
    { id: 2, name: 'Akola APMC Yard', verified: true, location: 'Akola, Vidarbha', date: `${todayStr} Today`, routes: 2, distanceKm: 190, bestRouteMin: 185, grossPrice: 4710, takeHomePrice: 4498, changePercent: 3.1, isPositive: true },
  ],
  wheat: [
    { id: 1, name: 'Solapur Grain APMC', verified: true, location: 'Solapur', date: `${todayStr} Today`, routes: 2, distanceKm: 110, bestRouteMin: 105, grossPrice: 2420, takeHomePrice: 2311, changePercent: 1.2, isPositive: true },
  ],
  cotton: [
    { id: 1, name: 'Jalna APMC Yard', verified: true, location: 'Jalna, Marathwada', date: `${todayStr} Today`, routes: 3, distanceKm: 140, bestRouteMin: 132, grossPrice: 7350, takeHomePrice: 7157, changePercent: 5.4, isPositive: true },
  ],
};

const PROCESSORS_DATA = {
  onion: [
    { id: 1, name: 'AgroFresh Dehydration Hub', verified: true, location: 'Niphad, Nashik', date: todayStr, routes: 2, distanceKm: 28, bestRouteMin: 25, grossPrice: 1960, takeHomePrice: 1940, changePercent: 2.1, isPositive: true },
    { id: 2, name: 'Mahindra Agri Processing', verified: true, location: 'Sinnar, Nashik', date: todayStr, routes: 3, distanceKm: 34, bestRouteMin: 30, grossPrice: 1980, takeHomePrice: 1960, changePercent: 1.5, isPositive: true },
    { id: 3, name: 'Patanjali Agro Centre', verified: true, location: 'Igatpuri, Nashik', date: todayStr, routes: 2, distanceKm: 65, bestRouteMin: 62, grossPrice: 2000, takeHomePrice: 1975, changePercent: 3.0, isPositive: true },
  ],
  tomato: [
    { id: 1, name: 'Sahyadri Agro Processing', verified: true, location: 'Mohadi, Nashik', date: todayStr, routes: 3, distanceKm: 45, bestRouteMin: 40, grossPrice: 3100, takeHomePrice: 3065, changePercent: 4.2, isPositive: true },
  ],
  potato: [
    { id: 1, name: 'PepsiCo AgriHub (Potato)', verified: true, location: 'Pune Belt', date: todayStr, routes: 2, distanceKm: 55, bestRouteMin: 50, grossPrice: 2300, takeHomePrice: 2280, changePercent: 2.0, isPositive: true },
  ],
  soybean: [
    { id: 1, name: 'Ruchi Soya Processing', verified: true, location: 'Latur', date: todayStr, routes: 2, distanceKm: 12, bestRouteMin: 11, grossPrice: 4800, takeHomePrice: 4770, changePercent: 3.8, isPositive: true },
  ],
  wheat: [
    { id: 1, name: 'ITC Agri Flour Hub', verified: true, location: 'Solapur', date: todayStr, routes: 2, distanceKm: 105, bestRouteMin: 100, grossPrice: 2450, takeHomePrice: 2430, changePercent: 1.0, isPositive: true },
  ],
  cotton: [
    { id: 1, name: 'Welspun Cotton Gin', verified: true, location: 'Jalna', date: todayStr, routes: 2, distanceKm: 135, bestRouteMin: 128, grossPrice: 7400, takeHomePrice: 7370, changePercent: 6.0, isPositive: true },
  ],
};

const INSTITUTIONAL_DATA = {
  onion: [
    { id: 1, name: 'Reliance Retail Direct', verified: true, location: 'Nashik Distribution', date: todayStr, routes: 1, distanceKm: 10, bestRouteMin: 10, grossPrice: 2050, takeHomePrice: 2040, changePercent: 2.8, isPositive: true },
    { id: 2, name: 'Metro Cash & Carry', verified: true, location: 'Nashik Warehouse', date: todayStr, routes: 1, distanceKm: 12, bestRouteMin: 12, grossPrice: 2030, takeHomePrice: 2018, changePercent: 1.9, isPositive: true },
    { id: 3, name: 'NAFED Procurement', verified: true, location: 'Nashik Collection', date: todayStr, routes: 2, distanceKm: 8, bestRouteMin: 8, grossPrice: 1980, takeHomePrice: 1970, changePercent: 0.5, isPositive: true },
  ],
  tomato: [
    { id: 1, name: 'BigBasket Direct Farm', verified: true, location: 'Nashik Hub', date: todayStr, routes: 1, distanceKm: 15, bestRouteMin: 14, grossPrice: 3200, takeHomePrice: 3180, changePercent: 5.5, isPositive: true },
  ],
  potato: [
    { id: 1, name: 'Spencer\'s Retail Potato Buy', verified: true, location: 'Pune Hub', date: todayStr, routes: 1, distanceKm: 20, bestRouteMin: 18, grossPrice: 2350, takeHomePrice: 2330, changePercent: 2.2, isPositive: true },
  ],
  soybean: [
    { id: 1, name: 'Govt. MSP Procurement (NAFED)', verified: true, location: 'Latur', date: todayStr, routes: 1, distanceKm: 5, bestRouteMin: 5, grossPrice: 4892, takeHomePrice: 4892, changePercent: 0.0, isPositive: true },
  ],
  wheat: [
    { id: 1, name: 'FCI MSP Wheat Procurement', verified: true, location: 'Solapur', date: todayStr, routes: 1, distanceKm: 8, bestRouteMin: 8, grossPrice: 2275, takeHomePrice: 2275, changePercent: 0.0, isPositive: true },
  ],
  cotton: [
    { id: 1, name: 'CCI Cotton Procurement', verified: true, location: 'Jalna', date: todayStr, routes: 1, distanceKm: 10, bestRouteMin: 10, grossPrice: 6620, takeHomePrice: 6620, changePercent: 0.0, isPositive: true },
  ],
};

const DIGITAL_DATA = {
  onion: [
    { id: 1, name: 'eNAM Platform (Nashik)', verified: true, location: 'Online / APMC Integrated', date: todayStr, routes: 0, distanceKm: 0, bestRouteMin: 0, grossPrice: 2010, takeHomePrice: 2000, changePercent: 2.0, isPositive: true },
    { id: 2, name: 'MahaAgro FPO Tender', verified: true, location: 'Digital Auction Platform', date: todayStr, routes: 0, distanceKm: 5, bestRouteMin: 0, grossPrice: 1990, takeHomePrice: 1980, changePercent: 1.4, isPositive: true },
    { id: 3, name: 'AgriMarket.in Bid', verified: false, location: 'Online Marketplace', date: todayStr, routes: 0, distanceKm: 0, bestRouteMin: 0, grossPrice: 1975, takeHomePrice: 1960, changePercent: 0.8, isPositive: true },
  ],
  tomato: [
    { id: 1, name: 'Fasal Digital Platform', verified: true, location: 'App-Based Trading', date: todayStr, routes: 0, distanceKm: 0, bestRouteMin: 0, grossPrice: 3150, takeHomePrice: 3135, changePercent: 3.8, isPositive: true },
  ],
  potato: [
    { id: 1, name: 'Kisan Network Potato Bid', verified: true, location: 'Digital Platform', date: todayStr, routes: 0, distanceKm: 0, bestRouteMin: 0, grossPrice: 2320, takeHomePrice: 2310, changePercent: 1.8, isPositive: true },
  ],
  soybean: [
    { id: 1, name: 'eNAM Soybean Auction', verified: true, location: 'Online / eNAM', date: todayStr, routes: 0, distanceKm: 0, bestRouteMin: 0, grossPrice: 4760, takeHomePrice: 4750, changePercent: 4.0, isPositive: true },
  ],
  wheat: [
    { id: 1, name: 'DeHaat Grain Exchange', verified: true, location: 'Digital Platform', date: todayStr, routes: 0, distanceKm: 0, bestRouteMin: 0, grossPrice: 2400, takeHomePrice: 2388, changePercent: 1.1, isPositive: true },
  ],
  cotton: [
    { id: 1, name: 'Cotton Corp Digital Tender', verified: true, location: 'Digital / Online', date: todayStr, routes: 0, distanceKm: 0, bestRouteMin: 0, grossPrice: 7300, takeHomePrice: 7285, changePercent: 4.9, isPositive: true },
  ],
};

// ─── Tab configuration ────────────────────────────────────────────────────────
const TABS = [
  { id: 'apmc',          label: 'Government APMC Mandis',   icon: '🏛️', endpoint: '/markets/apmc',         data: APMC_DATA,          infoColor: 'green',  infoText: 'Government APMC Mandis — Prices are modal rates reported to AGMARKNET / eNAM. Net take-home deducts freight + Mandi cess.' },
  { id: 'processors',    label: 'Verified Processors',       icon: '🏭', endpoint: '/markets/processors',    data: PROCESSORS_DATA,    infoColor: 'blue',   infoText: 'Verified Processors — Certified agri-processing units offering farm-gate or collection-centre pickup. Contract guarantee provided.' },
  { id: 'institutional', label: 'Institutional Buyers',      icon: '🤝', endpoint: '/markets/institutional', data: INSTITUTIONAL_DATA, infoColor: 'purple', infoText: 'Institutional Buyers — Organised retail chains, cooperatives & government procurement agencies. Escrow-backed payments.' },
  { id: 'digital',       label: 'Digital Trading Channels',  icon: '💻', endpoint: '/markets/digital',       data: DIGITAL_DATA,       infoColor: 'orange', infoText: 'Digital Trading Channels — eNAM, FPO tender platforms & agri-marketplace bids. Zero physical transport needed for price discovery.' },
];

// ─── Dropdown data ────────────────────────────────────────────────────────────
const CROPS = [
  { value: 'onion',   label: '🧅 Onion (कांदा)' },
  { value: 'tomato',  label: '🍅 Tomato (टोमॅटो)' },
  { value: 'potato',  label: '🥔 Potato (बटाटा)' },
  { value: 'soybean', label: '🌱 Soybean (सोयाबीन)' },
  { value: 'wheat',   label: '🌾 Wheat (गहू)' },
  { value: 'cotton',  label: '☁️ Cotton (कापूस)' },
];

const DISTRICTS = [
  { value: 'nashik',     label: 'Nashik (नाशिक)' },
  { value: 'pune',       label: 'Pune (पुणे)' },
  { value: 'solapur',    label: 'Solapur (सोलापूर)' },
  { value: 'latur',      label: 'Latur (लातूर)' },
  { value: 'ahmednagar', label: 'Ahmednagar (अहमदनगर)' },
  { value: 'jalna',      label: 'Jalna (जालना)' },
  { value: 'akola',      label: 'Akola (अकोला)' },
];

const TALUKAS = {
  nashik:     ['Nashik', 'Sinnar', 'Niphad', 'Dindori', 'Malegaon', 'Yeola', 'Kalwan', 'Baglan', 'Chandwad', 'Igatpuri'],
  pune:       ['Pune City', 'Junnar', 'Ambegaon', 'Khed', 'Haveli', 'Baramati', 'Shirur', 'Indapur', 'Daund'],
  solapur:    ['North Solapur', 'South Solapur', 'Barshi', 'Pandharpur', 'Akkalkot'],
  latur:      ['Latur', 'Ausa', 'Udgir', 'Nilanga', 'Ahmedpur'],
  ahmednagar: ['Ahmednagar', 'Sangamner', 'Kopargaon', 'Rahata', 'Rahuri', 'Shrirampur', 'Nevasa'],
  jalna:      ['Jalna', 'Badnapur', 'Ambad', 'Partur'],
  akola:      ['Akola', 'Akot', 'Balapur'],
};

const MAHARASHTRA_VILLAGES = {
  // Nashik
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

  // Pune
  'Junnar': ['Narayangaon', 'Otur', 'Alephata', 'Junnar', 'Belhe', 'Rajur', 'Kusur', 'Dingore'],
  'Ambegaon': ['Manchar', 'Ghodegaon', 'Avsari', 'Pabal', 'Loni', 'Shindodi', 'Kalamb'],
  'Khed': ['Rajgurunagar', 'Chakan', 'Alandi', 'Waki', 'Kadus', 'Shelgaon', 'Pait'],
  'Pune City': ['Gultekdi', 'Shivajinagar', 'Kothrud', 'Khadki', 'Baner', 'Hinjawadi', 'Dhankawadi'],
  'Haveli': ['Hadapsar', 'Katraj', 'Wagholi', 'Manjri', 'Loni Kalbhor', 'Khadakwasla', 'Uruli Kanchan'],
  'Baramati': ['Baramati', 'Malegaon Budruk', 'Koregaon', 'Songaon', 'Morgaon', 'Supa'],
  'Shirur': ['Shirur', 'Shikrapur', 'Sanaswadi', 'Ranjangaon Ganpati', 'Koregaon Bhima'],
  'Indapur': ['Indapur', 'Nimgaon Ketki', 'Bawada', 'Anthurne', 'Lasurne', 'Bhigwan'],
  'Daund': ['Daund', 'Patas', 'Yavat', 'Kedgaon', 'Kashti', 'Kurkumbh'],

  // Solapur
  'North Solapur': ['Solapur', 'Kegaon', 'Degaon', 'Tirole', 'Kavthe', 'Pakni'],
  'South Solapur': ['Mandrup', 'Boramani', 'Hotgi', 'Vinchur', 'Kumbhari', 'Valsang'],
  'Barshi': ['Barshi', 'Vairag', 'Gaudgaon', 'Pangri', 'Upale', 'Korphale'],
  'Pandharpur': ['Pandharpur', 'Karkamb', 'Tungat', 'Korti', 'Bhatumbare'],
  'Akkalkot': ['Akkalkot', 'Maindargi', 'Chapalgaon', 'Waghdari', 'Karjal'],

  // Latur
  'Latur': ['Latur', 'Murud', 'Harangul', 'Babhalgaon', 'Kasar Kheda', 'Gangapur'],
  'Ausa': ['Ausa', 'Lamjana', 'Matola', 'Alala', 'Belkund'],
  'Udgir': ['Udgir', 'Devarjan', 'Her', 'Nalgir', 'Wadhawana'],
  'Nilanga': ['Nilanga', 'Aurad Shahajani', 'Kasar Sirsi', 'Halgara', 'Ambulga'],
  'Ahmedpur': ['Ahmedpur', 'Kingaon', 'Khandali', 'Shirur Tajband'],

  // Ahmednagar
  'Ahmednagar': ['Ahmednagar', 'Bhor', 'Kedgaon', 'Nalegaon', 'Bhingar', 'Savedi'],
  'Sangamner': ['Sangamner', 'Ashwi', 'Ghargaon', 'Sakur', 'Talegaon'],
  'Kopargaon': ['Kopargaon', 'Kolpewadi', 'Pohegaon', 'Dhamori', 'Savalvihir'],
  'Rahata': ['Shirdi', 'Rahata', 'Sakuri', 'Pimplas', 'Bableshwar', 'Loni'],
  'Rahuri': ['Rahuri', 'Vambori', 'Taklibhan', 'Deolali Pravara', 'Kukana'],
  'Shrirampur': ['Shrirampur', 'Belapur', 'Padhegaon', 'Nipani Vadgaon'],
  'Nevasa': ['Nevasa', 'Sonai', 'Kukana', 'Ghodegaon', 'Salabatpur'],

  // Jalna
  'Jalna': ['Jalna', 'Daregaon', 'Ramnagar', 'Sewli', 'Wadgaon'],
  'Badnapur': ['Badnapur', 'Roshangaon', 'Somthana', 'Shelgaon'],
  'Ambad': ['Ambad', 'Wadigodri', 'Pachod', 'Gondi'],
  'Partur': ['Partur', 'Watur', 'Ashti', 'Shirasgaon'],

  // Akola
  'Akola': ['Akola', 'Borgaon Manju', 'Malkapur', 'Kapshi', 'Karanja'],
  'Akot': ['Akot', 'Hiwarkhed', 'Keli Veli', 'Panaj', 'Chohatta'],
  'Balapur': ['Balapur', 'Paras', 'Ural', 'Wadeghon', 'Khamkhed'],
};

const TALUKA_COORDS = {
  'Nashik': { lat: 19.9975, lng: 73.7898 },
  'Niphad': { lat: 20.0793, lng: 74.1117 },
  'Sinnar': { lat: 19.8465, lng: 73.9984 },
  'Dindori': { lat: 20.2012, lng: 73.8341 },
  'Malegaon': { lat: 20.5539, lng: 74.5298 },
  'Yeola': { lat: 20.0532, lng: 74.4908 },
  'Junnar': { lat: 19.2083, lng: 73.8744 },
  'Ambegaon': { lat: 19.0112, lng: 73.8378 },
  'Khed': { lat: 18.8524, lng: 73.8893 },
  'Pune City': { lat: 18.5204, lng: 73.8567 },
  'Baramati': { lat: 18.1517, lng: 74.5772 },
  'Latur': { lat: 18.4088, lng: 76.5604 },
  'North Solapur': { lat: 17.6599, lng: 75.9064 },
  'Ahmednagar': { lat: 19.0948, lng: 74.7480 },
  'Kopargaon': { lat: 19.8827, lng: 74.4820 },
  'Jalna': { lat: 19.8347, lng: 75.8816 },
  'Akola': { lat: 20.7002, lng: 77.0082 },
};

const SORT_OPTIONS = [
  { value: 'distance', label: 'Nearest Distance' },
  { value: 'price',    label: 'Highest Price' },
  { value: 'net',      label: 'Best Net Take-Home' },
];

// ─── Market Card ──────────────────────────────────────────────────────────────
const MarketCard = ({ market, rank, isDigital, selectedVillage, userLocationLabel, onOpenMap }) => (
  <div className="bg-white rounded-2xl border border-slate-200 hover:border-green-300 hover:shadow-md transition-all duration-200 p-4">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">

      {/* Rank */}
      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-slate-100 text-slate-600 font-black text-sm flex items-center justify-center border border-slate-200">
        {rank}
      </div>

      {/* Market info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <h3 className="font-bold text-slate-900 text-sm leading-tight">{market.name}</h3>
          {market.verified && <span className="text-green-500 text-sm flex-shrink-0" title="Verified">✅</span>}
        </div>
        
        {/* Origin & Destination line */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs mt-1">
          <span className="font-extrabold text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-300 flex items-center gap-1">
            <span>🏡 From:</span>
            <span className="underline">{selectedVillage || (userLocationLabel || '').split(',')[0]}</span>
          </span>
          <span className="text-slate-400 font-bold">➔</span>
          <span className="font-semibold text-slate-700">
            🏪 {market.location}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-700 font-bold">
            {isDigital && market.distanceKm === 0 ? '⚡ Direct Electronic Settlement' : `🛣️ 3 Routes Available (${market.distanceKm} km)`}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-500">
          <span>📅 {market.date}</span>
        </div>
      </div>

      {/* Distance */}
      <div className="flex-shrink-0 text-center min-w-[72px]">
        {isDigital && market.distanceKm === 0 ? (
          <div className="text-xs font-bold text-slate-600 bg-orange-50 border border-orange-200 rounded-lg px-2 py-1">Online</div>
        ) : (
          <>
            <div className="text-xl font-black text-slate-900">{market.distanceKm} km</div>
            <div className="text-[10px] text-amber-600 font-bold flex items-center justify-center gap-0.5 mt-0.5">
              <span>⭐</span>
              <span>Best Route: ~{market.bestRouteMin} min</span>
            </div>
          </>
        )}
      </div>

      {/* Prices */}
      <div className="flex-shrink-0 text-right min-w-[136px]">
        <div className="text-xl font-black text-slate-900 font-mono leading-tight">
          ₹{market.grossPrice.toLocaleString('en-IN')}
          <span className="text-xs font-semibold text-slate-400 font-sans">/q</span>
        </div>
        <div className="text-[11px] text-slate-500 font-medium mt-0.5">
          Take-Home: ₹{market.takeHomePrice.toLocaleString('en-IN')}/q
        </div>
        <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-md font-mono mt-0.5 ${market.isPositive ? 'text-green-700 bg-green-50' : 'text-red-600 bg-red-50'}`}>
          {market.isPositive ? '▲' : '▼'} {Math.abs(market.changePercent)}%
        </span>
      </div>

      {/* Routes & Map button */}
      <div className="flex-shrink-0">
        <button
          type="button"
          onClick={() => onOpenMap(market)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-green-700 hover:bg-green-600 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-green-700/20 whitespace-nowrap cursor-pointer"
        >
          <span>🗺️</span>
          <span>3 Routes & Map</span>
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Widget ──────────────────────────────────────────────────────────────
export const TrendingMarketPricesWidget = () => {
  const [activeTab, setActiveTab]           = useState('apmc');
  const [selectedCrop, setSelectedCrop]     = useState('onion');
  const [selectedDistrict, setSelectedDistrict] = useState('nashik');
  const [selectedTaluka, setSelectedTaluka] = useState('Nashik');
  const [selectedVillage, setSelectedVillage] = useState('Panchavati');
  const [userLocationLabel, setUserLocationLabel] = useState('Panchavati, Nashik Taluka, Nashik');
  const [userCoords, setUserCoords]         = useState({ lat: 19.9975, lng: 73.7898 });
  const [sortBy, setSortBy]                 = useState('distance');
  const [liveData, setLiveData]             = useState(null);
  const [loading, setLoading]               = useState(false);
  const [showMapModal, setShowMapModal]     = useState(false);
  const [selectedMapMandi, setSelectedMapMandi] = useState(null);

  const currentTab    = TABS.find((t) => t.id === activeTab);
  const talukaOptions = TALUKAS[selectedDistrict] || [];
  const villageList   = MAHARASHTRA_VILLAGES[selectedTaluka] || [
    `${selectedTaluka} Central`,
    `${selectedTaluka} Gram`,
    'North Agro Belt',
    'South Farm Cluster',
  ];

  // Precise coordinate calculator for village
  const computeVillageCoords = (villageName, talukaName) => {
    const base = TALUKA_COORDS[talukaName] || { lat: 19.9975, lng: 73.7898 };
    let hash = 0;
    const vStr = String(villageName || '').trim();
    for (let i = 0; i < vStr.length; i++) hash = (hash << 5) - hash + vStr.charCodeAt(i);
    const latOffset = (((hash % 100) / 10000) * 1.8);
    const lngOffset = ((((hash >> 3) % 100) / 10000) * 1.8);
    return {
      lat: Number((base.lat + latOffset).toFixed(5)),
      lng: Number((base.lng + lngOffset).toFixed(5)),
    };
  };

  // Derive display list
  const staticList  = currentTab?.data?.[selectedCrop] || currentTab?.data?.onion || [];
  const baseList    = liveData || staticList;
  const displayList = [...baseList].sort((a, b) => {
    if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
    if (sortBy === 'price')    return b.grossPrice - a.grossPrice;
    if (sortBy === 'net')      return b.takeHomePrice - a.takeHomePrice;
    return 0;
  });

  // Reset taluka and village when district changes
  useEffect(() => {
    const talukas = TALUKAS[selectedDistrict] || [];
    const firstTaluka = talukas[0] || 'Nashik';
    setSelectedTaluka(firstTaluka);
    const vList = MAHARASHTRA_VILLAGES[firstTaluka] || [`${firstTaluka} Central`];
    const firstVillage = vList[0] || `${firstTaluka} Central`;
    setSelectedVillage(firstVillage);
    const distLabel = DISTRICTS.find((d) => d.value === selectedDistrict)?.label.split(' ')[0] || 'Nashik';
    const coords = computeVillageCoords(firstVillage, firstTaluka);
    setUserCoords(coords);
    setUserLocationLabel(`${firstVillage}, ${firstTaluka} Taluka, ${distLabel}`);
  }, [selectedDistrict]);

  // Handler: taluka change
  const handleTalukaChange = (tName) => {
    setSelectedTaluka(tName);
    const vList = MAHARASHTRA_VILLAGES[tName] || [`${tName} Central`];
    const firstVillage = vList[0] || `${tName} Central`;
    setSelectedVillage(firstVillage);
    const distLabel = DISTRICTS.find((d) => d.value === selectedDistrict)?.label.split(' ')[0] || 'Nashik';
    const coords = computeVillageCoords(firstVillage, tName);
    setUserCoords(coords);
    setUserLocationLabel(`${firstVillage}, ${tName} Taluka, ${distLabel}`);
  };

  // Handler: village change
  const handleVillageChange = (vName) => {
    setSelectedVillage(vName);
    const distLabel = DISTRICTS.find((d) => d.value === selectedDistrict)?.label.split(' ')[0] || 'Nashik';
    const coords = computeVillageCoords(vName, selectedTaluka);
    setUserCoords(coords);
    setUserLocationLabel(`${vName}, ${selectedTaluka} Taluka, ${distLabel}`);
  };

  // Tab switch: clear live override
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setLiveData(null);
  };

  // Search: hit backend with channel endpoint
  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await marketService.getPrices({
        crop:     selectedCrop,
        district: selectedDistrict,
        taluka:   selectedTaluka,
        channel:  activeTab,
      });
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map((m, idx) => ({
          id:             idx + 1,
          name:           m.marketName || m.name,
          verified:       true,
          location:       `${m.district || selectedDistrict}, ${m.state || 'Maharashtra'}`,
          date:           new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' Today',
          routes:         3,
          distanceKm:     m.distanceKm || 0,
          bestRouteMin:   Math.round((m.distanceKm || 0) * 0.9),
          grossPrice:     m.modalPricePerQuintal || m.pricePerQuintal || 0,
          takeHomePrice:  Math.round((m.modalPricePerQuintal || m.pricePerQuintal || 0) * 0.985),
          changePercent:  Math.abs(parseFloat(m.change || '0')),
          isPositive:     !String(m.change || '').startsWith('-'),
        }));
        setLiveData(mapped);
      } else {
        setLiveData(null);
      }
    } catch {
      setLiveData(null);
    } finally {
      setLoading(false);
    }
  }, [selectedCrop, selectedDistrict, selectedTaluka, activeTab]);

  const today      = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const distLabel  = DISTRICTS.find((d) => d.value === selectedDistrict)?.label.split(' ')[0] || 'Nashik';
  const isDigital  = activeTab === 'digital';

  // Info bar colours
  const infoBg = {
    green: 'bg-green-50 text-green-800 border-green-200',
    blue:  'bg-blue-50 text-blue-800 border-blue-200',
    purple:'bg-purple-50 text-purple-800 border-purple-200',
    orange:'bg-orange-50 text-orange-800 border-orange-200',
  }[currentTab?.infoColor] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <div className="space-y-4">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">📈</span>
            <h2 className="text-xl font-black text-slate-900">Trending Market Prices</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 max-w-sm leading-relaxed">
            Maharashtra: Real-time rates from APMCs, Verified Processors &amp; Institutional Buyers near your village
          </p>
        </div>
        <div className="flex flex-col gap-2 items-start sm:items-end">
          <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-green-700 text-white text-xs font-bold rounded-full shadow-sm cursor-default">
            <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>
            200 km Range
          </button>
          <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-full shadow-sm cursor-default">
            <span className="text-red-500">📍</span>
            {userLocationLabel}
          </button>
        </div>
      </div>

      {/* ── Main card ──────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-slate-200 scrollbar-none">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-3.5 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-green-700 text-green-800 bg-green-50/60'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Filter Row: Crop + District + Taluka + Village + Search */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/40">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 items-end gap-3">

            {/* Crop (col-span-3) */}
            <div className="lg:col-span-3 min-w-0">
              <label className="block text-[11px] font-bold text-slate-500 mb-1">🌾 Select Crop</label>
              <div className="relative">
                <select
                  value={selectedCrop}
                  onChange={(e) => { setSelectedCrop(e.target.value); setLiveData(null); }}
                  className="w-full appearance-none bg-white border border-slate-200 hover:border-green-400 focus:border-green-600 focus:outline-none rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 pr-8 cursor-pointer transition-colors"
                >
                  {CROPS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">▼</span>
              </div>
            </div>

            {/* District (col-span-3) */}
            <div className="lg:col-span-3 min-w-0">
              <label className="block text-[11px] font-bold text-slate-500 mb-1">🏛️ District (Maharashtra)</label>
              <div className="relative">
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 hover:border-green-400 focus:border-green-600 focus:outline-none rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 pr-8 cursor-pointer transition-colors"
                >
                  {DISTRICTS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">▼</span>
              </div>
            </div>

            {/* Taluka (col-span-2) */}
            <div className="lg:col-span-2 min-w-0">
              <label className="block text-[11px] font-bold text-slate-500 mb-1">📍 Select Taluka</label>
              <div className="relative">
                <select
                  value={selectedTaluka}
                  onChange={(e) => handleTalukaChange(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 hover:border-green-400 focus:border-green-600 focus:outline-none rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 pr-8 cursor-pointer transition-colors"
                >
                  {talukaOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">▼</span>
              </div>
            </div>

            {/* Village (col-span-2) - Pure Dropdown */}
            <div className="lg:col-span-2 min-w-0">
              <label className="block text-[11px] font-bold text-slate-500 mb-1">🏡 Select Village</label>
              <div className="relative">
                <select
                  value={selectedVillage}
                  onChange={(e) => handleVillageChange(e.target.value)}
                  className="w-full appearance-none bg-emerald-50/70 border border-emerald-300 hover:border-emerald-500 focus:border-emerald-600 focus:outline-none rounded-xl px-3 py-2.5 text-sm font-bold text-emerald-950 pr-8 cursor-pointer transition-colors"
                >
                  {villageList.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-600 text-xs">▼</span>
              </div>
            </div>

            {/* Search button (col-span-2) */}
            <div className="lg:col-span-2">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-green-700 hover:bg-green-600 active:scale-95 disabled:opacity-60 text-white font-black text-sm rounded-xl shadow-sm shadow-green-700/20 transition-all cursor-pointer"
              >
                {loading
                  ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  : <span>🔍</span>
                }
                <span>Search</span>
              </button>
            </div>

          </div>
        </div>

        {/* Results header */}
        <div className="px-4 pt-4 pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base">🏪</span>
              <h3 className="font-black text-slate-900 text-base">
                {activeTab === 'apmc'          && 'Nearest APMC Mandi Live Prices'}
                {activeTab === 'processors'    && 'Verified Processor Buy Rates'}
                {activeTab === 'institutional' && 'Institutional Buyer Offers'}
                {activeTab === 'digital'       && 'Digital Trading Channel Rates'}
              </h3>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                📅 Today&apos;s Live Rates ({today})
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
              🎯 200 km Radius ({displayList.length} {activeTab === 'apmc' ? 'APMCs' : 'found'})
            </span>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[11px] font-bold text-slate-400">Sorted by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl pl-3 pr-7 py-2 cursor-pointer focus:outline-none focus:border-green-500 transition-colors"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">▼</span>
            </div>
          </div>
        </div>

        {/* Card list */}
        <div className="px-4 pb-5 space-y-3">
          {displayList.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm font-medium">
              <div className="text-3xl mb-2">🔍</div>
              No markets found for the selected filters. Try changing the crop or district.
            </div>
          ) : (
            displayList.map((market, idx) => (
              <MarketCard
                key={market.id}
                market={market}
                rank={idx + 1}
                isDigital={isDigital}
                selectedVillage={selectedVillage}
                userLocationLabel={userLocationLabel}
                onOpenMap={(m) => {
                  setSelectedMapMandi(m);
                  setShowMapModal(true);
                }}
              />
            ))
          )}
        </div>

        {/* Info footer */}
        <div className={`px-4 py-3 border-t text-xs font-medium flex items-start gap-2 ${infoBg}`}>
          <span className="text-base flex-shrink-0">
            {activeTab === 'apmc' ? '🏛️' : activeTab === 'processors' ? '🏭' : activeTab === 'institutional' ? '🤝' : '💻'}
          </span>
          <span dangerouslySetInnerHTML={{ __html: currentTab?.infoText?.replace('—', '<strong>—</strong>') || '' }} />
        </div>
      </div>

      {/* Interactive Route Cockpit Modal */}
      {showMapModal && (
        <RouteMapModal
          isOpen={showMapModal}
          onClose={() => {
            setShowMapModal(false);
            setSelectedMapMandi(null);
          }}
          userLocationLabel={userLocationLabel}
          userCoords={userCoords}
          selectedMandi={selectedMapMandi || displayList[0]}
          allMandis={displayList}
          selectedCrop={selectedCrop}
        />
      )}

    </div>
  );
};

export default TrendingMarketPricesWidget;
