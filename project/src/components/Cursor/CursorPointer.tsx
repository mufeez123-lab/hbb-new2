import { useEffect } from "react";

const CustomCursor: React.FC = () => {
  useEffect(() => {
    const cursor = document.querySelector<HTMLDivElement>(".cursor");
    const dot = document.querySelector<HTMLDivElement>(".cursor-dot");

    if (!cursor || !dot) return;

    const moveCursor = (e: MouseEvent) => {
      const { clientX, clientY } = e;

      dot.style.left = `${clientX}px`;
      dot.style.top = `${clientY}px`;

      cursor.style.left = `${clientX}px`;
      cursor.style.top = `${clientY}px`;
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        className="
          cursor-dot
          fixed
          left-0 top-0
          w-1.5 h-1.5
          bg-[#63b545]
          rounded-full
          pointer-events-none
          -translate-x-1/2 -translate-y-1/2
          z-[10000]
        "
      />

      {/* Outer circle */}
      <div
        className="
          cursor
          fixed
          left-0 top-0
          w-8 h-8
          border-2 border-[#ed8439]
          rounded-full
          pointer-events-none
          -translate-x-1/2 -translate-y-1/2
          transition-transform duration-300 ease-out
          z-[9999]
        "
      />
    </>
  );
};

export default CustomCursor;
