import { useState, useEffect } from "react";

const LoadingButton = ({
  href,
  onClick,
  className,
  children,
  loadingText = null,
  delay = 800,
  icon = null,
}) => {
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState(1);

  // Animación de puntos suspensivos
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setDots((d) => (d === 3 ? 1 : d + 1));
      }, 400);
    } else {
      setDots(1);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleClick = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Si hay un onClick personalizado, lo ejecutamos
    if (onClick) {
      onClick(e);
    }
    
    setTimeout(() => {
      if (href) {
        window.location.href = href;
      }
    }, delay);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      style={{ pointerEvents: loading ? "none" : "auto", opacity: loading ? 0.7 : 1 }}
    >
      {!loading ? (
        <>
          {children}
          {icon}
        </>
      ) : (
        <span className="flex items-center gap-1">
          {loadingText && <span>{loadingText}</span>}
          <span className="dot-animation" style={{ minWidth: 24, display: "inline-block" }}>
            {".".repeat(dots)}
          </span>
        </span>
      )}
    </a>
  );
};

export default LoadingButton;

