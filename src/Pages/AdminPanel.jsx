import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5010/api/appointments";

/* ================= DOCTOR RULES ================= */
const schedules = {
  "Dr. Gikku P Ninan": {
    days: [1, 2, 3, 4, 5, 6],
    slots: [
      { start: "08:00", end: "13:00" },
      { start: "16:00", end: "19:00" },
    ],
  },
  "Dr. Meera Punnoose": {
    days: [1, 2, 3, 4, 5, 6],
    slots: [
      { start: "09:00", end: "13:00" },
      { start: "15:30", end: "19:00" },
    ],
  },
  "Dr. Shinto Thomas George": {
    days: [1, 3, 5],
    slots: [{ start: "17:30", end: "19:00" }],
  },
  "Dr. Amal": { emergency: true },
};

const doctorList = [
  { doctor: "Dr. Gikku P Ninan", dept: "General Medicine" },
  { doctor: "Dr. Meera Punnoose", dept: "ENT" },
  { doctor: "Dr. Shinto Thomas George", dept: "Orthopedics" },
  { doctor: "Dr. Amal", dept: "Emergency" },
];

/* ================= GROUP BY DATE ================= */
const groupByDate = (list) =>
  list.reduce((acc, item) => {
    acc[item.date] = acc[item.date] || [];
    acc[item.date].push(item);
    return acc;
  }, {});

