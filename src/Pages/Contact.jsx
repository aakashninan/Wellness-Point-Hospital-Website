import { useState } from 'react';
import { Send, CheckCircle, Loader2, Phone, MapPin, Clock } from 'lucide-react';
import { Helmet } from 'react-helmet-async'; // 1. Imported Helmet safely

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await fetch("https://formspree.io/f/mjgzrqjl", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        alert("Failed to deliver message. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred. Please check your connection and try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-10 py-4 max-w-2xl mx-auto px-4">
      
      {/* 2. SEO META TAGS SPECIFIC TO CONTACT PAGE */}
      <Helmet>
        <title>Contact Us & Phone Number | Wellness Point Hospital Peruva</title>
        <meta 
          name="description" 
          content="Contact Wellness Point Hospital in Moorkattilpady, Peruva, Kerala. Call us at +91 96569 87335 or send a message for operational inquiries and appointment support." 
        />
        <meta 
          name="keywords" 
          content="Wellness Point contact number, phone number Wellness Point Peruva, book appointment Wellness Point, hospital contact Moorkattilpady" 
        />
        <link rel="canonical" href="https://wellnesspointhospital.vercel.app/contact" />
      </Helmet>

      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Connect With Us</h2>
        <p className="text-slate-600 text-sm">Have general operational questions or scheduling inquiries? Drop us an instant note below.</p>
      </div>

      {/* 3. QUICK CONTACT INFO CARD (Displays Phone Number) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-700">
        <a 
          href="tel:+919656987335" 
          className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-500 transition duration-300"
        >
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            <Phone className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Call Us</p>
            <p className="text-sm font-medium text-slate-800">+91 96569 87335</p>
          </div>
        </a>

        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Location</p>
            <p className="text-sm font-medium text-slate-800">Peruva, Moorkattilpady</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Availability</p>
            <p className="text-sm font-medium text-slate-800">Open 24 Hours</p>
          </div>
        </div>
      </div>

      {/* FORM INTERFACE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-2 text-emerald-800">
            <CheckCircle className="h-10 w-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-lg">Message Logged Successfully</h3>
            <p className="text-sm">Thank you for writing. Our operational support desk will reply via email shortly.</p>
          </div>
        ) : (
          <form onSubmit={submitForm} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInput}
                placeholder="John Doe"
                className="w-full text-sm border border-slate-200 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInput}
                placeholder="john@example.com"
                className="w-full text-sm border border-slate-200 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Your Message</label>
              <textarea
                id="message"
                name="message"
                required
                rows="5"
                value={formData.message}
                onChange={handleInput}
                placeholder="How can our clinical support help you..."
                className="w-full text-sm border border-slate-200 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold text-sm py-3 px-4 rounded-lg flex items-center justify-center space-x-2 shadow transition-colors"
            >
              {isSending ? (
                <>
                  <span>Transmitting...</span>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                <>
                  <span>Transmit Message</span>
                  <Send className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}