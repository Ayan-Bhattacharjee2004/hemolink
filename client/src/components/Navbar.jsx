import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import {
  Heart,
  Menu,
  Bell,
  User,
  LogOut,
} from "lucide-react";
import logo from "../assets/img/logo.png";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

function Navbar() {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // TODO: wire this up to your real notifications source
  // (e.g. an API call, socket event, or context/redux store).
  // Reads from the user object if present, otherwise falls back to a
  // demo value of 3 so you can SEE the badge/animation working right away.
  // Once your backend sends a real count, remove the "?? 3" fallback.
  const [notificationCount, setNotificationCount] = useState(
    user?.notificationCount ?? 3
  );

  useEffect(() => {
    // Example of where you'd fetch/poll real unread count:
    // fetchUnreadNotifications().then(setNotificationCount);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const hasNotifications = notificationCount > 0;

  // Shared bell button used in both the desktop nav and the mobile header.
  const NotificationBell = ({ className = "" }) => (
    <Link
      to="/notifications"
      className={`bell-btn ${className}`}
      aria-label={hasNotifications ? "You have new notifications" : "No new notifications"}
    >
      <Bell
        className={hasNotifications ? "h-[19px] w-[19px] bell-wiggle" : "h-[19px] w-[19px]"}
        strokeWidth={1.75}
      />
      {hasNotifications && (
        <span className="bell-indicator-wrap">
          <span className="bell-indicator-ping" />
          <span className="bell-indicator-dot" />
        </span>
      )}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/60 backdrop-blur-xl">
      {/* Local keyframes for the "has notifications" wiggle */}
      <style>{`
        @keyframes bell-wiggle-kf {
          0%, 100% { transform: rotate(0deg); }
          10% { transform: rotate(-14deg); }
          20% { transform: rotate(12deg); }
          30% { transform: rotate(-10deg); }
          40% { transform: rotate(8deg); }
          50% { transform: rotate(-4deg); }
          60%, 100% { transform: rotate(0deg); }
        }
        @keyframes bell-ping-kf {
          0% { transform: scale(1); opacity: 0.65; }
          75%, 100% { transform: scale(2.4); opacity: 0; }
        }
        .bell-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 38px;
          width: 38px;
          border-radius: 9999px;
          color: #52525b;
          background-color: transparent;
          transition: background-color 0.15s ease, color 0.15s ease, transform 0.1s ease;
        }
        .bell-btn:hover {
          background-color: rgba(0, 0, 0, 0.05);
          color: #18181b;
        }
        .bell-btn:active {
          transform: scale(0.92);
        }
        .bell-wiggle {
          transform-origin: 50% 0%;
          animation: bell-wiggle-kf 2s ease-in-out infinite;
        }
        .bell-indicator-wrap {
          position: absolute;
          top: 8px;
          right: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 8px;
          width: 8px;
        }
        .bell-indicator-ping {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: linear-gradient(135deg, #ef4444, #a855f7);
          animation: bell-ping-kf 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .bell-indicator-dot {
          position: relative;
          height: 8px;
          width: 8px;
          border-radius: 9999px;
          background: linear-gradient(135deg, #ef4444, #a855f7);
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.9);
        }
      `}</style>

      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img src={logo} alt="HemoLink" className="h-60 mt-2 w-auto object-contain transition-transform group-hover:scale-105" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/search" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Find Donors
          </Link>
          <Link to="/requests" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Blood Requests
          </Link>

          {!token ? (
            <>
              <Button
                variant="outline"
                asChild
                className="rounded-full border-white/20"
              >
                <Link to="/login">Login</Link>
              </Button>

              <Button
                asChild
                className="rounded-full bg-gradient-to-r from-red-500 to-purple-600"
              >
                <Link to="/register">Register</Link>
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-4">

              <NotificationBell />

              <Link
                to="/profile"
                className="flex items-center gap-2"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-purple-600 text-white font-bold">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </div>
              </Link>

              <button
                onClick={logout}
                className="text-red-500"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </nav>

        {/* Mobile: bell (only when logged in) + menu trigger */}
        <div className="flex items-center gap-3 md:hidden">
          {token && <NotificationBell />}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-xl border-white/20 backdrop-blur">
                <Menu />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[75%] sm:w-[320px] bg-background/95 backdrop-blur-xl border-white/10 px-6 [&>div]:gap-0">
              <div className="mt-12 flex flex-col gap-1">
                <Link
                  to="/"
                  className="rounded-lg px-3 py-2.5 text-base font-medium hover:bg-white/10 transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/search"
                  className="rounded-lg px-3 py-2.5 text-base font-medium hover:bg-white/10 transition-colors"
                >
                  Find Donors
                </Link>
                <Link
                  to="/requests"
                  className="rounded-lg px-3 py-2.5 text-base font-medium hover:bg-white/10 transition-colors"
                >
                  Blood Requests
                </Link>

                <div className="my-3 h-px w-full bg-foreground/10" />

                {!token ? (
                  <>
                    <Link
                      to="/login"
                      className="rounded-lg border border-white/20 px-3 py-2.5 text-center"
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      className="rounded-lg bg-gradient-to-r from-red-500 to-purple-600 px-3 py-2.5 text-center text-white"
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/profile"
                      className="rounded-lg px-3 py-2.5"
                    >
                      My Profile
                    </Link>

                    <button
                      onClick={logout}
                      className="rounded-lg px-3 py-2.5 text-left text-red-500"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>

      {/* Bottom glow line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-red-500/60 to-purple-600/60" />
    </header>
  );
}

export default Navbar;