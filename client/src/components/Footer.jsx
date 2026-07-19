import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin } from "lucide-react";
import { FaFacebookF, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-background">
      {/* Background Blur */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute top-0 left-0 h-[250px] w-[250px] rounded-full bg-red-500/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-purple-600 shadow-lg transition-transform group-hover:scale-105">
                <Heart className="h-5 w-5 fill-white text-white" />
              </div>

              <span className="bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                HemoLink
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Connecting blood donors with people in need, in real time.
              Every drop counts and every life matters.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted transition-all hover:scale-110 hover:bg-red-500 hover:text-white"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted transition-all hover:scale-110 hover:bg-sky-500 hover:text-white"
              >
                <FaTwitter />
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted transition-all hover:scale-110 hover:bg-pink-500 hover:text-white"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted transition-all hover:scale-110 hover:bg-gray-800 hover:text-white"
              >
                <FaGithub />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide">
              Quick Links
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="transition-colors hover:text-red-500">
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/search"
                  className="transition-colors hover:text-red-500"
                >
                  Find Donors
                </Link>
              </li>

              <li>
                <Link
                  to="/requests"
                  className="transition-colors hover:text-red-500"
                >
                  Blood Requests
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="transition-colors hover:text-red-500"
                >
                  Become a Donor
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide">Company</h3>

            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/about"
                  className="transition-colors hover:text-red-500"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="transition-colors hover:text-red-500"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  to="/privacy"
                  className="transition-colors hover:text-red-500"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/terms"
                  className="transition-colors hover:text-red-500"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide">Contact</h3>

            <ul className="mt-4 space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-red-500" />
                support@hemolink.com
              </li>

              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-red-500" />
                +91 98765 43210
              </li>

              <li className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 text-red-500" />
                Kolkata, West Bengal, India
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© 2026 HemoLink. All rights reserved.</p>

          <p className="flex items-center gap-1">
            Made with
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            for a healthier world
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;