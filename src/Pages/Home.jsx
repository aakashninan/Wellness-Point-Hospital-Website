import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Feather,
  Droplets,
  Waves,
  HeartPulse,
} from 'lucide-react';

import { useEffect, useState } from 'react';
import HospitalLogo from './logo.jpg';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const moveCursor = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', moveCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7faf8] text-slate-900">

      {/* INTERACTIVE CURSOR GLOW */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition duration-300"
        style={{
          background: `radial-gradient(
            500px at ${mousePosition.x}px ${mousePosition.y}px,
            rgba(16,185,129,0.12),
            transparent 75%
          )`,
        }}
      />

      {/* BACKGROUND BLURS */}
      <div className="absolute top-[-150px] left-[-150px] w-[450px] h-[450px] bg-emerald-100/40 rounded-full blur-3xl animate-pulse" />

      <div className="absolute bottom-[-150px] right-[-150px] w-[450px] h-[450px] bg-sky-100/30 rounded-full blur-3xl animate-pulse" />

      {/* GRID OVERLAY */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:70px_70px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-10">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-[40px] border border-white/60 bg-white/70 backdrop-blur-3xl shadow-[0_20px_80px_rgba(0,0,0,0.06)]">

          {/* GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-emerald-50/40 to-white" />

          {/* FLOATING SHIMMER */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-[-100%] h-full w-[50%] rotate-12 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shine_10s_linear_infinite]" />
          </div>

          <div className="relative z-10 grid lg:grid-cols-2 items-center gap-16 px-8 md:px-20 py-24">

            {/* LEFT CONTENT */}
            <div className="relative">

              {/* LOGO CARD */}
              <div className="inline-flex items-center gap-4 px-6 py-4 rounded-3xl bg-white/80 backdrop-blur-xl border border-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">

                <img
                  src={HospitalLogo}
                  alt="Hospital Logo"
                  className="h-14 w-auto"
                />

                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-emerald-600 font-semibold">
                    Wellness Point
                  </p>

                  <p className="text-slate-500 text-sm">
                    Compassion • Trust • Healing
                  </p>
                </div>

              </div>

              {/* FLOATING BADGE */}
              <div className="mt-8 inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/80 backdrop-blur-xl border border-white shadow-lg animate-bounce">

                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />

                <span className="text-sm tracking-wide text-slate-700">
                  Human-Centered Healthcare
                </span>

              </div>

              {/* HEADING */}
              <h1 className="mt-10 font-serif text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight">

                Committed to

                <span className="block text-emerald-700 mt-4">
                  Compassionate Care
                </span>

              </h1>

              {/* PULSE LINE */}
              <div className="mt-8 overflow-hidden">
                <div className="h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-pulse" />
              </div>

              {/* SUBTITLE */}
              <p className="mt-8 text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl">
                Wellness Point Hospital blends modern medical excellence with empathy,
                dignity, and deeply personalized healing experiences.
              </p>

              {/* CTA BUTTONS */}
              <div className="mt-12 flex flex-wrap gap-5">

                {/* PRIMARY */}
                <Link
                  to="/book-appointment"
                  className="group relative overflow-hidden px-8 py-4 rounded-2xl bg-emerald-600 text-white font-medium shadow-[0_10px_40px_rgba(16,185,129,0.35)] hover:scale-105 hover:-translate-y-2 transition-all duration-500"
                >

                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 opacity-0 group-hover:opacity-20 transition duration-500" />

                  <span className="relative z-10 flex items-center">
                    Request Consultation

                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>

                </Link>

                {/* SECONDARY */}
                <Link
                  to="/contact"
                  className="px-8 py-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                >
                  Contact Us
                </Link>

              </div>
            </div>

            {/* RIGHT VISUAL */}
            <div className="relative flex justify-center items-center h-[600px]">

              {/* ORB GLOW */}
              <div className="absolute w-72 h-72 rounded-full bg-emerald-100/40 blur-3xl animate-pulse" />

              {/* CENTRAL CORE */}
              <div className="relative z-20 w-44 h-44 rounded-full bg-white/80 backdrop-blur-2xl border border-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] flex items-center justify-center">

                <HeartPulse className="h-20 w-20 text-emerald-600 animate-pulse" />

              </div>

              {/* FLOAT CARD 1 */}
              <div className="absolute top-10 left-0 animate-[float_6s_ease-in-out_infinite]">

                <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-xl w-64 hover:scale-105 transition-all duration-500">

                  <Feather className="h-8 w-8 text-emerald-600 mb-4" />

                  <h3 className="font-semibold text-lg">
                    Tailored Recovery
                  </h3>

                  <p className="text-slate-500 text-sm mt-2">
                    Personalized treatment journeys designed around individual needs.
                  </p>

                </div>

              </div>

              {/* FLOAT CARD 2 */}
              <div className="absolute bottom-16 left-12 animate-[float_8s_ease-in-out_infinite]">

                <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-xl w-64 hover:scale-105 transition-all duration-500">

                  <Droplets className="h-8 w-8 text-emerald-600 mb-4" />

                  <h3 className="font-semibold text-lg">
                    Refined Expertise
                  </h3>

                  <p className="text-slate-500 text-sm mt-2">
                    Advanced diagnostics with precision-driven medical care.
                  </p>

                </div>

              </div>

              {/* FLOAT CARD 3 */}
              <div className="absolute top-24 right-0 animate-[float_7s_ease-in-out_infinite]">

                <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-xl w-64 hover:scale-105 transition-all duration-500">

                  <Waves className="h-8 w-8 text-emerald-600 mb-4" />

                  <h3 className="font-semibold text-lg">
                    Peaceful Environment
                  </h3>

                  <p className="text-slate-500 text-sm mt-2">
                    A healing space designed for comfort, trust, and calm recovery.
                  </p>

                </div>

              </div>

            </div>

          </div>
        </section>

        {/* VALUES SECTION */}
        <section className="mt-32">

          <div className="text-center max-w-2xl mx-auto">

            <p className="uppercase tracking-[0.4em] text-sm text-emerald-600 font-semibold">
              Our Philosophy
            </p>

            <h2 className="mt-5 font-serif text-4xl md:text-5xl">
              Care That Feels Personal
            </h2>

            <p className="mt-4 text-slate-500">
              A calm, precise, and human-centered approach to healthcare.
            </p>

          </div>

          {/* INTERACTIVE CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">

            {[
              {
                icon: Feather,
                title: 'Tailored Recovery',
                desc: 'Personalized treatment journeys designed around individual needs.',
              },
              {
                icon: Droplets,
                title: 'Refined Expertise',
                desc: 'Advanced diagnostics with precision-driven medical care.',
              },
              {
                icon: Waves,
                title: 'Peaceful Environment',
                desc: 'A healing space designed for comfort, trust, and calm recovery.',
              },
            ].map((item, i) => {
              const Icon = item.icon;

              return (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-[32px] border border-white/60 bg-white/70 backdrop-blur-2xl p-10 shadow-sm hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-4"
                >

                  {/* HOVER GLOW */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-emerald-50 via-transparent to-transparent" />

                  <div className="relative z-10">

                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">

                      <Icon className="h-7 w-7 text-emerald-600" />

                    </div>

                    <h3 className="text-xl font-semibold mb-3">
                      {item.title}
                    </h3>

                    <p className="text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>

                  </div>

                </div>
              );
            })}

          </div>

        </section>

      </div>
    </div>
  );
}