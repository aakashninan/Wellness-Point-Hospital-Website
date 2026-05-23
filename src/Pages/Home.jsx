import { Link } from 'react-router-dom';
import { ArrowRight, Feather, Droplets, Waves, HeartPulse } from 'lucide-react';
import HospitalLogo from './logo.jpg';

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-[#fafaf8] to-white text-slate-900 min-h-screen relative overflow-hidden">

      {/* Floating Ambient Blobs */}
      <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-emerald-100/40 blur-3xl rounded-full" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-sky-100/30 blur-3xl rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 py-14 space-y-32">

        {/* HERO SECTION */}
        <section className="relative rounded-[40px] border border-white/60 bg-white/70 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.06)] overflow-hidden">

          {/* subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-emerald-50/30 to-white" />

          <div className="relative z-10 px-8 py-20 md:px-20 text-center flex flex-col items-center">

            {/* Logo */}
            <div className="mb-10">
              <div className="flex items-center gap-3 bg-white/80 border border-slate-100 px-6 py-3 rounded-2xl shadow-sm">
               
                <img src={HospitalLogo} alt="logo" className="h-12 w-auto" />
              </div>
            </div>

            {/* Heading */}
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight">
              Committed to
              <span className="block text-emerald-700 mt-3">
                Compassionate Care
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-8 max-w-3xl text-lg md:text-xl text-slate-600 leading-relaxed">
              Wellness Point Hospital blends modern medical excellence with empathy,
              dignity, and deeply personalized healing experiences.
            </p>

            {/* CTA Buttons */}
            <div className="mt-12 flex flex-wrap justify-center gap-5">

              {/* PRIMARY CTA → BOOK APPOINTMENT */}
              <Link
                to="/book-appointment"
                className="group bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-medium shadow-lg shadow-emerald-200/50 transition-all duration-300 hover:-translate-y-1"
              >
                Request Consultation
                <ArrowRight className="inline ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* SECONDARY CTA */}
              <Link
                to="/contact"
                className="px-8 py-4 rounded-2xl border border-slate-200 bg-white/70 hover:bg-white text-slate-700 hover:text-emerald-700 transition-all duration-300 shadow-sm"
              >
                Contact Us
              </Link>

            </div>
          </div>
        </section>

        {/* VALUES SECTION */}
        <section className="space-y-14">

          {/* Header */}
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

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Card 1 */}
            <div className="group p-10 rounded-[28px] bg-white/70 backdrop-blur-xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
              <Feather className="h-7 w-7 text-emerald-600 mb-6" />
              <h3 className="text-xl font-semibold mb-3">Tailored Recovery</h3>
              <p className="text-slate-600 leading-relaxed">
                Personalized treatment journeys designed around individual needs.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group p-10 rounded-[28px] bg-white/70 backdrop-blur-xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
              <Droplets className="h-7 w-7 text-emerald-600 mb-6" />
              <h3 className="text-xl font-semibold mb-3">Refined Expertise</h3>
              <p className="text-slate-600 leading-relaxed">
                Advanced diagnostics with precision-driven medical care.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group p-10 rounded-[28px] bg-white/70 backdrop-blur-xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
              <Waves className="h-7 w-7 text-emerald-600 mb-6" />
              <h3 className="text-xl font-semibold mb-3">Peaceful Environment</h3>
              <p className="text-slate-600 leading-relaxed">
                A healing space designed for comfort, trust, and calm recovery.
              </p>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
