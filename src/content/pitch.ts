// Shared project copy for the overview, PDF, and legacy presentation components.
// The immersive homepage has its presentation copy in components/experience/content.ts.
//
// House rules for this file (checked by `npm run check:copy`): no emoji, no em dashes, no dot separators,
// no small all-caps labels above headings. Plain sentences. Claims stay true to
// the user-supplied Devpost description and the working headset demonstration.

export type Step = { title: string; text: string };
export type Claim = { title: string; text: string };
export type Question = { q: string; a: string };

export const product = {
  name: "ZAP!",
  headline: "A spatial knowledge space for Meta Quest.",
  lead: "Speak a thought, give it a place, connect it to another, and step inside a world of questions.",
  platform: "For Meta Quest 3",
  event: "Built at Immerse the Bay for the Living Worlds track.",
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
    text: "Hold the controller button and say a topic. An orb appears in your hand. AI writes its note using its parent ideas as context.",
  },
  {
    title: "Throw it",
    text: "Throw an orb to place it in space. Pull or stretch the whole map with two hands.",
  },
  {
    title: "Zap it",
    text: "Point from one orb to another to link related ideas. Each node stores its topic, note, position and links on the headset.",
  },
  {
    title: "Step inside",
    text: "Throw an orb forward to travel into its world. Grab and resize learning objects, ask questions aloud, and place answers on glass panes.",
  },
];

/** ZAP! has two places to be (design-system.md, "The two spaces"), shown as Harvey shows its two audiences. */
export const spaces = {
  title: "Two spaces, one study session",
  text: "You build your understanding in the void, then walk into any part of it.",
  items: [
    {
      title: "The void",
      text: "A dark, quiet space around you. Say topics, throw them into the space around you, and zap them together into a constellation of everything you are learning.",
      cta: "Try the void",
      href: "#try",
    },
    {
      title: "A world",
      text: "Enter a topic through its orb. Explore a world with real geometry, handle learning objects and ask questions aloud. The demo uses three worlds generated with World Labs.",
      cta: "Step inside",
      href: "#step-inside",
    },
  ],
} as const;

/** The heading over the row of parts, where Harvey shows its customers' logos. */
export const builtOnHeading = "Built at Immerse the Bay on";

/** A few true numbers, Harvey-style. Each one is backed by the answers further down the page. */
export const numbers = {
  title: "ZAP! in numbers",
  items: [
    { value: "4", label: "moves: say it, place it, connect it, step inside" },
    { value: "3", label: "prepared worlds in the headset demo" },
    { value: "2", label: "hands to pull and stretch your map" },
    { value: "0", label: "keyboards needed inside the headset" },
  ],
} as const;

export const tryIt = {
  title: "Try it here",
  text: "A small version of the void, in your browser. Type a topic to make a star, then drag from one star to another to zap them together.",
  note: "This is a sketch of the interaction. The real thing is in the headset.",
} as const;

export const worlds = {
  title: "Every orb is a doorway.",
  text: "The Great Wall, a connected watchtower and a DNA biology lab were generated with World Labs. They load as textured 3D meshes, giving you real geometry to walk around in.",
  points: [
    { title: "Walk inside", text: "Travel through an orb into an immersive world and find your own viewpoint." },
    { title: "Think with your hands", text: "Grab and resize learning objects. Keep the explanation on a glass pane beside you." },
    { title: "Change it by voice", text: "Say create RNA and delete the DNA. AI describes the requested object using simple shapes, and Unity builds it." },
  ] satisfies Claim[],
} as const;

export const whyXr = {
  title: "Why it has to be a headset",
  claims: [
    {
      title: "Ideas have a place",
      text: "Recognize a topic by its position, its neighbors, or its world. Spatial familiarity is a design goal; learning benefits have not been measured.",
    },
    {
      title: "Hands make ideas tangible",
      text: "Hold, move, rotate, and enlarge learning objects. Choose the viewpoint that helps you inspect a representation.",
    },
    {
      title: "Questions have context",
      text: "Ask about the world or an object you select. Answers stay on glass panes that you can place beside what you are exploring.",
    },
  ] satisfies Claim[],
} as const;

export const builtOn = {
  title: "Built on",
  items: [
    { name: "Unity + C#", role: "Runtime and interaction on Meta Quest" },
    { name: "World Labs", role: "Three generated environments, exported as meshes" },
    { name: "Faster Whisper", role: "Local speech transcription through a Python service" },
    { name: "GPT-6 Luna", role: "Notes, questions and object edits" },
    { name: "Figma", role: "One shared theme for the spatial interface" },
  ],
  trackFit:
    "ZAP! makes a learning topic into a place you can enter. You inspect and change learning objects, ask contextual questions, and connect each investigation to your wider constellation.",
} as const;

export const questions: readonly Question[] = [
  {
    q: "Who is ZAP! for?",
    a: "Independent learners following their own questions. Ideas can start as a subject, a specific question, or a connection between topics.",
  },
  {
    q: "What can I explore now?",
    a: "Three prepared environments: Great Wall outside, a connected watchtower, and a biology lab. These are generated interpretations, with schematic learning objects.",
  },
  {
    q: "What can voice change?",
    a: "Create, revise, or remove learning objects. In the biology demo, asking to create RNA and delete DNA produced both changes. The room itself stays static.",
  },
  {
    q: "What stays when I return?",
    a: "Each node keeps its topic, note, position and links in a small file on the headset. The app recreates the map from these files.",
  },
  {
    q: "What is still future work?",
    a: "Generating new worlds while you wait, AI-suggested links and shared study spaces are next. Faster, more affordable world generation is the path to a real product.",
  },
  {
    q: "How do I enter a world?",
    a: "Every orb is a doorway. Throw one forward to travel into a world you can walk around in, inspect and ask questions about.",
  },
  {
    q: "Can I trust the visuals?",
    a: "Worlds provide a setting for questions. They are not surveyed historical reconstructions, and object changes are qualitative teaching illustrations, not validated simulations.",
  },
  {
    q: "Is there a desktop experience?",
    a: "The website includes a browser sketch of arranging and connecting nodes. ZAP! itself is built for Meta Quest, using controllers and voice.",
  },
];

export const close = {
  title: "Come try it.",
  text: "Put on the headset at our table and build your first constellation. Explore an idea with your voice and hands.",
  qrCaption: "Scan for the pamphlet",
  pdfLabel: "Download the PDF",
} as const;

/**
 * The pamphlet: a one-page overview judges open from the QR code. It reads like a shared doc, keeps working
 * offline once opened, and saves as a one-page PDF. It holds less than the site on purpose.
 */
export const pamphlet = {
  title: "ZAP! overview",
  subtitle: "A spatial knowledge space for Meta Quest, built at Immerse the Bay for the Living Worlds track.",
  intro:
    "Speak an idea into an orb, arrange and connect it, then enter a world to investigate it. The demo includes the Great Wall exterior, a linked watchtower, and a biology lab.",
  whatTitle: "What it is",
  howTitle: "How it works",
  whyTitle: "Why VR?",
  whyLead: "The headset adds physical scale, surrounding space, and direct handling:",
  questionsTitle: "What judges ask",
  techTitle: "Built on",
  trackTitle: "Why it fits Living Worlds",
  siteLabel: "See the full pitch",
  footer: "Immerse the Bay, Living Worlds track.",
  offlineSaving: "Saving for offline",
  offlineReady: "Available offline",
  offlineNow: "Offline, showing the saved copy",
} as const;

/** Concise questions about the prepared demo, voice, persistence, and scope. */
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
