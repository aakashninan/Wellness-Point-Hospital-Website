import { useState } from 'react';
import { Clock, Home, Pill, Scan, FlaskConical, Sparkles, Shield, Activity } from 'lucide-react';

export default function Facilities() {
  const [activeIndex, setActiveIndex] = useState(null);

  const facilities = [
    {
      title: '24/7 Casualty & Emergency Care',
      desc: 'Round-the-clock emergency response unit equipped for trauma stabilization, critical care, and urgent medical intervention with immediate doctor availability.',
      icon: Clock,
      tag: 'Critical Care',
    },
    {
      title: 'Spacious Inpatient Rooms',
      desc: 'Well-ventilated, private, and semi-private inpatient rooms designed for comfort, recovery, and continuous medical supervision.',
      icon: Home,
      tag: 'Comfort & Recovery',
    },
    {
      title: '24-Hour Pharmacy Services',
      desc: 'Fully stocked in-house pharmacy operating day and night to ensure uninterrupted access to essential medications and prescriptions.',
      icon: Pill,
      tag: 'Support System',
    },

    // ✅ NEW LABORATORY (replaces X-Ray position)
    {
      title: 'Advanced Clinical Laboratory',
      desc: 'Fully equipped diagnostic laboratory offering fast and accurate blood tests, urine analysis, and comprehensive pathology services for precise treatment decisions.',
      icon: FlaskConical,
      tag: 'Diagnostics',
    },
  ];

  return (
    <div className="relative bg-[#fafaf8] min-h-screen overflow-hidden px-6 md:px-12 lg:px-24 py-20">

      {/* FLOATING BACKGROUND ENERGY */}
      <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-emerald-100/40 blur-3xl rounded-full animate-pulse" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-sky-100/30 blur-3xl rounded-full animate-pulse" />

      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-20 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 text-emerald-700 text-sm shadow-sm mb-6">
          <Sparkles className="h-4 w-4" />
          Designed for Complete Care Experience
        </div>

        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-slate-900">
          More Than Facilities — A Healthcare Ecosystem
        </h1>

        <p className="mt-5 text-slate-600 text-lg leading-relaxed">
          From emergency response to diagnostics, every layer of our hospital is built
          to ensure seamless, continuous, and compassionate care.
        </p>
      </div>

      {/* STATS STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-16 relative z-10">
        {[
          { icon: Shield, label: '24/7 Safety' },
          { icon: Activity, label: 'Critical Care Ready' },
          { icon: Clock, label: 'Instant Response' },
          { icon: Sparkles, label: 'Modern Infrastructure' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition"
            >
              <Icon className="h-5 w-5 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm text-slate-700">{item.label}</p>
            </div>
          );
        })}
      </div>

      {/* FACILITIES GRID */}
      <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto relative z-10">

        {facilities.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeIndex === idx;

          return (
            <div
              key={idx}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
              className={`relative group cursor-pointer transition-all duration-500 rounded-3xl border bg-white/70 backdrop-blur-xl p-8 overflow-hidden
              ${isActive ? 'shadow-2xl scale-[1.02] border-emerald-200' : 'shadow-sm border-slate-100'}`}
            >

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-emerald-50 via-transparent to-transparent" />

              <div className="relative z-10 mb-4 inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
                <Sparkles className="h-3 w-3" />
                {item.tag}
              </div>

              <div className="relative z-10 w-14 h-14 rounded-2xl bg-white shadow-inner flex items-center justify-center mb-5 group-hover:scale-110 transition">
                <Icon className="h-6 w-6 text-emerald-600" />
              </div>

              <h2 className="relative z-10 text-xl md:text-2xl font-semibold text-slate-900 mb-3">
                {item.title}
              </h2>

              <p className="relative z-10 text-slate-600 leading-relaxed text-base">
                {item.desc}
              </p>

              <div className="relative z-10 mt-6 text-xs text-emerald-600 opacity-0 group-hover:opacity-100 transition">
                Integrated into hospital-wide care network →
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ X-RAY MOVED TO BOTTOM CENTER */}
      <div className="flex justify-center mt-14 relative z-10">
        <div className="w-full max-w-md group cursor-pointer rounded-3xl border bg-white/70 backdrop-blur-xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] border-slate-100">

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-emerald-50 via-transparent to-transparent rounded-3xl" />

          <div className="relative z-10 mb-4 inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
            <Sparkles className="h-3 w-3" />
            Diagnostics
          </div>

          <div className="relative z-10 w-14 h-14 rounded-2xl bg-white shadow-inner flex items-center justify-center mb-5 group-hover:scale-110 transition">
            <Scan className="h-6 w-6 text-emerald-600" />
          </div>

          <h2 className="relative z-10 text-xl md:text-2xl font-semibold text-slate-900 mb-3">
            Advanced X-Ray Facility
          </h2>

          <p className="relative z-10 text-slate-600 leading-relaxed text-base">
            High-precision digital radiology unit enabling fast and accurate diagnostic imaging for effective treatment planning.
          </p>

          <div className="relative z-10 mt-6 text-xs text-emerald-600 opacity-0 group-hover:opacity-100 transition">
            Integrated into hospital-wide care network →
          </div>

        </div>
      </div>

      {/* FOOTER INSIGHT STRIP */}
      <div className="max-w-4xl mx-auto mt-24 text-center relative z-10">
        <div className="bg-white/70 border border-white rounded-2xl p-8 backdrop-blur-xl shadow-sm">
          <h3 className="font-serif text-2xl text-slate-900">
            Every unit is connected. Every patient is prioritized.
          </h3>
          <p className="mt-3 text-slate-600">
            Our infrastructure is designed to feel seamless — because care should never feel fragmented.
          </p>
        </div>
      </div>

    </div>
  );
}