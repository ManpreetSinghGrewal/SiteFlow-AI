import { useEffect, useState } from "react";

export function GlowingCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.closest("button") ||
          target.closest("a") ||
          target.getAttribute("role") === "button" ||
          target.classList.contains("cursor-pointer"))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  // Smooth lerp for outer ring follower
  useEffect(() => {
    let animationFrameId: number;

    const updateTrailing = () => {
      setTrailingPos((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.18,
        y: prev.y + (position.y - prev.y) * 0.18,
      }));
      animationFrameId = requestAnimationFrame(updateTrailing);
    };

    animationFrameId = requestAnimationFrame(updateTrailing);

    return () => cancelAnimationFrame(animationFrameId);
  }, [position]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Glowing Ring Follower */}
      <div
        className={`pointer-events-none fixed inset-0 z-[99999] transition-transform duration-200 ease-out`}
        style={{
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0)`,
        }}
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ease-out ${
            isHovered
              ? "w-12 h-12 border-2 border-sky-400/80 bg-sky-400/15 shadow-[0_0_25px_rgba(56,189,248,0.6)] scale-110"
              : isClicked
              ? "w-7 h-7 border border-indigo-400 bg-indigo-500/30 scale-90"
              : "w-9 h-9 border border-sky-400/50 bg-sky-500/10 shadow-[0_0_15px_rgba(56,189,248,0.35)]"
          }`}
        />
      </div>

      {/* Inner Glowing Center Dot */}
      <div
        className="pointer-events-none fixed inset-0 z-[99999]"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400 transition-all duration-150 shadow-[0_0_10px_#38bdf8] ${
            isHovered ? "w-3 h-3 bg-indigo-300 shadow-[0_0_12px_#818cf8]" : "w-2 h-2"
          }`}
        />
      </div>
    </>
  );
}
