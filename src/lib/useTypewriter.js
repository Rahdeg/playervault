import { useEffect, useState } from "react";

/**
 * Character-by-character typewriter animation with natural rhythm on punctuation.
 * Respects prefers-reduced-motion.
 * @returns {{ displayed: string, done: boolean }}
 */
export function useTypewriter(text, speed = 18) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplayed("");
      setDone(false);
      return;
    }

    // Respect reduced motion - show instantly
    const mq =
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;

    if (mq?.matches) {
      setDisplayed(text);
      setDone(true);
      return;
    }

    setDisplayed("");
    setDone(false);

    let cancelled = false;
    let i = 0;

    function tick() {
      if (cancelled) return;
      i++;
      setDisplayed(text.slice(0, i));

      if (i < text.length) {
        const char = text[i - 1];
        const delay = ".!?".includes(char)
          ? speed * 10
          : ",;:".includes(char)
            ? speed * 5
            : char === "\n"
              ? speed * 14
              : speed;
        setTimeout(tick, delay);
      } else {
        setDone(true);
      }
    }

    // Brief pause before starting
    const start = setTimeout(tick, 500);

    return () => {
      cancelled = true;
      clearTimeout(start);
    };
  }, [text, speed]);

  return { displayed, done };
}
