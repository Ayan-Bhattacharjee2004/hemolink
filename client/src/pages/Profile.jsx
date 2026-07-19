import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  User, Mail, Phone, MapPin, Calendar, Droplets, Heart, Activity,
  Bell, Shield, LogOut, Edit, Weight, Clock, X, Check, AlertTriangle,
  Lock, Eye, EyeOff, Trash2, Loader2, CheckCircle2,
} from "lucide-react";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const API = "http://localhost:5000/api";

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}

function getInitials(name) {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(dateStr) {
  if (!dateStr) return "Not set";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function daysSince(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
}

/* ── Reusable Toast ── */
function Toast({ type = "success", message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const styles = {
    success: { bar: "#22c55e", icon: <CheckCircle2 size={18} color="#22c55e" /> },
    error:   { bar: "#ef4444", icon: <AlertTriangle size={18} color="#ef4444" /> },
    info:    { bar: "#3b82f6", icon: <CheckCircle2 size={18} color="#3b82f6" /> },
  };
  const s = styles[type] || styles.info;

  return (
    <>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes toastShrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
      <div style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        minWidth: "280px",
        maxWidth: "calc(100vw - 48px)",
        background: "rgba(18,18,18,0.97)",
        borderRadius: "14px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        overflow: "hidden",
        animation: "toastIn 0.28s cubic-bezier(.34,1.56,.64,1) both",
      }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", background: s.bar }} />
        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px 14px 20px" }}>
          <span style={{ flexShrink: 0 }}>{s.icon}</span>
          <span style={{ flex: 1, fontSize: "14px", fontWeight: 500, color: "#f1f5f9", lineHeight: 1.4 }}>{message}</span>
          <button
            onClick={onClose}
            style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", borderRadius: "6px", background: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer", color: "#94a3b8" }}
          >
            <X size={13} />
          </button>
        </div>
        <div style={{ height: "3px", background: "rgba(255,255,255,0.06)" }}>
          <div style={{ height: "100%", background: s.bar, opacity: 0.45, animation: "toastShrink 3.5s linear forwards" }} />
        </div>
      </div>
    </>
  );
}

