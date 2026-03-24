import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/context/usePreferences";

export default function SearchBar({ onSearch }) {
  const { query, setQuery } = usePreferences();

  function handleSubmit(e) {
    e.preventDefault();
    onSearch();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 rounded-full border border-border/80 bg-card/70 p-2 shadow-[0_10px_30px_rgba(205,88,151,0.18)] backdrop-blur-md">
      <Input
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