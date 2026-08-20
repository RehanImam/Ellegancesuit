import { MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#4A0E20] text-white">
      {/* ================= MAIN FOOTER ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* ================= BRAND ================= */}
          <div>
            <h2 className="font-serif text-3xl tracking-wide text-white">
              ZARAA
            </h2>

            <p className="text-[#F4A6B8] text-xs tracking-[5px] mt-2">
              WOMEN'S FASHION
            </p>

            <p className="text-pink-100/80 leading-7 mt-6 max-w-sm">
              Modern elegance inspired by timeless Indian fashion.
              Discover beautiful frocks and premium suits designed
              specially for women.
            </p>

            {/* Social Media */}
            <div className="flex gap-3 mt-7">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="
                  w-10 h-10
                  rounded-full
                  bg-pink-500/20
                  border border-pink-300/30
                  flex items-center justify-center
                  text-[#F4A6B8]
                  font-semibold
                  text-xs
                  hover:bg-pink-500
                  hover:text-white
                  transition
                "
              >
                IG
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="
                  w-10 h-10
                  rounded-full
                  bg-pink-500/20
                  border border-pink-300/30
                  flex items-center justify-center
                  text-[#F4A6B8]
                  font-semibold
                  text-lg
                  hover:bg-pink-500
                  hover:text-white
                  transition
                "
              >
                f
              </a>
            </div>
          </div>

          {/* ================= SHOP ================= */}
          <div>
            <h3 className="font-serif text-xl text-white mb-6">
              Shop
            </h3>

            <ul className="space-y-4">
              <li>
                <Link
                  to="/shop"
                  className="text-pink-100/80 hover:text-[#F4A6B8] transition"
                >
                  New Arrivals
                </Link>
              </li>

              <li>
                <Link
                  to="/shop?category=Frocks"
                  className="text-pink-100/80 hover:text-[#F4A6B8] transition"
                >
                  Frocks
                </Link>
              </li>

              <li>
                <Link
                  to="/shop?category=Suits"
                  className="text-pink-100/80 hover:text-[#F4A6B8] transition"
                >
                  Suits
                </Link>
              </li>

              <li>
                <Link
                  to="/shop"
                  className="text-pink-100/80 hover:text-[#F4A6B8] transition"
                >
                  Festive Collection
                </Link>
              </li>

              <li>
                <Link
                  to="/shop"
                  className="text-pink-100/80 hover:text-[#F4A6B8] transition"
                >
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* ================= CUSTOMER CARE ================= */}
          <div>
            <h3 className="font-serif text-xl text-white mb-6">
              Customer Care
            </h3>

            <ul className="space-y-4">
              <li>
                <Link
                  to="/contact"
                  className="text-pink-100/80 hover:text-[#F4A6B8] transition"
                >
                  Contact Us
                </Link>
              </li>

              <li>
                <Link
                  to="/shipping"
                  className="text-pink-100/80 hover:text-[#F4A6B8] transition"
                >
                  Shipping & Delivery
                </Link>
              </li>

              <li>
                <Link
                  to="/returns"
                  className="text-pink-100/80 hover:text-[#F4A6B8] transition"
                >
                  Returns
                </Link>
              </li>

              <li>
                <Link
                  to="/size-guide"
                  className="text-pink-100/80 hover:text-[#F4A6B8] transition"
                >
                  Size Guide
                </Link>
              </li>

              <li>
                <Link
                  to="/faq"
                  className="text-pink-100/80 hover:text-[#F4A6B8] transition"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* ================= GET IN TOUCH ================= */}
          <div>
            <h3 className="font-serif text-xl text-white mb-6">
              Get In Touch
            </h3>

            <div className="space-y-5">
              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin
                  size={20}
                  className="text-[#F4A6B8] mt-1 shrink-0"
                />

                <span className="text-pink-100/80">
                  New Delhi, India
                </span>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone
                  size={20}
                  className="text-[#F4A6B8] shrink-0"
                />

                <span className="text-pink-100/80">
                  +91 98765 43210
                </span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail
                  size={20}
                  className="text-[#F4A6B8] shrink-0"
                />

                <span className="text-pink-100/80">
                  hello@zaraa.com
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="border-t border-pink-300/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-pink-200/70 text-sm text-center md:text-left">
              © 2026 ZARAA Women's Fashion. All rights reserved.
            </p>

            {/* Bottom Links */}
            <div className="flex gap-6 text-sm">
              <Link
                to="/privacy"
                className="text-pink-200/70 hover:text-[#F4A6B8] transition"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms"
                className="text-pink-200/70 hover:text-[#F4A6B8] transition"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;