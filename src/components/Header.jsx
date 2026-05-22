import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, PhoneCall } from 'lucide-react';

// Import Logo
import HospitalLogo from '../pages/logo.jpg';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

 const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Our Doctors', path: '/doctors' },
  { name: 'Book Appointment', path: '/book-appointment' },
  { name: 'Facilities', path: '/facilities' },
  
  { name: 'Management', path: '/management' },
  
];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-24 flex items-center justify-between">

        {/* Brand Identity */}
        <Link
          to="/"
          className="flex items-center space-x-4 group"
        >
          {/* Logo Container */}
          <div className="bg-white border border-slate-100 rounded-2xl p-2 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:scale-[1.02]">
            <img
              src={HospitalLogo}
              alt="Wellness Point Hospital Logo"
              className="h-12 w-auto object-contain"
            />
          </div>

          {/* Brand Text */}
          <div className="flex flex-col">
            <span className="font-serif text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 leading-none">
              Wellness Point
            </span>

            <span className="mt-1 text-[10px] uppercase tracking-[0.35em] text-slate-400 font-medium">
              Hospital & Care
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10">

          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative text-sm uppercase tracking-[0.15em] font-medium transition-all duration-300 pb-1 ${
                isActive(item.path)
                  ? 'text-emerald-700'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {item.name}

              {/* Elegant Underline */}
              <span
                className={`absolute left-0 bottom-0 h-[2px] bg-emerald-600 transition-all duration-300 ${
                  isActive(item.path)
                    ? 'w-full'
                    : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>
          ))}

        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-emerald-700 text-white text-xs uppercase tracking-[0.2em] font-semibold px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
          >
            <PhoneCall className="h-4 w-4" />
            Contact
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl shadow-xl">

          <div className="px-6 py-6 space-y-3">

            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-2xl text-sm uppercase tracking-[0.15em] font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile CTA */}
            <div className="pt-4 border-t border-slate-100">
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-emerald-700 text-white uppercase tracking-[0.2em] text-xs font-semibold py-4 rounded-2xl transition-all duration-300"
              >
                <PhoneCall className="h-4 w-4" />
                Contact Us
              </Link>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}