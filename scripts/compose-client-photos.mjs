#!/usr/bin/env node
/**
 * scripts/compose-client-photos.mjs — builds the site images that use the client's
 * own pictures (`node scripts/compose-client-photos.mjs`).
 *
 * Sources (the originals, untouched, in assets/client-photos/):
 *   fiber-laser-ra-auto.png       the client's laser machine photo ("pic 1"): white
 *                                 studio background, RA Auto Engineering Works on the body
 *   delhi-exhibition-robot.png    the welding robot from the client's Delhi exhibition file
 *
 * Both are low-resolution brochure crops, so each machine is cut out of its
 * background (flood fill from the edges for the laser; colour separation for the
 * robot, whose background is a blue brochure design) and set on the site's dark
 * teal scene instead of being stretched edge to edge. Outputs:
 *   public/photos/hero-home.webp, hero-fiber.webp, hero-welding.webp   (1920×1080)
 *   public/categories/fiber-laser-cutting-machines{,-1200}.webp        (1200×800, alpha)
 *   public/categories/robotic-welding-systems{,-1200}.webp             (1200×800, alpha)
 *
 * scripts/generate-photos.mjs and generate-placeholders.mjs no longer produce
 * these keys, so regenerating the drawn art can never overwrite them. When better
 * (higher-resolution) pictures arrive, replace the two files in assets/client-photos/
 * and re-run this script.
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "assets", "client-photos");
const PHOTOS = join(ROOT, "public", "photos");
const CATS = join(ROOT, "public", "categories");

/** Largest connected component of `fg`, as a soft alpha plane. */
function largestComponent(fg, W, H) {
  const lab = new Int32Array(W * H);
  let best = 0, bestN = 0, id = 0;
  for (let s = 0; s < W * H; s++) {
    if (!fg[s] || lab[s]) continue;
    id++;
    let n = 0;
    const st = [s];
    lab[s] = id;
    while (st.length) {
      const i = st.pop();
      n++;
      const x = i % W, y = (i / W) | 0;
      for (const j of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, y > 0 ? i - W : -1, y < H - 1 ? i + W : -1]) {
        if (j >= 0 && fg[j] && !lab[j]) { lab[j] = id; st.push(j); }
      }
    }
    if (n > bestN) { bestN = n; best = id; }
  }
  const a = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) a[i] = lab[i] === best ? 255 : 0;
  return a;
}

async function toCutout(rgb, W, H, alphaPlane, { clear = [] } = {}) {
  const mask = await sharp(Buffer.from(alphaPlane), { raw: { width: W, height: H, channels: 1 } })
    .blur(0.8).extractChannel(0).raw().toBuffer();
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (let i = 0; i < W * H; i++) {
    if (mask[i] > 128) {
      const x = i % W, y = (i / W) | 0;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
  }
  const w = x1 - x0 + 1, h = y1 - y0 + 1;
  const rgba = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const si = (y + y0) * W + (x + x0), di = y * w + x;
      let a = mask[si];
      for (const [cx, cy] of clear) if (x >= cx && y >= cy) a = 0;
      rgba[di * 4] = rgb[si * 3]; rgba[di * 4 + 1] = rgb[si * 3 + 1]; rgba[di * 4 + 2] = rgb[si * 3 + 2]; rgba[di * 4 + 3] = a;
    }
  }
  return { buf: await sharp(rgba, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer(), w, h };
}

/** Flood fill "background" (near-white) pixels in from the image border. */
function floodBackground(data, W, H, T) {
  const bg = new Uint8Array(W * H);
  const q = [];
  const isBg = (i) => data[i * 3] >= T && data[i * 3 + 1] >= T && data[i * 3 + 2] >= T;
  const push = (x, y) => { const i = y * W + x; if (!bg[i] && isBg(i)) { bg[i] = 1; q.push(i); } };
  for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
  for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
  while (q.length) {
    const i = q.pop(), x = i % W, y = (i / W) | 0;
    if (x > 0) push(x - 1, y); if (x < W - 1) push(x + 1, y); if (y > 0) push(x, y - 1); if (y < H - 1) push(x, y + 1);
  }
  return bg;
}

/** The laser photo: remove the pure-white studio background by flood fill. */
async function laserCutout() {
  const { data, info } = await sharp(join(SRC, "fiber-laser-ra-auto.png")).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  // Pass 1 (236): keeps the machine's pale roof and panels whole.
  const bg = floodBackground(data, W, H, 236);
  // Pass 2 (224), lower band only: also drops the soft floor reflection around the
  // wheels. Up there the machine is outlined by its blue base stripe, so the stricter
  // threshold cannot leak into the body (it does on the roof, hence the band).
  const bgLow = floodBackground(data, W, H, 224);
  const fg = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) {
    const y = (i / W) | 0;
    fg[i] = bg[i] || (y >= 395 && bgLow[i]) ? 0 : 1;
  }
  // The photo's own caption ("Fiber Laser 1000W") touches the machine's front wheel;
  // its first letters survive the cut, so clear that corner of the cutout.
  return toCutout(data, W, H, largestComponent(fg, W, H), { clear: [[562, 408]] });
}

