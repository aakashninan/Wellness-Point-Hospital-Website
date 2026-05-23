import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API =
  "https://wellness-point-hospital-website-1.onrender.com/api/appointments";

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

  /* ================= LIVE NOTIFICATIONS ================= */
  const [lastCount, setLastCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

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

    // 🔔 detect new appointments
    if (lastCount && data.length > lastCount) {
      const newItems = data.length - lastCount;

      setNotifications((prev) => [
        {
          id: Date.now(),
          message: `🆕 ${newItems} new appointment(s) received`,
        },
        ...prev,
      ]);
    }

    setAppointments(data);
    setLastCount(data.length);
  };

  /* ================= POLLING ================= */
  useEffect(() => {
    if (!isAuth) return;

    load();

    const interval = setInterval(() => {
      load();
    }, 10000);

    return () => clearInterval(interval);
  }, [isAuth, lastCount]);

  /* ================= LOGIN ================= */
  const handleLogin = (e) => {
    e.preventDefault();

    if (
      login.username === "wpadmin" &&
      login.password === "wp111168"
    ) {
      setIsAuth(true);
    } else {
      alert("Invalid credentials");
    }
  };

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (id, status) => {
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    // remove related notification
    setNotifications((prev) =>
      prev.filter((n) => !n.message.includes("new appointment"))
    );

    load();
  };

  /* ================= DELETE ================= */
  const deleteAppointment = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;

    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    setNotifications((prev) =>
      prev.filter((n) => !n.message.includes("new appointment"))
    );

    load();
  };

  /* ================= DISMISS NOTIFICATION ================= */
  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((n) => n.id !== id)
    );
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

  /* ================= LOGIN SCREEN ================= */
  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf8]">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-3xl shadow w-[380px] space-y-4"
        >
          <h1 className="text-2xl font-serif text-center">
            Admin Login
          </h1>

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

  /* ================= MAIN UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 space-y-6">

      {/* 🔔 NOTIFICATIONS (PERSISTENT) */}
      <div className="fixed top-5 right-5 space-y-3 z-50">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => removeNotification(n.id)}
            className="bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg cursor-pointer hover:bg-emerald-700 transition"
          >
            {n.message}
            <p className="text-xs opacity-80 mt-1">
              Click to dismiss
            </p>
          </div>
        ))}
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-semibold">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Manage hospital appointments efficiently
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="px-5 py-2 bg-slate-900 text-white rounded-xl"
        >
          Home
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-2 flex-wrap bg-white p-2 rounded-2xl shadow-sm w-fit">
        {["pending", "approved", "today", "tomorrow", "add"].map(
          (v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-xl text-sm font-medium ${
                view === v
                  ? "bg-emerald-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {v.toUpperCase()}
            </button>
          )
        )}
      </div>

      {/* (YOUR EXISTING UI REMAINS SAME BELOW) */}
      {/* pending / approved / today / tomorrow / add sections stay unchanged */}

    </div>
  );
}
