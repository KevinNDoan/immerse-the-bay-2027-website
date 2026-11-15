// Every word of the pitch, in one place. The landing page, the /pamphlet page and the PDF all read from here,
// so the copy never drifts between them.
//
// House rules for this file (checked by `npm run check:copy`): no emoji, no em dashes, no dot separators,
// no small all-caps labels above headings. Plain sentences. Claims stay true to
// ~/immerse-the-bay-2027/docs/planning.md and docs/design-system.md.

export type Step = { title: string; text: string };
export type Claim = { title: string; text: string };
export type Question = { q: string; a: string };

export const product = {
  name: "ZAP!",
  headline: "Study in space.",
  lead: "Say a topic and it lands in your hand as a star. Throw it, zap it to the next idea, then step inside it.",
  platform: "For Meta Quest 3",
  event: "Built at Immerse the Bay 2027 for the Living Worlds track.",
  tryPrompt: "Type a topic",
  tryExamples: ["Volcanoes", "Black holes", "The French Revolution", "Photosynthesis"],
} as const;

export const problem = {
  statement: "Notes are flat. Learning isn't.",
  text: "A page of notes hides how ideas connect, and a screen keeps you outside the subject. ZAP! puts your ideas around you, where you can see how they connect and walk inside them.",
} as const;

export const steps: readonly Step[] = [
  {
    title: "Say it",
    text: "Hold a button and say a topic. A star with a sticky note appears in your hand, along with a short summary and three ideas to explore next.",
  },
  {
    title: "Throw it",
    text: "Throw the star into the dark and it drifts to a stop where you left it. Place ideas the way you think about them, close or far, high or low.",
  },
  {
    title: "Zap it",
    text: "Drag from one star to another and a bolt snaps between them, then settles into a glowing line. ZAP! suggests the link it thinks fits best.",
  },
  {
    title: "Step inside",
    text: "Pull a star to your face. The void gives way to a living world of that topic, all around you. Steer it with the sticks or ask for what you want to see.",
  },
];

/** ZAP! has two places to be (design-system.md, "The two spaces"), shown as Harvey shows its two audiences. */
export const spaces = {
  title: "Two spaces, one study session",
  text: "You build your understanding in the void, then walk into any part of it.",
  items: [
    {
      title: "The void",
      text: "A dark, quiet space around you. Say topics, throw them where they belong, and zap them together into a constellation of everything you are learning.",
      cta: "Try the void",
      href: "#try",
    },
    {
      title: "A world",
      text: "Pull any star to your face and the void gives way to a moving world of that topic, generated live by Orbis. Steer it, then press a button to come back.",
      cta: "Step inside",
      href: "#step-inside",
    },
  ],
} as const;

/** The heading over the row of parts, where Harvey shows its customers' logos. */
export const builtOnHeading = "Built at Immerse the Bay 2027 on";

/** A few true numbers, Harvey-style. Each one is backed by the answers further down the page. */
export const numbers = {
  title: "ZAP! in numbers",
  items: [
    { value: "4", label: "moves to learn: say it, throw it, zap it, step inside" },
    { value: "2 s", label: "about how long a world takes to answer what you ask" },
    { value: "30 cm", label: "the closest anything in ZAP! ever comes to your face" },
    { value: "$0.58", label: "a minute on Orbis Stable, and only while you are inside a world" },
  ],
} as const;

export const tryIt = {
  title: "Try it here",
  text: "A small version of the void, in your browser. Type a topic to make a star, then drag from one star to another to zap them together.",
  note: "This is a sketch of the interaction. The real thing is in the headset.",
} as const;

export const worlds = {
  title: "Every topic is a place.",
  text: "Inside a star, Orbis by Visko generates a world in real time and wraps it around you. Push a stick to move, look around, or say what you want to see. A marker shows your request is on its way, and about two seconds later the world answers.",
  points: [
    { title: "You steer", text: "Move, look, trigger an event, or ask out loud. Nothing plays on rails." },
    { title: "It remembers", text: "Leave, and the star keeps a picture of where you went. Come back and you pick up from that view." },
    { title: "It knows the context", text: "Each world is written from the topic and the ideas it connects to, so Pompeii looks different under Volcanoes than under Rome." },
  ] satisfies Claim[],
} as const;

export const whyXr = {
  title: "Why it has to be a headset",
  claims: [
    {
      title: "Space is memory",
      text: "People have tied ideas to places for over two thousand years. In ZAP! every idea has a real place you can point to and come back to.",
    },
    {
      title: "Hands make ideas real",
      text: "Grabbing, throwing and zapping turns study into something you do, not something you scroll. The shape of the constellation is the shape of your understanding.",
    },
    {
      title: "Presence beats description",
      text: "A screen shows you a volcano. A headset puts you next to one, and gives the topic a place you can remember it by.",
    },
  ] satisfies Claim[],
} as const;