/** The robot: drop the white/lilac panels and the blue brochure lines by colour. */
async function robotCutout() {
  const { data, info } = await sharp(join(SRC, "delhi-exhibition-robot.png")).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const fg = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
    const min = Math.min(r, g, b), max = Math.max(r, g, b);
    const pale = (min >= 200 && max - min < 40) || (min >= 125 && max - min < 26); // panels, and the photo's grey drop shadow
    const blue = b - r > 28 && b > g;
    fg[i] = pale || blue ? 0 : 1;
  }
  const comp = largestComponent(fg, W, H);
  // close pin-holes, then pull the edge in a touch so no pale halo is left
  const closed = await sharp(Buffer.from(comp), { raw: { width: W, height: H, channels: 1 } })
    .blur(2.5).threshold(40).blur(1.2).threshold(150).extractChannel(0).raw().toBuffer();
  return toCutout(data, W, H, closed);
}

/** Dark teal studio scene, with a soft glow behind the subject. */
function sceneSvg(w, h, glowX, floorY) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05161a"/><stop offset=".55" stop-color="#0c2a29"/><stop offset="1" stop-color="#08201f"/></linearGradient>
    <radialGradient id="glow" cx="${glowX}" cy=".52" r=".55"><stop offset="0" stop-color="#2dd4bf" stop-opacity=".30"/><stop offset=".6" stop-color="#2dd4bf" stop-opacity=".07"/><stop offset="1" stop-color="#2dd4bf" stop-opacity="0"/></radialGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a4a45" stop-opacity="0"/><stop offset=".22" stop-color="#1a4a45" stop-opacity=".5"/><stop offset="1" stop-color="#0a2220" stop-opacity="0"/></linearGradient>
    <radialGradient id="vig" cx=".5" cy=".5" r=".78"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  <rect y="${floorY - 40}" width="${w}" height="${h - floorY + 40}" fill="url(#floor)"/>
  <rect width="${w}" height="${h}" fill="url(#vig)"/>
</svg>`);
}

function shadowSvg(w, h, cx, cy, rx, ry, opacity = 0.5) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><filter id="b" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="${Math.round(ry * 0.55)}"/></filter></defs><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#000" fill-opacity="${opacity}" filter="url(#b)"/></svg>`);
}

/** Fit `cut` to targetH (or targetW), returning the resized buffer + size. */
async function fit(cut, { w, h }) {
  const scale = Math.min(w ? w / cut.w : Infinity, h ? h / cut.h : Infinity);
  const rw = Math.round(cut.w * scale), rh = Math.round(cut.h * scale);
  return { buf: await sharp(cut.buf).resize(rw, rh, { kernel: "lanczos3" }).png().toBuffer(), w: rw, h: rh };
}

async function hero(name, cut, { cx, bottom, width, height, glow = 0.6 }) {
  const W = 1920, H = 1080;
  const m = await fit(cut, { w: width, h: height });
  const left = Math.round(cx - m.w / 2), top = Math.round(bottom - m.h);
  const out = await sharp(sceneSvg(W, H, glow, bottom))
    .composite([
      { input: shadowSvg(W, H, cx, bottom - 6, m.w * 0.5, 26, 0.55), left: 0, top: 0 },
      { input: m.buf, left, top },
    ])
    .webp({ quality: 82 }).toFile(join(PHOTOS, `${name}.webp`));
  console.log(`  ${name}.webp  ${(out.size / 1024).toFixed(0)} KB`);
}

async function card(slug, cut, { width, height }) {
  const W = 1200, H = 800;
  const m = await fit(cut, { w: width, h: height });
  const left = Math.round((W - m.w) / 2), bottom = 700, top = bottom - m.h;
  const buf = await sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([
      { input: shadowSvg(W, H, W / 2, bottom - 4, m.w * 0.48, 22, 0.45), left: 0, top: 0 },
      { input: m.buf, left, top },
    ])
    .webp({ quality: 88, alphaQuality: 95 }).toBuffer();
  await sharp(buf).toFile(join(CATS, `${slug}.webp`));
  await sharp(buf).toFile(join(CATS, `${slug}-1200.webp`));
  console.log(`  ${slug}.webp  ${(buf.length / 1024).toFixed(0)} KB`);
}

const laser = await laserCutout();
const robot = await robotCutout();
console.log(`laser cutout ${laser.w}×${laser.h}, robot cutout ${robot.w}×${robot.h}`);

await hero("hero-home", laser, { cx: 1230, bottom: 905, width: 1060, glow: 0.64 });
await hero("hero-fiber", laser, { cx: 1250, bottom: 880, width: 1000, glow: 0.65 });
await hero("hero-welding", robot, { cx: 1290, bottom: 930, height: 720, glow: 0.67 });
await card("fiber-laser-cutting-machines", laser, { width: 1040, height: 560 });
await card("robotic-welding-systems", robot, { width: 640, height: 600 });
