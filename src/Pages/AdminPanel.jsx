import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API =
  "https://wellness-point-hospital-website-1.onrender.com/api/appointments";

/* ================= GROUP BY DATE (SAFE) ================= */
const groupByDate = (list = []) => {
  return list.reduce((acc, item) => {
    if (!item?.date) return acc;

    acc[item.date] = acc[item.date] || [];
    acc[item.date].push(item);

    return acc;
  }, {});
};

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

  /* ================= NOTIFICATIONS ================= */
  const [lastCount, setLastCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  /* ================= FETCH ================= */
  const load = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();

      if (lastCount && data.length > lastCount) {
        setNotifications((prev) => [
          {
            id: Date.now(),
            message: `🆕 ${data.length - lastCount} new appointment(s)`,
          },
          ...prev,
        ]);
      }

      setAppointments(data || []);
      setLastCount(data.length || 0);
    } catch (err) {
      console.error("API error:", err);
      setAppointments([]);
    }
  };

  /* ================= POLLING ================= */
  useEffect(() => {
    if (!isAuth) return;

    load();
    const interval = setInterval(load, 10000);

    return () => clearInterval(interval);
  }, [isAuth, lastCount]);

  /* ================= LOGIN ================= */
  const handleLogin = (e) => {
    e.preventDefault();

    if (login.username === "wpadmin" && login.password === "wp111168") {
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

  /* ================= FILTERS (SAFE) ================= */
  const normalized = useMemo(() => {
    return appointments.map((a) => ({
      ...a,
      status: (a.status || "pending").toLowerCase(),
    }));
  }, [appointments]);

  const pending = useMemo(
    () => normalized.filter((a) => a.status !== "approved"),
    [normalized]
  );

  const approved = useMemo(
    () => normalized.filter((a) => a.status === "approved"),
    [normalized]
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
            className="bg-emerald-600 text-white px-4 py-3 rounded-xl cursor-pointer"
          >
            {n.message}
          </div>
        ))}
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Home
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-2 bg-white p-2 rounded-xl w-fit">
        {["pending", "approved", "today", "tomorrow"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 rounded-lg ${
              view === v ? "bg-green-600 text-white" : ""
            }`}
          >
            {v.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ================= PENDING ================= */}
      {view === "pending" && (
        <div>
          {Object.keys(pendingGrouped).length === 0 ? (
            <p>No pending appointments</p>
          ) : (
            Object.keys(pendingGrouped).map((date) => (
              <div key={date} className="bg-white p-4 rounded-xl mb-3">
                <h2>📅 {date}</h2>

                {pendingGrouped[date].map((a) => (
                  <div key={a._id} className="flex justify-between p-2">
                    <div>
                      <p>{a.name}</p>
                      <p>{a.doctor}</p>
                      <p>{a.time}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(a._id, "approved")}
                        className="bg-green-600 text-white px-3 py-1"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => deleteAppointment(a._id)}
                        className="bg-red-600 text-white px-3 py-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}

      {/* ================= APPROVED ================= */}
      {view === "approved" && (
        <div>
          {Object.keys(approvedGrouped).length === 0 ? (
            <p>No approved appointments</p>
          ) : (
            Object.keys(approvedGrouped).map((date) => (
              <div key={date} className="bg-emerald-50 p-4 rounded-xl mb-3">
                <h2>📅 {date}</h2>

                {approvedGrouped[date].map((a) => (
                  <div key={a._id} className="bg-white p-3 rounded-lg mb-2">
                    <p>{a.name}</p>
                    <p>{a.doctor}</p>
                    <p>{a.time}</p>

                    <button
                      onClick={() => deleteAppointment(a._id)}
                      className="bg-red-600 text-white px-3 py-1 mt-2"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}

      {/* TODAY */}
      {view === "today" && (
        <div>
          {todayList.length === 0 ? (
            <p>No appointments today</p>
          ) : (
            todayList.map((a) => (
              <div key={a._id} className="bg-white p-3 rounded-xl mb-2">
                <p>{a.name}</p>
                <p>{a.doctor}</p>
                <p>{a.time}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* TOMORROW */}
      {view === "tomorrow" && (
        <div>
          {tomorrowList.length === 0 ? (
            <p>No appointments tomorrow</p>
          ) : (
            tomorrowList.map((a) => (
              <div key={a._id} className="bg-white p-3 rounded-xl mb-2">
                <p>{a.name}</p>
                <p>{a.doctor}</p>
                <p>{a.time}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
