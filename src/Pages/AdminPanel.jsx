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
  const appointmentRefs = useRef({});
  const intervalRef = useRef(null);

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
    }
  };

  /* ================= AUTO REFRESH (FIXED) ================= */
  useEffect(() => {
    if (!isAuth) return;

    // initial fetch immediately
    load();

    // clear old interval if any (prevents duplicates)
    if (intervalRef.current) clearInterval(intervalRef.current);

    // auto refresh every 5 seconds
    intervalRef.current = setInterval(() => {
      load();
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
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

  /* ================= LAST 5 NEW ================= */
  const latest5 = [...appointments]
    .sort((a, b) => new Date(b._id) - new Date(a._id))
    .slice(0, 5);

  const isNew = (id) => latest5.some((a) => a._id === id);

  /* ================= NOTIF CLICK ================= */
  const handleNotificationClick = (notif) => {
    const el = appointmentRefs.current[notif.appointmentId];

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-4", "ring-emerald-400");

      setTimeout(() => {
        el.classList.remove("ring-4", "ring-emerald-400");
      }, 1500);
    }

    setNotifications((prev) =>
      prev.filter((n) => n.id !== notif.id)
    );

    setView("pending");
  };

  /* ================= DOCTOR STATS ================= */
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

  /* ================= UI ================= */
  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-2xl shadow w-[360px] space-y-4"
        >
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
          <button className="w-full bg-black text-white py-3 rounded-xl">
            Login
          </button>
        </form>
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-5">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-4 py-2 rounded-xl"
        >
          Home
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl shadow w-fit mb-6">
        {["pending", "approved", "today", "tomorrow", "stats"].map(
          (v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-5 py-2 rounded-xl ${
                view === v
                  ? "bg-emerald-600 text-white"
                  : "hover:bg-slate-100"
              }`}
            >
              {v.toUpperCase()}
            </button>
          )
        )}
      </div>

      {/* NOTIFICATIONS */}
      <div className="fixed top-5 right-5 space-y-2 z-50 w-72">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => handleNotificationClick(n)}
            className="bg-emerald-600 text-white p-3 rounded-xl cursor-pointer shadow hover:bg-emerald-700"
          >
            {n.message}
            <p className="text-xs opacity-80">click to view</p>
          </div>
        ))}
      </div>

      {/* ================= PENDING ================= */}
      {view === "pending" &&
        Object.keys(pendingGrouped).map((date) => (
          <div key={date} className="bg-white rounded-xl mb-4 shadow">
            <h2 className="p-4 font-semibold bg-slate-100">
              📅 {date}
            </h2>

            {pendingGrouped[date].map((a) => (
              <div
                key={a._id}
                ref={(el) => (appointmentRefs.current[a._id] = el)}
                className="p-4 border-b flex justify-between hover:bg-slate-50 transition"
              >
                <div>
                  <p className="font-semibold">
                    {a.name}{" "}
                    {isNew(a._id) && (
                      <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded">
                        NEW
                      </span>
                    )}
                  </p>
                  <p>{a.doctor}</p>
                  <p>{a.time}</p>
                  <p className="text-xs text-slate-600">
                    📞 {a.phone} | 🩺 {a.symptoms}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      updateStatus(a._id, "approved")
                    }
                    className="bg-emerald-600 text-white px-4 py-2 rounded-xl"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => deleteAppointment(a._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-xl"
                  >
                    Delete
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
                className="bg-white p-3 rounded-xl mb-2 flex justify-between"
              >
                <div>
                  <p className="font-semibold">{a.name}</p>
                  <p>{a.doctor}</p>
                  <p>{a.time}</p>
                  <p className="text-xs text-slate-600">
                    📞 {a.phone} | 🩺 {a.symptoms}
                  </p>
                </div>

                <button
                  onClick={() => deleteAppointment(a._id)}
                  className="bg-red-600 text-white px-3 py-2 rounded-xl"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ))}

      {/* ================= TODAY ================= */}
      {view === "today" && (
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold mb-4">📅 Today ({today})</h2>

          {todayList.length === 0 ? (
            <p className="text-slate-500">No appointments today</p>
          ) : (
            todayList.map((a) => (
              <div key={a._id} className="border-b p-3">
                <p className="font-semibold">{a.name}</p>
                <p>{a.doctor}</p>
                <p>{a.time}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* ================= TOMORROW ================= */}
      {view === "tomorrow" && (
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold mb-4">📅 Tomorrow ({tomorrow})</h2>

          {tomorrowList.length === 0 ? (
            <p className="text-slate-500">No appointments tomorrow</p>
          ) : (
            tomorrowList.map((a) => (
              <div key={a._id} className="border-b p-3">
                <p className="font-semibold">{a.name}</p>
                <p>{a.doctor}</p>
                <p>{a.time}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* ================= STATS ================= */}
      {view === "stats" && (
        <div>
          {Object.keys(doctorStats).map((date) => (
            <div
              key={date}
              className="bg-white p-4 rounded-xl mb-4"
            >
              <h2 className="font-bold mb-2">📅 {date}</h2>

              {Object.entries(doctorStats[date]).map(
                ([doc, count]) => (
                  <div
                    key={doc}
                    className="flex justify-between border-b p-2"
                  >
                    <span>{doc}</span>
                    <span className="text-emerald-600 font-bold">
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
