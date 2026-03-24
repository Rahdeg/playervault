import { useLocation, useNavigate } from "react-router-dom";

/* ── Orbit geometry ─────────────────────────────────────────── */
const ORBIT_SIZE = 230;  // total container px
const RING_R     = 85;   // ring radius px
const CX = ORBIT_SIZE / 2;
const CY = ORBIT_SIZE / 2;

/** Polar angle (deg, 0 = top, clockwise) → absolute position object */
function orbit(angleDeg) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return {
    position: "absolute",
    left: CX + RING_R * Math.cos(rad),
    top:  CY + RING_R * Math.sin(rad),
    transform: "translate(-50%, -50%)",
  };
}

function truncate(str, max = 11) {
  if (!str) return "—";
  return str.length > max ? `${str.slice(0, max)}…` : str;
}

export default function PlayerCard({ player }) {
  const navigate = useNavigate();
  const location = useLocation();

  function handleClick() {
    navigate(`/player/${player.id}`, {
      state: { from: `${location.pathname}${location.search}` },
    });
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }

  const initials = (player.name || "?")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();

  // 5 satellites evenly spread (72° apart, starting from top)
  const sats = [
    { label: truncate(player.sport      || "—"), angle: 0   }, // top
    { label: truncate(player.team?.name || "—"), angle: 72  }, // top-right
    { label: truncate(player.name       || "—"), angle: 144 }, // bottom-right
    { label: truncate(player.position   || "—"), angle: 216 }, // bottom-left
    { label: truncate(player.nationality|| "—"), angle: 288 }, // top-left
  ];

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View ${player.name ?? "player"} profile`}
      className="orbit-card group"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* ── Orbit zone ── */}
      <div
        className="orbit-zone"
        style={{ width: ORBIT_SIZE, height: ORBIT_SIZE }}
      >
        {/* Dashed ring */}
        <div
          className="orbit-ring-dash"
          style={{ width: RING_R * 2, height: RING_R * 2 }}
          aria-hidden="true"
        />

        {/* Centre image node */}
        <div className="orbit-center-node">
          {player.image ? (
            <img
              src={player.image}
              alt={`${player.name} profile`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <span className="orbit-initials">{initials}</span>
          )}
          <div className="orbit-pulse" aria-hidden="true" />
        </div>

        {/* Satellite labels */}
        {sats.map(({ label, angle }) => (
          <span
            key={angle}
            className="satellite"
            style={orbit(angle)}
            aria-hidden="true"
          >
            {label}
          </span>
        ))}
      </div>

      {/* Name beneath orbit */}
      <p className="mt-2 text-center text-sm font-bold tracking-tight text-foreground/90">
        {player.name || "Unknown Player"}
      </p>
    </div>
  );
}