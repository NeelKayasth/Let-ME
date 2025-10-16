import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();
  const navType = useNavigationType(); // PUSH | POP | REPLACE

  useEffect(() => {
    // Disable browser's automatic scroll restoration so we control it
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    // Always scroll to top on route change, including back/forward (POP)
    // Use rAF to wait until layout is painted
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    });
  }, [pathname, search, hash, navType]);

  return null;
};

export default ScrollToTop;


