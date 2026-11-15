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
      text: "A screen shows you a volcano. A headset puts you next to one. Being there is what makes a topic stick.",
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
    q: "Why does this need a headset?",
    a: "Because the point is space. A 2D graph app can show links, but it cannot let you place ideas around your body, reach for them, or stand inside one. Those are the parts that help a topic stick.",
  },
  {
    q: "Is the generated world more than eye candy?",
    a: "It is tied to your notes. Each world is written from the topic and the ideas connected to it, you steer it live, and the last view becomes the star's picture, a visual cue for what you learned there.",
  },
  {
    q: "Will it make people feel sick?",
    a: "We designed against it. Nothing is fixed to your view, nothing comes closer than 30 cm, nothing flashes across the whole view, and in the void you move by walking and pulling the constellation, not with the sticks.",
  },
  {
    q: "The world takes two seconds to respond. Is that a problem?",
    a: "Orbis applies a new instruction about two seconds after it is sent. A marker shows your request is on its way so the wait feels intended, and stick moves go straight to Orbis as short camera instructions, with no language model in between.",
  },
  {
    q: "What if the Wi-Fi or Orbis goes down?",
    a: "We bring our own router so the headset and laptop always reach each other. If Orbis is unreachable, a recorded world plays in its place and the rest of ZAP! keeps working.",
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
    a: "Anyone studying on their own: students before an exam, and curious people working through a subject for fun. Self-directed learning is where we see the most good.",
  },
  {
    q: "Can I use it today?",
    a: "Not yet. ZAP! is a prototype built at Immerse the Bay 2027. Come try it at our table.",
  },
  {
    q: "What comes next?",
    a: "Colour, spatial sound by Satie, hand tracking, sharing a constellation with a friend, importing your existing notes, and doorways from one world straight into a connected one.",
  },
];

export const close = {
  title: "Come try it.",
  text: "Put on the headset at our table and build your first constellation in a minute. Scan the code to take this pitch with you.",
  qrCaption: "Scan for the pamphlet",
  pdfLabel: "Download the PDF",
} as const;

export const pamphlet = {
  title: "ZAP! in one page",
  intro:
    "A study tool for Meta Quest 3. You say a topic, throw it into space as a star, zap related stars together, and step inside any of them to explore a world generated live by Orbis.",
  howTitle: "How it works",
  whyTitle: "Why it has to be a headset",
  questionsTitle: "Questions judges ask",
  techTitle: "Built on",
  footer: "Immerse the Bay 2027, Living Worlds track.",
} as const;
