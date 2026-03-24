function hasValue(value) {
  return value !== null && value !== undefined && value !== "";
}

function toNumber(value) {
  if (!hasValue(value)) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function countCompleteness(player) {
  const fields = [
    player.name,
    player.nationality,
    player.team?.name,
    player.position,
    player.dateBorn,
    player.heightCm,
    player.weightKg,
    player.signingAmount,
    player.wageAmount,
    player.description,
    player.image,
  ];

  return fields.filter(hasValue).length;
}

function descriptionLength(player) {
  const text = (player?.description || "").trim();
  return text.length;
}

function scoreAchievementsFromBio(description) {
  if (!description || typeof description !== "string") {
    return { total: 0, hitLines: 0, lineCount: 0 };
  }

  const lines = description
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const eliteTerms = [
    "world cup",
    "champions league",
    "olympic",
    "grand slam",
    "ballon d'or",
    "hall of fame",
    "gold medal",
    "world champion",
  ];

  const majorTerms = [
    "champion",
    "winner",
    "title",
    "trophy",
    "mvp",
    "record",
    "award",
    "finalist",
  ];

  const supportingTerms = [
    "captain",
    "debut",
    "international",
    "national team",
    "all-star",
    "top scorer",
  ];

  let total = 0;
  let hitLines = 0;

  for (const line of lines) {
    const lower = line.toLowerCase();
    let lineScore = 0;

    const eliteHits = eliteTerms.filter((term) => lower.includes(term)).length;
    const majorHits = majorTerms.filter((term) => lower.includes(term)).length;
    const supportHits = supportingTerms.filter((term) =>
      lower.includes(term),
    ).length;

    lineScore += eliteHits * 5;
    lineScore += majorHits * 3;
    lineScore += supportHits;

    const quantifiedAchievements = lower.match(
      /\b\d+\s+(titles?|trophies|goals?|wins?|medals?|caps|appearances|awards?)\b/g,
    );
    if (quantifiedAchievements?.length) {
      lineScore += quantifiedAchievements.length * 2;
    }

    if (lineScore > 0) {
      hitLines += 1;
      total += lineScore;
    }
  }

  return {
    total,
    hitLines,
    lineCount: lines.length,
  };
}

function compareAchievementNarrative(playerA, playerB) {
  const scoreA = scoreAchievementsFromBio(playerA?.description);
  const scoreB = scoreAchievementsFromBio(playerB?.description);

  const totalWinner = compareNumeric(scoreA.total, scoreB.total);
  if (totalWinner !== "draw") {
    return { winner: totalWinner, scoreA, scoreB };
  }

  const lineWinner = compareNumeric(scoreA.hitLines, scoreB.hitLines);
  if (lineWinner !== "draw") {
    return { winner: lineWinner, scoreA, scoreB };
  }

  return { winner: "draw", scoreA, scoreB };
}

function statusScore(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "active") return 3;
  if (normalized === "signed") return 2;
  if (normalized === "retired") return 1;
  return 0;
}

function primeAgeBySport(sport) {
  const key = String(sport || "")
    .trim()
    .toLowerCase();

  const map = {
    soccer: 27,
    football: 27,
    basketball: 28,
    cricket: 29,
    rugby: 28,
    tennis: 27,
    baseball: 28,
    "american football": 27,
    "ice hockey": 27,
    golf: 31,
  };

  return map[key] ?? 28;
}

function compareByPrimeAge(playerA, playerB) {
  const a = toNumber(playerA?.age);
  const b = toNumber(playerB?.age);

  if (!hasValue(a) && !hasValue(b)) return "draw";
  if (hasValue(a) && !hasValue(b)) return "a";
  if (!hasValue(a) && hasValue(b)) return "b";

  const target = primeAgeBySport(playerA?.sport || playerB?.sport);
  const distA = Math.abs(a - target);
  const distB = Math.abs(b - target);

  if (distA === distB) return "draw";
  return distA < distB ? "a" : "b";
}

function compareProfileStrength(playerA, playerB) {
  const completenessA = countCompleteness(playerA);
  const completenessB = countCompleteness(playerB);

  if (completenessA !== completenessB) {
    return completenessA > completenessB ? "a" : "b";
  }

  const bioA = descriptionLength(playerA);
  const bioB = descriptionLength(playerB);
  if (bioA !== bioB) return bioA > bioB ? "a" : "b";

  return "draw";
}

function compareNumeric(a, b) {
  if (!hasValue(a) && !hasValue(b)) return "draw";
  if (hasValue(a) && !hasValue(b)) return "a";
  if (!hasValue(a) && hasValue(b)) return "b";
  if (a === b) return "draw";
  return a > b ? "a" : "b";
}

function compareText(a, b) {
  if (!a && !b) return "draw";
  if (a && !b) return "a";
  if (!a && b) return "b";
  if (a === b) return "draw";
  return String(a).length === String(b).length
    ? "draw"
    : String(a).length > String(b).length
      ? "a"
      : "b";
}

function makeCriterion({ key, label, weight, aValue, bValue, winner, reason }) {
  return {
    key,
    label,
    weight,
    aValue,
    bValue,
    winner,
    reason,
    points: {
      a: winner === "a" ? weight : 0,
      b: winner === "b" ? weight : 0,
    },
  };
}

