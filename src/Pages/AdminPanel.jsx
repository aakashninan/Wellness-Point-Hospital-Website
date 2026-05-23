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

  /* ================= REFS ================= */
  const seenIdsRef = useRef(new Set());
  const appointmentRefs = useRef({});
  const highlightRef = useRef({});

  /* ================= NOTIFICATIONS ================= */
  const [notifications, setNotifications] = useState([]);

  /* ================= FETCH ================= */
  const load = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();

      const safeData = Array.isArray(data) ? data : [];

      /* detect new appointments */
      const newAppointments = safeData.filter(
        (a) => !seenIdsRef.current.has(a._id)
      );

      /* create notification per appointment */
      if (newAppointments.length > 0 && seenIdsRef.current.size > 0) {
        const newNotifs = newAppointments.map((a) => ({
          id: a._id,
          appointmentId: a._id,
          message: `🆕 ${a.name} booked ${a.doctor}`,
        }));

        setNotifications((prev) => [...newNotifs, ...prev]);
      }

      /* update seen IDs */
      safeData.forEach((a) => seenIdsRef.current.add(a._id));

      setAppointments(safeData);
    } catch (err) {
      console.error(err);
      setAppointments([]);
    }
  };

  /* ================= POLLING ================= */
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
    } else {
      alert("Invalid credentials");
    }
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

  /* ================= CLICK NOTIFICATION ================= */
  const handleNotificationClick = (notif) => {
    const el = appointmentRefs.current[notif.appointmentId];

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });

      /* highlight effect */
      highlightRef.current[notif.appointmentId] = true;

      setTimeout(() => {
        highlightRef.current[notif.appointmentId] = false;
        setAppointments((prev) => [...prev]);
      }, 1200);
    }

    setNotifications((prev) =>
      prev.filter((n) => n.id !== notif.id)
    );
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

  /* ================= LAST 4 NEW BADGE ================= */
  const sortedByLatest = [...appointments]
    .sort((a, b) => (b._id > a._id ? 1 : -1))
    .slice(0, 4);

  const isNew = (id) =>
    sortedByLatest.some((a) => a._id === id);

  /* ================= LOGIN SCREEN ================= */
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

          <button className="w-full bg-black text-white py-3 rounded-xl">
            Login
          </button>
        </form>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">

      {/* NOTIFICATIONS */}
      <div className="fixed top-5 right-5 space-y-3 z-50 w-[320px]">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => handleNotificationClick(n)}
            className="bg-emerald-600 text-white p-3 rounded-xl shadow cursor-pointer hover:bg-emerald-700 transition"
          >
            {n.message}
            <p className="text-xs opacity-80">
              click to view
            </p>
          </div>
        ))}
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded-xl bg-black text-white"
        >
          Home
        </button>
      </div>

      {/* TABS (UPGRADED UI) */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl shadow w-fit mb-6">
        {["pending", "approved", "today", "tomorrow"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-5 py-2 rounded-xl transition-all font-medium ${
              view === v
                ? "bg-emerald-600 text-white shadow"
                : "hover:bg-slate-100"
            }`}
          >
            {v.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ================= PENDING ================= */}
      {view === "pending" && (
        <div className="space-y-4">
          {Object.keys(pendingGrouped).map((date) => (
            <div key={date} className="bg-white rounded-xl shadow">
              <div className="p-4 font-semibold bg-slate-50">
                📅 {date}
              </div>

              {pendingGrouped[date].map((a) => (
                <div
                  key={a._id}
                  ref={(el) =>
                    (appointmentRefs.current[a._id] = el)
                  }
                  className={`p-4 border-b flex justify-between transition ${
                    highlightRef.current[a._id]
                      ? "bg-yellow-100"
                      : ""
                  }`}
                >
                  <div>
                    <p className="font-semibold">
                      {a.name}{" "}
                      {isNew(a._id) && (
                        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded ml-2">
                          NEW
                        </span>
                      )}
                    </p>
                    <p className="text-sm">{a.doctor}</p>
                    <p className="text-sm">{a.time}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        updateStatus(a._id, "approved")
                      }
                      className="bg-emerald-600 text-white px-3 py-1 rounded-lg"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        deleteAppointment(a._id)
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ================= APPROVED ================= */}
      {view === "approved" && (
        <div className="space-y-4">
          {Object.keys(approvedGrouped).map((date) => (
            <div
              key={date}
              className="bg-emerald-50 p-4 rounded-xl"
            >
              <h2 className="font-semibold mb-3">📅 {date}</h2>

              {approvedGrouped[date].map((a) => (
                <div
                  key={a._id}
                  className="bg-white p-3 rounded-lg mb-2"
                >
                  <p className="font-semibold">{a.name}</p>
                  <p>{a.doctor}</p>
                  <p>{a.time}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ================= TODAY ================= */}
      {view === "today" && (
        <div className="space-y-2">
          {todayList.map((a) => (
            <div key={a._id} className="bg-white p-3 rounded-xl">
              {a.name} - {a.doctor} - {a.time}
            </div>
          ))}
        </div>
      )}

      {/* ================= TOMORROW ================= */}
      {view === "tomorrow" && (
        <div className="space-y-2">
          {tomorrowList.map((a) => (
            <div key={a._id} className="bg-white p-3 rounded-xl">
              {a.name} - {a.doctor} - {a.time}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
