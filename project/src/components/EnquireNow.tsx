import { useState } from 'react';
import { X } from 'lucide-react';
import emailjs from '@emailjs/browser';

const EnquireForm = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    type: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.send(
      'service_7uzla86', // from EmailJS dashboard
      'template_sffprpe', // from EmailJS dashboard
      form,
      'wUdeNSJ0V6jqmnIBC' // Public key from EmailJS
    )
    .then(() => {
      alert('Message sent!');
      setForm({ name: '', mobile: '', email: '', type: '' });
      setOpen(false);
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Failed to send message');
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-1/2 left-0 transform -translate-y-1/2 bg-transparent text-[#8B6E3D] border-t border-l border-r border-[#8B6E3D] hover:bg-[#8a6c1a] hover:text-white px-2 py-1 text-sm font-poppins rotate-90 origin-bottom-left z-[9999] rounded rounded-bl-none rounded-br-none transition-all duration-300"
      >
        Enquire Now
      </button>

      <div
        className={`fixed top-7 right-0 h-full w-full max-w-md bg-white shadow-xl z-[9998] transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center px-6 pt-6">
          <h2 className="text-lg font-semibold">ENQUIRE NOW</h2>
          <button onClick={() => setOpen(false)}>
            <X className="w-6 h-6 text-black" />
          </button>
        </div>

        <form className="px-6 py-4 space-y-4" onSubmit={sendEmail}>
          <div>
            <label className="block text-sm font-medium">Your Name*</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter Your Name"
              className="w-full border-b py-1 text-sm focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Mobile*</label>
            <div className="flex items-center gap-2 border-b py-1">
              <span className="text-sm text-gray-500">+91</span>
              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Your Mobile"
                className="flex-1 text-sm focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Your Email*</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter Your Email"
              className="w-full border-b py-1 text-sm focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Projects Type*</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border-b py-1 text-sm focus:outline-none"
              required
            >
              <option value="">Select Project Type</option>
              <option>Residential</option>
              <option>Commercial</option>
            </select>
          </div>

          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <p className="text-sm text-gray-600">
              Yes, I want to stay informed and receive newsletter and marketing updates.
            </p>
          </div>

          <p className="text-xs text-gray-500">
            By submitting this form you agree to the <span className="font-semibold text-black">Terms and Conditions</span> and <span className="font-semibold text-black">Privacy Policy</span>.
          </p>

          <button type="submit" className="w-full py-2 border border-[#8a6c1a] text-[#8B6E3D] font-semibold">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default EnquireForm;
