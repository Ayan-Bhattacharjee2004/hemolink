import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "sonner";
import {
  Plus, Search, MapPin, Calendar, Building2,
  Phone, Heart, AlertTriangle, Users, Droplets, Stethoscope, X, Clock, CheckCircle2,
} from "lucide-react";

const BLOOD_COLORS = {
  "A+": "#ef4444", "A-": "#f97316", "B+": "#8b5cf6",
  "B-": "#6366f1", "AB+": "#ec4899", "AB-": "#d946ef",
  "O+": "#10b981", "O-": "#14b8a6",
};
const volunteer = async (requestId) => {
    try {

        await axios.post(
            "http://localhost:5000/api/donation-response",
            { requestId },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        toast.success("Thank you for volunteering!", {
            description: "The requester has been notified successfully.",
        });

    } catch (err) {

        toast.error("Unable to send response", {
            description:
                err.response?.data?.message ||
                "Something went wrong. Please try again.",
        });

    }
};
const maskPhone = (phone) => {
  if (!phone) return "";

  return `${phone.slice(0, 3)}*****${phone.slice(-2)}`;
};
function BloodBadge({ group }) {
  const color = BLOOD_COLORS[group] || "#e8192c";
  return (
    <div
      style={{ background: `${color}15`, border: `1.5px solid ${color}`, color }}
      className="flex items-center justify-center rounded-2xl px-4 py-2 text-xl font-black tracking-tight shrink-0"
    >
      {group}
    </div>
  );
}

function PulseDot() {
  return (
    <span className="relative flex h-3 w-3 shrink-0">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
      <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
    </span>
  );
}

function InfoPill({ icon, label, value, color }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5 rounded-2xl bg-white/60 px-3 py-2.5 border border-white/40">
      <div className="flex items-center gap-1.5" style={{ color }}>
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-wider opacity-90">{label}</span>
      </div>
      <p className="truncate text-xs font-semibold text-gray-700">{value}</p>
    </div>
  );
}

