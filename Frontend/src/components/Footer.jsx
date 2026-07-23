import React from "react";

// Unsplash image representing students/research; replace with a project asset if preferred
const BG_URL =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80";

const Footer = ({ theme = "light" }) => {
  const overlay = theme === "dark" ? "rgba(2,6,23,0.8)" : "rgba(7,16,36,0.65)";

  return (
    <footer
      className="mt-auto text-white w-full"
      style={{
        backgroundImage: `linear-gradient(${overlay}, ${overlay}), url(${BG_URL})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-lg font-semibold">STUDENT-ASST</h4>
          <p className="text-sm text-gray-200 max-w-md">
            Curated departmental resources, guides, and study materials to help
            students excel in their academic journey.
          </p>
        </div>

        <div className="text-sm text-gray-200">
          <p>© {new Date().getFullYear()} STUDENT-ASST</p>
          <p className="mt-1">Built for collaborative learning.</p>
          <p className="text-sm text-gray-200">
            Contact: <a href="https://miraclemi.onrender.com/">info@stud-asst.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
