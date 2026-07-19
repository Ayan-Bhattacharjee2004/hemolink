import { Link } from "react-router-dom";
import { Heart, Search, Users, Activity, ShieldCheck, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-donation.png";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const STATUS_COLORS = { Critical: "#f87171", Low: "#f59e0b", Stable: "#34d399" };

/* ── Continuous ECG trace, loops seamlessly ── */
function EcgTrace({ color, speed }) {
  return (
    <div className="relative h-6 w-full overflow-hidden">
      <svg
        className="absolute inset-y-0 left-0 h-full"
        style={{ width: "200%", animation: `ecg-scroll ${speed} linear infinite` }}
        viewBox="0 0 400 24"
        preserveAspectRatio="none"
      >
        <polyline
          points="0,12 40,12 48,12 54,2 60,22 66,6 72,12 200,12 240,12 248,12 254,2 260,22 266,6 272,12 400,12"
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

/* ── One blood type readout, styled like a monitor channel ── */
function BloodTypeMonitor({ type, status, requests }) {
  const color = STATUS_COLORS[status] ?? "#34d399";
  const isUrgent = status === "Critical";
  const note =
    requests > 0
      ? `${requests} active request${requests === 1 ? "" : "s"}`
      : "No active requests";
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-4">
      <span className="font-mono text-xl font-black text-zinc-100">{type}</span>
      <div className="flex items-center gap-1.5">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 6px 1px ${color}`,
            animation: isUrgent ? "led-blink 1s ease-in-out infinite" : "none",
          }}
        />
        <span className="font-mono text-[9px] font-bold uppercase tracking-wider" style={{ color }}>
          {status}
        </span>
      </div>
      <p className="text-center font-mono text-[10px] text-zinc-500">{note}</p>
      <EcgTrace color={color} speed={isUrgent ? "3.5s" : "7s"} />
    </div>
  );
}

function Home() {

const navigate = useNavigate();

const [showProfilePopup, setShowProfilePopup] =
  useState(false);
  useEffect(() => {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (
    user &&
    user.profileCompleted === false
  ) {
    setShowProfilePopup(true);
  }
}, []);

/* ── Live blood type demand ── */
const [bloodDemand, setBloodDemand] = useState([]);

const fetchDemand = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/blood-requests/demand"
    );
    setBloodDemand(res.data);
  } catch (err) {
    console.log(err);
  }
};

useEffect(() => {
  fetchDemand();
}, []);


  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-red-500/20 blur-3xl animate-pulse" />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/50 backdrop-blur px-4 py-1.5 text-sm font-medium text-purple-700">
              <Activity className="h-4 w-4" />
              Saving lives, one drop at a time
            </span>

            <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Connect with{" "}
              <span className="bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
                blood donors
              </span>{" "}
              near you
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-md">
              HemoLink bridges the gap between donors and recipients in real time.
              Find a match, request blood, and save a life — instantly.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-gradient-to-r from-red-500 to-purple-600 text-white shadow-[0_0_16px_rgba(147,51,234,0.4)] hover:shadow-[0_0_24px_rgba(147,51,234,0.6)] hover:scale-105 transition-all border-0"
              >
                <Link to="/search">
                  Find Donors <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/20 backdrop-blur hover:scale-105 transition-transform"
              >
                <Link to="/register">Become a Donor</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-red-500/20 to-purple-600/20 blur-2xl" />
            <img
              src={heroImage}
              alt="Person donating blood"
              className="relative rounded-3xl w-full max-h-[300px] object-contain mx-auto md:max-h-none md:h-[400px] md:object-cover shadow-xl transition-transform duration-500 hover:scale-[1.02]"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "12K+", label: "Registered donors" },
            { value: "3.5K", label: "Lives saved" },
            { value: "150+", label: "Partner hospitals" },
            { value: "24/7", label: "Emergency support" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/40 backdrop-blur p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-white/60"
            >
              <p className="text-3xl font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Blood Type Demand Monitor */}
      <section className="container mx-auto px-4 py-8">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-400/10 bg-[#080c0b] p-8">
          <style>{`
            @keyframes ecg-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
            @keyframes led-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
          `}</style>

          {/* faint CRT scanlines */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, transparent 1px, transparent 2px)" }}
          />

          <div className="relative mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-emerald-400" />
              <div>
                <h2 className="font-mono text-lg font-bold uppercase tracking-wide text-zinc-100">
                  Live Blood Type Demand
                </h2>
                <p className="font-mono text-[11px] text-zinc-500">
                  Real-time supply status across our donor network
                </p>
              </div>
            </div>
            <span className="flex items-center gap-2 rounded-full border border-emerald-400/20 px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-emerald-400">
              <span
                className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                style={{ animation: "led-blink 1.6s ease-in-out infinite" }}
              />
              Live
            </span>
          </div>

          <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-4">
            {bloodDemand.map((b) => (
              <BloodTypeMonitor key={b.type} {...b} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">How HemoLink works</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            A simple, fast, and secure process connecting donors with people in need.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Users,
              title: "Create your profile",
              desc: "Sign up as a donor with your blood type, location, and availability.",
            },
            {
              icon: Search,
              title: "Find a match",
              desc: "Search or get matched instantly with nearby donors or requests.",
            },
            {
              icon: ShieldCheck,
              title: "Connect securely",
              desc: "Chat and coordinate safely through our verified platform.",
            },
          ].map((step, i) => (
            <div
              key={step.title}
              className="group rounded-2xl border border-white/10 bg-white/40 backdrop-blur p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-white/60"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-purple-600 shadow-[0_0_18px_rgba(220,38,38,0.45)] mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <step.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-muted-foreground">{step.desc}</p>
              <span className="mt-4 inline-block text-sm font-medium text-purple-600">
                Step {i + 1}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-500 to-purple-600 px-8 py-16 text-center text-white transition-transform duration-500 hover:scale-[1.01]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.15),_transparent_50%)]" />
          <Heart className="mx-auto h-12 w-12 fill-white mb-4 animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-bold">Every drop counts</h2>
          <p className="mt-3 text-white/80 max-w-xl mx-auto">
            Join thousands of donors who are making a difference in their community today.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 rounded-full bg-white text-purple-700 hover:bg-white/90 hover:scale-105 transition-all border-0"
          >
            <Link to="/register">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
      {showProfilePopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
    
    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">

      <h2 className="text-2xl font-bold">
        Complete Your Profile
      </h2>

      <p className="mt-3 text-gray-600">
        Add your city, date of birth,
        weight and donation details to
        unlock all HemoLink features.
      </p>

      <div className="mt-6 flex gap-3">
        
        <button
          onClick={() =>
            setShowProfilePopup(false)
          }
          className="flex-1 rounded-xl border py-3"
        >
          Later
        </button>

        <button
          onClick={() =>
            navigate("/complete-profile")
          }
          className="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-purple-600 py-3 text-white"
        >
          Complete Now
        </button>

      </div>
    </div>

  </div>
)}
    </>
  );
}

export default Home;