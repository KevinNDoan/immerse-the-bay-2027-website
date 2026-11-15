"""Prepare website media from the supplied ZAP! headset recording.

Usage: python3 scripts/prepare-product-media.py '/path/to/recording.mov'
Requires ffmpeg with libx264. Source recording is never modified.
"""

import argparse
import subprocess
import tempfile
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "public/media/zap"
# Edited tour: keep the original playback speed and cut the pauses between actions.
SEGMENTS = [(0, 11), (17, 38), (38, 51), (55, 68), (106, 125), (280, 294)]
STILLS = {"constellation": 6, "great-wall": 28, "watchtower": 50, "biology-lab": 85, "ribosome": 117}


def run(*args):
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *map(str, args)], check=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    options = parser.parse_args()
    source = options.source.resolve(strict=True)
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for name, timestamp in STILLS.items():
        run("-ss", timestamp, "-i", source, "-frames:v", 1,
            "-vf", "crop=1808:1808:606:100,scale=1000:1000",
            "-q:v", 3, "-map_metadata", -1, OUTPUT / f"{name}.jpg")
    run("-ss", 65, "-i", source, "-frames:v", 1,
        "-vf", "crop=1808:1896:606:66,scale=720:756", "-q:v", 2, "-map_metadata", -1, OUTPUT / "headset-tour-poster.jpg")
    with tempfile.TemporaryDirectory(prefix="zap-tour-") as temporary:
        temp = Path(temporary)

        def segment(item):
            index, (start, end) = item
            path = temp / f"part-{index}.mp4"
            run("-ss", start, "-i", source, "-t", end - start, "-an",
                "-vf", "crop=1808:1896:606:66,scale=720:756,fps=24",
                "-c:v", "libx264", "-preset", "fast", "-crf", 24, "-threads", 2,
                "-pix_fmt", "yuv420p", "-map_metadata", -1, path)
            return path

        with ThreadPoolExecutor(max_workers=2) as executor:
            parts = list(executor.map(segment, enumerate(SEGMENTS)))
        playlist = temp / "concat.txt"
        playlist.write_text("\n".join(f"file '{path}'" for path in parts))
        run("-f", "concat", "-safe", 0, "-i", playlist, "-c", "copy", "-an",
            "-movflags", "+faststart", "-map_metadata", -1, OUTPUT / "headset-tour.mp4")
    print(f"Created {sum(end - start for start, end in SEGMENTS)}-second tour and six stills in {OUTPUT}")


if __name__ == "__main__":
    main()