export function comparePlayers(playerA, playerB) {
  const sportA = (playerA?.sport || "").trim().toLowerCase();
  const sportB = (playerB?.sport || "").trim().toLowerCase();

  if (!sportA || !sportB || sportA !== sportB) {
    return {
      comparable: false,
      reason: "Players must belong to the same sport.",
      winner: "none",
      totals: { a: 0, b: 0 },
      criteria: [],
    };
  }

  const criteria = [];

  const popularityWinner = compareNumeric(playerA.loved, playerB.loved);
  criteria.push(
    makeCriterion({
      key: "popularity",
      label: "Popularity (loved count)",
      weight: 3,
      aValue: playerA.loved,
      bValue: playerB.loved,
      winner: popularityWinner,
      reason: "Higher loved count wins.",
    }),
  );

  const statusA = statusScore(playerA.status);
  const statusB = statusScore(playerB.status);
  const statusWinner = compareNumeric(statusA, statusB);
  criteria.push(
    makeCriterion({
      key: "status",
      label: "Current status",
      weight: 2,
      aValue: playerA.status || "Unknown",
      bValue: playerB.status || "Unknown",
      winner: statusWinner,
      reason: "Status ranking: Active > Signed > Retired > Unknown.",
    }),
  );

  const completenessA = countCompleteness(playerA);
  const completenessB = countCompleteness(playerB);
  const completenessWinner = compareNumeric(completenessA, completenessB);
  criteria.push(
    makeCriterion({
      key: "completeness",
      label: "Profile completeness",
      weight: 1,
      aValue: completenessA,
      bValue: completenessB,
      winner: completenessWinner,
      reason: "More available API fields wins.",
    }),
  );

  const profileStrengthWinner = compareProfileStrength(playerA, playerB);
  criteria.push(
    makeCriterion({
      key: "profileStrength",
      label: "Profile detail quality",
      weight: 1,
      aValue: descriptionLength(playerA),
      bValue: descriptionLength(playerB),
      winner: profileStrengthWinner,
      reason: "More complete and richer profile metadata wins.",
    }),
  );

  const achievementComparison = compareAchievementNarrative(playerA, playerB);
  criteria.push(
    makeCriterion({
      key: "achievementNarrative",
      label: "Career achievements (bio analysis)",
      weight: 2,
      aValue: achievementComparison.scoreA.total,
      bValue: achievementComparison.scoreB.total,
      winner: achievementComparison.winner,
      reason:
        "Biography is read line-by-line and scored for major achievements, awards, records, and quantified milestones.",
    }),
  );

  const signingWinner = compareNumeric(
    playerA.signingAmount,
    playerB.signingAmount,
  );
  criteria.push(
    makeCriterion({
      key: "signing",
      label: "Signing value",
      weight: 1,
      aValue: playerA.signingRaw || playerA.signingAmount,
      bValue: playerB.signingRaw || playerB.signingAmount,
      winner: signingWinner,
      reason: "Higher signing value wins when available.",
    }),
  );

  const wageWinner = compareNumeric(playerA.wageAmount, playerB.wageAmount);
  criteria.push(
    makeCriterion({
      key: "wage",
      label: "Wage",
      weight: 1,
      aValue: playerA.wageRaw || playerA.wageAmount,
      bValue: playerB.wageRaw || playerB.wageAmount,
      winner: wageWinner,
      reason: "Higher wage wins when available.",
    }),
  );

  const primeAgeWinner = compareByPrimeAge(playerA, playerB);
  criteria.push(
    makeCriterion({
      key: "primeAge",
      label: "Age fit for sport prime",
      weight: 1,
      aValue: playerA.age,
      bValue: playerB.age,
      winner: primeAgeWinner,
      reason: "Player closer to the sport's typical prime age wins.",
    }),
  );

  const positionWinner = compareText(playerA.position, playerB.position);
  criteria.push(
    makeCriterion({
      key: "positionData",
      label: "Position data availability",
      weight: 1,
      aValue: playerA.position || "Unknown",
      bValue: playerB.position || "Unknown",
      winner: positionWinner,
      reason: "Only rewards missing vs available position metadata.",
    }),
  );

  const priorityOrder = [
    "popularity",
    "achievementNarrative",
    "status",
    "signing",
    "wage",
    "completeness",
    "profileStrength",
    "primeAge",
    "positionData",
  ];

  const totals = criteria.reduce(
    (acc, item) => {
      acc.a += item.points.a;
      acc.b += item.points.b;
      return acc;
    },
    { a: 0, b: 0 },
  );

  let winner = totals.a === totals.b ? "draw" : totals.a > totals.b ? "a" : "b";

  if (winner === "draw") {
    for (const key of priorityOrder) {
      const criterion = criteria.find((item) => item.key === key);
      if (criterion?.winner === "a" || criterion?.winner === "b") {
        winner = criterion.winner;
        break;
      }
    }
  }

  if (winner === "draw") {
    const fallbackA =
      (toNumber(playerA.loved) || 0) +
      scoreAchievementsFromBio(playerA.description).total / 10 +
      statusScore(playerA.status) +
      countCompleteness(playerA) +
      descriptionLength(playerA) / 1000;

    const fallbackB =
      (toNumber(playerB.loved) || 0) +
      scoreAchievementsFromBio(playerB.description).total / 10 +
      statusScore(playerB.status) +
      countCompleteness(playerB) +
      descriptionLength(playerB) / 1000;

    if (fallbackA !== fallbackB) {
      winner = fallbackA > fallbackB ? "a" : "b";
    }
  }

  return {
    comparable: true,
    reason: "",
    winner,
    totals,
    criteria,
  };
}
