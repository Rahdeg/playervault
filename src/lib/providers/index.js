import * as basketball from "./basketball";
import * as football from "./football";
import * as cricket from "./cricket";

export function getProvider(sport) {
  if (sport === "basketball") return basketball;
  if (sport === "football") return football;
  if (sport === "cricket") return cricket;
  throw new Error("Unknown sport provider");
}
