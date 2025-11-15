import { useState } from "react";
import { Phone, Mail } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.phone || !form.message) {
      alert("Please fill out all fields");
      return;
    }
    console.log("Form submitted:", form);
    alert("Message sent!");
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-16 px-4">
      
      {/* Card Container */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-10 mb-16 border border-gray-100">
        
        {/* Contact Info Section */}
        <div className="mb-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Call Us</h3>
            </div>
            <p className="text-sm text-gray-500 mb-2">
              We are available 24/7, 7 days a week.
            </p>
            <p className="text-sm font-medium text-gray-600">+212 611 122 222</p>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Email Us</h3>
            </div>
            <p className="text-sm text-gray-500 mb-2">
              Fill out our form and we will contact you within 24 hours.
            </p>
            <p className="text-sm font-medium text-gray-600 mb-1">
              customer@exclusive.com
            </p>
            <p className="text-sm font-medium text-gray-600">
              support@exclusive.com
            </p>
          </div>
        </div>

        {/* Send Message Form Section */}
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name *"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email *"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
          />
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Your Phone *"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message *"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm w-full h-32 resize-none focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
          />
          <button
            onClick={handleSubmit}
            className="bg-orange-500 hover:bg-orange-600 text-white w-full py-4 rounded-xl text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          >
            Send Message
          </button>
        </div>
      </div>

      {/* Our Location Section */}
      <div className="max-w-7xl mx-auto text-center">
        <h3 className="text-3xl font-bold text-orange-500 mb-8">Our Location</h3>
        <div className="w-full h-96 rounded-2xl overflow-hidden shadow-xl border border-gray-100">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3319.123456789!2d-7.622!3d33.573!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdxxx!2sCasablanca!5e0!3m2!1sen!2sma!4v1690000000000!5m2!1sen!2sma"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
