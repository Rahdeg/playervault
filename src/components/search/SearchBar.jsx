import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/context/usePreferences";

export default function SearchBar({ onSearch, focusOnMount = false }) {
  const { query, setQuery } = usePreferences();
  const inputRef = useRef(null);

  useEffect(() => {
    if (!focusOnMount) return;
    // Wait for the page-enter transition (0.38s) to finish before focusing
    const id = setTimeout(() => inputRef.current?.focus(), 420);
    return () => clearTimeout(id);
  }, [focusOnMount]);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 rounded-full border border-border/80 bg-card/70 p-2 shadow-[0_10px_30px_rgba(205,88,151,0.18)] backdrop-blur-md">
      <Input
        ref={inputRef}
        placeholder="Search players by name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="h-10 rounded-full border-primary/30 bg-background/80"
      />
      <Button type="submit" className="h-10 rounded-full px-6 tracking-[0.14em] uppercase">
        Search
      </Button>
    </form>
  );
}