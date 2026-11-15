export const destinations = [
  {
    name: "The Great Wall",
    caption: "Walk through history.",
    subtitle: "A bigger perspective.",
    category: "History / Outside",
    description: "Walk the Great Wall. Ask a question out loud, and keep the answer on a glass pane beside you.",
    detail: "Start with the whole landscape. Then follow the connection into a watchtower for a closer look.",
    color: "#bbd5b6",
    topic: "The Great Wall",
    image: "/media/zap/great-wall.jpg",
    imageAlt: "Actual headset view of the Great Wall at sunset, with a question pane and a travel orb to the watchtower.",
  },
  {
    name: "The Watchtower",
    caption: "Follow the next question.",
    subtitle: "Look a little closer.",
    category: "History / Inside",
    description: "Follow the connection into a watchtower. A related idea becomes another place you can stand in and explore.",
    detail: "This world is linked to the Great Wall exterior, keeping the path of your curiosity intact.",
    color: "#e2c3a6",
    topic: "Watchtowers",
    image: "/media/zap/watchtower.jpg",
    imageAlt: "Actual headset view inside the brick watchtower, with arched windows and a controller ray.",
  },
  {
    name: "The Biology Lab",
    caption: "Hold a new perspective.",
    subtitle: "Get hands-on with life.",
    category: "Biology / Discover",
    description: "Grab and resize a learning object. Say “create RNA and delete the DNA” to reshape the scene around you.",
    detail: "Learning objects can be inspected, resized, and revised by voice. The surrounding room stays in place.",
    color: "#e6b9cb",
    topic: "DNA & RNA",
    image: "/media/zap/biology-lab.jpg",
    imageAlt: "Actual headset view of orange and teal DNA and RNA models in the biology lab, beside a pane requesting a ribosome.",
  },
] as const;

export const rituals = [
  { short: "Say", title: "Say it.", accent: "See it.", caption: "Your voice becomes an idea.", visual: "A DNA world glows inside a glass marble above a pulsing voice waveform." },
  { short: "Place", title: "A thought.", accent: "A place.", caption: "Throw it into your space.", visual: "The idea marble moves outward into a new position in the spatial map." },
  { short: "Connect", title: "One idea.", accent: "Another.", caption: "Point. Link. Follow the thought.", visual: "A gold thread connects two world marbles, with a spark traveling between them." },
  { short: "Enter", title: "Go on.", accent: "Step inside.", caption: "An entire world, in your hand.", visual: "A Great Wall marble expands to reveal its miniature mountains, walls and towers." },
] as const;

/** Real headset captures from the product recording (see docs/product-recording.md), one per section. */
export const captures = {
  voice: {
    image: "/media/zap/ribosome.jpg",
    alt: "Actual headset view of a teal ribosome made on request in the biology lab, with a pane explaining its parts.",
    caption: "In the headset: a ribosome, made by voice.",
  },
  connect: {
    image: "/media/zap/constellation.jpg",
    alt: "Actual headset view of the constellation: the Great Wall, Watchtower and Biology Lab orbs, two of them linked.",
    caption: "In the headset: linked worlds.",
  },
} as const;
