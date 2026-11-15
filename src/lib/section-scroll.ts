export type SectionBounds = { top: number; bottom: number };
export type ScrollDirection = -1 | 1;

/** One stop per presentation section. Section height never creates an extra stop. */
export function sectionStops(sections: SectionBounds[], viewport: number, limit: number): number[] {
  if (viewport <= 0 || limit <= 0) return [0];
  const stops = new Set<number>([0]);
  for (const section of sections) {
    stops.add(Math.round(Math.max(0, Math.min(limit, section.top))));
  }
  return [...stops].sort((a, b) => a - b);
}

export function nextSectionStop(stops: number[], position: number, direction: ScrollDirection): number {
  const tolerance = 3;
  if (direction > 0) return stops.find(stop => stop > position + tolerance) ?? stops.at(-1) ?? 0;
  return stops.findLast(stop => stop < position - tolerance) ?? stops[0] ?? 0;
}

/** One wheel/trackpad gesture advances once, even if its inertial tail outlasts the animation. */
export class SectionGesture {
  private lastAt = -Infinity;
  private direction = 0;
  private distance = 0;
  private consumed = false;

  reset() {
    this.lastAt = -Infinity;
    this.direction = 0;
    this.distance = 0;
    this.consumed = false;
  }

  sample(delta: number, at: number, locked: boolean): ScrollDirection | 0 {
    if (!delta) return 0;
    const direction = Math.sign(delta) as ScrollDirection;
    if (at - this.lastAt > 220 || (!locked && direction !== this.direction)) {
      this.distance = 0;
      this.consumed = false;
    }
    this.lastAt = at;
    this.direction = direction;
    if (locked) {
      this.consumed = true;
      return 0;
    }
    if (this.consumed) return 0;
    this.distance += delta;
    if (Math.abs(this.distance) < 24) return 0;
    this.consumed = true;
    return direction;
  }
}
