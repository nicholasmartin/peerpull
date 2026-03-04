"""
PeerPull Logo — Speech bubble + P, minimal and clean.
"""
from PIL import Image, ImageDraw, ImageFont
import math
import os

FONTS_DIR = os.path.expanduser(
    r"~\.claude\plugins\cache\anthropic-agent-skills\example-skills\f23222824449\skills\canvas-design\canvas-fonts"
)
OUT_DIR = os.path.dirname(os.path.abspath(__file__))

# Colors
BG = (13, 15, 22)
GOLD = (212, 168, 83)
GOLD_LIGHT = (232, 199, 120)
WHITE = (240, 240, 242)
TRANSPARENT = (0, 0, 0, 0)


def make_logo(size=800, show_text=True):
    """Generate the logo at a given canvas size."""
    W, H = size, size
    img = Image.new("RGBA", (W, H), (*BG, 255))
    draw = ImageDraw.Draw(img)

    cx, cy_icon = W // 2, H // 2 - (60 if show_text else 0)

    # ── Speech bubble ──
    # Rounded rectangle body + small triangle tail at bottom-left
    bubble_w, bubble_h = 220, 180
    radius = 36
    bx1 = cx - bubble_w // 2
    by1 = cy_icon - bubble_h // 2
    bx2 = cx + bubble_w // 2
    by2 = cy_icon + bubble_h // 2

    # Draw rounded rect
    draw.rounded_rectangle([bx1, by1, bx2, by2], radius=radius, fill=GOLD)

    # Triangle tail — bottom left
    tail_x = bx1 + 38
    tail_y = by2
    tail_points = [
        (tail_x, tail_y - 2),
        (tail_x - 24, tail_y + 28),
        (tail_x + 30, tail_y - 2),
    ]
    draw.polygon(tail_points, fill=GOLD)

    # ── Letter "P" ──
    try:
        font_p = ImageFont.truetype(os.path.join(FONTS_DIR, "WorkSans-Bold.ttf"), 140)
    except Exception:
        font_p = ImageFont.load_default()

    p_text = "P"
    p_bbox = draw.textbbox((0, 0), p_text, font=font_p)
    p_w = p_bbox[2] - p_bbox[0]
    p_h = p_bbox[3] - p_bbox[1]
    p_x = cx - p_w // 2 - p_bbox[0]
    p_y = cy_icon - p_h // 2 - p_bbox[1] - 4  # slight nudge up for optical center
    draw.text((p_x, p_y), p_text, fill=BG, font=font_p)

    # ── Wordmark below ──
    if show_text:
        try:
            font_name = ImageFont.truetype(os.path.join(FONTS_DIR, "WorkSans-Bold.ttf"), 42)
            font_tag = ImageFont.truetype(os.path.join(FONTS_DIR, "WorkSans-Regular.ttf"), 16)
        except Exception:
            font_name = ImageFont.load_default()
            font_tag = ImageFont.load_default()

        # "PeerPull"
        name = "PeerPull"
        name_bbox = draw.textbbox((0, 0), name, font=font_name)
        name_w = name_bbox[2] - name_bbox[0]
        name_y = cy_icon + bubble_h // 2 + 56
        draw.text(((W - name_w) / 2 - name_bbox[0], name_y), name, fill=WHITE, font=font_name)

    return img


# ── Generate variants ──

# Full logo with wordmark (1200x1200)
logo = make_logo(1200, show_text=True)
logo_rgb = Image.new("RGB", logo.size, BG)
logo_rgb.paste(logo, mask=logo.split()[3])
logo_rgb.save(os.path.join(OUT_DIR, "peerpull-logo.png"), "PNG")
print("Saved peerpull-logo.png (1200x1200)")

# 512 web version
logo_512 = logo_rgb.resize((512, 512), Image.LANCZOS)
logo_512.save(os.path.join(OUT_DIR, "peerpull-logo-512.png"), "PNG")
print("Saved peerpull-logo-512.png")

# Icon only (no text)
icon = make_logo(600, show_text=False)
icon_rgb = Image.new("RGB", icon.size, BG)
icon_rgb.paste(icon, mask=icon.split()[3])
icon_256 = icon_rgb.resize((256, 256), Image.LANCZOS)
icon_256.save(os.path.join(OUT_DIR, "peerpull-icon-256.png"), "PNG")
print("Saved peerpull-icon-256.png")

# Transparent background icon (for overlays)
icon_t = make_logo(600, show_text=False)
# Make BG transparent
data = icon_t.getdata()
new_data = []
for item in data:
    if item[0] == BG[0] and item[1] == BG[1] and item[2] == BG[2]:
        new_data.append((0, 0, 0, 0))
    else:
        new_data.append(item)
icon_t.putdata(new_data)
icon_t_256 = icon_t.resize((256, 256), Image.LANCZOS)
icon_t_256.save(os.path.join(OUT_DIR, "peerpull-icon-transparent.png"), "PNG")
print("Saved peerpull-icon-transparent.png")
