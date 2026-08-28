import React from 'react';

export const WeatherForecastPage = () => {
  const days = [
    { day: 'Wednesday (Today)', date: '28 May 2025', temp: '32°C / 21°C', weather: 'Sunny', icon: '☀️', rain: '0%', humidity: '48%', wind: '14 km/h', advice: 'Optimal for field harvesting and open-air shed drying.' },
    { day: 'Thursday', date: '29 May 2025', temp: '33°C / 21°C', weather: 'Partly Cloudy', icon: '⛅', rain: '10%', humidity: '52%', wind: '12 km/h', advice: 'Favorable storage conditions, low decay risk.' },
    { day: 'Friday', date: '30 May 2025', temp: '32°C / 20°C', weather: 'Light Rain Shower', icon: '🌧️', rain: '65%', humidity: '74%', wind: '18 km/h', advice: 'Ensure onion storage sheds are covered with tarpaulin.' },
    { day: 'Saturday', date: '31 May 2025', temp: '31°C / 19°C', weather: 'Moderate Rain', icon: '🌧️', rain: '80%', humidity: '82%', wind: '22 km/h', advice: 'Avoid transporting produce in open tractor trailers.' },
    { day: 'Sunday', date: '01 June 2025', temp: '30°C / 18°C', weather: 'Thunderstorm', icon: '⛈️', rain: '85%', humidity: '85%', wind: '25 km/h', advice: 'Keep drain channels clear in low-lying plots.' },
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-800">
      
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Agricultural Weather &amp; Harvest Advisory</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Micro-climate radar forecast for Ausa, Latur and surrounding agricultural blocks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Today's Deep Dive */}
        <div className="bg-[#062d1f] text-white p-6 rounded-3xl border border-emerald-700/60 shadow-lg space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">TODAY'S WEATHER</span>
              <div className="text-4xl font-black font-mono text-white mt-1">32°C</div>
              <div className="text-sm font-bold text-amber-300">Sunny • Clear Skies</div>
            </div>
            <span className="text-5xl">☀️</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-emerald-800 text-xs">
            <div>
              <span className="text-emerald-300 block text-[11px]">Humidity</span>
              <span className="font-bold text-white">48% (Optimal)</span>
            </div>
            <div>
              <span className="text-emerald-300 block text-[11px]">Wind Speed</span>
              <span className="font-bold text-white">14 km/h East</span>
            </div>
            <div>
              <span className="text-emerald-300 block text-[11px]">Rain Probability</span>
              <span className="font-bold text-white">0%</span>
            </div>
            <div>
              <span className="text-emerald-300 block text-[11px]">Soil Moisture</span>
              <span className="font-bold text-emerald-300">62% (Good)</span>
            </div>
          </div>
        </div>

        {/* AI Harvest Advisory Note */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <h3 className="font-extrabold text-slate-900 text-base">AI Harvesting &amp; Drying Window</h3>
            </div>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
              You have a prime <strong>48-hour harvesting and sorting window</strong> before the monsoon cloud band brings showers on Friday afternoon. Complete all lot bagging and dispatch to farm-gate buyer pickups by Thursday evening.
            </p>
          </div>
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 font-bold">
            ⚠️ Advisory: Rain alert active for Friday 30 May (65% precipitation chance).
          </div>
        </div>
      </div>

      {/* 5-Day Detailed Grid */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-lg">5-Day Agricultural Forecast</h3>

        <div className="divide-y divide-slate-100">
          {days.map((d, idx) => (
            <div key={idx} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
              <div className="flex items-center gap-3.5">
                <span className="text-3xl">{d.icon}</span>
                <div>
                  <div className="font-extrabold text-slate-900 text-sm">{d.day}</div>
                  <div className="text-slate-500 font-medium">{d.date} • {d.weather}</div>
                </div>
              </div>

              <div className="text-slate-600 max-w-sm font-medium">
                {d.advice}
              </div>

              <div className="text-right font-mono font-bold text-slate-900 text-sm">
                {d.temp}
                <div className="text-[11px] text-slate-400 font-sans font-normal">Rain: {d.rain}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default WeatherForecastPage;
