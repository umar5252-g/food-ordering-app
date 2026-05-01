import { Link } from "react-router-dom";
import { Instagram, Twitter, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Menu", to: "/menu" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "FAQ", to: "/faq" },
  ];

  const socialLinks = [
    {
      icon: Instagram,
      href: "https://instagram.com",
      label: "Instagram",
    },
    {
      icon: Mail,
      href: "mailto:contact@brandname.com",
      label: "Email",
    },
    {
      icon: Twitter,
      href: "https://twitter.com",
      label: "Twitter",
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