/* ── Field wrapper ── */
function ModalField({ label, error, children }) {
  return (
    <div>
      <label className="mb-1 block text-xs text-zinc-400">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

const zinpBase = "w-full rounded-xl bg-white/10 p-3 outline-none ring-1 ring-transparent focus:ring-purple-500 transition";
const zinpErr = "ring-1 ring-red-500";

/* ── Continuous ECG trace, loops seamlessly ── */
function EcgTrace({ color = "#34d399", speed = "6s" }) {
  return (
    <div className="relative h-8 w-full overflow-hidden">
      <svg
        className="absolute inset-y-0 left-0 h-full"
        style={{ width: "200%", animation: `ecg-scroll ${speed} linear infinite` }}
        viewBox="0 0 400 32"
        preserveAspectRatio="none"
      >
        <polyline
          points="0,16 40,16 48,16 54,4 60,28 66,10 72,16 200,16 240,16 248,16 254,4 260,28 266,10 272,16 400,16"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/* ── Blinking status LED, like a monitor indicator light ── */
function StatusLED({ active, label }) {
  const color = active ? "#34d399" : "#f59e0b";
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{
          backgroundColor: color,
          boxShadow: `0 0 6px 1px ${color}`,
          animation: active ? "led-blink 1.6s ease-in-out infinite" : "none",
        }}
      />
      <span
        className="font-mono text-[10px] font-bold uppercase tracking-[0.15em]"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  );
}

/* ── One monitored request, read like a bedside vitals card ── */
function MonitorRow({ request, onDelete }) {
  const isActive = request.status === "Active";
  return (
    <div className="overflow-hidden rounded-xl border border-emerald-400/10 bg-[#0b1210]">
      <div className="flex items-center gap-4 p-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 font-mono text-sm font-bold text-rose-400"
          style={{ borderColor: "#fb7185", boxShadow: "0 0 10px 0 rgba(251,113,133,0.35)" }}
        >
          {request.bloodGroup}
        </div>

        <div className="min-w-0 flex-1 font-mono">
          <p className="truncate text-sm font-semibold text-zinc-100">
            <span className="text-emerald-400/60">PT </span>{request.patientName}
          </p>
          <p className="truncate text-xs text-zinc-400">
            <span className="text-emerald-400/50">FAC </span>{request.hospital}
          </p>
          <p className="flex items-center gap-1 truncate text-xs text-zinc-500">
            <MapPin size={10} className="text-emerald-400/50" /> {request.city}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-3">
          <StatusLED active={isActive} label={request.status} />
          <button
            onClick={() => onDelete(request._id)}
            className="flex items-center gap-1 rounded border border-zinc-700 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-zinc-500 transition hover:border-red-500/50 hover:text-red-400"
          >
            <Trash2 size={11} /> Remove
          </button>
        </div>
      </div>
      <EcgTrace color={isActive ? "#34d399" : "#52525b"} speed={isActive ? "5s" : "9s"} />
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  /* toast */
  const [toast, setToast] = useState(null); // { type, message }
  const showToast = (type, message) => setToast({ type, message });

  /* availability */
  const [available, setAvailable] = useState(true);
  const [updatingAvail, setUpdatingAvail] = useState(false);

  /* edit profile modal */
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);

  /* password modal */
  const [showPassword, setShowPassword] = useState(false);
  const [pwData, setPwData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState(false);
  const [pwErrors, setPwErrors] = useState({});
  const [savingPw, setSavingPw] = useState(false);

  /* notification modal */
  const [showNotif, setShowNotif] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState({
    emailAlerts: true, smsAlerts: true, nearbyRequests: true, donationReminders: true,
  });
  const [savingNotif, setSavingNotif] = useState(false);

  /* delete modal */
  const [showDelete, setShowDelete] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [deleting, setDeleting] = useState(false);

  /* ── My blood requests ── */
  const [myRequests, setMyRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  const fetchMyRequests = async () => {
    setLoadingRequests(true);
    try {
      const res = await axios.get(`${API}/blood-requests/my`, { headers: authHeaders() });
      setMyRequests(res.data);
    } catch (err) {
      console.log(err);
      showToast("error", "Couldn't load your blood requests.");
    } finally {
      setLoadingRequests(false);
    }
  };

  const deleteRequest = async (id) => {
    if (!window.confirm("Delete this blood request?")) return;

    try {
      await axios.delete(`${API}/blood-requests/${id}`, { headers: authHeaders() });
      setMyRequests(prev => prev.filter(req => req._id !== id));
      showToast("success", "Blood request deleted.");
    } catch {
      showToast("error", "Couldn't delete request.");
    }
  };

  /* ── Fetch profile ── */
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/auth/profile`, { headers: authHeaders() });
        const u = res.data;
        setUser(u);
        setAvailable(u.available ?? true);
        setEditData({
          fullName: u.fullName || "",
          email: u.email || "",
          phone: u.phone || "",
          city: u.city || "",
          dateOfBirth: u.dateOfBirth ? u.dateOfBirth.slice(0, 10) : "",
          lastDonationDate: u.lastDonationDate ? u.lastDonationDate.slice(0, 10) : "",
          weight: u.weight || "",
          gender: u.gender || "",
          bloodType: u.bloodType || "",
        });
        if (u.notificationPrefs) setNotifPrefs(p => ({ ...p, ...u.notificationPrefs }));
      } catch {
        setPageError("We couldn't load your profile. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── Fetch my blood requests on mount ── */
  useEffect(() => {
    fetchMyRequests();
  }, []);

  /* ── Logout ── */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /* ── Availability toggle ── */
  const toggleAvailability = async () => {
    const next = !available;
    setAvailable(next);
    setUpdatingAvail(true);
    try {
      await axios.patch(`${API}/auth/availability`, { available: next }, { headers: authHeaders() });
      showToast("success", next ? "You're now visible to patients." : "You're now hidden from search.");
    } catch {
      setAvailable(!next);
      showToast("error", "Couldn't update availability. Try again.");
    } finally {
      setUpdatingAvail(false);
    }
  };

  /* ── Edit profile ── */
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(p => ({ ...p, [name]: value }));
    setEditErrors(p => ({ ...p, [name]: undefined }));
  };

  const validateEdit = () => {
    const err = {};
    if (!editData.fullName?.trim()) err.fullName = "Name is required.";
    if (!editData.email?.trim()) err.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(editData.email)) err.email = "Enter a valid email.";
    if (editData.phone && !/^[0-9+\-\s]{7,15}$/.test(editData.phone)) err.phone = "Enter a valid phone number.";
    if (editData.dateOfBirth) {
      const age = (Date.now() - new Date(editData.dateOfBirth)) / (1000 * 60 * 60 * 24 * 365.25);
      if (age < 18) err.dateOfBirth = "You must be at least 18 to donate.";
      if (age > 120) err.dateOfBirth = "Enter a valid date of birth.";
    }
    if (editData.lastDonationDate && new Date(editData.lastDonationDate) > new Date())
      err.lastDonationDate = "Date can't be in the future.";
    if (editData.weight) {
      const w = Number(editData.weight);
      if (isNaN(w) || w < 30 || w > 300) err.weight = "Enter a weight between 30 and 300 kg.";
    }
    return err;
  };

  const handleUpdateProfile = async () => {
    const errors = validateEdit();
    setEditErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSavingProfile(true);
    try {
      const res = await axios.put(`${API}/auth/profile`, editData, { headers: authHeaders() });
      // Merge all returned fields back into user state
      setUser(prev => ({
        ...prev,
        ...res.data,
        // normalise field names in case backend uses different keys
        fullName: res.data.fullName || editData.fullName,
        email: res.data.email || editData.email,
        phone: res.data.phone || editData.phone,
        city: res.data.city || editData.city,
        gender: res.data.gender || editData.gender,
        bloodType: res.data.bloodType || editData.bloodType,
        weight: res.data.weight || editData.weight,
        dateOfBirth: res.data.dateOfBirth || (editData.dateOfBirth ? editData.dateOfBirth : prev.dateOfBirth),
        lastDonationDate: res.data.lastDonationDate || (editData.lastDonationDate ? editData.lastDonationDate : prev.lastDonationDate),
      }));
      setShowEdit(false);
      showToast("success", "Profile updated successfully.");
    } catch (err) {
      showToast("error", err.response?.data?.message || "Couldn't save changes. Try again.");
    } finally {
      setSavingProfile(false);
    }
  };

  /* ── Password ── */
  const handlePwChange = (e) => {
    const { name, value } = e.target;
    setPwData(p => ({ ...p, [name]: value }));
    setPwErrors(p => ({ ...p, [name]: undefined }));
  };

  const validatePw = () => {
    const err = {};
    if (!pwData.currentPassword) err.currentPassword = "Enter your current password.";
    if (!pwData.newPassword) err.newPassword = "Enter a new password.";
    else if (pwData.newPassword.length < 8) err.newPassword = "Password must be at least 8 characters.";
    if (pwData.currentPassword && pwData.currentPassword === pwData.newPassword)
      err.newPassword = "New password must differ from current password.";
    if (pwData.confirmPassword !== pwData.newPassword) err.confirmPassword = "Passwords do not match.";
    return err;
  };

  const closePwModal = () => {
    setShowPassword(false);
    setPwErrors({});
    setShowPw(false);
    setPwData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleChangePassword = async () => {
    const errors = validatePw();
    setPwErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSavingPw(true);
    try {
      await axios.put(
        `${API}/auth/change-password`,
        { currentPassword: pwData.currentPassword, newPassword: pwData.newPassword },
        { headers: authHeaders() }
      );
      closePwModal();
      showToast("success", "Password updated successfully.");
    } catch (err) {
      setPwErrors({ currentPassword: err.response?.data?.message || "Current password is incorrect." });
    } finally {
      setSavingPw(false);
    }
  };

  /* ── Notifications ── */
  const toggleNotif = (key) => setNotifPrefs(p => ({ ...p, [key]: !p[key] }));

  const handleSaveNotif = async () => {
    setSavingNotif(true);
    try {
      await axios.put(`${API}/auth/notification-preferences`, notifPrefs, { headers: authHeaders() });
      setUser(prev => ({ ...prev, notificationPrefs: notifPrefs }));
      setShowNotif(false);
      showToast("success", "Notification preferences saved.");
    } catch {
      showToast("error", "Couldn't save preferences. Try again.");
    } finally {
      setSavingNotif(false);
    }
  };

  /* ── Delete account ── */
  const handleDeleteAccount = async () => {
    if (deleteText !== "DELETE") return;
    setDeleting(true);
    try {
      await axios.delete(`${API}/auth/account`, { headers: authHeaders() });
      localStorage.removeItem("token");
      navigate("/login");
    } catch {
      showToast("error", "Couldn't delete account. Try again.");
      setDeleting(false);
    }
  };

  /* ── Loading / error screens ── */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 animate-ping rounded-full bg-red-500/30" />
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-purple-600">
              <Droplets className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-muted-foreground">Loading your profile…</p>
        </div>
      </div>
    );
  }

  if (pageError || !user) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <Heart className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="max-w-md text-muted-foreground">{pageError || "Couldn't find your profile. Try signing in again."}</p>
          <button onClick={() => window.location.reload()} className="rounded-2xl bg-gradient-to-r from-red-500 to-purple-600 px-6 py-3 font-medium text-white transition hover:opacity-90">
            Try again
          </button>
        </main>
        <Footer />
      </>
    );
  }

  /* ── Derived values ── */
  const lastDonationDays = daysSince(user.lastDonationDate);
  const eligibleToDonate = lastDonationDays === null || lastDonationDays >= 90;
  const completionFields = [user.fullName, user.email, user.phone, user.city, user.dateOfBirth, user.bloodType, user.gender, user.weight];
  const completion = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100);

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen overflow-hidden px-4 pt-28 pb-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-red-500/20 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl space-y-8">

          {/* ── Profile Header ── */}
          <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl shadow-xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-purple-600 text-3xl font-bold text-white">
                  {getInitials(user.fullName)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-bold">{user.fullName}</h1>
                    {eligibleToDonate && (
                      <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-500">
                        Eligible to donate
                      </span>
                    )}
                  </div>
                  <p className="mt-1 flex items-center gap-2 text-muted-foreground">
                    <Droplets className="h-4 w-4 text-red-500" />
                    Blood Group: <span className="font-semibold text-foreground">{user.bloodType || "Not set"}</span>
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {user.city || "Location not set"}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowEdit(true)}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-purple-600 px-5 py-3 text-white transition hover:opacity-90"
              >
                <Edit size={18} /> Edit Profile
              </button>
            </div>

            {completion < 100 && (
              <div className="mt-8">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Profile Completion</span>
                  <span className="text-sm font-bold">{completion}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-500 to-purple-600 transition-all duration-700"
                    style={{ width: `${completion}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Complete your profile so nearby patients can find and trust you faster.
                </p>
              </div>
            )}
          </div>

          {/* ── Stats ── */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <Heart className="mb-3 text-red-500" />, value: user.donations ?? 0, label: "Donations" },
              { icon: <Activity className="mb-3 text-green-500" />, value: user.livesHelped ?? 0, label: "Lives Helped" },
              { icon: <Bell className="mb-3 text-orange-500" />, value: user.responses ?? 0, label: "Responses" },
              { icon: <Droplets className="mb-3 text-purple-500" />, value: user.bloodType || "—", label: "Blood Group" },
            ].map(({ icon, value, label }) => (
              <div key={label} className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl transition hover:bg-white/15">
                {icon}
                <h2 className="text-3xl font-bold">{value}</h2>
                <p className="text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          {/* ── Donor Availability ── */}
          <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold">Donor Availability</h2>
                <p className="text-muted-foreground">
                  {available
                    ? "You're visible to patients searching for your blood type nearby."
                    : "You're hidden from donor search results."}
                </p>
                {lastDonationDays !== null && !eligibleToDonate && (
                  <p className="mt-2 flex items-center gap-2 text-sm text-orange-500">
                    <Clock className="h-4 w-4" />
                    You can donate again in {90 - lastDonationDays} day{90 - lastDonationDays === 1 ? "" : "s"}.
                  </p>
                )}
              </div>
              <button
                onClick={toggleAvailability}
                disabled={updatingAvail}
                className={`flex items-center justify-center gap-2 rounded-full px-6 py-3 font-medium text-white transition disabled:opacity-60 ${
                  available ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"
                }`}
              >
                {updatingAvail
                  ? <Loader2 size={16} className="animate-spin" />
                  : <span className={`h-2.5 w-2.5 rounded-full ${available ? "bg-white animate-pulse" : "bg-white/50"}`} />
                }
                {updatingAvail ? "Updating…" : available ? "Available" : "Offline"}
              </button>
            </div>
          </div>

          {/* ── Personal + Medical Info ── */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
              <h2 className="mb-6 text-xl font-bold">Personal Information</h2>
              <div className="space-y-5">
                {[
                  { icon: <User size={16} />, label: "Full Name", value: user.fullName },
                  { icon: <Mail size={16} />, label: "Email", value: user.email },
                  { icon: <Phone size={16} />, label: "Phone", value: user.phone },
                  { icon: <MapPin size={16} />, label: "City", value: user.city },
                  { icon: <Calendar size={16} />, label: "Date of Birth", value: formatDate(user.dateOfBirth) },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">{icon}</div>
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="font-medium">{value || "Not set"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
              <h2 className="mb-6 text-xl font-bold">Medical Information</h2>
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                    <Droplets size={16} className="text-red-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Blood Group</p>
                    <p className="font-bold text-red-500">{user.bloodType || "Not set"}</p>
                  </div>
                </div>
                {[
                  { icon: <User size={16} />, label: "Gender", value: user.gender },
                  { icon: <Weight size={16} />, label: "Weight", value: user.weight ? `${user.weight} kg` : null },
                  {
                    icon: <Clock size={16} />, label: "Last Donation",
                    value: user.lastDonationDate
                      ? `${formatDate(user.lastDonationDate)} (${lastDonationDays} days ago)`
                      : "No donations yet",
                  },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">{icon}</div>
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="font-medium">{value || "Not set"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Recent Activity ── */}
          <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
            <h2 className="mb-6 text-xl font-bold">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-500/15 text-green-500">✓</span>
                <div>
                  <p className="font-medium">Account registered</p>
                  <p className="text-xs text-muted-foreground">Welcome to the community</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-500">
                  <Droplets size={16} />
                </span>
                <div>
                  <p className="font-medium">Blood group added</p>
                  <p className="text-xs text-muted-foreground">{user.bloodType || "Not set yet"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-orange-500">
                  <Bell size={16} />
                </span>
                <div>
                  <p className="font-medium">Notifications enabled</p>
                  <p className="text-xs text-muted-foreground">You'll be alerted for nearby requests</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── My Blood Requests: bedside monitor panel ── */}
          <div className="relative overflow-hidden rounded-3xl border border-emerald-400/10 bg-[#080c0b] p-6">
            <style>{`
              @keyframes ecg-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
              @keyframes led-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
            `}</style>
            {/* faint CRT scanlines */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.05]"
              style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, transparent 1px, transparent 2px)" }}
            />

            <div className="relative mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-emerald-400" />
                <div>
                  <h2 className="font-mono text-lg font-bold uppercase tracking-wide text-zinc-100">
                    My Blood Requests
                  </h2>
                  <p className="font-mono text-[11px] text-zinc-500">Live status of requests you've posted</p>
                </div>
              </div>
              {!loadingRequests && myRequests.length > 0 && (
                <span className="flex items-center gap-2 rounded-full border border-emerald-400/20 px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-emerald-400">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                    style={{ animation: "led-blink 1.6s ease-in-out infinite" }}
                  />
                  {myRequests.length} monitored
                </span>
              )}
            </div>

            <div className="relative space-y-3">
              {loadingRequests ? (
                <div className="flex items-center gap-3 py-10 font-mono text-xs uppercase tracking-widest text-emerald-400/60">
                  <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
                  Connecting to feed…
                </div>
              ) : myRequests.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-zinc-700 py-12 text-center font-mono">
                  <Activity className="h-6 w-6 text-zinc-600" />
                  <p className="text-sm text-zinc-400">No signals detected</p>
                  <p className="text-xs text-zinc-600">Post a blood request and it'll appear here.</p>
                </div>
              ) : (
                myRequests.map(request => (
                  <MonitorRow key={request._id} request={request} onDelete={deleteRequest} />
                ))
              )}
            </div>
          </div>

          {/* ── Account Settings ── */}
          <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
            <h2 className="mb-6 text-xl font-bold">Account Settings</h2>
            <div className="flex flex-col gap-4">
              {[
                { icon: <Shield size={18} />, label: "Change Password", onClick: () => setShowPassword(true) },
                { icon: <Bell size={18} />, label: "Notification Settings", onClick: () => setShowNotif(true) },
                { icon: <LogOut size={18} />, label: "Logout", onClick: handleLogout },
              ].map(({ icon, label, onClick }) => (
                <button key={label} onClick={onClick} className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 text-left transition hover:bg-white/20">
                  {icon} {label}
                </button>
              ))}
              <button
                onClick={() => setShowDelete(true)}
                className="flex items-center gap-3 rounded-2xl bg-red-500/10 p-4 text-left text-red-500 transition hover:bg-red-500/20"
              >
                <Trash2 size={18} /> Delete Account
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ════════════════════════════════════════
          EDIT PROFILE MODAL
      ════════════════════════════════════════ */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/20 bg-zinc-900 p-6 text-white shadow-2xl">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Edit Profile</h2>
              <button onClick={() => { setShowEdit(false); setEditErrors({}); }} className="rounded-full p-1 text-zinc-400 transition hover:bg-white/10 hover:text-white">
                <X size={22} />
              </button>
            </div>
            <p className="mb-6 text-sm text-zinc-400">Keep your details accurate so donors and patients can reach you.</p>

            <div className="space-y-6">
              {/* Personal */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">Personal Details</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <ModalField label="Full Name" error={editErrors.fullName}>
                    <input type="text" name="fullName" value={editData.fullName} onChange={handleEditChange} placeholder="Full Name"
                      className={`${zinpBase} ${editErrors.fullName ? zinpErr : ""}`} />
                  </ModalField>
                  <ModalField label="Email" error={editErrors.email}>
                    <input type="email" name="email" value={editData.email} onChange={handleEditChange} placeholder="Email"
                      className={`${zinpBase} ${editErrors.email ? zinpErr : ""}`} />
                  </ModalField>
                  <ModalField label="Phone" error={editErrors.phone}>
                    <input type="text" name="phone" value={editData.phone} onChange={handleEditChange} placeholder="Phone"
                      className={`${zinpBase} ${editErrors.phone ? zinpErr : ""}`} />
                  </ModalField>
                  <ModalField label="City">
                    <input type="text" name="city" value={editData.city} onChange={handleEditChange} placeholder="City" className={zinpBase} />
                  </ModalField>
                  <ModalField label="Date of Birth" error={editErrors.dateOfBirth}>
                    <input type="date" name="dateOfBirth" value={editData.dateOfBirth} onChange={handleEditChange}
                      max={new Date().toISOString().slice(0, 10)}
                      className={`${zinpBase} ${editErrors.dateOfBirth ? zinpErr : ""}`} />
                  </ModalField>
                  <ModalField label="Gender">
                    <select name="gender" value={editData.gender} onChange={handleEditChange} className={zinpBase}>
                      <option value="" className="bg-zinc-900">Select Gender</option>
                      {["Male", "Female", "Other"].map(g => <option key={g} value={g} className="bg-zinc-900">{g}</option>)}
                    </select>
                  </ModalField>
                </div>
              </div>

              {/* Medical */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">Medical Details</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <ModalField label="Blood Group">
                    <select name="bloodType" value={editData.bloodType} onChange={handleEditChange} className={zinpBase}>
                      <option value="" className="bg-zinc-900">Select Blood Group</option>
                      {BLOOD_TYPES.map(bt => <option key={bt} value={bt} className="bg-zinc-900">{bt}</option>)}
                    </select>
                  </ModalField>
                  <ModalField label="Weight (kg)" error={editErrors.weight}>
                    <input type="number" name="weight" value={editData.weight} onChange={handleEditChange}
                      placeholder="Weight" min="30" max="300"
                      className={`${zinpBase} ${editErrors.weight ? zinpErr : ""}`} />
                  </ModalField>
                  <ModalField label="Last Donation Date" error={editErrors.lastDonationDate} className="md:col-span-2">
                    <input type="date" name="lastDonationDate" value={editData.lastDonationDate} onChange={handleEditChange}
                      max={new Date().toISOString().slice(0, 10)}
                      className={`${zinpBase} ${editErrors.lastDonationDate ? zinpErr : ""}`} />
                    <p className="mt-1 text-xs text-zinc-500">Leave blank if you've never donated before.</p>
                  </ModalField>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => { setShowEdit(false); setEditErrors({}); }}
                className="flex-1 rounded-xl border border-white/20 py-3 transition hover:bg-white/10">
                Cancel
              </button>
              <button onClick={handleUpdateProfile} disabled={savingProfile}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-purple-600 py-3 font-medium transition hover:opacity-90 disabled:opacity-60">
                {savingProfile && <Loader2 size={16} className="animate-spin" />}
                {savingProfile ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          CHANGE PASSWORD MODAL
      ════════════════════════════════════════ */}
      {showPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/20 bg-zinc-900 p-6 text-white shadow-2xl">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Change Password</h2>
              <button onClick={closePwModal} className="rounded-full p-1 text-zinc-400 transition hover:bg-white/10 hover:text-white">
                <X size={22} />
              </button>
            </div>
            <p className="mb-6 text-sm text-zinc-400">Use a password you don't use anywhere else.</p>

            <div className="space-y-4">
              {[
                { name: "currentPassword", label: "Current Password", placeholder: "Enter current password" },
                { name: "newPassword", label: "New Password", placeholder: "At least 8 characters" },
                { name: "confirmPassword", label: "Confirm New Password", placeholder: "Re-enter new password" },
              ].map(({ name, label, placeholder }) => (
                <ModalField key={name} label={label} error={pwErrors[name]}>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type={showPw ? "text" : "password"}
                      name={name}
                      value={pwData[name]}
                      onChange={handlePwChange}
                      placeholder={placeholder}
                      className={`${zinpBase} pl-9 ${pwErrors[name] ? zinpErr : ""}`}
                    />
                  </div>
                </ModalField>
              ))}
              <button type="button" onClick={() => setShowPw(p => !p)}
                className="flex items-center gap-2 text-xs text-zinc-400 transition hover:text-white">
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                {showPw ? "Hide passwords" : "Show passwords"}
              </button>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={closePwModal} className="flex-1 rounded-xl border border-white/20 py-3 transition hover:bg-white/10">
                Cancel
              </button>
              <button onClick={handleChangePassword} disabled={savingPw}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-purple-600 py-3 font-medium transition hover:opacity-90 disabled:opacity-60">
                {savingPw && <Loader2 size={16} className="animate-spin" />}
                {savingPw ? "Updating…" : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          NOTIFICATION SETTINGS MODAL
      ════════════════════════════════════════ */}
      {showNotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/20 bg-zinc-900 p-6 text-white shadow-2xl">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Notification Settings</h2>
              <button onClick={() => setShowNotif(false)} className="rounded-full p-1 text-zinc-400 transition hover:bg-white/10 hover:text-white">
                <X size={22} />
              </button>
            </div>
            <p className="mb-6 text-sm text-zinc-400">Choose how you'd like to hear about donation requests.</p>

            <div className="space-y-3">
              {[
                { key: "nearbyRequests", title: "Nearby Blood Requests", desc: "Get notified when someone near you needs your blood type." },
                { key: "emailAlerts", title: "Email Alerts", desc: "Receive updates and requests by email." },
                { key: "smsAlerts", title: "SMS Alerts", desc: "Receive urgent requests by text message." },
                { key: "donationReminders", title: "Donation Reminders", desc: "Remind me when I'm eligible to donate again." },
              ].map(({ key, title, desc }) => (
                <div key={key} className="flex items-center justify-between gap-4 rounded-2xl bg-white/5 p-4">
                  <div>
                    <p className="font-medium">{title}</p>
                    <p className="text-xs text-zinc-400">{desc}</p>
                  </div>
                  <button
                    onClick={() => toggleNotif(key)}
                    role="switch"
                    aria-checked={notifPrefs[key]}
                    className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${notifPrefs[key] ? "bg-green-500" : "bg-zinc-700"}`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${notifPrefs[key] ? "left-6" : "left-1"}`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowNotif(false)} className="flex-1 rounded-xl border border-white/20 py-3 transition hover:bg-white/10">
                Cancel
              </button>
              <button onClick={handleSaveNotif} disabled={savingNotif}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-purple-600 py-3 font-medium transition hover:opacity-90 disabled:opacity-60">
                {savingNotif && <Loader2 size={16} className="animate-spin" />}
                {savingNotif ? "Saving…" : "Save Preferences"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          DELETE ACCOUNT MODAL
      ════════════════════════════════════════ */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-red-500/30 bg-zinc-900 p-6 text-white shadow-2xl">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-red-500">
                <AlertTriangle size={22} /> Delete Account
              </h2>
              <button onClick={() => { setShowDelete(false); setDeleteText(""); }}
                className="rounded-full p-1 text-zinc-400 transition hover:bg-white/10 hover:text-white">
                <X size={22} />
              </button>
            </div>
            <p className="mb-4 text-sm text-zinc-400">
              This permanently deletes your profile, donation history, and removes you from donor search. This action cannot be undone.
            </p>
            <label className="mb-1 block text-xs text-zinc-400">
              Type <span className="font-semibold text-white">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={deleteText}
              onChange={e => setDeleteText(e.target.value)}
              placeholder="DELETE"
              className="w-full rounded-xl bg-white/10 p-3 outline-none ring-1 ring-transparent focus:ring-red-500"
            />
            <div className="mt-6 flex gap-3">
              <button onClick={() => { setShowDelete(false); setDeleteText(""); }}
                className="flex-1 rounded-xl border border-white/20 py-3 transition hover:bg-white/10">
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteText !== "DELETE" || deleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-3 font-medium transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {deleting && <Loader2 size={16} className="animate-spin" />}
                {deleting ? "Deleting…" : "Delete My Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Global Toast ── */}
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <Footer />
    </>
  );
}