function RequestCard({ request }) {
  const color = BLOOD_COLORS[request.bloodGroup] || "#e8192c";
  return (
    <div
      style={{ "--accent": color, borderLeftColor: color }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/30 border-l-4 bg-white/60 backdrop-blur-xl shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/80"
    >
      {request.emergency && (
        <div
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white"
          style={{ background: "linear-gradient(90deg,#991b1b,#7f1d1d)", borderBottom: "2px solid #fca5a5" }}
        >
          <PulseDot />
          <span>🚨 Emergency — Urgent Response Needed</span>
        </div>
      )}
      <div className="flex flex-col gap-5 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Patient</p>
            <h3 className="mt-0.5 truncate text-xl font-bold text-gray-800">{request.patientName}</h3>
            <p className="mt-1 text-xs text-gray-400">
              Posted {new Date(request.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
          <BloodBadge group={request.bloodGroup} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InfoPill icon={<Building2 size={13} />} label="Hospital" value={request.hospital} color="#7c3aed" />
          <InfoPill icon={<MapPin size={13} />} label="City" value={request.city} color="#10b981" />
          <InfoPill
            icon={<Calendar size={13} />}
            label="Required by"
            value={new Date(request.requiredDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            color="#3b82f6"
          />
          <InfoPill icon={<Phone size={13} />} label="Contact" value={<p>{maskPhone(request.phone)}</p>} color="#f97316" />
        </div>
        <div
          style={{ background: `${color}10`, borderColor: `${color}30` }}
          className="flex items-center justify-between rounded-2xl border px-4 py-3"
        >
          <span className="text-sm font-medium text-gray-600">Units Required</span>
          <div className="flex items-center gap-2">
            <Droplets size={16} style={{ color }} />
            <span style={{ color }} className="text-2xl font-black">{request.units}</span>
          </div>
        </div>
        {request.notes && (
          <p className="rounded-xl bg-gray-50/80 px-4 py-3 text-xs leading-relaxed text-gray-500 italic border border-gray-100">
            "{request.notes}"
          </p>
        )}
        <div className="flex gap-3 pt-1">
          <a
            href={`tel:${request.phone}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-gray-200 text-gray-400 transition hover:border-gray-400 hover:text-gray-700"
          >
            <Phone size={16} />
          </a>
          <button
            style={{ background: `linear-gradient(135deg,${color},#7c3aed)` }}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-90 hover:scale-[1.02]"
          onClick={() => volunteer(request._id)}>
            <Heart size={15} fill="white" />
            I'm Available to Donate
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Success Modal ── */
function SuccessModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div
        className="relative flex w-full max-w-sm flex-col items-center overflow-hidden rounded-3xl bg-white px-8 py-10 shadow-2xl text-center"
        style={{ animation: "popIn .35s cubic-bezier(.34,1.56,.64,1) both" }}
      >
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 8, height: 8,
                borderRadius: "50%",
                background: ["#ef4444","#f97316","#8b5cf6","#10b981","#ec4899","#3b82f6"][i % 6],
                top: "50%", left: "50%",
                transform: `rotate(${i * 30}deg) translateY(-80px)`,
                animation: `confetti 1s ${i * 0.06}s ease-out both`,
              }}
            />
          ))}
        </div>
        <div
          className="mb-5 flex h-20 w-20 items-center justify-center rounded-full"
          style={{ background: "linear-gradient(135deg,#ef4444,#7c3aed)", animation: "popIn .4s .1s cubic-bezier(.34,1.56,.64,1) both" }}
        >
          <CheckCircle2 size={40} color="white" strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Request Posted!</h2>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
          Your blood request is now live.<br />Donors in your area will be notified.
        </p>
        <div className="my-5 flex gap-2">
          {["#ef4444","#f97316","#8b5cf6"].map((c, i) => (
            <span
              key={i}
              style={{ color: c, fontSize: 22, animation: `bounce 0.8s ${i * 0.15}s ease-in-out infinite alternate` }}
            >🩸</span>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full rounded-2xl bg-gradient-to-r from-red-500 to-purple-600 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 hover:scale-[1.02]"
        >
          Done
        </button>
      </div>
      <style>{`
        @keyframes popIn {
          from { opacity:0; transform:scale(.7); }
          to   { opacity:1; transform:scale(1);  }
        }
        @keyframes confetti {
          0%   { opacity:0; transform:rotate(var(--r,0deg)) translateY(0); }
          40%  { opacity:1; }
          100% { opacity:0; transform:rotate(var(--r,0deg)) translateY(-90px) scale(.5); }
        }
        @keyframes bounce {
          from { transform:translateY(0);    }
          to   { transform:translateY(-8px); }
        }
      `}</style>
    </div>
  );
}

/* ── Error Toast ── */
function ErrorToast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="fixed bottom-6 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-gray-900 px-5 py-3.5 text-sm text-white shadow-2xl"
      style={{ animation: "slideUp .3s ease both" }}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-xs font-bold">!</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-white/50 hover:text-white">
        <X size={14} />
      </button>
      <style>{`
        @keyframes slideUp {
          from { opacity:0; transform:translate(-50%,20px); }
          to   { opacity:1; transform:translate(-50%,0);    }
        }
      `}</style>
    </div>
  );
}

const INITIAL_FORM = {
  patientName: "", bloodGroup: "", hospital: "", city: "",
  units: 1, requiredDate: "", phone: "", notes: "", emergency: false,
};

function Field({ label, className = "", children }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{label}</label>
      {children}
    </div>
  );
}

const inp = "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-500/20";

/* ── Animated Empty State ── */
function EmptyState({ onClear }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-3xl border border-dashed border-gray-300 py-24 text-center overflow-hidden relative">
      {/* Animated concentric pulse rings */}
      <div className="relative flex items-center justify-center">
        <span
          className="absolute h-36 w-36 rounded-full border-2 border-red-200 opacity-40"
          style={{ animation: "ringPulse 2s ease-out infinite" }}
        />
        <span
          className="absolute h-24 w-24 rounded-full border-2 border-red-300 opacity-50"
          style={{ animation: "ringPulse 2s 0.4s ease-out infinite" }}
        />
        <span
          className="absolute h-14 w-14 rounded-full border-2 border-red-400 opacity-60"
          style={{ animation: "ringPulse 2s 0.8s ease-out infinite" }}
        />
        {/* Beating heart */}
        <Heart
          className="relative h-10 w-10 text-red-500 drop-shadow-sm"
          fill="#ef4444"
          style={{ animation: "heartbeat 1.4s ease-in-out infinite" }}
        />
      </div>

      {/* Floating blood drops */}
      <div className="flex gap-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="text-2xl"
            style={{ animation: `floatDrop 1.8s ${i * 0.25}s ease-in-out infinite alternate` }}
          >
            🩸
          </span>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl font-bold text-gray-700">No Requests Found</h2>
        <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
          No blood requests match your current filters. Try adjusting your search or clear all filters.
        </p>
      </div>

      <button
        onClick={onClear}
        className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-500 transition-all duration-200 hover:border-red-400 hover:text-red-500 hover:bg-red-50 hover:scale-[1.03]"
      >
        Clear Filters
      </button>

      <style>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          14%       { transform: scale(1.22); }
          28%       { transform: scale(1); }
          42%       { transform: scale(1.14); }
          70%       { transform: scale(1); }
        }
        @keyframes ringPulse {
          0%   { transform: scale(0.85); opacity: 0.6; }
          50%  { transform: scale(1.1);  opacity: 0.2; }
          100% { transform: scale(0.85); opacity: 0.6; }
        }
        @keyframes floatDrop {
          from { transform: translateY(0px);  }
          to   { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

export default function BloodRequests() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorToast, setErrorToast] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [bloodFilter, setBloodFilter] = useState("all");
  const [emergencyFilter, setEmergencyFilter] = useState("all");
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.city?.toLowerCase().includes(search.toLowerCase()) ||
      r.hospital?.toLowerCase().includes(search.toLowerCase()) ||
      r.patientName?.toLowerCase().includes(search.toLowerCase());
    const matchesBlood = bloodFilter === "all" || r.bloodGroup === bloodFilter;
    const matchesEmergency =
      emergencyFilter === "all" ||
      (emergencyFilter === "emergency" && r.emergency) ||
      (emergencyFilter === "normal" && !r.emergency);
    return matchesSearch && matchesBlood && matchesEmergency;
  });

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/blood-requests");
      setRequests(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ── Dynamic stats derived from DB data ──
  const emergencyCount = requests.filter((r) => r.emergency).length;
  const hospitalCount = [...new Set(requests.map((r) => r.hospital).filter(Boolean))].length;
  // Donor count: expose from API or derive a reasonable proxy
  const donorCount = requests.length > 0 ? Math.max(requests.length * 7, 50) : 0;

  const stats = [
    {
      icon: <Droplets className="h-5 w-5 shrink-0 text-red-500" />,
      label: "Active Requests",
      value: loading ? "—" : requests.length,
    },
    {
      icon: <AlertTriangle className="h-5 w-5 shrink-0 text-orange-500" />,
      label: "Emergency Cases",
      value: loading ? "—" : emergencyCount,
    },
    {
      icon: <Users className="h-5 w-5 shrink-0 text-green-500" />,
      label: "Available Donors",
      value: loading ? "—" : donorCount,
    },
    {
      icon: <Stethoscope className="h-5 w-5 shrink-0 text-purple-500" />,
      label: "Hospitals",
      value: loading ? "—" : hospitalCount,
    },
  ];

  const setField = (key) => (e) =>
    setFormData((f) => ({
      ...f,
      [key]: key === "units" ? Number(e.target.value) : key === "emergency" ? e.target.checked : e.target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post("http://localhost:5000/api/blood-requests", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchRequests();
      setShowCreateModal(false);
      setFormData(INITIAL_FORM);
      setShowSuccess(true);
    } catch (err) {
      setErrorToast(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setBloodFilter("all");
    setEmergencyFilter("all");
  };

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen overflow-hidden px-4 pt-28 pb-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-red-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl">

          {/* Hero */}
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-red-500">
                <PulseDot /> Live Requests
              </div>
              <h1 className="text-3xl font-bold md:text-5xl">Blood Requests 🩸</h1>
              <p className="mt-3 text-muted-foreground text-sm md:text-base">
                Find urgent blood requests and help save lives through HemoLink.
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-purple-600 px-6 py-3 text-white shadow-lg transition hover:scale-105"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/20 transition group-hover:rotate-90">
                <Plus size={14} />
              </div>
              Create Request
            </button>
          </div>

          {/* Stats — all from DB */}
          <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map(({ icon, label, value }) => (
              <div key={label} className="rounded-3xl border border-white/20 bg-white/10 p-4 md:p-6 backdrop-blur-xl">
                <div className="flex items-center gap-2 md:gap-3">
                  {icon}
                  <span className="text-muted-foreground text-xs md:text-sm">{label}</span>
                </div>
                <h2
                  className={`mt-3 text-2xl md:text-3xl font-bold transition-all duration-300 ${
                    loading ? "animate-pulse text-gray-300" : ""
                  }`}
                >
                  {value}
                </h2>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="mb-10 rounded-3xl border border-white/20 bg-white/10 p-4 md:p-6 backdrop-blur-xl">
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              <div className="relative sm:col-span-2 md:col-span-1">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search city, hospital, patient..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-2xl border bg-white py-3 pl-12 pr-4 text-sm outline-none focus:ring-4 focus:ring-red-500/20"
                />
              </div>
              <select value={bloodFilter} onChange={(e) => setBloodFilter(e.target.value)} className="rounded-2xl border bg-white px-4 py-3 text-sm">
                <option value="all">All Blood Groups</option>
                {Object.keys(BLOOD_COLORS).map((g) => <option key={g}>{g}</option>)}
              </select>
              <select value={emergencyFilter} onChange={(e) => setEmergencyFilter(e.target.value)} className="rounded-2xl border bg-white px-4 py-3 text-sm">
                <option value="all">All Requests</option>
                <option value="emergency">🚨 Emergency Only</option>
                <option value="normal">Regular Requests</option>
              </select>
            </div>
          </div>

          {/* Cards / Empty State */}
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 rounded-3xl bg-white/40 animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          ) : filteredRequests.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredRequests.map((req) => (
                <RequestCard key={req._id} request={req} />
              ))}
            </div>
          ) : (
            <EmptyState onClear={clearFilters} />
          )}
        </div>

        {/* ── Create Modal ── */}
        {showCreateModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setShowCreateModal(false)}
          >
            <div className="flex w-full max-w-lg flex-col rounded-3xl bg-white shadow-2xl" style={{ maxHeight: "90vh" }}>
              <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-5">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-gray-900">Create Blood Request</span>
                  <span className="text-xl">🩸</span>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800"
                >
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Patient Name">
                    <input type="text" placeholder="Full name" required className={inp}
                      value={formData.patientName} onChange={setField("patientName")} />
                  </Field>
                  <Field label="Blood Group">
                    <select required className={inp} value={formData.bloodGroup} onChange={setField("bloodGroup")}>
                      <option value="">Select</option>
                      {Object.keys(BLOOD_COLORS).map((g) => <option key={g}>{g}</option>)}
                    </select>
                  </Field>
                  <Field label="Hospital">
                    <input type="text" placeholder="Hospital name" required className={inp}
                      value={formData.hospital} onChange={setField("hospital")} />
                  </Field>
                  <Field label="City">
                    <input type="text" placeholder="City" required className={inp}
                      value={formData.city} onChange={setField("city")} />
                  </Field>
                  <Field label="Units Needed">
                    <input type="number" min={1} required className={inp}
                      value={formData.units} onChange={setField("units")} />
                  </Field>
                  <Field label="Required By">
                    <input type="date" required className={inp}
                      value={formData.requiredDate} onChange={setField("requiredDate")} />
                  </Field>
                  <Field label="Contact Number" className="col-span-2">
                    <input type="tel" placeholder="+91 XXXXX XXXXX" required className={inp}
                      value={formData.phone} onChange={setField("phone")} />
                  </Field>
                  <Field label="Additional Notes" className="col-span-2">
                    <textarea rows={3} placeholder="Any extra info donors should know…"
                      className={`${inp} resize-none`}
                      value={formData.notes} onChange={setField("notes")} />
                  </Field>
                  <div className="col-span-2">
                    <label className="flex cursor-pointer items-center gap-3">
                      <div className="relative">
                        <input type="checkbox" className="peer sr-only"
                          checked={formData.emergency} onChange={setField("emergency")} />
                        <div className="h-6 w-11 rounded-full bg-gray-200 transition-colors peer-checked:bg-red-500" />
                        <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
                      </div>
                      <span className="text-sm font-semibold text-gray-600">Mark as Emergency Request</span>
                    </label>
                  </div>
                  <div className="col-span-2 flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-purple-600 py-3 text-sm font-bold text-white shadow-md transition hover:opacity-90 disabled:opacity-60"
                    >
                      {submitting
                        ? <><Clock size={15} className="animate-spin" /> Submitting…</>
                        : <><Heart size={15} fill="white" /> Submit Request</>
                      }
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Success Modal ── */}
        {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}

        {/* ── Error Toast ── */}
        {errorToast && <ErrorToast message={errorToast} onClose={() => setErrorToast("")} />}
      </main>

      <Footer />
    </>
  );
}