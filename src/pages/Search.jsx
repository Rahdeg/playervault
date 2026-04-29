import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import SearchBar from "@/components/search/SearchBar";
import FiltersPanel from "@/components/search/FiltersPanel";
import PlayersGrid from "@/components/search/PlayersGrid";
import { usePreferences } from "@/context/usePreferences";
import { searchPlayers } from "@/lib/providers/players";

export default function Search() {
  const MotionSection = motion.section;
  const MotionDiv = motion.div;

  const { query, setQuery, filters, setFilters } = usePreferences();

  const [searchParams, setSearchParams] = useSearchParams();

  const [rawPlayers, setRawPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const hydratedFromUrl = useRef(false);
  const debounceRef = useRef(null);
  const resultsRef = useRef(null);
  const wasLoadingRef = useRef(false);

  const handleSearch = useCallback(async (customQuery) => {
    try {
      const finalQuery = (customQuery ?? query).trim();

      if (!finalQuery) {
        setRawPlayers([]);
        setHasSearched(false);
        setError("");
        return;
      }

      setLoading(true);
      setError("");
      setHasSearched(true);

      const results = await searchPlayers(finalQuery);
      setRawPlayers(results);
    } catch (err) {
      setRawPlayers([]);
      setError(err.message || "Search failed.");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (hydratedFromUrl.current) return;

    const urlQuery = searchParams.get("q") || "";
    const urlSport = searchParams.get("sport") || "";
    const urlNationality = searchParams.get("nationality") || "";
    const urlPosition = searchParams.get("position") || "";
    const urlAgeMin = searchParams.get("ageMin") || "";
    const urlAgeMax = searchParams.get("ageMax") || "";

    setQuery(urlQuery);
    setFilters({
      sport: urlSport,
      nationality: urlNationality,
      position: urlPosition,
      ageMin: urlAgeMin,
      ageMax: urlAgeMax,
    });

    hydratedFromUrl.current = true;

    if (urlQuery) {
      handleSearch(urlQuery);
    }
  }, [searchParams, setQuery, setFilters, handleSearch]);

  useEffect(() => {
    if (!hydratedFromUrl.current) return;

    const params = new URLSearchParams();

    if (query) params.set("q", query);
    if (filters.sport) params.set("sport", filters.sport);
    if (filters.nationality) params.set("nationality", filters.nationality);
    if (filters.position) params.set("position", filters.position);
    if (filters.ageMin) params.set("ageMin", filters.ageMin);
    if (filters.ageMax) params.set("ageMax", filters.ageMax);

    setSearchParams(params, { replace: true });
  }, [query, filters, setSearchParams]);

  useEffect(() => {
    if (!hydratedFromUrl.current) return;

    if (!query.trim()) {
      setRawPlayers([]);
      setHasSearched(false);
      setError("");
      return;
    }

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      handleSearch(query);
    }, 600);

    return () => clearTimeout(debounceRef.current);
  }, [query, handleSearch]);

  useEffect(() => {
    const finishedLoading = wasLoadingRef.current && !loading;

    if (finishedLoading && hasSearched && resultsRef.current) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      resultsRef.current.focus({ preventScroll: true });
    }

    wasLoadingRef.current = loading;
  }, [loading, hasSearched]);

  const players = useMemo(() => {
    return rawPlayers.filter((player) => {
      const matchesSport =
        !filters.sport ||
        (player.sport || "").toLowerCase() === filters.sport.toLowerCase();

      const matchesNationality =
        !filters.nationality ||
        (player.nationality || "")
          .toLowerCase()
          .includes(filters.nationality.toLowerCase());

      const matchesPosition =
        !filters.position ||
        (player.position || "")
          .toLowerCase()
          .includes(filters.position.toLowerCase());

      const matchesMinAge =
        !filters.ageMin ||
        (player.age !== null && player.age >= Number(filters.ageMin));

      const matchesMaxAge =
        !filters.ageMax ||
        (player.age !== null && player.age <= Number(filters.ageMax));

      return (
        matchesSport &&
        matchesNationality &&
        matchesPosition &&
        matchesMinAge &&
        matchesMaxAge
      );
    });
  }, [rawPlayers, filters]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-6 sm:pt-8">
      <MotionSection
        id="search-hero"
        className="elev8-shell animate-rise"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-center text-xs font-semibold tracking-[0.3em] uppercase text-primary/90">
          PLAYER SEARCH ENGINE
        </p>
        <h1 className="mt-4 text-center text-3xl font-black tracking-tight sm:text-5xl">
          Discover. Compare. <span className="text-primary">Decide.</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground">
          Use live search, then refine with smart filters to narrow down your ideal athletes.
        </p>
      </MotionSection>

      <div className="mt-6" id="search-filters">
        <SearchBar onSearch={handleSearch} focusOnMount />
      </div>

      <MotionDiv
        className="mt-4 rounded-3xl border border-border/80 bg-card/60 p-4 backdrop-blur-md sm:p-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        <FiltersPanel />
      </MotionDiv>

      {!loading && !error && !hasSearched && !query.trim() && (
        <MotionDiv
          className="mt-5 rounded-3xl border border-dashed border-primary/35 bg-card/50 p-5 text-left sm:p-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h2 className="text-base font-semibold text-foreground sm:text-lg">
            Start with a player name
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter a player name in the search bar first. Once results appear,
            use filters (sport, nationality, position, and age) to narrow your
            list.
          </p>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Search by player name.</li>
            <li>Review the returned players.</li>
            <li>Apply filters to refine results.</li>
          </ol>
        </MotionDiv>
      )}

      {loading && (
        <p className="mb-4 mt-6 text-sm text-muted-foreground">Loading players...</p>
      )}

      {error && <p className="mb-4 mt-6 text-sm text-red-500">{error}</p>}

      {!loading && !error && hasSearched && players.length > 0 && (
        <p className="mb-4 mt-6 text-sm text-muted-foreground">
          Showing {players.length} result{players.length !== 1 ? "s" : ""}
          {query ? ` for "${query}"` : ""}
        </p>
      )}

      {!loading && !error && hasSearched && players.length === 0 && (
        <p className="mb-4 mt-6 text-sm text-muted-foreground">
          No players matched your search and filters.
        </p>
      )}

      <section id="search-results" ref={resultsRef} tabIndex={-1} className="outline-none focus:outline-none">
        <PlayersGrid players={players} />
      </section>
    </div>
  );
}