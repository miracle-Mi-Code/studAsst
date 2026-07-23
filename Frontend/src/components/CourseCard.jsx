import React from "react";

const CourseCard = ({ course }) => {
  const handleDownload = () => {
    const content = `Title: ${course.title}\nLevel: ${course.level}\nFormat: ${course.type}\n`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${course.title.replace(/[^a-z0-9]/gi, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold text-lg">{course.title}</h3>
      <p className="text-sm text-gray-500">Level: {course.level}</p>
      <p className="text-sm text-gray-500">Format: {course.type}</p>
      <div className="mt-3">
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
            />
          </svg>
          Download
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
