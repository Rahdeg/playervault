import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { comparePlayers } from "@/lib/comparePlayers";
import { searchPlayers } from "@/lib/providers/players";

function formatValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

function winnerLabel(winner, aName, bName) {
  if (winner === "a") return aName;
  if (winner === "b") return bName;
  return "Draw";
}

function PlayerSearchContainer({ title, onPlayerSelect, selectedPlayer }) {
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
            <p className="font-semibold text-foreground">{selectedPlayer.name}</p>
            <p className="text-xs text-muted-foreground">{selectedPlayer.sport}</p>
            <p className="text-xs text-muted-foreground">
              {selectedPlayer.position || "—"} • {selectedPlayer.team?.name || "—"}
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPlayerSelect(null)}
              className="mt-2 rounded-full"
            >
              Change
            </Button>
          </div>
        )}

        {!selectedPlayer && results.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {results.map((player) => (
              <button
                key={player.id}
                onClick={() => onPlayerSelect(player)}
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
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [comparison, setComparison] = useState(null);

  function handleCompare() {
    if (!player1 || !player2) {
      return;
    }

    const result = comparePlayers(player1, player2);
    setComparison(result);
  }

  function clearComparison() {
    setComparison(null);
    setPlayer1(null);
    setPlayer2(null);
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
            onPlayerSelect={setPlayer1}
          />
          <PlayerSearchContainer
            title="Player 2"
            selectedPlayer={player2}
            onPlayerSelect={setPlayer2}
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
                <CardHeader>
                  <CardTitle className="text-lg">Decision</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Winner:</span>{" "}
                    {winnerLabel(comparison.winner, player1.name, player2.name)}
                  </p>
                  <p className="text-muted-foreground">
                    Score: {player1.name} ({comparison.totals.a}) vs {player2.name} (
                    {comparison.totals.b})
                  </p>
                </CardContent>
              </Card>

              {/* Player Cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                {[player1, player2].map((player) => (
                  <Card key={player.id} className="elev8-card">
                    <CardHeader>
                      <CardTitle className="text-lg">{player.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
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
