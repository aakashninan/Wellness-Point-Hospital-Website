import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = (e) => {
    e.preventDefault();
    // Static simulation of form capture
    console.log("Captured Content Data Payload:", formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="space-y-10 py-4 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Connect With Us</h2>
        <p className="text-slate-600 text-sm">Have general operational questions or scheduling inquiries? Drop us an instant note below.</p>
      </div>

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
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm py-3 px-4 rounded-lg flex items-center justify-center space-x-2 shadow transition-colors"
            >
              <span>Transmit Message</span>
              <Send className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}