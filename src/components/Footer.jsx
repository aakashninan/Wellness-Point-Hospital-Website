import { Link } from 'react-router-dom';
import { HeartPulse, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-12 pb-6 border-t border-slate-800">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
        
        {/* About column */}
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 mb-4">
            <HeartPulse className="h-6 w-6" />
            <span className="font-bold text-lg text-white">Wellness Point</span>
          </div>
          <p className="text-sm leading-relaxed">
            A healthcare center dedicated to delivering personalized medical attention and comprehensive wellness solutions to our community.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/facilities" className="hover:text-white transition-colors">Our Facilities</Link></li>
            <li><Link to="/doctors" className="hover:text-white transition-colors">Find a Doctor</Link></li>
            <li><Link to="/management" className="hover:text-white transition-colors">Our Leadership</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Get in Touch</Link></li>

            {/* ✅ ADMIN BUTTON ADDED */}
            <li className="pt-2">
              <Link
                to="/admin"
                className="inline-block px-3 py-1 text-xs rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition"
              >
                Admin Panel
              </Link>
            </li>
          </ul>
        </div>

        {/* Core Details */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact Info</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-emerald-400 flex-shrink-0" />
              <span>AONE Supermarket Complex, Moorkatil Pady, Peruva, Kottayam, 686610</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-emerald-400 flex-shrink-0" />
              <span>+91 9656987335</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-emerald-400 flex-shrink-0" />
              <span>wellnesspoint@gmail.com</span>
            </li>
          </ul>
        </div>

      </div>
      
      <div className="container mx-auto px-4 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs">
        <p>&copy; {new Date().getFullYear()} Wellness Point Hospital. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">Care Integrity Compassion</p>
      </div>
    </footer>
  );
}