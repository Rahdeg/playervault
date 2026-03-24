import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePreferences } from "@/context/usePreferences";

const sports = [
  "Soccer",
  "Basketball",
  "Cricket",
  "American Football",
  "Baseball",
  "Tennis",
  "Rugby",
  "Motorsport",
  "Golf",
  "Ice Hockey",
];

export default function FiltersPanel() {
  const { filters, setFilters } = usePreferences();

  function resetFilters() {
    setFilters({
      sport: "",
      nationality: "",
      position: "",
      ageMin: "",
      ageMax: "",
    });
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Filters refine the current search results.
      </p>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Select
          value={filters.sport || "__all__"}
          onValueChange={(value) =>
            setFilters({
              ...filters,
              sport: value === "__all__" ? "" : value,
            })
          }
        >
          <SelectTrigger className="w-full rounded-full border-primary/30 bg-background/80">
            <SelectValue placeholder="Select sport" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All sports</SelectItem>
            {sports.map((sport) => (
              <SelectItem key={sport} value={sport}>
                {sport}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Nationality"
          value={filters.nationality}
          onChange={(e) =>
            setFilters({ ...filters, nationality: e.target.value })
          }
          className="rounded-full border-primary/30 bg-background/80"
        />

        <Input
          placeholder="Position"
          value={filters.position}
          onChange={(e) =>
            setFilters({ ...filters, position: e.target.value })
          }
          className="rounded-full border-primary/30 bg-background/80"
        />

        <Input
          placeholder="Min Age"
          type="number"
          value={filters.ageMin}
          onChange={(e) =>
            setFilters({ ...filters, ageMin: e.target.value })
          }
          className="rounded-full border-primary/30 bg-background/80"
        />

        <Input
          placeholder="Max Age"
          type="number"
          value={filters.ageMax}
          onChange={(e) =>
            setFilters({ ...filters, ageMax: e.target.value })
          }
          className="rounded-full border-primary/30 bg-background/80"
        />
      </div>

      <Button type="button" variant="outline" onClick={resetFilters} className="rounded-full border-primary/40">
        Reset filters
      </Button>
    </div>
  );
}