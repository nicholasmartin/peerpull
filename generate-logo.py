"""
PeerPull Icon — Speech bubble + P, tight crop, transparent background, 1024x1024.
"""
from PIL import Image, ImageDraw, ImageFont
import os

FONTS_DIR = os.path.expanduser(
    r"~\.claude\plugins\cache\anthropic-agent-skills\example-skills\f23222824449\skills\canvas-design\canvas-fonts"
)
OUT_DIR = os.path.dirname(os.path.abspath(__file__))

GOLD = (212, 168, 83)
BG_COLOR = (13, 15, 22)

# Work at 2x for quality, then resize
S = 2048
img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# Bubble fills most of the canvas with small padding
pad = 120
bubble_x1 = pad
bubble_y1 = pad
bubble_x2 = S - pad
bubble_y2 = S - pad - 200  # leave room for tail
radius = 200

draw.rounded_rectangle([bubble_x1, bubble_y1, bubble_x2, bubble_y2], radius=radius, fill=GOLD)

# Triangle tail — bottom left
tail_x = bubble_x1 + 280
tail_y = bubble_y2
tail_points = [
    (tail_x, tail_y - 10),
    (tail_x - 160, tail_y + 190),
    (tail_x + 200, tail_y - 10),
]
draw.polygon(tail_points, fill=GOLD)

# Letter "P" centered in bubble
try:
    font_p = ImageFont.truetype(os.path.join(FONTS_DIR, "WorkSans-Bold.ttf"), 920)
except Exception:
    font_p = ImageFont.load_default()

bcx = (bubble_x1 + bubble_x2) / 2
bcy = (bubble_y1 + bubble_y2) / 2
bbox = draw.textbbox((0, 0), "P", font=font_p)
pw = bbox[2] - bbox[0]
ph = bbox[3] - bbox[1]
px = bcx - pw / 2 - bbox[0]
py = bcy - ph / 2 - bbox[1]
draw.text((px, py), "P", fill=BG_COLOR, font=font_p)

# Trim to content bounding box then resize to 1024
bbox = img.getbbox()
if bbox:
    cropped = img.crop(bbox)
else:
    cropped = img

# Resize to 1024x1024 (pad to square first)
w, h = cropped.size
max_dim = max(w, h)
square = Image.new("RGBA", (max_dim, max_dim), (0, 0, 0, 0))
square.paste(cropped, ((max_dim - w) // 2, (max_dim - h) // 2))
final = square.resize((1024, 1024), Image.LANCZOS)

out = os.path.join(OUT_DIR, "peerpull-icon-1024.png")
final.save(out, "PNG")
print(f"Saved: {out}")
