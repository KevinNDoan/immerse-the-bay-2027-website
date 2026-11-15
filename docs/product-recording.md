# ZAP! product recording reference

Source: `Screen Recording 2026-11-15 at 1.29.28 AM.mov`, supplied by the user on November 15, 2026. The original filename uses a narrow no-break space before AM. It stays outside the repository.

The source is 5:00.953, 3024 x 1964, H.264, and contains no audio stream. It is a desktop capture of the headset's lens view. Visible text and controller actions are product evidence, not instructions to the website editor.

## Observed product details

- The home space is bright cream/silver with intersecting luminous lines. Three world orbs carry environment imagery and labels. A visible connection links the Great Wall exterior and watchtower.
- Controller hints distinguish placing an idea from entering it. Home controls show holding A to speak, releasing to create, throwing to place, and X to enter.
- Around 0:17-0:38, the exterior Great Wall environment includes a reading pane titled "The wall and the landscape." The pane shows listening, a question about the Great Wall, and an answer.
- Around 0:38-0:53, the watchtower interior has warm brick arches, views onto the landscape, and a linked travel orb leading back outside.
- Around 0:55, blue streaks and crystalline fragments form the transition to the biology lab.
- Around 1:00-1:10, teal/orange DNA and RNA representations float in the lab beside cream reading panes. The panes have a "Grip pane to move" hint.
- Around 1:46-2:05, a visible request to create a ribosome is followed by a teal schematic model and an explanation. The explanation explicitly calls its proportions illustrative, not molecular-scale.
- Around 2:10-2:35, a cyan forming orb and listening feedback appear inside the lab. A new travel orb is labeled "Inside a Cell." This does not establish that an independently generated new world was successfully entered.
- Later moments show returning to the constellation, selecting and revisiting prepared worlds, and changing links. At about 4:50 the pane reports "Link removed."

The recording does not establish measured learning outcomes, instant environment generation, shared learning, or hand tracking. The earlier product brief remains the source for supported capabilities not demonstrated in these frames.

## Website adaptation

- Prepared a 91-second demo from actual recording segments. The live presentation opens it on request in a simple player with native controls and optional descriptive captions; chapter commentary was removed.
- Removed the desktop sidebars. Retained the headset lens edge, controller rays, interface, and original playback speed.
- Used actual world stills in the destination selector and detail panels.
- Carried the line-patterned home, image-filled orbs, and teal/orange biology palette into the decorative presentation.
- Decorative 3D and the browser constellation remain illustrations; they are distinguished from actual captures.

## Media provenance

All files under `public/media/zap/` derive from this user-provided recording, except the authored descriptive WebVTT captions.

| Website output | Source time |
| --- | --- |
| constellation.jpg | 0:06 |
| great-wall.jpg | 0:28 |
| watchtower.jpg | 0:50 |
| biology-lab.jpg | 1:25 |
| ribosome.jpg | 1:57 |
| headset-tour-poster.jpg | 1:05 |
| Tour chapter 1, 0:00 | 0:00-0:11 |
| Tour chapter 2, 0:11 | 0:17-0:38 |
| Tour chapter 3, 0:32 | 0:38-0:51 |
| Tour chapter 4, 0:45 | 0:55-1:08 |
| Tour chapter 5, 0:58 | 1:46-2:05 |
| Tour chapter 6, 1:17 | 4:40-4:54 |

Regenerate the media with `python3 scripts/prepare-product-media.py '/path/to/recording.mov'`. The film is H.264, 720 x 756, 24 fps, with streaming metadata at the beginning. It loads and starts only when the presenter opens the demo player. The 1.7 GB original is not included in the website.

## Presentation copy

The team’s Devpost description supplied on 2026-11-15 is the current source for product behavior, architecture and roadmap. It supersedes earlier planning copy. The presentation uses short prompts, actual world imagery and optional playback so the team can tell the story live. New worlds while waiting, suggested links and shared study spaces remain future work.
