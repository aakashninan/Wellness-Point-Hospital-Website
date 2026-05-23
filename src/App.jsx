import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./Pages/Home";
import Facilities from "./Pages/Facilities";
import Doctors from "./Pages/Doctors";
import Management from "./Pages/Management";
import Contact from "./Pages/Contact";
import BookAppointment from "./Pages/BookAppointment";
import AdminPanel from "./Pages/AdminPanel";


export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#fafaf8] text-slate-800 antialiased">

        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/management" element={<Management />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}
