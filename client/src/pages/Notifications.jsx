import { useEffect, useState } from "react";
import axios from "axios";
import {
  Bell,
  Droplet,
  Loader2,
  Check,
  X,
  RefreshCw,
  Clock,
  Info,
} from "lucide-react";
import Navbar from "../components/Navbar"; // adjust the path if your Navbar lives elsewhere

const API_BASE = "http://localhost:5000/api/donation-response";

/**
 * Every notification the backend sends should eventually carry a `type` field.
 * Today the API only returns donor-response items (no `type` on them yet), so
 * anything missing a type is treated as "donation-response" below. When you
 * add a second kind later (e.g. "system", "reminder", "request-fulfilled"),
 * just:
 *   1. Add an entry to NOTIFICATION_META for its icon/accent color.
 *   2. If it needs its own body (like accept/reject does), add a branch in
 *      <NotificationCard />. Anything without a custom branch automatically
 *      renders through the generic fallback (icon + title + message + time),
 *      so nothing breaks while you build the real UI for it.
 */
const NOTIFICATION_META = {
  "donation-response": { icon: Droplet, accent: "from-red-500 to-purple-600" },
  system: { icon: Info, accent: "from-sky-500 to-indigo-600" },
};

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actioningId, setActioningId] = useState(null);
  const [resolvedIds, setResolvedIds] = useState({});
  const [removingIds, setRemovingIds] = useState({});

  useEffect(() => {
    fetchNotifications();
  }, []);

  const authHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/notifications`, authHeaders());
      setNotifications(res.data.map((n) => ({ type: "donation-response", ...n })));
    } catch (err) {
      console.error(err);
      setError("Couldn't load your notifications. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const respond = async (id, action) => {
    setActioningId(id);
    try {
      await axios.patch(`${API_BASE}/${id}/${action}`, {}, authHeaders());
      setResolvedIds((prev) => ({ ...prev, [id]: action }));
      // Show the confirmation for a beat, then collapse the card out.
      setTimeout(() => setRemovingIds((prev) => ({ ...prev, [id]: true })), 900);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        setResolvedIds((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        setRemovingIds((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }, 1200);
    } catch (err) {
      console.error(err);
      setError(`Couldn't ${action} that request. Please try again.`);
    } finally {
      setActioningId(null);
    }
  };

  const pendingCount = notifications.length;
  const bloodTypesInPlay = [...new Set(notifications.map((n) => n.donor?.bloodType).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50/40 via-white to-purple-50/30">
      <style>{`
        @keyframes notifIn {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bellRing {
          0%, 100% { transform: rotate(0deg); }
          10% { transform: rotate(-12deg); }
          20% { transform: rotate(10deg); }
          30% { transform: rotate(-8deg); }
          40% { transform: rotate(6deg); }
          50% { transform: rotate(0deg); }
        }
        .notif-card-enter {
          animation: notifIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .bell-ring {
          animation: bellRing 1.8s ease-in-out infinite;
          transform-origin: top center;
        }
      `}</style>

      <Navbar />

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header strip */}
        <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-red-500 to-purple-600 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <Bell className={`h-5 w-5 ${pendingCount > 0 ? "bell-ring" : ""}`} />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">Notifications</h1>
              <p className="text-sm text-white/80">Donor responses waiting on you</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <p className="text-2xl font-bold leading-none tabular-nums">{loading ? "—" : pendingCount}</p>
              <p className="mt-1 text-xs text-white/75">pending</p>
            </div>
            <div className="hidden sm:block">
              <p className="text-2xl font-bold leading-none tabular-nums">{loading ? "—" : bloodTypesInPlay.length}</p>
              <p className="mt-1 text-xs text-white/75">blood types</p>
            </div>
            <button
              onClick={fetchNotifications}
              disabled={loading}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25 disabled:opacity-50"
              aria-label="Refresh"
            >
              <RefreshCw className={`h-4 w-4 transition-transform ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {error && (
          <div className="notif-card-enter mb-5 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <button onClick={fetchNotifications} className="font-medium underline underline-offset-2">
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border border-black/5 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-black/10" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-28 rounded bg-black/10" />
                    <div className="h-2.5 w-20 rounded bg-black/10" />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="h-8 flex-1 rounded-full bg-black/10" />
                  <div className="h-8 flex-1 rounded-full bg-black/10" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="notif-card-enter flex flex-col items-center gap-3 rounded-2xl border border-dashed border-black/10 bg-white/60 py-14 text-center">
            <Bell className="h-8 w-8 text-muted-foreground/40" />
            <p className="font-medium text-foreground">You're all caught up</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              New donor responses to your blood requests will show up here.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {notifications.map((item, index) => (
              <NotificationCard
                key={item._id}
                item={item}
                index={index}
                isActioning={actioningId === item._id}
                resolved={resolvedIds[item._id]}
                removing={removingIds[item._id]}
                onRespond={respond}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationCard({ item, index, isActioning, resolved, removing, onRespond }) {
  const meta = NOTIFICATION_META[item.type] ?? NOTIFICATION_META["donation-response"];
  const Icon = meta.icon;

  return (
    <div
      className={`notif-card-enter group relative overflow-hidden rounded-xl border border-black/5 bg-white p-4 shadow-sm shadow-black/[0.02] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md ${
        removing ? "pointer-events-none max-h-0 scale-95 !p-0 opacity-0" : "max-h-96 opacity-100"
      }`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${meta.accent}`} />

      {resolved ? (
        <div
          className={`flex h-full items-center gap-2 py-4 pl-2 text-sm font-medium transition-opacity duration-300 ${
            resolved === "accept" ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {resolved === "accept" ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
          {resolved === "accept" ? "Donor accepted" : "Donor declined"}
        </div>
      ) : item.type === "donation-response" ? (
        <div className="pl-2">
          <div className="flex items-start gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${meta.accent} text-sm font-semibold text-white`}>
              {item.donor?.fullName?.charAt(0).toUpperCase() ?? "?"}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-foreground">
                {item.donor?.fullName ?? "Unknown donor"}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[11px] font-semibold text-red-600">
                  <Droplet className="h-3 w-3" />
                  {item.donor?.bloodType ?? "—"}
                </span>
                {item.createdAt && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Available for <span className="font-medium text-foreground">{item.request?.patientName ?? "a patient"}</span>
              </p>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => onRespond(item._id, "accept")}
              disabled={isActioning}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isActioning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              Accept
            </button>
            <button
              onClick={() => onRespond(item._id, "reject")}
              disabled={isActioning}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-all hover:bg-red-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isActioning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
              Reject
            </button>
          </div>
        </div>
      ) : (
        // Generic fallback for any future notification type that hasn't
        // gotten its own branch yet — nothing crashes, it just renders plainly.
        <div className="flex items-start gap-3 pl-2">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${meta.accent} text-white`}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-foreground">{item.title ?? "Notification"}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{item.message}</p>
            {item.createdAt && (
              <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;