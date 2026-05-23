import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const API =
  "https://wellness-point-hospital-website-1.onrender.com/api/appointments";

/* ================= GROUP BY DATE ================= */
const groupByDate = (list = []) => {
  return list.reduce((acc, item) => {
    if (!item?.date) return acc;
    acc[item.date] = acc[item.date] || [];
    acc[item.date].push(item);
    return acc;
  }, {});
};

export default function AdminPanel() {
  const navigate = useNavigate();

  const [isAuth, setIsAuth] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [view, setView] = useState("pending");
  const [login, setLogin] = useState({ username: "", password: "" });

  const seenIdsRef = useRef(new Set());

  const [notifications, setNotifications] = useState([]);

  /* ================= FETCH ================= */
  const load = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      const safeData = Array.isArray(data) ? data : [];

      const newAppointments = safeData.filter(
        (a) => !seenIdsRef.current.has(a._id)
      );

      if (newAppointments.length > 0 && seenIdsRef.current.size > 0) {
        setNotifications((prev) => [
          ...newAppointments.map((a) => ({
            id: a._id,
            appointmentId: a._id,
            message: `🆕 ${a.name} → ${a.doctor}`,
          })),
          ...prev,
        ]);
      }

      safeData.forEach((a) => seenIdsRef.current.add(a._id));

      setAppointments(safeData);
    } catch (err) {
      console.error(err);
      setAppointments([]);
    }
  };

  useEffect(() => {
    if (!isAuth) return;
    load();
    const interval = setInterval(load, 8000);
    return () => clearInterval(interval);
  }, [isAuth]);

  /* ================= LOGIN ================= */
  const handleLogin = (e) => {
    e.preventDefault();
    if (login.username === "wpadmin" && login.password === "wp111168") {
      setIsAuth(true);
    } else alert("Invalid credentials");
  };

  /* ================= ACTIONS ================= */
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
    await fetch(`${API}/${id}`, { method: "DELETE" });
    load();
  };

  /* ================= FILTERS ================= */
  const normalized = useMemo(() => {
    return appointments.map((a) => ({
      ...a,
      status: (a.status || "pending").toLowerCase(),
    }));
  }, [appointments]);

  const pending = normalized.filter((a) => a.status !== "approved");
  const approved = normalized.filter((a) => a.status === "approved");

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000)
    .toISOString()
    .split("T")[0];

  const todayList = approved.filter((a) => a.date === today);
  const tomorrowList = approved.filter((a) => a.date === tomorrow);

  const pendingGrouped = groupByDate(pending);
  const approvedGrouped = groupByDate(approved);

  /* ================= STATS (NEW FEATURE) ================= */
  const doctorStats = useMemo(() => {
    const map = {};

    appointments.forEach((a) => {
      if (!a.date || !a.doctor) return;

      if (!map[a.date]) map[a.date] = {};
      map[a.date][a.doctor] =
        (map[a.date][a.doctor] || 0) + 1;
    });

    return map;
  }, [appointments]);

  /* ================= LOGIN ================= */
  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-2xl shadow w-[360px] space-y-4"
        >
          <h1 className="text-xl font-semibold text-center">
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

          <button className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800">
            Login
          </button>
        </form>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800"
        >
          Home
        </button>
      </div>

      {/* TABS (IMPROVED UI) */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl shadow w-fit mb-6">
        {["pending", "approved", "today", "tomorrow", "stats"].map(
          (v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-5 py-2 rounded-xl font-medium transition ${
                view === v
                  ? "bg-emerald-600 text-white shadow"
                  : "hover:bg-slate-100"
              }`}
            >
              {v.toUpperCase()}
            </button>
          )
        )}
      </div>

      {/* ================= PENDING ================= */}
      {view === "pending" &&
        Object.keys(pendingGrouped).map((date) => (
          <div
            key={date}
            className="bg-white rounded-xl shadow mb-4"
          >
            <h2 className="p-4 bg-slate-100 font-semibold">
              📅 {date}
            </h2>

            {pendingGrouped[date].map((a) => (
              <div
                key={a._id}
                className="p-4 flex justify-between border-b"
              >
                <div>
                  <p className="font-semibold">{a.name}</p>
                  <p className="text-sm">{a.doctor}</p>
                  <p className="text-sm">{a.time}</p>
                </div>

                {/* 🔥 AESTHETIC BUTTONS */}
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      updateStatus(a._id, "approved")
                    }
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow hover:scale-105 transition"
                  >
                    ✔ Approve
                  </button>

                  <button
                    onClick={() => deleteAppointment(a._id)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-700 text-white shadow hover:scale-105 transition"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}

      {/* ================= APPROVED ================= */}
      {view === "approved" &&
        Object.keys(approvedGrouped).map((date) => (
          <div
            key={date}
            className="bg-emerald-50 p-4 rounded-xl mb-4"
          >
            <h2 className="font-semibold mb-3">📅 {date}</h2>

            {approvedGrouped[date].map((a) => (
              <div
                key={a._id}
                className="bg-white p-3 rounded-xl mb-2"
              >
                <p className="font-semibold">{a.name}</p>
                <p>{a.doctor}</p>
                <p>{a.time}</p>
              </div>
            ))}
          </div>
        ))}

      {/* ================= TODAY ================= */}
      {view === "today" &&
        todayList.map((a) => (
          <div
            key={a._id}
            className="bg-white p-3 rounded-xl mb-2"
          >
            {a.name} - {a.doctor} - {a.time}
          </div>
        ))}

      {/* ================= TOMORROW ================= */}
      {view === "tomorrow" &&
        tomorrowList.map((a) => (
          <div
            key={a._id}
            className="bg-white p-3 rounded-xl mb-2"
          >
            {a.name} - {a.doctor} - {a.time}
          </div>
        ))}

      {/* ================= STATS TAB ================= */}
      {view === "stats" && (
        <div className="space-y-4">
          {Object.keys(doctorStats).map((date) => (
            <div
              key={date}
              className="bg-white p-4 rounded-xl shadow"
            >
              <h2 className="font-bold mb-3">📅 {date}</h2>

              {Object.entries(doctorStats[date]).map(
                ([doctor, count]) => (
                  <div
                    key={doctor}
                    className="flex justify-between p-2 border-b"
                  >
                    <span>{doctor}</span>
                    <span className="font-semibold text-emerald-600">
                      {count} appointments
                    </span>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
