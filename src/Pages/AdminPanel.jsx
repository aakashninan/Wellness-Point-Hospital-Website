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

/* ================= BAR WIDTH ================= */
const getWidth = (value, max) => {
  if (!max) return "0%";
  return `${(value / max) * 100}%`;
};

export default function AdminPanel() {
  const navigate = useNavigate();

  const [isAuth, setIsAuth] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [view, setView] = useState("pending");

  const [login, setLogin] = useState({
    username: "",
    password: "",
  });

  const seenIdsRef = useRef(new Set());
  const appointmentRefs = useRef({});
  const intervalRef = useRef(null);

  const [notifications, setNotifications] = useState([]);

  /* ================= FETCH ================= */
  const load = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();

      const safeData = Array.isArray(data)
        ? data
        : [];

      const newAppointments = safeData.filter(
        (a) => !seenIdsRef.current.has(a._id)
      );

      if (
        newAppointments.length > 0 &&
        seenIdsRef.current.size > 0
      ) {
        setNotifications((prev) => [
          ...newAppointments.map((a) => ({
            id: a._id,
            appointmentId: a._id,
            message: `🆕 ${a.name} → ${a.doctor}`,
          })),
          ...prev,
        ]);
      }

      safeData.forEach((a) =>
        seenIdsRef.current.add(a._id)
      );

      setAppointments(safeData);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= AUTO REFRESH ================= */
  useEffect(() => {
    if (!isAuth) return;

    load();

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      load();
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAuth]);

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

  /* ================= ACTIONS ================= */
  const updateStatus = async (id, status) => {
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({ status }),
    });

    load();
  };

  const deleteAppointment = async (id) => {
    if (
      !window.confirm(
        "Delete this appointment?"
      )
    )
      return;

    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    load();
  };

  /* ================= NORMALIZE ================= */
  const normalized = useMemo(() => {
    return appointments.map((a) => ({
      ...a,
      status: (
        a.status || "pending"
      ).toLowerCase(),
    }));
  }, [appointments]);

  /* ================= REMOVE PAST DATES ================= */
  const activeAppointments = useMemo(() => {
    const todayStart = new Date();

    todayStart.setHours(0, 0, 0, 0);

    return normalized.filter((a) => {
      if (!a.date) return false;

      const appointmentDate = new Date(
        a.date
      );

      appointmentDate.setHours(
        0,
        0,
        0,
        0
      );

      return (
        appointmentDate >= todayStart
      );
    });
  }, [normalized]);

  /* ================= FILTERS ================= */
  const pending = activeAppointments.filter(
    (a) => a.status !== "approved"
  );

  const approved = activeAppointments.filter(
    (a) => a.status === "approved"
  );

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const tomorrow = new Date(
    Date.now() + 86400000
  )
    .toISOString()
    .split("T")[0];

  const todayList = approved.filter(
    (a) => a.date === today
  );

  const tomorrowList = approved.filter(
    (a) => a.date === tomorrow
  );

  const pendingGrouped =
    groupByDate(pending);

  const approvedGrouped =
    groupByDate(approved);

  /* ================= LAST 5 NEW ================= */
  const latest5 = [...appointments]
    .sort(
      (a, b) =>
        new Date(
          b.createdAt || b._id
        ) -
        new Date(
          a.createdAt || a._id
        )
    )
    .slice(0, 5);

  const isNew = (id) =>
    latest5.some((a) => a._id === id);

  /* ================= NOTIFICATION CLICK ================= */
  const handleNotificationClick = (
    notif
  ) => {
    const el =
      appointmentRefs.current[
        notif.appointmentId
      ];

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      el.classList.add(
        "ring-4",
        "ring-emerald-400"
      );

      setTimeout(() => {
        el.classList.remove(
          "ring-4",
          "ring-emerald-400"
        );
      }, 1500);
    }

    setNotifications((prev) =>
      prev.filter(
        (n) => n.id !== notif.id
      )
    );

    setView("pending");
  };

  /* ================= DOCTOR STATS ================= */
  const doctorStats = useMemo(() => {
    const map = {};

    activeAppointments.forEach((a) => {
      if (!a.date || !a.doctor)
        return;

      if (!map[a.date]) {
        map[a.date] = {};
      }

      map[a.date][a.doctor] =
        (map[a.date][a.doctor] || 0) +
        1;
    });

    return map;
  }, [activeAppointments]);

  /* ================= BUSINESS ANALYTICS ================= */
  const analytics = useMemo(() => {

    /* UPCOMING ONLY */
    const upcomingDoctorMap = {};

    activeAppointments.forEach((a) => {
      const doctor =
        a.doctor || "Unknown";

      upcomingDoctorMap[doctor] =
        (upcomingDoctorMap[doctor] ||
          0) + 1;
    });

    /* HISTORICAL */
    const doctorDailyMap = {};
    const globalHourMap = {};
    const doctorHourMap = {};
    const historicalDoctorTotals = {};

    appointments.forEach((a) => {
      const doctor =
        a.doctor || "Unknown";

      /* total historical */
      historicalDoctorTotals[
        doctor
      ] =
        (historicalDoctorTotals[
          doctor
        ] || 0) + 1;

      /* avg/day */
      if (!doctorDailyMap[doctor]) {
        doctorDailyMap[doctor] = {};
      }

      if (a.date) {
        doctorDailyMap[doctor][
          a.date
        ] =
          (doctorDailyMap[doctor][
            a.date
          ] || 0) + 1;
      }

      /* global peak hrs */
      if (a.time) {
        const hour =
          a.time.split(":")[0];

        globalHourMap[hour] =
          (globalHourMap[hour] ||
            0) + 1;

        /* doctor peak hrs */
        if (
          !doctorHourMap[doctor]
        ) {
          doctorHourMap[doctor] =
            {};
        }

        doctorHourMap[doctor][
          hour
        ] =
          (doctorHourMap[doctor][
            hour
          ] || 0) + 1;
      }
    });

    /* avg/day calc */
    const doctorAverages =
      Object.entries(
        doctorDailyMap
      ).map(([doctor, dates]) => {
        const total =
          Object.values(
            dates
          ).reduce(
            (a, b) => a + b,
            0
          );

        const days =
          Object.keys(dates)
            .length || 1;

        const avg =
          total / days;

        return {
          doctor,
          average:
            avg.toFixed(1),
          total,
        };
      });

    /* upcoming workload */
    const doctorTotals =
      Object.entries(
        upcomingDoctorMap
      ).sort((a, b) => b[1] - a[1]);

    /* peak hrs */
    const peakHours =
      Object.entries(
        globalHourMap
      ).sort((a, b) => b[1] - a[1]);

    return {
      doctorTotals,
      doctorAverages,
      peakHours,
      doctorHourMap,
      totalAppointments:
        appointments.length,
    };
  }, [appointments, activeAppointments]);

  const maxDoctorCount =
    Math.max(
      ...analytics.doctorTotals.map(
        (d) => d[1]
      ),
      1
    );

  const maxPeakHour =
    Math.max(
      ...analytics.peakHours.map(
        (d) => d[1]
      ),
      1
    );

  /* ================= LOGIN PAGE ================= */
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
              setLogin({
                ...login,
                username:
                  e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-xl"
            onChange={(e) =>
              setLogin({
                ...login,
                password:
                  e.target.value,
              })
            }
          />

          <button className="w-full bg-black text-white py-3 rounded-xl">
            Login
          </button>
        </form>
      </div>
    );
  }

  /* ================= MAIN UI ================= */
  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-5">
        <h1 className="text-2xl font-bold">
          Admin Dashboard
        </h1>

        <button
          onClick={() =>
            navigate("/")
          }
          className="bg-black text-white px-4 py-2 rounded-xl"
        >
          Home
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl shadow w-fit mb-6 flex-wrap">
        {[
          "pending",
          "approved",
          "today",
          "tomorrow",
          "stats",
          "analytics",
        ].map((v) => (
          <button
            key={v}
            onClick={() =>
              setView(v)
            }
            className={`px-5 py-2 rounded-xl ${
              view === v
                ? "bg-emerald-600 text-white"
                : "hover:bg-slate-100"
            }`}
          >
            {v.toUpperCase()}
          </button>
        ))}
      </div>

      {/* NOTIFICATIONS */}
      <div className="fixed top-5 right-5 space-y-2 z-50 w-72">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() =>
              handleNotificationClick(
                n
              )
            }
            className="bg-emerald-600 text-white p-3 rounded-xl cursor-pointer shadow hover:bg-emerald-700"
          >
            {n.message}

            <p className="text-xs opacity-80">
              click to view
            </p>
          </div>
        ))}
      </div>

      {/* ================= PENDING ================= */}
      {view === "pending" &&
        Object.keys(
          pendingGrouped
        ).map((date) => (
          <div
            key={date}
            className="bg-white rounded-xl mb-4 shadow"
          >
            <h2 className="p-4 font-semibold bg-slate-100">
              📅 {date}
            </h2>

            {pendingGrouped[
              date
            ].map((a) => (
              <div
                key={a._id}
                ref={(el) =>
                  (appointmentRefs.current[
                    a._id
                  ] = el)
                }
                className="p-4 border-b flex justify-between hover:bg-slate-50"
              >
                <div>
                  <p className="font-semibold">
                    {a.name}

                    {isNew(
                      a._id
                    ) && (
                      <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded">
                        NEW
                      </span>
                    )}
                  </p>

                  <p>
                    {a.doctor}
                  </p>

                  <p>{a.time}</p>

                  <p className="text-xs text-slate-600">
                    📞 {a.phone} |
                    🩺{" "}
                    {a.symptoms}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      updateStatus(
                        a._id,
                        "approved"
                      )
                    }
                    className="bg-emerald-600 text-white px-4 py-2 rounded-xl"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      deleteAppointment(
                        a._id
                      )
                    }
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
        Object.keys(
          approvedGrouped
        ).map((date) => (
          <div
            key={date}
            className="bg-emerald-50 p-4 rounded-xl mb-4"
          >
            <h2 className="font-semibold mb-3">
              📅 {date}
            </h2>

            {approvedGrouped[
              date
            ].map((a) => (
              <div
                key={a._id}
                className="bg-white p-3 rounded-xl mb-2 flex justify-between"
              >
                <div>
                  <p className="font-semibold">
                    {a.name}
                  </p>

                  <p>
                    {a.doctor}
                  </p>

                  <p>{a.time}</p>

                  <p className="text-xs text-slate-600">
                    📞 {a.phone} |
                    🩺{" "}
                    {a.symptoms}
                  </p>
                </div>

                <button
                  onClick={() =>
                    deleteAppointment(
                      a._id
                    )
                  }
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
          <h2 className="font-bold mb-4">
            📅 Today ({today})
          </h2>

          {todayList.length ===
          0 ? (
            <p>
              No appointments
              today
            </p>
          ) : (
            todayList.map((a) => (
              <div
                key={a._id}
                className="border-b p-3"
              >
                <p className="font-semibold">
                  {a.name}
                </p>

                <p>
                  {a.doctor}
                </p>

                <p>{a.time}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* ================= TOMORROW ================= */}
      {view === "tomorrow" && (
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold mb-4">
            📅 Tomorrow (
            {tomorrow})
          </h2>

          {tomorrowList.length ===
          0 ? (
            <p>
              No appointments
              tomorrow
            </p>
          ) : (
            tomorrowList.map((a) => (
              <div
                key={a._id}
                className="border-b p-3"
              >
                <p className="font-semibold">
                  {a.name}
                </p>

                <p>
                  {a.doctor}
                </p>

                <p>{a.time}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* ================= STATS ================= */}
      {view === "stats" && (
        <div>
          {Object.keys(
            doctorStats
          ).map((date) => (
            <div
              key={date}
              className="bg-white p-4 rounded-xl mb-4"
            >
              <h2 className="font-bold mb-2">
                📅 {date}
              </h2>

              {Object.entries(
                doctorStats[
                  date
                ]
              ).map(
                ([doc, count]) => (
                  <div
                    key={doc}
                    className="flex justify-between border-b p-2"
                  >
                    <span>
                      {doc}
                    </span>

                    <span className="text-emerald-600 font-bold">
                      {count}{" "}
                      appointments
                    </span>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      )}

      {/* ================= ANALYTICS ================= */}
      {view === "analytics" && (
        <div className="space-y-6">

          {/* SUMMARY */}
          <div className="grid md:grid-cols-3 gap-4">

            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-slate-500">
  Total Upcoming Appointments
</p>

<h2 className="text-4xl font-bold text-emerald-600 mt-2">
  {activeAppointments.length}
</h2>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-slate-500">
                Peak Booking
                Hour
              </p>

              <h2 className="text-4xl font-bold text-blue-600 mt-2">
                {analytics
                  .peakHours[0]?.[0] ||
                  "--"}
                :00
              </h2>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-slate-500">
                Most Busy
                Doctor
              </p>

              <h2 className="text-2xl font-bold text-purple-600 mt-2">
                {analytics
                  .doctorTotals[0]?.[0] ||
                  "N/A"}
              </h2>
            </div>

          </div>

          {/* UPCOMING WORKLOAD GRAPH */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-bold mb-6">
              👨‍⚕️ Upcoming
              Doctor Workload
            </h2>

            <div className="space-y-4">
              {analytics.doctorTotals.map(
                ([doctor, count]) => (
                  <div
                    key={doctor}
                  >
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">
                        {doctor}
                      </span>

                      <span className="font-bold">
                        {count}
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-5">
                      <div
                        className="bg-emerald-500 h-5 rounded-full"
                        style={{
                          width:
                            getWidth(
                              count,
                              maxDoctorCount
                            ),
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* DOCTOR TABLE */}
          <div className="bg-white p-6 rounded-2xl shadow overflow-auto">
            <h2 className="text-xl font-bold mb-4">
              📊 Doctor
              Business
              Analytics
            </h2>

            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-100">
                  <th className="text-left p-3">
                    Doctor
                  </th>

                  <th className="text-left p-3">
                    Historical
                    Patients
                  </th>

                  <th className="text-left p-3">
                    Avg Patients
                    / Day
                  </th>
                </tr>
              </thead>

              <tbody>
                {analytics.doctorAverages.map(
                  (doc) => (
                    <tr
                      key={
                        doc.doctor
                      }
                      className="border-b"
                    >
                      <td className="p-3">
                        {
                          doc.doctor
                        }
                      </td>

                      <td className="p-3 font-bold">
                        {doc.total}
                      </td>

                      <td className="p-3 text-emerald-600 font-bold">
                        {
                          doc.average
                        }
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* GLOBAL PEAK HOURS */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-bold mb-6">
              ⏰ Historical
              Peak Booking
              Hours
            </h2>

            <div className="space-y-4">
              {analytics.peakHours.map(
                ([hour, count]) => (
                  <div
                    key={hour}
                  >
                    <div className="flex justify-between mb-1">
                      <span>
                        {hour}:00
                      </span>

                      <span className="font-bold">
                        {count}
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-5">
                      <div
                        className="bg-blue-500 h-5 rounded-full"
                        style={{
                          width:
                            getWidth(
                              count,
                              maxPeakHour
                            ),
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* EACH DOCTOR PEAK HOURS */}
          <div className="space-y-6">
            {Object.entries(
              analytics.doctorHourMap
            ).map(
              ([doctor, hrs]) => {
                const sorted =
                  Object.entries(
                    hrs
                  ).sort(
                    (a, b) =>
                      b[1] -
                      a[1]
                  );

                const max =
                  Math.max(
                    ...sorted.map(
                      (s) =>
                        s[1]
                    ),
                    1
                  );

                return (
                  <div
                    key={
                      doctor
                    }
                    className="bg-white p-6 rounded-2xl shadow"
                  >
                    <h2 className="text-xl font-bold mb-6">
                      🩺 Historical
                      Peak Hours
                      —{" "}
                      {
                        doctor
                      }
                    </h2>

                    <div className="space-y-4">
                      {sorted.map(
                        ([
                          hour,
                          count,
                        ]) => (
                          <div
                            key={
                              hour
                            }
                          >
                            <div className="flex justify-between mb-1">
                              <span>
                                {
                                  hour
                                }
                                :00
                              </span>

                              <span className="font-bold">
                                {
                                  count
                                }
                              </span>
                            </div>

                            <div className="w-full bg-slate-200 rounded-full h-5">
                              <div
                                className="bg-purple-500 h-5 rounded-full"
                                style={{
                                  width:
                                    getWidth(
                                      count,
                                      max
                                    ),
                                }}
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>

        </div>
      )}
    </div>
  );
}