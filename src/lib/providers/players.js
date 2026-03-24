const BASE = "https://www.thesportsdb.com/api/v1/json/3";

function toNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseMetric(value) {
  if (!value) return null;
  const match = String(value).match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseMoney(value) {
  if (!value) return null;

  const source = String(value).trim().toLowerCase();
  const cleaned = source.replace(/[$£€,\s]/g, "");
  const match = cleaned.match(/(-?\d+(?:\.\d+)?)([kmb])?/i);

  if (!match) return null;

  const base = Number(match[1]);
  if (!Number.isFinite(base)) return null;

  const multiplier =
    match[2] === "k"
      ? 1_000
      : match[2] === "m"
        ? 1_000_000
        : match[2] === "b"
          ? 1_000_000_000
          : 1;

  return Math.round(base * multiplier);
}

function calculateAge(dateBorn) {
  if (!dateBorn) return null;

  const birthDate = new Date(dateBorn);

  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

function normalisePlayer(player) {
  return {
    id: String(player.idPlayer || ""),
    name: player.strPlayer || "Unknown Player",
    sport: player.strSport || "",
    nationality: player.strNationality || "",
    team: {
      id: String(player.idTeam || ""),
      name: player.strTeam || "",
      logo: "",
    },
    position: player.strPosition || "",
    gender: player.strGender || "",
    status: player.strStatus || "",
    image: player.strThumb || player.strCutout || "",
    cutout: player.strCutout || "",
    dateBorn: player.dateBorn || "",
    age: calculateAge(player.dateBorn),
    description: player.strDescriptionEN || "",
    loved: toNumber(player.intLoved),
    heightRaw: player.strHeight || "",
    heightCm: parseMetric(player.strHeight),
    weightRaw: player.strWeight || "",
    weightKg: parseMetric(player.strWeight),
    signingRaw: player.strSigning || "",
    signingAmount: parseMoney(player.strSigning),
    wageRaw: player.strWage || "",
    wageAmount: parseMoney(player.strWage),
    shirtNumber: player.strNumber || "",
    birthLocation: player.strBirthLocation || "",
  };
}

function dedupePlayers(players) {
  const seen = new Set();

  return players.filter((player) => {
    const key = `${player.id}-${player.name}-${player.team.name}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function searchPlayers(query) {
  if (!query?.trim()) return [];

  const res = await fetch(
    `${BASE}/searchplayers.php?p=${encodeURIComponent(query.trim())}`,
  );

  if (!res.ok) {
    throw new Error("Failed to search players.");
  }

  const data = await res.json();
  console.log("Player search data:", data);

  const players = (data.player || []).map(normalisePlayer);
  return dedupePlayers(players);
}

export async function getPlayer(id) {
  const res = await fetch(
    `${BASE}/lookupplayer.php?id=${encodeURIComponent(id)}`,
  );

  if (!res.ok) {
    throw new Error("Failed to load player.");
  }

  const data = await res.json();
  const player = data.players?.[0];

  if (!player) {
    throw new Error("Player not found.");
  }

  return normalisePlayer(player);
}

export async function getPlayersForCompare(id1, id2) {
  const [playerA, playerB] = await Promise.all([
    getPlayer(id1),
    getPlayer(id2),
  ]);
  return [playerA, playerB];
}
