import { useLocation } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';

export default function BookAppointment() {
  const location = useLocation();
  const selectedDoctor = location.state?.doctor || null;

  const [bookedSlots, setBookedSlots] = useState([]);

  const doctorList = [
    { doctor: 'Dr. Gikku P Ninan', dept: 'General Medicine' },
    { doctor: 'Dr. Meera Punnoose', dept: 'ENT' },
    { doctor: 'Dr. Shinto Thomas George', dept: 'Orthopedics' },
    { doctor: 'Dr. Amal', dept: 'Emergency & Trauma Care' },
  ];

  const schedules = {
    'Dr. Gikku P Ninan': {
      days: [1, 2, 3, 4, 5, 6],
      slots: [
        { start: '08:00', end: '13:00' },
        { start: '16:00', end: '19:00' },
      ],
    },
    'Dr. Meera Punnoose': {
      days: [1, 2, 3, 4, 5, 6],
      slots: [
        { start: '09:00', end: '13:00' },
        { start: '15:30', end: '19:00' },
      ],
    },
    'Dr. Shinto Thomas George': {
      days: [1, 3, 5],
      slots: [{ start: '17:30', end: '19:00' }],
    },
    'Dr. Amal': { emergency: true },
  };

  const [form, setForm] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    doctor: selectedDoctor?.doctor || '',
    department: selectedDoctor?.dept || '',
    symptoms: '',
  });

  useEffect(() => {
    if (!form.doctor || !form.date) return;

    fetch('https://wellness-point-hospital-website-1.onrender.com/api/appointments')
      .then((res) => res.json())
      .then((data) => {
        const taken = data
          .filter((a) => a.doctor === form.doctor && a.date === form.date)
          .map((a) => a.time);

        setBookedSlots(taken);
      })
      .catch((err) => console.error(err));
  }, [form.doctor, form.date]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'doctor') {
      const doc = doctorList.find((d) => d.doctor === value);

      setForm({
        ...form,
        doctor: value,
        department: doc?.dept || '',
        date: '',
        time: '',
      });

      return;
    }

    setForm({ ...form, [name]: value });
  };

  const availableDates = useMemo(() => {
    if (!form.doctor) return [];

    const schedule = schedules[form.doctor];
    if (!schedule || schedule.emergency) return [];

    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);

      if (schedule.days.includes(d.getDay())) {
        dates.push(d.toISOString().split('T')[0]);
      }
    }

    return dates;
  }, [form.doctor]);

  const generateSlots = (doctor, date) => {
    const schedule = schedules[doctor];
    if (!schedule || schedule.emergency) return [];

    const day = new Date(date).getDay();
    if (!schedule.days.includes(day)) return [];

    let slots = [];

    schedule.slots.forEach((block) => {
      let [sh, sm] = block.start.split(':').map(Number);
      let [eh, em] = block.end.split(':').map(Number);

      let start = sh * 60 + sm;
      let end = eh * 60 + em;

      for (let t = start; t <= end; t += 15) {
        const h = String(Math.floor(t / 60)).padStart(2, '0');
        const m = String(t % 60).padStart(2, '0');
        const time = `${h}:${m}`;

        if (!bookedSlots.includes(time)) {
          slots.push(time);
        }
      }
    });

    return slots;
  };

  const timeSlots = useMemo(() => {
    if (!form.doctor || !form.date) return [];
    return generateSlots(form.doctor, form.date);
  }, [form.doctor, form.date, bookedSlots]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (bookedSlots.includes(form.time)) {
      alert('This slot is already booked');
      return;
    }

    try {
      const res = await fetch(
        'https://wellness-point-hospital-website-1.onrender.com/api/appointments',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Slot already booked');
        return;
      }

      alert('Appointment Booked Successfully!');
    } catch (err) {
      console.error(err);
      alert('Error booking appointment');
    }
  };

  const disabled = !form.doctor;

  return (
    <>
      {/* MARQUEE BANNER */}
      <div className="w-full overflow-hidden bg-red-600 text-white font-bold py-2">
        <div className="whitespace-nowrap animate-marquee">
          ⚠️ CURRENTLY UNDER TESTING PHASE — NOT TO FOR COMMERICIAL USE ⚠️
        </div>
      </div>

      <div className="min-h-screen bg-[#fafaf8] px-6 py-12 flex justify-center">
        <div className="w-full max-w-3xl bg-white border border-slate-100 rounded-3xl shadow-sm p-10 space-y-10">

          <div>
            <h1 className="text-3xl font-serif font-semibold text-slate-900">
              Book Appointment
            </h1>
            <p className="text-slate-500 mt-2">
              Select doctor first to unlock available dates & time slots.
            </p>
          </div>

          {selectedDoctor && (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
              <p className="text-emerald-700 text-sm font-medium">
                Selected Doctor
              </p>
              <p className="text-slate-900 font-semibold">
                {selectedDoctor.doctor}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid md:grid-cols-2 gap-4">
              <input
                name="name"
                placeholder="Patient Name"
                className="p-3 border rounded-xl"
                onChange={handleChange}
                required
              />

              <input
                name="phone"
                placeholder="Phone Number"
                className="p-3 border rounded-xl"
                onChange={handleChange}
                required
              />
            </div>

            <select
              name="doctor"
              value={form.doctor}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl bg-white"
              required
            >
              <option value="">Select Doctor</option>
              {doctorList.map((d, i) => (
                <option key={i} value={d.doctor}>
                  {d.doctor} ({d.dept})
                </option>
              ))}
            </select>

            <select
              name="date"
              value={form.date}
              onChange={handleChange}
              disabled={disabled}
              className="w-full p-3 border rounded-xl bg-white disabled:bg-slate-100"
              required
            >
              <option value="">Select Appointment Date</option>
              {availableDates.map((d, i) => (
                <option key={i} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              name="time"
              value={form.time}
              onChange={handleChange}
              disabled={!form.date}
              className="w-full p-3 border rounded-xl bg-white disabled:bg-slate-100"
              required
            >
              <option value="">Select Time Slot</option>
              {timeSlots.map((t, i) => (
                <option key={i} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <input
              name="department"
              value={form.department}
              readOnly
              className="w-full p-3 border rounded-xl bg-slate-50"
            />

            <textarea
              name="symptoms"
              placeholder="Describe symptoms..."
              rows="4"
              className="w-full p-3 border rounded-xl"
              onChange={handleChange}
            />

            <button
              className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition disabled:opacity-50"
              disabled={!form.doctor || !form.date || !form.time}
            >
              Confirm Appointment
            </button>

          </form>
        </div>
      </div>
    </>
  );
}
