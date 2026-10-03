#!/usr/bin/env python3
"""Generate favicon.ico from the Morph mark geometry.

Dependency-free (Python stdlib only): rasterizes the three mark shapes
(square-corner bar -> pill -> circle) with the brand gradient, then wraps
the PNGs into a multi-size .ico. Regenerate with:

    python brand/scripts/generate-favicon.py [output.ico]

The geometry mirrors brand/favicon.svg; keep the two in sync.
"""

import struct
import sys
import zlib

INDIGO = (0x4F, 0x46, 0xE5)
CYAN = (0x06, 0xB6, 0xD4)
GRAD_START = (5.0, 23.0)  # gradient axis in the 32-unit viewBox space
GRAD_END = (27.0, 9.0)

# Shapes in the 32-unit viewBox: (kind, x, y, w/h-or-r, ..., rx)
SHAPES = [
    ("rrect", (5.0, 9.0, 5.0, 14.0, 1.0)),      # x, y, w, h, rx
    ("rrect", (13.5, 9.0, 5.0, 14.0, 2.5)),
    ("circle", (25.0, 16.0, 4.0)),              # cx, cy, r
]


def inside_shape(kind, params, x, y):
    if kind == "rrect":
        rx0, ry0, rw, rh, rad = params
        if rx0 <= x <= rx0 + rw and ry0 <= y <= ry0 + rh:
            # distance to nearest corner-clamp centre
            cx = min(max(x, rx0 + rad), rx0 + rw - rad)
            cy = min(max(y, ry0 + rad), ry0 + rh - rad)
            return (x - cx) ** 2 + (y - cy) ** 2 <= rad * rad
        return False
    ccx, ccy, r = params
    return (x - ccx) ** 2 + (y - ccy) ** 2 <= r * r


def gradient_color(x, y):
    gx, gy = GRAD_END[0] - GRAD_START[0], GRAD_END[1] - GRAD_START[1]
    denom = gx * gx + gy * gy
    t = 0.0 if denom == 0 else ((x - GRAD_START[0]) * gx + (y - GRAD_START[1]) * gy) / denom
    t = max(0.0, min(1.0, t))
    return tuple(int(a + (b - a) * t) for a, b in zip(INDIGO, CYAN))


def render(size, supersample=4):
    scale = size / 32.0
    ss = supersample
    px = []
    for py in range(size):
        row = bytearray()
        for pxx in range(size):
            hit = 0
            r = g = b = 0
            for sy in range(ss):
                for sx in range(ss):
                    x = (pxx * ss + sx + 0.5) / (size * ss) * 32.0
                    y = (py * ss + sy + 0.5) / (size * ss) * 32.0
                    for kind, params in SHAPES:
                        if inside_shape(kind, params, x, y):
                            cr, cg, cb = gradient_color(x, y)
                            r += cr
                            g += cg
                            b += cb
                            hit += 1
                            break
            if hit:
                n = hit
                row += bytes((r // n, g // n, b // n, 255))
            else:
                row += bytes((0, 0, 0, 0))
        px.append(bytes(row))
    return px


def png_chunk(tag, data):
    return (
        struct.pack(">I", len(data))
        + tag
        + data
        + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
    )


def write_png(width, height, rows):
    raw = b"".join(b"\x00" + row for row in rows)
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    return (
        b"\x89PNG\r\n\x1a\n"
        + png_chunk(b"IHDR", ihdr)
        + png_chunk(b"IDAT", zlib.compress(raw, 9))
        + png_chunk(b"IEND", b"")
    )


def write_ico(images):
    # images: list of (size, png_bytes)
    count = len(images)
    out = struct.pack("<HHH", 0, 1, count)
    offset = 6 + 16 * count
    directory = b""
    blob = b""
    for size, data in images:
        w = 0 if size >= 256 else size
        h = 0 if size >= 256 else size
        directory += struct.pack("<BBBBHHII", w, h, 0, 0, 1, 32, len(data), offset)
        blob += data
        offset += len(data)
    return out + directory + blob


def main():
    out_path = sys.argv[1] if len(sys.argv) > 1 else "apps/studio/public/favicon.ico"
    images = []
    for size in (16, 32, 48):
        png = write_png(size, size, render(size))
        images.append((size, png))
    with open(out_path, "wb") as f:
        f.write(write_ico(images))
    print(f"wrote {out_path} (16x16, 32x32, 48x48)")


if __name__ == "__main__":
    main()
