import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Search,
  MapPin,
  Phone,
  Heart,
  Users,
  CheckCircle,
  Clock,
  Droplets,
  Filter,
  Star,
} from "lucide-react";

const DONORS = [
  {
    id: 1,
    name: "Arjun Mehta",
    blood: "O+",
    city: "Kolkata",
    lastDonated: "2 months ago",
    donations: 12,
    available: true,
    verified: true,
    age: 28,
    phone: "+91 98765 43210",
  },
  {
    id: 2,
    name: "Sneha Bose",
    blood: "A+",
    city: "Delhi",
    lastDonated: "3 months ago",
    donations: 7,
    available: true,
    verified: true,
    age: 24,
    phone: "+91 91234 56789",
  },
  {
    id: 3,
    name: "Ravi Kumar",
    blood: "B-",
    city: "Bangalore",
    lastDonated: "5 months ago",
    donations: 4,
    available: false,
    verified: true,
    age: 32,
    phone: "+91 99887 76655",
  },
  {
    id: 4,
    name: "Pooja Sharma",
    blood: "AB+",
    city: "Mumbai",
    lastDonated: "1 month ago",
    donations: 19,
    available: true,
    verified: true,
    age: 29,
    phone: "+91 88776 65544",
  },
  {
    id: 5,
    name: "Debjit Roy",
    blood: "O-",
    city: "Kolkata",
    lastDonated: "4 months ago",
    donations: 9,
    available: true,
    verified: false,
    age: 35,
    phone: "+91 77665 54433",
  },
  {
    id: 6,
    name: "Ananya Das",
    blood: "A-",
    city: "Hyderabad",
    lastDonated: "6 months ago",
    donations: 3,
    available: false,
    verified: true,
    age: 26,
    phone: "+91 66554 43322",
  },
  {
    id: 7,
    name: "Manish Gupta",
    blood: "B+",
    city: "Delhi",
    lastDonated: "2 months ago",
    donations: 15,
    available: true,
    verified: true,
    age: 31,
    phone: "+91 55443 32211",
  },
  {
    id: 8,
    name: "Ritika Sen",
    blood: "AB-",
    city: "Chennai",
    lastDonated: "3 months ago",
    donations: 6,
    available: true,
    verified: false,
    age: 27,
    phone: "+91 44332 21100",
  },
];

const BLOOD_GROUPS = ["All", "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
const CITIES = ["All Cities", "Kolkata", "Delhi", "Bangalore", "Mumbai", "Hyderabad", "Chennai"];

function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}

const AVATAR_COLORS = [
  "bg-purple-100 text-purple-700",
  "bg-red-100 text-red-700",
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-amber-100 text-amber-700",
  "bg-pink-100 text-pink-700",
];

