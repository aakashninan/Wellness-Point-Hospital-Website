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

  /* ================= UPDATE + DELETE ================= */
  const updateStatus = async (id, status) => {
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    load();
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;

    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    load();
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
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

      {/* NOTIFICATIONS */}
      <div className="fixed top-5 right-5 space-y-3 z-50">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => removeNotification(n.id)}
            className="bg-emerald-600 text-white px-4 py-3 rounded-xl shadow cursor-pointer"
          >
            {n.message}
            <p className="text-xs opacity-80">
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

      {/* ================= PENDING ================= */}
      {view === "pending" && (
        <div className="space-y-4">
          {Object.keys(pendingGrouped).map((date) => (
            <div key={date} className="bg-white rounded-2xl shadow-sm">
              <button
                onClick={() =>
                  setOpenDate(openDate === date ? null : date)
                }
                className="w-full p-5 flex justify-between bg-slate-50"
              >
                📅 {date}
              </button>

              {openDate === date && (
                <div className="p-4 space-y-3">
                  {pendingGrouped[date].map((a) => (
                    <div
                      key={a._id}
                      className="flex justify-between bg-slate-50 p-4 rounded-xl"
                    >
                      <div>
                        <h3 className="font-semibold">{a.name}</h3>
                        <p>{a.doctor}</p>
                        <p>{a.time}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            updateStatus(a._id, "approved")
                          }
                          className="bg-emerald-600 text-white px-3 py-1 rounded"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => deleteAppointment(a._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ================= APPROVED ================= */}
      {view === "approved" && (
        <div className="space-y-4">
          {Object.keys(approvedGrouped).map((date) => (
            <div key={date} className="bg-emerald-50 p-5 rounded-2xl">
              <h2>📅 {date}</h2>

              {approvedGrouped[date].map((a) => (
                <div key={a._id} className="bg-white p-4 rounded-xl mb-3">
                  <h3>{a.name}</h3>
                  <p>{a.doctor}</p>
                  <p>{a.time}</p>

                  <button
                    onClick={() => deleteAppointment(a._id)}
                    className="mt-2 bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ================= TODAY ================= */}
      {view === "today" && (
        <div className="space-y-3">
          {todayList.map((a) => (
            <div key={a._id} className="bg-white p-4 rounded-xl">
              <h3>{a.name}</h3>
              <p>{a.doctor}</p>
              <p>{a.time}</p>
            </div>
          ))}
        </div>
      )}

      {/* ================= TOMORROW ================= */}
      {view === "tomorrow" && (
        <div className="space-y-3">
          {tomorrowList.map((a) => (
            <div key={a._id} className="bg-white p-4 rounded-xl">
              <h3>{a.name}</h3>
              <p>{a.doctor}</p>
              <p>{a.time}</p>
            </div>
          ))}
        </div>
      )}

      {/* ================= ADD ================= */}
      {view === "add" && (
        <form className="bg-white p-6 rounded-xl space-y-4">
          <h2>Create Appointment</h2>
        </form>
      )}
    </div>
  );
}
