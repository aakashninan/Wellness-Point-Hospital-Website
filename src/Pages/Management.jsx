import { ShieldCheck } from 'lucide-react';
import gikkuImg from './gikku.jpg';
import meeraImg from './meera.jpg';

export default function Management() {
  const team = [
    {
      name: 'Dr. Gikku P Ninan',
      role: 'Founder & Managing Director',
      desc: 'Oversees hospital vision, infrastructure development, and long-term strategic planning with a focus on patient-centered care and sustainable healthcare growth.',
      img: gikkuImg,
      tag: 'Leadership',
    },
    {
      name: 'Manu Murali Madhavan',
      role: 'Hospital Administrator',
      desc: 'Manages daily hospital operations, coordination between departments, resource allocation, and administrative efficiency across all services.',
      img: '/admin.jpg',
      tag: 'Operations',
    },
    {
      name: 'Dr. Meera Punnoose',
      role: 'Chief Operational Officer',
      desc: 'Responsible for clinical workflow optimization, emergency readiness systems, and maintaining healthcare delivery standards.',
      img: meeraImg,
      tag: 'Clinical Ops',
    },
    {
      name: 'Remya P M',
      role: 'Chief Nurse In-Charge',
      desc: 'Leads the nursing department, patient care coordination, and ensures compassionate bedside care across all inpatient units.',
      img: '/nurse.jpg',
      tag: 'Nursing',
    },
  ];

  return (
    <div className="bg-[#fafaf8] min-h-screen py-16 px-6 md:px-12 lg:px-24">

      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-slate-900">
          Hospital Management
        </h1>
        <p className="mt-4 text-slate-600 text-lg leading-relaxed">
          Guided by experienced leadership committed to compassionate care,
          operational excellence, and community-focused healthcare delivery.
        </p>
      </div>

      {/* CARDS */}
      <div className="space-y-12 max-w-5xl mx-auto">

        {team.map((member, idx) => (
          <div
            key={idx}
            className="flex flex-col md:flex-row bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-[260px]"
          >

            {/* IMAGE SECTION (FIXED SIZE + NO GROWTH) */}
            <div className="md:w-1/3 w-full h-[260px] overflow-hidden bg-slate-100">
              <img
                src={member.img}
                alt={member.name}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* CONTENT */}
            <div className="md:w-2/3 p-8 md:p-10 flex flex-col justify-center space-y-4 overflow-hidden">

              {/* TAG */}
              <div className="flex items-center gap-2 text-emerald-700 uppercase tracking-[0.25em] text-xs font-medium">
                <ShieldCheck className="h-4 w-4" />
                {member.tag}
              </div>

              {/* NAME */}
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
                {member.name}
              </h2>

              {/* ROLE */}
              <p className="text-sm font-medium text-slate-500">
                {member.role}
              </p>

              {/* DESCRIPTION (CLAMP TO PREVENT GROWTH) */}
              <p className="text-slate-600 leading-relaxed text-sm md:text-base line-clamp-4">
                {member.desc}
              </p>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}