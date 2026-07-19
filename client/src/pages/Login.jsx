import { Link } from "react-router-dom";
import { Heart, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "../assets/img/logo.png";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
function Login() {
  const [showPassword, setShowPassword] = useState(false);


const navigate = useNavigate();

const [loading, setLoading] = useState(false);

const [formData, setFormData] = useState({
  email: "",
  password: "",
});

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.email || !formData.password) {
    toast.error("Please fill all fields");
    return;
  }

  try {
    setLoading(true);

    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      formData
    );

    localStorage.setItem(
      "token",
      res.data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
    );

    toast.success("Login successful 🎉");

    setTimeout(() => {
      if (res.data.user.profileCompleted) {
        navigate("/");
      } else {
        navigate("/");
      }
    }, 1000);

  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Login failed"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4">
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
              Welcome back, lifesaver.
            </h2>
            <p className="mt-3 text-white/80 max-w-sm">
              Sign in to manage your donor profile, respond to requests, and track your impact.
            </p>
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

          <h1 className="text-2xl md:text-3xl font-bold">Sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-purple-600 hover:underline">
              Register here
            </Link>
          </p>

          <form className="mt-8 space-y-5"  onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Email address
              </label>
              <div className="mt-1.5 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                   name="email"
  value={formData.email}
  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-200 bg-white shadow-sm pl-10 pr-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-purple-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="mt-1.5 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="password"
                    name="password"
  value={formData.password}
  onChange={handleChange}
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

            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border border-white/20 accent-purple-600"
              />
              <label htmlFor="remember" className="text-sm text-muted-foreground">
                Remember me
              </label>
            </div>

            <Button
  type="submit"
  disabled={loading}
  size="lg"
  className="w-full rounded-full bg-gradient-to-r from-red-500 to-purple-600 text-white"
>
  {loading ? "Signing In..." : "Sign In"}
</Button>
          </form>

          <div className="mt-6 flex items-center gap-3">
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

export default Login;