from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
CHARACTERS = ROOT / "public" / "characters"
OUTPUT = ROOT / "exports" / "pierre-combinations.gif"

# A small tour through the live generator's real layer combinations.
COMBINATIONS = [
    ("01", "1", True),
    ("05", "4", False),
    ("08", "7", True),
    ("12", "9", False),
    ("18", "11", False),
    ("22", "13", False),
    ("26", "14", True),
    ("27", "15", False),
]


def layer(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA")


base = layer(CHARACTERS / "base-pierre-bingo.png")
mustache = layer(CHARACTERS / "faces" / "face-mustache-bingo.png")
frames: list[Image.Image] = []

for head_id, thing_id, has_mustache in COMBINATIONS:
    frame = base.copy()
    frame.alpha_composite(layer(CHARACTERS / "heads-pierre-v3" / f"head-{head_id}.png"))
    if has_mustache:
        frame.alpha_composite(mustache)
    frame.alpha_composite(layer(CHARACTERS / "things-pierre-v3" / f"thing-{thing_id}.png"))
    frames.append(frame.convert("RGB"))

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
frames[0].save(
    OUTPUT,
    save_all=True,
    append_images=frames[1:],
    duration=900,
    loop=0,
    disposal=2,
    optimize=False,
)

print(OUTPUT)
