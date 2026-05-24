import { Stethoscope, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; // 1. Imported Helmet safely
import gikkuImg from './gikku.jpg';
import meeraImg from './meera.jpg';

export default function Doctors() {
  const navigate = useNavigate();

  const doctors = [
    {
      dept: 'General Medicine',
      doctor: 'Dr. Gikku P Ninan',
      role: 'Chief Physician (MBBS, MD)',
      image: gikkuImg,
      desc: 'Provides comprehensive primary care with expertise in diagnosis, chronic disease management, and preventive healthcare focused on long-term patient wellness.',
      hours: [
        'Mon - Sat: 08:00 AM - 01:00 PM',
        'Mon - Sat: 04:00 PM - 07:00 PM',
      ],
    },
    {
      dept: 'ENT (Ear, Nose & Throat)',
      doctor: 'Dr. Meera Punnoose',
      role: 'ENT Specialist (MBBS, DLO)',
      image: meeraImg,
      desc: 'Specialist in ENT diagnostics, sinus treatments, hearing disorders, and minimally invasive procedures ensuring precise patient care.',
      hours: [
        'Mon - Sat: 09:00 AM - 01:00 PM',
        'Mon - Sat: 03:30 PM - 07:00 PM',
      ],
    },
    {
      dept: 'Orthopedics',
      doctor: 'Dr. Shinto Thomas George',
      image: '/doctor3.jpg',
      role: 'Orthopedic Surgeon (MBBS, D Ortho, CFA)',
      desc: 'Expert in bone and joint care including fracture management, sports injuries, and joint replacement surgeries using modern techniques.',
      hours: ['Mon, Wed, Fri: 05:30 PM - 07:00 PM'],
    },
    {
      dept: 'Emergency & Trauma Care',
      doctor: 'Dr. Amal',
      image: '/doctor4.jpg',
      role: 'Emergency Medicine Specialist (MBBS)',
      desc: 'Leads emergency response care, trauma stabilization, and acute medical interventions with rapid decision-making expertise.',
      hours: ['24/7 Emergency Availability'],
    },
  ];

  const handleBook = (doc) => {
    navigate('/book-appointment', { state: { doctor: doc } });
  };

  return (
    <div className="bg-[#fafaf8] min-h-screen py-16 px-6 md:px-12 lg:px-24">

      {/* 2. SEO META TAGS ADDED SPECIFIC TO SPECIALISTS PAGE */}
      <Helmet>
        <title>Our Specialist Doctors | Wellness Point Hospital Peruva</title>
        <meta 
          name="description" 
          content="Meet the medical specialists at Wellness Point Hospital. Expert doctors in General Medicine, ENT, Orthopedics, and Emergency Care serving Moorkattilpady, Kerala." 
        />
        <meta 
          name="keywords" 
          content="Doctors in Peruva, Wellness Point doctors, General physician Moorkattilpady, ENT specialist Peruva, Orthopedic surgeon Kottayam Kerala" 
        />
        <link rel="canonical" href="https://wellnesspointhospital.vercel.app/doctors" />
      </Helmet>

      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="flex justify-center items-center gap-2 text-emerald-600 mb-3">
          <Star className="h-5 w-5" />
          <p className="uppercase tracking-[0.3em] text-sm font-semibold">
            Our Medical Heroes
          </p>
          <Star className="h-5 w-5" />
        </div>

        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-slate-900">
          Meet the Specialists Who Heal Lives
        </h1>

        <p className="mt-4 text-slate-600 text-lg leading-relaxed">
          Dedicated specialists delivering precise, compassionate care across all departments.
        </p>
      </div>

      {/* CARDS */}
      <div className="space-y-14 max-w-5xl mx-auto">

        {doctors.map((doc, idx) => (
          <div
            key={idx}
            className="relative group flex flex-col md:flex-row items-center bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
          >

            {/* IMAGE SECTION */}
            <div className="md:w-1/3 flex items-center justify-center py-14 bg-gradient-to-b from-emerald-50/50 to-white">

              <div className="relative">

                {/* glow */}
                <div className="absolute inset-0 rounded-full bg-emerald-200 blur-3xl opacity-40 group-hover:opacity-70 transition" />

                {/* BIGGER IMAGE CIRCLE */}
                <img
                  src={doc.image}
                  alt={doc.doctor}
                  className="relative w-60 h-60 md:w-72 md:h-72 rounded-full object-cover border-4 border-white shadow-2xl group-hover:scale-105 transition duration-500"
                />
              </div>
            </div>

            {/* CONTENT */}
            <div className="md:w-2/3 p-10 flex flex-col justify-center space-y-3">

              <div className="flex items-center gap-2 text-emerald-700 uppercase tracking-[0.25em] text-xs font-medium">
                <Stethoscope className="h-4 w-4" />
                {doc.dept}
              </div>

              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 group-hover:text-emerald-700 transition">
                {doc.doctor}
              </h2>

              <p className="text-sm font-medium text-slate-500">
                {doc.role}
              </p>

              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                {doc.desc}
              </p>

              <div className="mt-2">
                <div className="flex items-center gap-2 text-slate-800 font-medium text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  OP Hours
                </div>

                <div className="mt-2 space-y-1 pl-4 border-l border-slate-200">
                  {doc.hours.map((h, i) => (
                    <p key={i} className="text-sm text-slate-600">
                      {h}
                    </p>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => handleBook(doc)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 hover:scale-105 transition"
                >
                  Book Appointment
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}