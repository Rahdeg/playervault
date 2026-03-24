import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getPlayer } from "@/lib/providers/players";
import { useTypewriter } from "@/lib/useTypewriter";

/* ── Orbit geometry for detail page ────────────────────────── */
const ORBIT_LG_SIZE = 330;
const RING_LG_R     = 128;
const LG_CX = ORBIT_LG_SIZE / 2;
const LG_CY = ORBIT_LG_SIZE / 2;

function orbitLg(angleDeg) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return {
    position: "absolute",
    left: LG_CX + RING_LG_R * Math.cos(rad),
    top:  LG_CY + RING_LG_R * Math.sin(rad),
    transform: "translate(-50%, -50%)",
  };
}

function trunc(str, max = 14) {
  if (!str) return "—";
  return str.length > max ? `${str.slice(0, max)}…` : str;
}

/* ── Loading / Error / Not Found skeletons ──────────────────── */
function StateShell({ backLink, children }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {children}
      <Link to={backLink} className="mt-4 inline-block text-sm font-medium underline">
        ← Back to search
      </Link>
    </div>
  );
}

/* ── About panel with typewriter ────────────────────────────── */
function PlayerAbout({ description }) {
  const { displayed, done } = useTypewriter(description ?? "", 17);

  return (
    <section className="flex w-full flex-col" aria-label="About this player">
      <div className="elev8-shell flex flex-col gap-4" style={{ minHeight: 340 }}>
        {/* Panel header */}
        <div className="flex items-center gap-2.5 border-b border-primary/25 pb-3">
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-primary"
            style={{ animation: "pulse-ring 2s ease-in-out infinite" }}
          />
          <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
            About
          </h2>
          {!done && description && (
            <span className="ml-auto text-xs text-muted-foreground/60" aria-live="polite">
              typing…
            </span>
          )}
        </div>

        {/* Typewriter text area */}
        <div className="about-text-zone flex-1 overflow-y-auto">
          {description ? (
            <p className="whitespace-pre-line text-sm leading-7 text-foreground/85">
              {displayed}
              {!done && (
                <span className="typewriter-cursor" aria-hidden="true">|</span>
              )}
            </p>
          ) : (
            <p className="text-sm italic text-muted-foreground">
              No biography available for this player.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Main component ─────────────────────────────────────────── */
export default function Player() {
  const MotionDiv = motion.div;
  const { id } = useParams();
  const location = useLocation();
  const backLink = location.state?.from || "/search";

  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]  = useState("");

  useEffect(() => {
    async function loadPlayer() {
      try {
        setLoading(true);
        setError("");
        const data = await getPlayer(id);
        setPlayer(data);
      } catch (err) {
        setError(err.message || "Failed to load player.");
      } finally {
        setLoading(false);
      }
    }
    loadPlayer();
  }, [id]);

  if (loading) {
    return (
      <StateShell backLink={backLink}>
        <p className="text-muted-foreground animate-pulse">Loading player…</p>
      </StateShell>
    );
  }

  if (error) {
    return (
      <StateShell backLink={backLink}>
        <p className="text-red-500">{error}</p>
      </StateShell>
    );
  }

  if (!player) {
    return (
      <StateShell backLink={backLink}>
        <p>Player not found.</p>
      </StateShell>
    );
  }

  // 6 satellites at 60° intervals around the large orbit ring
  const detailSats = [
    { label: trunc(player.team?.name  || "—",20), angle: 0,   title: "Team" },
    { label: trunc(player.nationality || "—"), angle: 60,  title: "Nationality" },
    { label: trunc(player.position    || "—"), angle: 120, title: "Position" },
    { label: player.age != null ? `Age ${player.age}` : "—", angle: 180, title: "Age" },
    { label: trunc(player.status || player.gender || "—"), angle: 240, title: "Status" },
    { label: trunc(player.dateBorn    || "—"), angle: 300, title: "Born" },
  ];

  const initials = (player.name || "?")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();

  return (
    <MotionDiv
      className="mx-auto max-w-6xl px-4 py-8"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={backLink}
        className="-mt-2 mb-6 inline-block text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        ← Back to search
      </Link>

      <div className="grid w-full gap-10 md:grid-cols-[1.45fr_1.18fr] md:items-start md:gap-12">

        {/* ── LEFT: name + orbital image ── */}
        <div className="flex w-full flex-col items-center">
          {/* Sport badge + Player name */}
          <div className="mb-6 text-center">
            <span className="inline-flex rounded-full border border-primary/35 px-3 py-0.5 text-xs font-bold uppercase tracking-widest text-primary">
              {player.sport || "Sport"}
            </span>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-foreground">
              {player.name}
            </h1>
          </div>

          {/* Orbit zone */}
          <div
            className="orbit-zone md:origin-top md:scale-[1.08] lg:scale-[1.14]"
            style={{ width: ORBIT_LG_SIZE, height: ORBIT_LG_SIZE, flexShrink: 0 }}
          >
            {/* Dashed ring */}
            <div
              className="orbit-ring-dash"
              style={{ width: RING_LG_R * 2, height: RING_LG_R * 2 }}
              aria-hidden="true"
            />

            {/* Centre image node */}
            <div className="orbit-center-node orbit-center-node--lg">
              {player.image ? (
                <img
                  src={player.image}
                  alt={`${player.name} profile`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="orbit-initials orbit-initials--lg">{initials}</span>
              )}
              <div className="orbit-pulse" aria-hidden="true" />
            </div>

            {/* 6 stat satellites */}
            {detailSats.map(({ label, angle, title }) => (
              <span
                key={angle}
                className="satellite satellite--lg"
                style={orbitLg(angle)}
                aria-label={`${title}: ${label}`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ── RIGHT: About typewriter panel ── */}
        <PlayerAbout description={player.description} />
      </div>
    </MotionDiv>
  );
}