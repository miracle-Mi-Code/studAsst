import React, { useMemo, useState } from "react";
import CourseCard from "./CourseCard";

const levels = ["all", "100", "200", "300", "400", "500"];

const CourseGrid = ({ initialCourses = [] }) => {
  const [level, setLevel] = useState("all");

  const filtered = useMemo(() => {
    return level === "all"
      ? initialCourses
      : initialCourses.filter((c) => c.level === level);
  }, [level, initialCourses]);

  return (
    <div className="min-h-screen">
      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm text-gray-700">Select Level:</label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="border rounded px-2 py-1"
        >
          {levels.map((l) => (
            <option key={l} value={l}>
              {l === "all" ? "All Levels" : `${l} Level`}
            </option>
          ))}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    </div>
  );
};

export default CourseGrid;