export const builtOn = {
  title: "Built on",
  items: [
    { name: "Meta Quest 3", role: "The headset, with Touch controllers" },
    { name: "Unity 6", role: "OpenXR and the XR Interaction Toolkit" },
    { name: "Orbis by Visko", role: "Real-time generated worlds, streamed through Reactor" },
    { name: "GPT-6 Luna", role: "Summaries, suggestions and world prompts" },
    { name: "Local speech recognition", role: "Your voice is turned into text on our laptop" },
  ],
  trackFit:
    "Living Worlds asks for an XR experience centred on Orbis, steered live by the user. In ZAP!, Orbis is where every topic leads, and the user steers it every second they are inside.",
} as const;

export const questions: readonly Question[] = [
  {
    q: "What happens when the constellation gets big?",
    a: "You reshape it with your hands. Pull it closer, stretch it from desk size to room size, or tap a star to bring it and its neighbours to you. Notes fade with distance, so only the ideas near you carry text.",
  },
  {
    q: "Is the generated world more than eye candy?",
    a: "It is tied to your notes. Each world is written from the topic and the ideas connected to it, you steer it live, and the last view becomes the star's picture, a visual cue for what you learned there.",
  },
  {
    q: "Will it make people feel sick?",
    a: "We designed against it. In the void you move by walking and pulling the constellation, never with the sticks. Inside a world the sticks steer the video, while the dome around you stays still. Nothing is fixed to your view, comes closer than 30 cm, or flashes across the whole view.",
  },
  {
    q: "The world takes two seconds to respond. Is that a problem?",
    a: "Orbis applies a new instruction about two seconds after it is sent. A marker shows your request is on its way so the wait feels intended, and stick moves go straight to Orbis as short camera instructions, with no language model in between.",
  },
  {
    q: "What if the Wi-Fi or Orbis goes down?",
    a: "We bring our own router, and if a network blocks the headset from the laptop, a USB cable works instead. If Orbis is unreachable, a recorded world plays in its place and the rest of ZAP! keeps working.",
  },
  {
    q: "Where does my voice go?",
    a: "Speech is turned into text on our own laptop. Only that text goes to the language model, and every API key stays on the laptop, never on the headset.",
  },
  {
    q: "What does it cost to run?",
    a: "Building the constellation costs a few short language model calls per topic. Worlds cost only while you are inside one, at about $0.58 a minute on Orbis Stable.",
  },
  {
    q: "Who is it for?",
    a: "Self-directed learners working through subjects made of connected ideas, like biology, history or how a system fits together. That kind of learning is where seeing the links helps most, and where we see the most good.",
  },
  {
    q: "Can you trust what the world shows?",
    a: "Treat it as a place, not a source. Worlds are there for presence and memory. The facts live on the note, as a short summary you can read and check, and the world is the scene you remember them by.",
  },
  {
    q: "What comes next?",
    a: "Sharing a constellation with a friend, importing your existing notes, spatial sound by Satie, hand tracking, doorways from one world straight into a connected one, and colour.",
  },
];

export const close = {
  title: "Come try it.",
  text: "Put on the headset at our table and build your first constellation in a minute. Scan the code to take this pitch with you.",
  qrCaption: "Scan for the pamphlet",
  pdfLabel: "Download the PDF",
} as const;

/**
 * The pamphlet: a one-page overview judges open from the QR code. It reads like a shared doc, keeps working
 * offline once opened, and saves as a one-page PDF. It holds less than the site on purpose.
 */
export const pamphlet = {
  title: "ZAP! overview",
  subtitle: "A study tool for Meta Quest 3, built at Immerse the Bay 2027 for the Living Worlds track.",
  intro:
    "You say a topic, throw it into space as a star, zap related stars together, and step inside any of them to explore a world generated live by Orbis.",
  whatTitle: "What it is",
  howTitle: "How it works",
  whyTitle: "Why VR?",
  whyLead: "Because it has to be a headset. Three things a screen can't do:",
  questionsTitle: "What judges ask",
  techTitle: "Built on",
  trackTitle: "Why it fits Living Worlds",
  siteLabel: "See the full pitch",
  footer: "Immerse the Bay 2027, Living Worlds track.",
  offlineSaving: "Saving for offline",
  offlineReady: "Available offline",
  offlineNow: "Offline, showing the saved copy",
} as const;

/** The questions short enough for the overview: is the world more than eye candy, comfort, the lag, and the network. */
export const pamphletQuestions: readonly Question[] = [questions[1], questions[2], questions[3], questions[4]];

/**
 * The demo video under the hero. Record a short headset capture, drop it in public/media/ and set `src`
 * (and ideally `poster`, a still from it). Until then the page plays the live 3D steps reel in its place.
 */
export const demoVideo: { src: string | null; poster: string | null; label: string } = {
  src: null,
  poster: null,
  label: "ZAP! in the headset: saying a topic, throwing it, zapping two stars together and stepping inside a world.",
};
