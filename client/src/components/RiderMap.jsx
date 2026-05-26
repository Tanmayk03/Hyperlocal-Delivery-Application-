import React, { useEffect, useRef, useState } from 'react';
import { FaPhoneAlt, FaStar, FaMotorcycle, FaCheck, FaUserCircle } from 'react-icons/fa';

const ROUTE = [
  [26.8467, 80.9462], // Hazratganj (Warehouse)
  [26.8475, 80.9500],
  [26.8480, 80.9530],
  [26.8485, 80.9560],
  [26.8490, 80.9600],
  [26.8495, 80.9630],
  [26.8500, 80.9660],
  [26.8505, 80.9700],
  [26.8510, 80.9730],
  [26.8515, 80.9760],
  [26.8520, 80.9785]  // Gomti Nagar (User Address)
];

const RiderMap = () => {
  const mapRef = useRef(null);
  const riderMarkerRef = useRef(null);
  const [step, setStep] = useState(0); // 0: Assigned, 1: Out for Delivery, 2: Arriving, 3: Arrived
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes countdown
  
  useEffect(() => {
    if (!window.L) return;
    const L = window.L;

    // 1. Initialize Map around Lucknow
    const map = L.map('rider-map', {
      zoomControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false
    }).setView([26.8490, 80.9630], 14);
    
    mapRef.current = map;

    // 2. Add Tiles (Sleek light tile style)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    // 3. Add Custom Markers (using vector SVGs instead of emojis)
    const hubIcon = L.divIcon({
      html: `<div class="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center border-2 border-white shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-white"><path d="M3 3h18v2H3V3zm1 4l-1 5v2h1v7h12v-7h4v-2l-1-5H4zm2 2h2v3H6V9zm10 0h2v3h-2V9zm-6 5h4v5h-4v-5z"/></svg>
      </div>`,
      className: '',
      iconSize: [32, 32]
    });

    const homeIcon = L.divIcon({
      html: `<div class="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center border-2 border-white shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-white"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
      </div>`,
      className: '',
      iconSize: [32, 32]
    });

    const riderIcon = L.divIcon({
      html: `<div class="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center border-2 border-white shadow-xl animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-white"><path d="M19.5 13c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5zm-15 0c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5zm16.5-4h-2.22l-1.33-4H11.5l1.33 4H9.5c-.83 0-1.5.67-1.5 1.5V13h8v-2h2.5c.83 0 1.5-.67 1.5-1.5z"/></svg>
      </div>`,
      className: '',
      iconSize: [36, 36]
    });

    L.marker(ROUTE[0], { icon: hubIcon }).addTo(map).bindPopup("<b>HyperLocal Warehouse</b>");
    L.marker(ROUTE[ROUTE.length - 1], { icon: homeIcon }).addTo(map).bindPopup("<b>Your Delivery Point</b>");

    // 4. Draw Polyline Route
    L.polyline(ROUTE, { color: '#16a34a', weight: 4, opacity: 0.7, dashArray: '6, 6' }).addTo(map);

    // 5. Add Rider Marker
    const rider = L.marker(ROUTE[0], { icon: riderIcon }).addTo(map);
    riderMarkerRef.current = rider;

    return () => {
      map.remove();
    };
  }, []);

  // 6. Simulate Rider GPS movements and steps
  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setStep(3);
          return 0;
        }
        return prev - 10;
      });
    }, 10000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  // Handle step and position transitions
  useEffect(() => {
    if (timeRemaining <= 0) {
      setStep(3);
      if (riderMarkerRef.current) riderMarkerRef.current.setLatLng(ROUTE[ROUTE.length - 1]);
      return;
    }

    const elapsed = 120 - timeRemaining; // 0 to 120
    const routeIndex = Math.min(
      Math.floor((elapsed / 120) * ROUTE.length),
      ROUTE.length - 1
    );

    if (riderMarkerRef.current) {
      riderMarkerRef.current.setLatLng(ROUTE[routeIndex]);
      if (mapRef.current) {
        mapRef.current.panTo(ROUTE[routeIndex]);
      }
    }

    // Update status step based on progress
    if (elapsed < 30) {
      setStep(0); // Assigned
    } else if (elapsed < 80) {
      setStep(1); // Out for Delivery
    } else if (elapsed < 110) {
      setStep(2); // Arriving
    } else {
      setStep(3); // Arrived
    }
  }, [timeRemaining]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden max-w-lg mx-auto mt-6">
      {/* Simulation Header / Timer */}
      <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
        <div>
          <span className="bg-green-600/10 text-green-700 text-[10px] font-extrabold tracking-wide uppercase px-2.5 py-1 rounded-full">
            On the way
          </span>
          <h3 className="text-lg font-bold text-slate-800 mt-2">Arriving in {Math.ceil(timeRemaining / 60)} Mins</h3>
        </div>
        <div className="bg-slate-900 text-white rounded-xl px-4 py-2.5 text-center shadow shadow-slate-900/20">
          <p className="text-[10px] uppercase font-bold tracking-wider opacity-75">Distance</p>
          <p className="text-sm font-extrabold">1.4 km away</p>
        </div>
      </div>

      {/* Map Container */}
      <div id="rider-map" className="w-full h-[240px] z-10 relative bg-slate-50"></div>

      {/* Stepper Status Indicators */}
      <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between gap-2 bg-slate-50/50 select-none">
        {[
          { label: "Assigned", stepVal: 0 },
          { label: "Out for Delivery", stepVal: 1 },
          { label: "Arriving Soon", stepVal: 2 },
          { label: "Arrived", stepVal: 3 }
        ].map((item) => (
          <div key={item.stepVal} className="flex flex-col items-center flex-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              step >= item.stepVal 
                ? 'bg-green-600 text-white shadow-md shadow-green-500/20' 
                : 'bg-slate-200 text-slate-400'
            }`}>
              {step > item.stepVal ? <FaCheck size={10} /> : item.stepVal + 1}
            </div>
            <span className={`text-[9px] font-bold mt-2 text-center transition-colors duration-300 ${
              step >= item.stepVal ? 'text-slate-800' : 'text-slate-400'
            }`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Rider Info Card */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-slate-400">
            <FaUserCircle size={44} />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-800">Tanmay Kumar</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-bold text-slate-500 flex items-center gap-0.5">
                <FaStar className="text-yellow-400" /> 4.9
              </span>
              <span className="text-slate-300 text-xs">•</span>
              <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                <FaMotorcycle /> Hero Splendor
              </span>
            </div>
          </div>
        </div>
        
        <a 
          href="tel:+919876543210"
          className="bg-green-50 hover:bg-green-100 text-green-700 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm border border-green-200/50"
        >
          <FaPhoneAlt size={14} />
        </a>
      </div>
    </div>
  );
};

export default RiderMap;
