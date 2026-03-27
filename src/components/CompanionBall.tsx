import { useState, useCallback, useEffect, useRef } from "react";

const BALL_SRC =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAABx0lEQVR4AcyUu0oDQRSGja2IPoCNsREv4BMkpfaiKILxgpaxUNBHUNBCS8VLBFEU+1gmTyCYiI1JkwcQxHr9TrKzzF51s7OScL6czTlz/j8zyW5/3z++es/MsqwinMEDXMAOTMQ9lMidIZiFCqInsAnzsA5HUKP3CnewB8PUIiPUjOERJj8gB2ExSWMRDuCdmRlyaISaMXENcWKAxWUMV8iBEWhmD0TtKFDMLpaYr4CcjF3qJJ8Zi+QoSp121+/yRRtoZXUFlxlN+ZGf9AUJr6/0eZcZjWWQsycZiRwbKColr9m0ahjM8o9ty3nNnEa7a+ZtSMk4ZmxXnghpmH35zCjMQhrxpkSdnVEYhzSirER1s0FVNJhrmUymrvR0s09VNJhrupZu5mroixJcv+izjhnbPaVRBVPxjdAtOOGY2ZU1O5tIc2ygpQu5zGg2aMrDM+kOC2g9o+UKl5l0WNSEPNcF6CaqzN8EDfrM1CJ7QG50OXtV/kteDVsUaiYDGMpRjHG9D/cQ9Y+Vox9lpsm6wIg0kwmGW3AISzBFTZ6fu+RLeIRz2KaXB/nN+Rgcv5p5xxCswzFswAJsgdw23qW+z7HNfAoxCj8AAAD///yLMP8AAAAGSURBVAMAso19N8rYxxgAAAAASUVORK5CYII=";

interface CompanionBallProps {
  isGenerating: boolean;
}

export function CompanionBall({ isGenerating }: CompanionBallProps) {
  const [isRed, setIsRed] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = useCallback(() => {
    // Bounce animation
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);

    // Turn red and reset timer
    setIsRed(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsRed(false), 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <button
      onClick={handleClick}
      className="companion-ball-btn focus:outline-none"
      aria-label="Companion ball"
    >
      <img
        src={BALL_SRC}
        alt="AI Companion"
        className={`companion-ball ${isGenerating ? "ball-writing" : "ball-idle"} ${isClicked ? "ball-bounce" : ""}`}
        style={{
          filter: isRed
            ? "hue-rotate(-80deg) saturate(3) brightness(0.9)"
            : "none",
          transition: "filter 0.4s ease",
        }}
        draggable={false}
      />
    </button>
  );
}

/** Inline ball that appears at the end of streaming text */
export function InlineBall({ isRed, onClick }: { isRed: boolean; onClick: () => void }) {
  return (
    <img
      src={BALL_SRC}
      alt=""
      onClick={onClick}
      className="inline-ball"
      style={{
        filter: isRed
          ? "hue-rotate(-80deg) saturate(3) brightness(0.9)"
          : "none",
        transition: "filter 0.4s ease",
      }}
      draggable={false}
    />
  );
}
