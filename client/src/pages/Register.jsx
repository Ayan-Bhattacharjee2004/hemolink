import { Link } from "react-router-dom";
import { Heart, Mail, Lock, User, Phone, Droplet, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "../assets/img/logo.png";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    bloodType: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



  const navigate = useNavigate();





const handleSubmit = async (e) => {
  e.preventDefault();

  if (loading) return;

  if (
    !formData.fullName ||
    !formData.phone ||
    !formData.email ||
    !formData.bloodType ||
    !formData.password
  ) {
    toast.error("Please fill all fields");
    return;
  }

  try {
    setLoading(true);

    const res = await axios.post(
      "http://localhost:5000/api/auth/register",
      formData
    );

    toast.success(res.data.message);

    setFormData({
      fullName: "",
      phone: "",
      email: "",
      bloodType: "",
      password: "",
    });

    setTimeout(() => navigate("/login"), 1500);

  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Something went wrong"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-red-500/20 blur-3xl" />
      </div>

      <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-3xl overflow-hidden border border-white/10 bg-white/40 backdrop-blur-xl shadow-xl">

        {/* Left branding panel */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-red-500 to-purple-600 p-10 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.15),_transparent_50%)]" />

          <Link to="/" className="inline-flex h-10 items-center overflow-hidden -my-2">
            <img
              src={logo}
              alt="HemoLink"
              className="h-40 w-auto object-contain brightness-0 invert"
            />
          </Link>

          <div>
            <h2 className="text-3xl font-bold leading-tight">
              Join the lifesaving network.
            </h2>
            <p className="mt-3 text-white/80 max-w-sm">
              Create your account to find donors, respond to requests, and help save lives in your community.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Get matched with nearby donors instantly",
                "Receive alerts for urgent requests",
                "Track your donation history",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 mt-0.5">
                    <Droplet className="h-3.5 w-3.5 fill-white" />
                  </div>
                  <span className="text-sm text-white/90">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-white/70">
            <Heart className="h-4 w-4 fill-white" />
            <span>Every drop counts</span>
          </div>
        </div>

        {/* Right form panel */}
        <div className="p-8 md:p-10 bg-white/60 backdrop-blur-xl">
          <Link to="/" className="md:hidden inline-flex h-10 items-center overflow-hidden -my-2 mb-8">
            <img
              src={logo}
              alt="HemoLink"
              className="h-40 w-auto object-contain"
            />
          </Link>

          <h1 className="text-2xl md:text-3xl font-bold">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-purple-600 hover:underline">
              Sign in
            </Link>
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium">
                  Full name
                </label>
                <div className="mt-1.5 relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="name"
                    type="text"
                    name="fullName"
                    placeholder="Ayan Bhattacharjee"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-white shadow-sm pl-10 pr-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone number
                </label>
                <div className="mt-1.5 relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="phone"
                    value={formData.phone}
                    name="phone"
                    onChange={handleChange}
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-gray-200 bg-white shadow-sm pl-10 pr-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Email address
              </label>
              <div className="mt-1.5 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-200 bg-white shadow-sm pl-10 pr-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="bloodType" className="text-sm font-medium">
                Blood type
              </label>
              <div className="mt-1.5 relative">
                <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  id="bloodType"
                  name="bloodType"
                  defaultValue=""
                  value={formData.bloodType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-white shadow-sm pl-10 pr-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20"
                >
                  <option value="" disabled>
                    Select your blood type
                  </option>
                  {bloodTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="mt-1.5 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 bg-white shadow-sm pl-10 pr-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 mt-0.5 rounded border border-white/20 accent-purple-600"
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{" "}
                <Link to="/terms" className="text-purple-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-purple-600 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

           <Button
  type="submit"
  disabled={loading}
  size="lg"
  className="w-full rounded-full ..."
>
  {loading ? "Creating Account..." : "Create Account"}
</Button>
          </form>

          <div className="mt-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/20" />
            <span className="text-xs text-muted-foreground">or continue with</span>
            <div className="h-px flex-1 bg-white/20" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              className="flex items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/40 backdrop-blur py-3 text-sm font-medium transition-all hover:bg-white/60 hover:scale-[1.02]"
            >
              <FcGoogle className="h-5 w-5" />
              Google
            </button>

            <button
              className="flex items-center justify-center gap-3 rounded-xl border border-white/20 bg-[#1877F2]/10 backdrop-blur py-3 text-sm font-medium transition-all hover:bg-[#1877F2]/20 hover:scale-[1.02]"
            >
              <FaFacebookF className="h-4 w-4 text-[#1877F2]" />
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;