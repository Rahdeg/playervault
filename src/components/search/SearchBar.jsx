import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/context/usePreferences";

export default function SearchBar({ onSearch, focusOnMount = false }) {
  const { query, setQuery } = usePreferences();
  const inputRef = useRef(null);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (!focusOnMount) return;
    const id = setTimeout(() => inputRef.current?.focus(), 420);
    return () => clearTimeout(id);
  }, [focusOnMount]);

  function handleQueryChange(e) {
    setQuery(e.target.value);
    if (validationError) setValidationError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) {
      setValidationError("Please enter a player name to search.");
      inputRef.current?.focus();
      return;
    }
    setValidationError("");
    onSearch();
  }

  return (
    <div className="space-y-1.5">
      <form
        onSubmit={handleSubmit}
        noValidate
        aria-describedby={validationError ? "search-error" : undefined}
        className="flex gap-2 rounded-full border border-border/80 bg-card/70 p-2 shadow-[0_10px_30px_rgba(205,88,151,0.18)]"
      >
        <Input
          ref={inputRef}
          placeholder="Search players by name..."
          value={query}
          onChange={handleQueryChange}
          aria-invalid={!!validationError}
          className="h-10 rounded-full border-primary/30 bg-background/80"
        />
        <Button type="submit" className="h-10 rounded-full px-6 tracking-[0.14em] uppercase">
          Search
        </Button>
      </form>
      {validationError && (
        <p id="search-error" role="alert" className="pl-4 text-xs font-medium text-destructive">
          {validationError}
        </p>
      )}
    </div>
  );
}