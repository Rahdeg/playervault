import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

const SECTION_MAP = {
  "/": [
    { id: "home-hero", label: "Hero" },
    { id: "home-marquee", label: "Flow" },
    { id: "home-panels", label: "Panels" },
  ],
  "/search": [
    { id: "search-hero", label: "Hero" },
    { id: "search-filters", label: "Filters" },
    { id: "search-results", label: "Results" },
  ],
};

export default function ScrollProgressNav() {
  const { pathname } = useLocation();
  const sections = useMemo(() => SECTION_MAP[pathname] ?? [], [pathname]);

  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(sections[0]?.id || "");
  const currentActiveSection = sections.some((section) => section.id === activeSection)
    ? activeSection
    : sections[0]?.id;

  useEffect(() => {
    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) {
        setProgress(0);
      } else {
        setProgress(Math.min(1, Math.max(0, window.scrollY / max)));
      }

      if (!sections.length) return;

      const anchorY = window.innerHeight * 0.38;
      let nextActive = sections[0].id;
      let smallestDistance = Number.POSITIVE_INFINITY;

      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const distance = Math.abs(rect.top - anchorY);

        if (distance < smallestDistance) {
          smallestDistance = distance;
          nextActive = section.id;
        }
      });

      setActiveSection((prev) => (prev === nextActive ? prev : nextActive));
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections]);

  if (!sections.length) return null;

  return (
    <aside
      aria-label="Scroll progress navigation"
      className="fixed right-2 top-1/2 z-30 hidden -translate-y-1/2 md:block"
    >
      <div className="scroll-nav-shell">
        <div className="scroll-nav-track">
          <div className="scroll-nav-progress" style={{ transform: `scaleY(${progress})` }} />
        </div>

        <ul className="scroll-nav-dots">
          {sections.map((section) => {
            const isActive = section.id === currentActiveSection;

            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-label={`Jump to ${section.label}`}
                  className={isActive ? "scroll-nav-dot is-active" : "scroll-nav-dot"}
                >
                  <span className="sr-only">{section.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
