import { Clock, Home, Pill, Scan } from 'lucide-react';

export default function Facilities() {
  const facilities = [
    {
      title: '24/7 Casualty & Emergency Care',
      desc: 'Round-the-clock emergency response unit equipped for trauma stabilization, critical care, and urgent medical intervention with immediate doctor availability.',
      icon: Clock,
    },
    {
      title: 'Spacious Inpatient Rooms',
      desc: 'Well-ventilated, private, and semi-private inpatient rooms designed for comfort, recovery, and continuous medical supervision.',
      icon: Home,
    },
    {
      title: '24-Hour Pharmacy Services',
      desc: 'Fully stocked in-house pharmacy operating day and night to ensure uninterrupted access to essential medications and prescriptions.',
      icon: Pill,
    },
    {
      title: 'Advanced X-Ray Facility',
      desc: 'High-precision digital radiology unit enabling fast and accurate diagnostic imaging for effective treatment planning.',
      icon: Scan,
    },
  ];

  return (
    <div className="bg-[#fafaf8] min-h-screen py-16 px-6 md:px-12 lg:px-24">

      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-slate-900">
          Hospital Facilities
        </h1>
        <p className="mt-4 text-slate-600 text-lg leading-relaxed">
          Thoughtfully designed healthcare infrastructure ensuring comfort, safety,
          and uninterrupted medical support at every stage of care.
        </p>
      </div>

      {/* CONTENT */}
      <div className="space-y-16 max-w-5xl mx-auto">

        {facilities.map((item, idx) => {
          const Icon = item.icon;

          return (
            <div
              key={idx}
              className="flex flex-col md:flex-row items-start gap-8 p-10 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300"
            >

              {/* ICON BLOCK */}
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                  <Icon className="h-6 w-6" />
                </div>
              </div>

              {/* TEXT BLOCK */}
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">
                  {item.title}
                </h2>

                <p className="text-slate-600 leading-relaxed text-base">
                  {item.desc}
                </p>
              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}