function DonorCard({ donor }) {
  const colorClass = AVATAR_COLORS[donor.id % AVATAR_COLORS.length];

  return (
    <div className={`rounded-3xl border bg-white/10 backdrop-blur-xl shadow-xl p-5 md:p-6 transition hover:-translate-y-1 ${
      donor.available ? "border-white/20" : "border-white/10 opacity-75"
    }`}>
      {/* Top */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center font-bold text-sm ${colorClass}`}>
            {getInitials(donor.name)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-base leading-tight">{donor.name}</h2>
              {donor.verified && (
                <CheckCircle className="h-4 w-4 text-blue-500 shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Age {donor.age}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-red-500 px-3 py-1 text-white font-bold text-sm">
          {donor.blood}
        </span>
      </div>

      {/* Availability */}
      <div className="mt-4">
        {donor.available ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
            Available to donate
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
            <Clock className="h-3 w-3" />
            Not available now
          </span>
        )}
      </div>

      {/* Details */}
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center gap-3 text-muted-foreground">
          <MapPin className="h-4 w-4 text-purple-500 shrink-0" />
          {donor.city}
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <Droplets className="h-4 w-4 text-red-500 shrink-0" />
          Last donated: {donor.lastDonated}
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <Star className="h-4 w-4 text-amber-500 shrink-0" />
          {donor.donations} total donations
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex gap-3">
        <button className="flex-1 rounded-2xl border border-gray-200 bg-white py-2.5 hover:bg-gray-50 transition flex items-center justify-center gap-2 text-sm font-medium">
          <Phone className="h-4 w-4" />
          Call
        </button>
        <button
          disabled={!donor.available}
          className={`flex-1 rounded-2xl py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition ${
            donor.available
              ? "bg-gradient-to-r from-red-500 to-purple-600 text-white hover:scale-[1.02]"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Heart className={`h-4 w-4 ${donor.available ? "fill-white" : ""}`} />
          Request
        </button>
      </div>
    </div>
  );
}

function FindDonors() {
  const [search, setSearch] = useState("");
  const [selectedBlood, setSelectedBlood] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [availableOnly, setAvailableOnly] = useState(false);

  const filtered = DONORS.filter((d) => {
    const matchSearch =
      !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.city.toLowerCase().includes(search.toLowerCase());
    const matchBlood = selectedBlood === "All" || d.blood === selectedBlood;
    const matchCity = selectedCity === "All Cities" || d.city === selectedCity;
    const matchAvail = !availableOnly || d.available;
    return matchSearch && matchBlood && matchCity && matchAvail;
  });

  const availableCount = DONORS.filter((d) => d.available).length;
  const verifiedCount = DONORS.filter((d) => d.verified).length;
  const totalDonations = DONORS.reduce((sum, d) => sum + d.donations, 0);

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen overflow-hidden pt-28 pb-20 px-4">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-red-500/20 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold md:text-5xl">Find Donors 🩸</h1>
            <p className="mt-3 text-muted-foreground text-sm md:text-base">
              Connect with verified blood donors near you and save lives.
            </p>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-4 md:p-6 backdrop-blur-xl">
              <div className="flex items-center gap-2 md:gap-3">
                <Users className="text-purple-500 h-5 w-5 shrink-0" />
                <span className="text-muted-foreground text-xs md:text-sm">Total Donors</span>
              </div>
              <h2 className="mt-3 text-2xl md:text-3xl font-bold">{DONORS.length}</h2>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/10 p-4 md:p-6 backdrop-blur-xl">
              <div className="flex items-center gap-2 md:gap-3">
                <Heart className="text-red-500 h-5 w-5 shrink-0" />
                <span className="text-muted-foreground text-xs md:text-sm">Available Now</span>
              </div>
              <h2 className="mt-3 text-2xl md:text-3xl font-bold">{availableCount}</h2>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/10 p-4 md:p-6 backdrop-blur-xl">
              <div className="flex items-center gap-2 md:gap-3">
                <CheckCircle className="text-blue-500 h-5 w-5 shrink-0" />
                <span className="text-muted-foreground text-xs md:text-sm">Verified</span>
              </div>
              <h2 className="mt-3 text-2xl md:text-3xl font-bold">{verifiedCount}</h2>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/10 p-4 md:p-6 backdrop-blur-xl">
              <div className="flex items-center gap-2 md:gap-3">
                <Droplets className="text-green-500 h-5 w-5 shrink-0" />
                <span className="text-muted-foreground text-xs md:text-sm">Total Donations</span>
              </div>
              <h2 className="mt-3 text-2xl md:text-3xl font-bold">{totalDonations}</h2>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-xl p-4 md:p-6 mb-8">
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              <div className="relative sm:col-span-2 md:col-span-1">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-2xl bg-white border border-gray-200 py-3 pl-12 pr-4 text-sm outline-none focus:ring-4 focus:ring-purple-500/20"
                />
              </div>

              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="rounded-2xl bg-white border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-purple-500/20"
              >
                {CITIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <select
                value={selectedBlood === "All" ? "All Blood Groups" : selectedBlood}
                onChange={(e) => setSelectedBlood(e.target.value === "All Blood Groups" ? "All" : e.target.value)}
                className="rounded-2xl bg-white border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-purple-500/20"
              >
                <option>All Blood Groups</option>
                {BLOOD_GROUPS.filter((g) => g !== "All").map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Blood group pills */}
            <div className="mt-5 flex flex-wrap gap-2">
              {BLOOD_GROUPS.map((group) => (
                <button
                  key={group}
                  onClick={() => setSelectedBlood(group)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    selectedBlood === group
                      ? "bg-gradient-to-r from-red-500 to-purple-600 text-white shadow"
                      : "border border-white/20 bg-white/20 hover:bg-red-500 hover:text-white"
                  }`}
                >
                  {group}
                </button>
              ))}

              <button
                onClick={() => setAvailableOnly((v) => !v)}
                className={`ml-auto rounded-full px-4 py-1.5 text-sm font-medium flex items-center gap-1.5 transition ${
                  availableOnly
                    ? "bg-green-500 text-white shadow"
                    : "border border-white/20 bg-white/20 hover:bg-green-500 hover:text-white"
                }`}
              >
                <Filter className="h-3.5 w-3.5" />
                Available only
              </button>
            </div>
          </div>

          {/* Result count */}
          <p className="mb-4 text-xs text-muted-foreground">
            {filtered.length === DONORS.length
              ? `Showing all ${DONORS.length} donors`
              : `${filtered.length} of ${DONORS.length} donors`}
          </p>

          {/* Donor Cards */}
          {filtered.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((donor) => (
                <DonorCard key={donor.id} donor={donor} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-300 py-20 text-center">
              <Heart className="mx-auto mb-4 h-16 w-16 text-red-400" />
              <h2 className="text-2xl font-bold">No Donors Found</h2>
              <p className="mt-2 text-muted-foreground">
                Try changing your filters or search query.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default FindDonors;