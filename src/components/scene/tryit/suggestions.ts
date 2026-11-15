// A small canned stand-in for the language model's "three ideas to explore next".

const MAP: Record<string, [string, string, string]> = {
  volcano: ["Magma", "Plate tectonics", "Pompeii"],
  "black hole": ["Event horizon", "Gravity", "Dying stars"],
  "french revolution": ["Bastille", "Napoleon", "Enlightenment"],
  photosynthesis: ["Chlorophyll", "Sunlight", "Carbon dioxide"],
  dinosaur: ["Fossils", "Asteroid impact", "Birds"],
  moon: ["Tides", "Apollo 11", "Craters"],
  "ancient rome": ["Julius Caesar", "Pompeii", "Latin"],
  dna: ["Genes", "Proteins", "Evolution"],
  ocean: ["Coral reefs", "Currents", "Whales"],
  "solar system": ["The Sun", "Mars", "Orbits"],
  electricity: ["Lightning", "Circuits", "Magnets"],
};

const FALLBACK: [string, string, string] = ["Key ideas", "Where it started", "Open questions"];

function normalise(topic: string): string {
  return topic
    .toLowerCase()
    .trim()
    .replace(/^the\s+/, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .replace(/(es|s)$/, (m, _g, offset: number, whole: string) => {
      const singular = whole.slice(0, offset);
      return MAP[singular] ? "" : m;
    });
}

export function suggestionsFor(topic: string): [string, string, string] {
  const key = normalise(topic);
  if (MAP[key]) return MAP[key];
  const hit = Object.keys(MAP).find((k) => key.includes(k));
  return hit ? MAP[hit] : FALLBACK;
}
