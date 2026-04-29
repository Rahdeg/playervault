import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { comparePlayers } from "@/lib/comparePlayers";
import { searchPlayers, getPlayer } from "@/lib/providers/players";
import trophyImg from "@/assets/trophy.svg";

const COMPARE_RESULT_STORAGE_KEY = "playerFinder.compareResult";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function formatValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

function winnerLabel(winner, aName, bName) {
  if (winner === "a") return aName;
  if (winner === "b") return bName;
  return "Draw";
}

function readSavedCompareResult() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(COMPARE_RESULT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.savedAt || Date.now() - parsed.savedAt > CACHE_TTL_MS) {
      window.localStorage.removeItem(COMPARE_RESULT_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function clearSavedCompareResult() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(COMPARE_RESULT_STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
}

function PlayerSearchContainer({ title, onPlayerSelect, selectedPlayer, playerNum }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await searchPlayers(query);
        setResults(res);
        setError("");
      } catch (err) {
        setError(err.message || "Search failed");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  return (
    <Card className="elev8-card">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Search player by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="rounded-full border-primary/30 bg-background/80"
        />

        {loading && <p className="text-xs text-muted-foreground">Searching...</p>}
        {error && <p className="text-xs text-red-500">{error}</p>}
        {!loading && results.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Found {results.length} result{results.length !== 1 ? "s" : ""}
          </p>
        )}

        {selectedPlayer && (
          <div className="rounded-lg border border-primary/40 bg-primary/10 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground">{selectedPlayer.name}</p>
                <p className="text-xs text-muted-foreground">{selectedPlayer.sport}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedPlayer.position || "—"} • {selectedPlayer.team?.name || "—"}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onPlayerSelect(null, playerNum)}
                  className="mt-2 rounded-full"
                >
                  Change
                </Button>
              </div>

              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-primary/35 bg-primary/10">
                {selectedPlayer.image ? (
                  <img
                    src={selectedPlayer.image}
                    alt={`${selectedPlayer.name} profile`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-primary">
                    {(selectedPlayer.name || "?")
                      .split(" ")
                      .slice(0, 2)
                      .map((word) => word[0] ?? "")
                      .join("")
                      .toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {!selectedPlayer && results.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {results.map((player) => (
              <button
                key={player.id}
                onClick={() => onPlayerSelect(player, playerNum)}
                className="w-full rounded-lg border border-border/70 bg-card/50 p-2 text-left transition-all hover:border-primary/50 hover:bg-card"
              >
                <p className="text-sm font-semibold text-foreground">{player.name}</p>
                <p className="text-xs text-muted-foreground">
                  {player.sport} • {player.position || "—"}
                </p>
              </button>
            ))}
          </div>
        )}

        {!loading && !selectedPlayer && results.length === 0 && query.trim() && (
          <p className="text-xs text-muted-foreground">No players found</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function ComparePlayersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [comparison, setComparison] = useState(null);
  const id1 = searchParams.get("id1");
  const id2 = searchParams.get("id2");

  // Load players from URL on mount
  useEffect(() => {
    if (!id1 && !id2) {
      return;
    }

    const loadPlayers = async () => {
      try {
        const saved = readSavedCompareResult();
        const canRestoreSavedResult =
          saved &&
          String(saved.id1 ?? "") === String(id1 ?? "") &&
          String(saved.id2 ?? "") === String(id2 ?? "") &&
          saved.player1 &&
          saved.player2 &&
          saved.comparison;

        if (canRestoreSavedResult) {
          setPlayer1(saved.player1);
          setPlayer2(saved.player2);
          setComparison(saved.comparison);
          return;
        }

        setComparison(null);
        if (id1) {
          const p1 = await getPlayer(id1);
          setPlayer1(p1);
        } else {
          setPlayer1(null);
        }
        if (id2) {
          const p2 = await getPlayer(id2);
          setPlayer2(p2);
        } else {
          setPlayer2(null);
        }
      } catch (err) {
        console.error("Error loading players from URL:", err);
      }
    };

    loadPlayers();
  }, [id1, id2]);

  useEffect(() => {
    if (!comparison || !player1 || !player2 || !id1 || !id2) return;
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(
        COMPARE_RESULT_STORAGE_KEY,
        JSON.stringify({
          id1,
          id2,
          player1,
          player2,
          comparison,
          savedAt: Date.now(),
        })
      );
    } catch {
      // ignore storage errors
    }
  }, [id1, id2, player1, player2, comparison]);

  function handlePlayerSelect(player, playerNum) {
    if (playerNum === 1) {
      setPlayer1(player);
      if (player) {
        setSearchParams((prev) => {
          prev.set("id1", player.id);
          return prev;
        });
      } else {
        setSearchParams((prev) => {
          prev.delete("id1");
          return prev;
        });
      }
    } else {
      setPlayer2(player);
      if (player) {
        setSearchParams((prev) => {
          prev.set("id2", player.id);
          return prev;
        });
      } else {
        setSearchParams((prev) => {
          prev.delete("id2");
          return prev;
        });
      }
    }
  }

  function handleCompare() {
    if (!player1 || !player2) {
      return;
    }

    const result = comparePlayers(player1, player2);
    setComparison(result);
  }

  function clearComparison() {
    setComparison(null);
    clearSavedCompareResult();
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <Link
        to="/search"
        className="mb-6 inline-block text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        ← Back to search
      </Link>

      <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
        Compare <span className="text-primary">Players</span>
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Search and select two players to compare their stats.
      </p>

      {/* Two Player Search Containers */}
      {!comparison && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <PlayerSearchContainer
            title="Player 1"
            selectedPlayer={player1}
            onPlayerSelect={handlePlayerSelect}
            playerNum={1}
          />
          <PlayerSearchContainer
            title="Player 2"
            selectedPlayer={player2}
            onPlayerSelect={handlePlayerSelect}
            playerNum={2}
          />
        </div>
      )}

      {/* Compare Button */}
      {!comparison && player1 && player2 && (
        <div className="mt-6 flex gap-2">
          <Button onClick={handleCompare} className="rounded-full">
            Compare Players
          </Button>
        </div>
      )}

      {/* Comparison Results */}
      {comparison && (
        <div className="mt-6 space-y-6">
          {!comparison.comparable && (
            <Card className="border border-destructive/45 bg-card/70">
              <CardContent className="pt-6">
                <p className="text-sm text-destructive">{comparison.reason}</p>
              </CardContent>
            </Card>
          )}

          {comparison.comparable && (
            <>
              {/* Decision Card */}
              <Card className="border border-primary/35 bg-card/80">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Decision</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-row items-center justify-between  text-sm">
                  <div className="space-y-1">
                  <p className=" text-xl md:text-3xl">
                    <span className="font-semibold">Winner:</span>{" "}
                   <strong>
                   {winnerLabel(comparison.winner, player1.name, player2.name)} 
                    </strong> 
                  </p>
                  <p className="text-muted-foreground">
                    Score: {player1.name} ({comparison.totals.a}) vs {player2.name} (
                    {comparison.totals.b})
                  </p>
                  </div>
                  
                   <img src={trophyImg} alt="trophy" className="size-40" />
                </CardContent>
              </Card>

              {/* Player Cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                {[player1, player2].map((player) => (
                  <Card key={player.id} className="elev8-card">
                    <CardHeader>
                      <CardTitle className="text-lg">{player.name}</CardTitle>
                    </CardHeader>
                    <CardContent className=" flex items-center justify-between">
                     

<div className="space-y-2 text-sm text-muted-foreground">
   <p>
                        <span className="font-semibold text-foreground">Sport:</span>{" "}
                        {formatValue(player.sport)}
                      </p>
                      <p>
                        <span className="font-semibold text-foreground">Team:</span>{" "}
                        {formatValue(player.team?.name)}
                      </p>
                      <p>
                        <span className="font-semibold text-foreground">Position:</span>{" "}
                        {formatValue(player.position)}
                      </p>
                      <p>
                        <span className="font-semibold text-foreground">Nationality:</span>{" "}
                        {formatValue(player.nationality)}
                      </p>
                      <p>
                        <span className="font-semibold text-foreground">Status:</span>{" "}
                        {formatValue(player.status)}
                      </p>
                      <p>
                        <span className="font-semibold text-foreground">Age:</span>{" "}
                        {formatValue(player.age)}
                      </p>
</div>
 <div className="mb-3 flex justify-center">
                        <div className=" h-48 w-48 shrink-0 overflow-hidden rounded-full border border-primary/35 bg-primary/10">
                          {player.image ? (
                            <img
                              src={player.image}
                              alt={`${player.name} profile`}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-2xl font-semibold text-primary">
                              {(player.name || "?")
                                .split(" ")
                                .slice(0, 2)
                                .map((word) => word[0] ?? "")
                                .join("")
                                .toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                     
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Criteria Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Scoring criteria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {comparison.criteria.map((item) => (
                      <div
                        key={item.key}
                        className="rounded-xl border border-border/70 bg-card/50 p-3 text-sm"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-foreground">
                              {item.label} <span className="text-xs text-muted-foreground">(weight {item.weight})</span>
                            </p>
                            <p className="mt-1 text-muted-foreground">
                              {player1.name}: <span className="text-foreground">{formatValue(item.aValue)}</span>
                            </p>
                            <p className="text-muted-foreground">
                              {player2.name}: <span className="text-foreground">{formatValue(item.bValue)}</span>
                            </p>
                            <p className="mt-1 text-xs italic text-muted-foreground">
                              {item.reason}
                            </p>
                          </div>
                          <div className="rounded-lg bg-primary/10 px-2 py-1 text-right">
                            <p className="text-xs font-semibold text-primary">
                              {winnerLabel(item.winner, "P1", "P2")}
                            </p>
                            <p className="text-xs text-muted-foreground">+{item.weight}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Compare Again Button */}
              <Button onClick={clearComparison} variant="outline" className="rounded-full">
                Compare different players
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
