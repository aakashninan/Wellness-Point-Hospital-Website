import { Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
      role: 'Orthopedic Surgeon (MBBS, D Ortho, CFA)',
      image: '/doctor3.jpg',
      desc: 'Expert in bone and joint care including fracture management, sports injuries, and joint replacement surgeries using modern techniques.',
      hours: [
        'Mon, Wed, Fri: 05:30 PM - 07:00 PM',
      ],
    },
    {
      dept: 'Emergency & Trauma Care',
      doctor: 'Dr. Amal',
      role: 'Emergency Medicine Specialist (MBBS)',
      image: '/doctor4.jpg',
      desc: 'Leads emergency response care, trauma stabilization, and acute medical interventions with rapid decision-making expertise.',
      hours: [
        '24/7 Emergency Availability',
      ],
    },
  ];

  const handleBook = (doc) => {
    navigate('/book-appointment', { state: { doctor: doc } });
  };

  return (
    <div className="bg-[#fafaf8] min-h-screen py-16 px-6 md:px-12 lg:px-24">

      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-slate-900">
          Our Medical Experts
        </h1>
        <p className="mt-4 text-slate-600 text-lg leading-relaxed">
          Dedicated specialists delivering precise, compassionate and evidence-based care across all departments.
        </p>
      </div>

      {/* CARDS */}
      <div className="space-y-12 max-w-5xl mx-auto">

        {doctors.map((doc, idx) => (
          <div
            key={idx}
            className="flex flex-col md:flex-row bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-[300px]"
          >

            {/* IMAGE */}
            <div className="md:w-1/3 w-full h-[300px] overflow-hidden bg-slate-100">
              <img
                src={doc.image}
                alt={doc.doctor}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* CONTENT */}
            <div className="md:w-2/3 p-8 md:p-10 flex flex-col justify-center space-y-3 overflow-hidden">

              {/* DEPARTMENT */}
              <div className="flex items-center gap-2 text-emerald-700 uppercase tracking-[0.25em] text-xs font-medium">
                <Stethoscope className="h-4 w-4" />
                {doc.dept}
              </div>

              {/* NAME */}
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
                {doc.doctor}
              </h2>

              {/* ROLE */}
              <p className="text-sm font-medium text-slate-500">
                {doc.role}
              </p>

              {/* DESCRIPTION */}
              <p className="text-slate-600 leading-relaxed text-sm md:text-base line-clamp-3">
                {doc.desc}
              </p>

              {/* OP HOURS (IMPROVED UI) */}
              <div className="mt-1">
                <div className="flex items-center gap-2 text-slate-800 font-medium text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  OP Hours
                </div>

                <div className="mt-2 space-y-1 pl-4 border-l border-slate-200">
                  {doc.hours.map((h, i) => (
                    <p
                      key={i}
                      className="text-sm md:text-[13.5px] text-slate-600 leading-relaxed"
                    >
                      {h}
                    </p>
                  ))}
                </div>
              </div>

              {/* BUTTON */}
              <div className="pt-2">
                <button
                  onClick={() => handleBook(doc)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition"
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