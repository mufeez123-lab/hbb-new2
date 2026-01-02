// src/components/Features.tsx

import { FaCog, FaRocket, FaShieldAlt } from "react-icons/fa";

const featuresData = [
  {
    icon: <FaRocket className="text-indigo-500 text-3xl" />,
    title: "Fast Performance",
    desc: "Your site loads lightning fast with optimized assets and minimal code.",
  },
  {
    icon: <FaShieldAlt className="text-indigo-500 text-3xl" />,
    title: "Secure",
    desc: "Industry-standard security features to protect your data.",
  },
  {
    icon: <FaCog className="text-indigo-500 text-3xl" />,
    title: "Easy to Customize",
    desc: "Built with flexibility in mind using React & Tailwind.",
  },
];

export default function Features() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuresData.map((feature, i) => (
            <div
              key={i}
              className="bg-white p-6 shadow-md rounded-lg hover:shadow-xl transition"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