/* ================= COMPONENT ================= */
export default function AdminPanel() {
  const navigate = useNavigate();

  const [isAuth, setIsAuth] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [view, setView] = useState("pending");
  const [openDate, setOpenDate] = useState(null);

  const [login, setLogin] = useState({
    username: "",
    password: "",
  });

  const [manual, setManual] = useState({
    name: "",
    phone: "",
    doctor: "",
    department: "",
    date: "",
    time: "",
    symptoms: "",
    status: "approved",
  });

  /* ================= FETCH ================= */
  const load = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setAppointments(data);
  };

  useEffect(() => {
    if (isAuth) load();
  }, [isAuth]);

  /* ================= LOGIN ================= */
  const handleLogin = (e) => {
    e.preventDefault();
    if (login.username === "wpadmin" && login.password === "wp111168") {
      setIsAuth(true);
    } else alert("Invalid credentials");
  };

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (id, status) => {
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    load();
  };

  /* ================= FILTERS ================= */
  const pending = useMemo(
    () => appointments.filter((a) => a.status !== "approved"),
    [appointments]
  );

  const approved = useMemo(
    () => appointments.filter((a) => a.status === "approved"),
    [appointments]
  );

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000)
    .toISOString()
    .split("T")[0];

  const todayList = approved.filter((a) => a.date === today);
  const tomorrowList = approved.filter((a) => a.date === tomorrow);

  const pendingGrouped = groupByDate(pending);
  const approvedGrouped = groupByDate(approved);

  /* ================= SLOT GENERATION ================= */
  const isTaken = (doctor, date, time) =>
    appointments.some(
      (a) =>
        a.doctor === doctor &&
        a.date === date &&
        a.time === time
    );

  const generateSlots = () => {
    if (!manual.doctor || !manual.date) return [];

    const s = schedules[manual.doctor];
    if (!s || s.emergency) return [];

    const day = new Date(manual.date).getDay();
    if (!s.days.includes(day)) return [];

    let slots = [];

    s.slots.forEach((b) => {
      let [sh, sm] = b.start.split(":").map(Number);
      let [eh, em] = b.end.split(":").map(Number);

      let start = sh * 60 + sm;
      let end = eh * 60 + em;

      for (let t = start; t <= end; t += 15) {
        const time = `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(
          t % 60
        ).padStart(2, "0")}`;

        if (!isTaken(manual.doctor, manual.date, time)) {
          slots.push(time);
        }
      }
    });

    return slots;
  };

  const slots = generateSlots();

  /* ================= ADD ================= */
  const add = async (e) => {
    e.preventDefault();

    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(manual),
    });

    alert("Added");
    load();
  };

  /* ================= LOGIN SCREEN ================= */
  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf8]">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-3xl shadow w-[380px] space-y-4"
        >
          <h1 className="text-2xl font-serif text-center">Admin Login</h1>

          <input
            placeholder="Username"
            className="w-full p-3 border rounded-xl"
            onChange={(e) =>
              setLogin({ ...login, username: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-xl"
            onChange={(e) =>
              setLogin({ ...login, password: e.target.value })
            }
          />

          <button className="w-full bg-slate-900 text-white py-3 rounded-xl">
            Login
          </button>
        </form>
      </div>
    );
  }

  /* ================= UI (IMPROVED ONLY, SAFE) ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-slate-900">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Manage hospital appointments efficiently
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="px-5 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition"
        >
          Home
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-2 flex-wrap bg-white p-2 rounded-2xl shadow-sm w-fit">
        {["pending", "approved", "today", "tomorrow", "add"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              view === v
                ? "bg-emerald-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {v.toUpperCase()}
          </button>
        ))}
      </div>

      {/* TODAY */}
      {view === "today" && (
        <div className="space-y-3">
          <h2 className="font-semibold">Today</h2>
          {todayList.map((a) => (
            <div key={a._id} className="bg-white p-4 rounded-xl shadow-sm">
              {a.name} • {a.doctor} • {a.time}
            </div>
          ))}
        </div>
      )}

      {/* TOMORROW */}
      {view === "tomorrow" && (
        <div className="space-y-3">
          <h2 className="font-semibold">Tomorrow</h2>
          {tomorrowList.map((a) => (
            <div key={a._id} className="bg-white p-4 rounded-xl shadow-sm">
              {a.name} • {a.doctor} • {a.time}
            </div>
          ))}
        </div>
      )}

      {/* PENDING */}
      {view === "pending" && (
        <div className="space-y-3">
          {Object.keys(pendingGrouped).map((date) => (
            <div key={date} className="bg-white rounded-2xl shadow-sm">
              <button
                onClick={() =>
                  setOpenDate(openDate === date ? null : date)
                }
                className="w-full text-left p-4 font-semibold flex justify-between"
              >
                📅 {date}
                <span className="text-xs text-slate-500">
                  {pendingGrouped[date].length}
                </span>
              </button>

              {openDate === date && (
                <div className="p-4 space-y-2">
                  {pendingGrouped[date].map((a) => (
                    <div
                      key={a._id}
                      className="flex justify-between bg-slate-50 p-3 rounded-xl"
                    >
                      <div>
                        {a.name} • {a.doctor} • {a.time}
                      </div>

                      <button
                        onClick={() =>
                          updateStatus(a._id, "approved")
                        }
                        className="bg-emerald-600 text-white px-3 py-1 rounded-lg"
                      >
                        Approve
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* APPROVED */}
      {view === "approved" && (
        <div className="space-y-3">
          {Object.keys(approvedGrouped).map((date) => (
            <div
              key={date}
              className="bg-emerald-50 p-4 rounded-xl"
            >
              <h2 className="font-semibold">📅 {date}</h2>
              {approvedGrouped[date].map((a) => (
                <div key={a._id} className="text-sm mt-2">
                  {a.name} • {a.doctor} • {a.time}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ADD */}
      {view === "add" && (
        <form
          onSubmit={add}
          className="bg-white p-6 rounded-2xl space-y-3 max-w-xl"
        >
          <input
            placeholder="Name"
            className="w-full p-3 border rounded-xl"
            onChange={(e) =>
              setManual({ ...manual, name: e.target.value })
            }
          />

          <input
            placeholder="Phone"
            className="w-full p-3 border rounded-xl"
            onChange={(e) =>
              setManual({ ...manual, phone: e.target.value })
            }
          />

          <select
            className="w-full p-3 border rounded-xl"
            onChange={(e) => {
              const d = doctorList.find(
                (x) => x.doctor === e.target.value
              );
              setManual({
                ...manual,
                doctor: d.doctor,
                department: d.dept,
              });
            }}
          >
            <option>Select Doctor</option>
            {doctorList.map((d, i) => (
              <option key={i}>{d.doctor}</option>
            ))}
          </select>

          <input
            type="date"
            className="w-full p-3 border rounded-xl"
            onChange={(e) =>
              setManual({ ...manual, date: e.target.value })
            }
          />

          <select
            className="w-full p-3 border rounded-xl"
            onChange={(e) =>
              setManual({ ...manual, time: e.target.value })
            }
          >
            <option>Select Time</option>
            {slots.map((t, i) => (
              <option key={i}>{t}</option>
            ))}
          </select>

          <button className="w-full bg-slate-900 text-white py-3 rounded-xl">
            Create Appointment
          </button>
        </form>
      )}
    </div>
  );
}