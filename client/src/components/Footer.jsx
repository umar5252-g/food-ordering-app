import { Link } from "react-router-dom";
import { Home, Phone } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Menu", to: "/menu" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "FAQ", to: "/faq" },
  ];

  const GithubIcon = ({ className }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );

  const socialLinks = [
    {
      icon: GithubIcon,
      href: "https://github.com",
      label: "GitHub",
    },
    {
      icon: Phone,
      href: "tel:+15551234567",
      label: "Call Us",
    },
    {
      icon: Home,
      href: "#",
      label: "Locations",
    },
  ];

  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E4002B] font-bold text-white">
                B
              </span>
              <span className="text-lg font-bold">BrandName</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-300">
              Your favorite meals, delivered fast. Taste the difference.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-white/10 p-2 text-white transition hover:bg-[#E4002B]"
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
              Quick Links
            </h3>
            <nav className="space-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-gray-300 transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Additional Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
              Contact
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <p>
                <span className="font-medium text-white">Email:</span>
                <br />
                info@brandname.com
              </p>
              <p>
                <span className="font-medium text-white">Phone:</span>
                <br />
                +1 (555) 123-4567
              </p>
              <p>
                <span className="font-medium text-white">Hours:</span>
                <br />
                Mon - Fri: 10am - 10pm
                <br />
                Sat - Sun: 11am - 11pm
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-white/10" />

        {/* Copyright */}
        <div className="text-center text-sm text-gray-400">
          <p>&copy; {currentYear} BrandName. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
