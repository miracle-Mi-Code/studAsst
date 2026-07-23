import React, { useState, useEffect } from "react";

const Typewriter = ({
  text = "About STUDENT-ASST",
  speed = 100,
  deleteSpeed = 50,
  pause = 1400,
}) => {
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [current, setCurrent] = useState("");

  useEffect(() => {
    const full = text;
    let timer = null;

    if (!isDeleting) {
      if (charIndex < full.length) {
        timer = setTimeout(() => setCharIndex((i) => i + 1), speed);
        setCurrent(full.substring(0, charIndex));
      } else {
        // finished typing, pause then start deleting
        setCurrent(full);
        timer = setTimeout(() => setIsDeleting(true), pause);
      }
    } else {
      if (charIndex > 0) {
        timer = setTimeout(() => setCharIndex((i) => i - 1), deleteSpeed);
        setCurrent(full.substring(0, charIndex));
      } else {
        // finished deleting, small pause then start typing again
        timer = setTimeout(() => setIsDeleting(false), 300);
      }
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, text, speed, deleteSpeed, pause]);

  return (
    <h2 className="text-2xl font-semibold mb-4 text-center">
      <span>{current}</span>
      <span className="ml-1 typewriter-cursor text-indigo-600">&nbsp;</span>
    </h2>
  );
};

export default Typewriter;
