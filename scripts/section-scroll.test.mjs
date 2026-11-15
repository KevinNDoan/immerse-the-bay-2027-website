import assert from "node:assert/strict";
import test from "node:test";
import { nextSectionStop, sectionStops, SectionGesture } from "../src/lib/section-scroll.ts";

test("each section gets one stop, without an extra footer stop", () => {
  const stops = sectionStops([{ top: 0, bottom: 800 }, { top: 800, bottom: 1600 }], 800, 950);
  assert.deepEqual(stops, [0, 800]);
  assert.equal(nextSectionStop(stops, 800, 1), 800);
  assert.equal(nextSectionStop(stops, 800, -1), 0);
});

test("slightly oversized slides advance directly to the next section", () => {
  const stops = sectionStops([{ top: 0, bottom: 830 }, { top: 830, bottom: 1700 }, { top: 1700, bottom: 2500 }], 800, 1700);
  assert.deepEqual(stops, [0, 830, 1700]);
  assert.equal(nextSectionStop(stops, 0, 1), 830);
  assert.equal(nextSectionStop(stops, 830, 1), 1700);
  assert.equal(nextSectionStop(stops, 1700, -1), 830);
});

test("a tall section still has only one arrival point", () => {
  const stops = sectionStops([{ top: 0, bottom: 800 }, { top: 800, bottom: 3400 }, { top: 3400, bottom: 4200 }], 800, 3400);
  assert.deepEqual(stops, [0, 800, 3400]);
  assert.equal(nextSectionStop(stops, 800, 1), 3400);
  assert.equal(nextSectionStop(stops, 3400, -1), 800);
});

test("stops are recalculated for changed section heights and resized viewports", () => {
  const sections = [{ top: 0, bottom: 900 }, { top: 900, bottom: 2600 }];
  assert.deepEqual(sectionStops(sections, 600, 2000), [0, 900]);
  assert.deepEqual(sectionStops(sections, 900, 1700), [0, 900]);
  assert.deepEqual(sectionStops([{ top: 0, bottom: 500 }, { top: 500, bottom: 1000 }], 800, 200), [0, 200]);
  assert.deepEqual(sectionStops([], 0, 0), [0]);
});

test("both directions settle predictably from a position between sections", () => {
  const stops = [0, 800, 1600];
  assert.equal(nextSectionStop(stops, 400, 1), 800);
  assert.equal(nextSectionStop(stops, 400, -1), 0);
  assert.equal(nextSectionStop(stops, 799.5, 1), 1600);
  assert.equal(nextSectionStop(stops, 0, -1), 0);
  assert.equal(nextSectionStop(stops, 1600, 1), 1600);
});

test("one long trackpad gesture cannot skip multiple sections", () => {
  const gesture = new SectionGesture();
  assert.equal(gesture.sample(40, 0, false), 1);
  for (let time = 16; time < 1600; time += 16) {
    assert.equal(gesture.sample(10, time, time < 950), 0);
  }
  assert.equal(gesture.sample(40, 2000, false), 1);
});

test("small trackpad deltas accumulate, and intentional reversal works", () => {
  const gesture = new SectionGesture();
  assert.equal(gesture.sample(8, 0, false), 0);
  assert.equal(gesture.sample(8, 16, false), 0);
  assert.equal(gesture.sample(8, 32, false), 1);
  assert.equal(gesture.sample(-30, 1000, false), -1);
});

test("gestures during a transition are consumed rather than queued", () => {
  const gesture = new SectionGesture();
  assert.equal(gesture.sample(80, 0, true), 0);
  assert.equal(gesture.sample(30, 100, false), 0);
  assert.equal(gesture.sample(30, 400, false), 1);
  gesture.reset();
  assert.equal(gesture.sample(-30, 420, false), -1);
});
