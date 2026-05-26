import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const exec = promisify(execFile);
const root = process.cwd();
const publicDir = path.join(root, "public");
const workDir = path.join(root, ".asset-cache");
const sources = JSON.parse(await readFile(new URL("./sources.json", import.meta.url), "utf8"));
const manifestEntries = [];

for (const directory of ["models", "hdr", "plants", "textures", "particles", "audio", "environment", "draco", "assets"]) {
  await mkdir(path.join(publicDir, directory), { recursive: true });
}
await rm(workDir, { recursive: true, force: true });
await mkdir(workDir, { recursive: true });

async function download(url, target) {
  const response = await fetch(url, { headers: { "User-Agent": "EDEN-production-asset-pipeline/1.0" } });
  if (!response.ok) throw new Error(`Download failed ${response.status}: ${url}`);
  const data = Buffer.from(await response.arrayBuffer());
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, data);
  return data;
}

async function record(entry, output, sourceUrl, optimization) {
  const data = await readFile(output);
  manifestEntries.push({
    path: path.relative(root, output),
    title: entry.title,
    provider: entry.provider,
    author: entry.author,
    page: entry.page ?? (entry.assetId ? `https://polyhaven.com/a/${entry.assetId}` : undefined),
    license: sources.licenses[entry.license].name,
    licenseUrl: sources.licenses[entry.license].url,
    attribution: sources.licenses[entry.license].attribution,
    sourceUrl,
    optimization,
    bytes: data.byteLength,
    sha256: createHash("sha256").update(data).digest("hex")
  });
}

async function optimizeGlb(input, output) {
  await exec(path.join(root, "node_modules/.bin/gltf-transform"), [
    "optimize", input, output, "--compress", "draco", "--texture-compress", "webp", "--texture-size", "1024"
  ], { cwd: root, env: { ...process.env, SHARP_IGNORE_GLOBAL_LIBVIPS: "1" } });
}

async function downloadPolyHavenModel(entry) {
  const info = await (await fetch(`https://api.polyhaven.com/files/${entry.assetId}`)).json();
  const source = info.gltf["1k"].gltf.url;
  const modelDir = path.join(workDir, entry.assetId);
  const gltfPath = path.join(modelDir, path.basename(new URL(source).pathname));
  const gltfBuffer = await download(source, gltfPath);
  const gltf = JSON.parse(gltfBuffer.toString("utf8"));
  for (const uri of gltf.buffers.map((item) => item.uri)) {
    await download(new URL(uri, source).href, path.join(modelDir, uri));
  }
  for (const uri of gltf.images.map((item) => item.uri)) {
    const materialKey = path.basename(uri)
      .replace(`${entry.assetId}_`, "")
      .replace("_1k.jpg", "");
    const apiMap = info[materialKey] ? materialKey
      : materialKey === "diff" ? "Diffuse"
      : materialKey === "rough" ? "Rough"
      : materialKey === "alpha" ? "Alpha"
      : materialKey;
    const imageUrl = info[apiMap]?.["1k"]?.jpg?.url;
    if (!imageUrl) throw new Error(`No Poly Haven source map found for ${entry.assetId}/${uri}.`);
    await download(imageUrl, path.join(modelDir, uri));
  }
  return { input: gltfPath, source };
}

for (const entry of sources.models) {
  const output = path.join(publicDir, "models", entry.target);
  const source = entry.assetId
    ? await downloadPolyHavenModel(entry)
    : { input: path.join(workDir, entry.target), source: entry.download };
  if (!entry.assetId) await download(entry.download, source.input);
  await optimizeGlb(source.input, output);
  await record(entry, output, source.source, "Draco geometry compression; WebP textures capped at 1024px; optimized draw calls.");
}

const hdrInfo = await (await fetch(`https://api.polyhaven.com/files/${sources.hdri.assetId}`)).json();
const hdrUrl = hdrInfo.hdri[sources.hdri.resolution].hdr.url;
const hdrOutput = path.join(publicDir, "hdr", sources.hdri.target);
await download(hdrUrl, hdrOutput);
await record(sources.hdri, hdrOutput, hdrUrl, "1K HDR selected for low transfer and GPU footprint.");

for (const entry of sources.textures) {
  const info = await (await fetch(`https://api.polyhaven.com/files/${entry.assetId}`)).json();
  const maps = [
    ["color", info.Diffuse?.["1k"]?.jpg?.url],
    ["normal", info.nor_gl?.["1k"]?.jpg?.url],
    ["roughness", info.Rough?.["1k"]?.jpg?.url]
  ];
  for (const [mapName, sourceUrl] of maps) {
    if (!sourceUrl) continue;
    const raw = path.join(workDir, `${entry.target}-${mapName}.jpg`);
    const output = path.join(publicDir, "textures", `${entry.target}-${mapName}.webp`);
    await download(sourceUrl, raw);
    await exec("magick", [raw, "-resize", "1024x1024>", "-strip", "-quality", "78", output]);
    await record(entry, output, sourceUrl, `1K source transcoded to WebP (${mapName}).`);
  }
}

for (const entry of sources.photography) {
  const raw = path.join(workDir, entry.target);
  const output = path.join(publicDir, "plants", entry.target);
  await download(entry.download, raw);
  await exec("magick", [raw, "-auto-orient", "-resize", "1200x1500^", "-gravity", "center", "-extent", "1200x1500", "-strip", "-quality", "80", output]);
  await record(entry, output, entry.download, "Cropped to 1200x1500 and optimized JPEG quality 80.");
}

function wave(samples, sampleRate = 22050) {
  const buffer = Buffer.alloc(44 + samples.length * 2);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + samples.length * 2, 4);
  buffer.write("WAVEfmt ", 8);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(samples.length * 2, 40);
  samples.forEach((value, index) => buffer.writeInt16LE(Math.max(-32767, Math.min(32767, value * 32767)), 44 + index * 2));
  return buffer;
}

function noise(seconds, style) {
  const length = Math.floor(22050 * seconds);
  let state = 928371;
  return Array.from({ length }, (_, index) => {
    state = (state * 1664525 + 1013904223) >>> 0;
    const random = state / 4294967296 * 2 - 1;
    const t = index / 22050;
    if (style === "bloom") return Math.sin(t * 880 * Math.PI * 2) * Math.exp(-t * 4) * 0.12;
    if (style === "birds") return Math.sin(t * (1900 + Math.sin(t * 6) * 240) * Math.PI * 2) * (Math.sin(t * 1.8) > 0.94 ? 0.035 : 0);
    const swell = 0.35 + Math.sin(t * (style === "wind" ? 0.42 : 0.18)) * 0.2;
    return random * swell * (style === "leaves" ? 0.035 : 0.022);
  });
}

for (const [file, seconds, style] of [["forest-ambience", 8, "forest"], ["wind", 8, "wind"], ["leaves", 5, "leaves"], ["birds", 8, "birds"], ["bloom", 1.4, "bloom"]]) {
  const wav = path.join(workDir, `${file}.wav`);
  const output = path.join(publicDir, "audio", `${file}.m4a`);
  await writeFile(wav, wave(noise(seconds, style)));
  await exec("/usr/bin/afconvert", ["-f", "m4af", "-d", "aac", "-b", "64000", wav, output]);
  const entry = { title: `${file} ambient layer`, provider: "EDEN", author: "EDEN procedural generator", license: "project-owned" };
  const data = await readFile(output);
  manifestEntries.push({
    path: path.relative(root, output),
    title: entry.title,
    provider: entry.provider,
    author: entry.author,
    license: "Project-owned generated audio",
    sourceUrl: "scripts/assets/sync-assets.mjs",
    optimization: "Deterministic mono procedural master encoded as AAC/M4A at 64kbps.",
    bytes: data.byteLength,
    sha256: createHash("sha256").update(data).digest("hex")
  });
}

const pollen = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><defs><radialGradient id="p"><stop stop-color="#fff8d0"/><stop offset=".3" stop-color="#fde68a" stop-opacity=".9"/><stop offset="1" stop-color="#fbbf24" stop-opacity="0"/></radialGradient></defs><circle cx="16" cy="16" r="16" fill="url(#p)"/></svg>`;
const noiseOverlay = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="3"/></filter><rect width="100%" height="100%" filter="url(#n)" opacity=".36"/></svg>`;
await writeFile(path.join(publicDir, "particles", "pollen.svg"), pollen);
await writeFile(path.join(publicDir, "environment", "forest-noise.svg"), noiseOverlay);

const generated = [
  { path: "public/particles/pollen.svg", title: "Pollen particle sprite" },
  { path: "public/environment/forest-noise.svg", title: "Atmospheric grain overlay" }
];
for (const entry of generated) {
  const data = await readFile(path.join(root, entry.path));
  manifestEntries.push({ ...entry, provider: "EDEN", license: "Project-owned generated graphic", sourceUrl: "scripts/assets/sync-assets.mjs", bytes: data.byteLength, sha256: createHash("sha256").update(data).digest("hex") });
}

const decoderSource = path.join(root, "node_modules", "three", "examples", "jsm", "libs", "draco", "gltf");
for (const decoder of ["draco_decoder.js", "draco_decoder.wasm", "draco_wasm_wrapper.js"]) {
  const data = await readFile(path.join(decoderSource, decoder));
  const output = path.join(publicDir, "draco", decoder);
  await writeFile(output, data);
  manifestEntries.push({
    path: path.relative(root, output),
    title: `Draco runtime decoder: ${decoder}`,
    provider: "Three.js runtime dependency",
    license: "MIT",
    sourceUrl: `node_modules/three/examples/jsm/libs/draco/gltf/${decoder}`,
    optimization: "Local decoder served with Draco-compressed GLBs to avoid third-party runtime requests.",
    bytes: data.byteLength,
    sha256: createHash("sha256").update(data).digest("hex")
  });
}

const manifest = {
  generatedAt: new Date().toISOString(),
  policy: "Production assets are commercial-use compatible and retained with provenance below. CC-BY attribution must remain visible in project documentation.",
  attributions: [sources.licenses["polypizza-ccby"].attribution],
  assets: manifestEntries
};
await writeFile(path.join(publicDir, "assets", "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
await rm(workDir, { recursive: true, force: true });

const bytes = (await Promise.all(manifestEntries.map(async (entry) => (await stat(path.join(root, entry.path))).size))).reduce((a, b) => a + b, 0);
console.log(`EDEN assets synchronized: ${manifestEntries.length} files, ${(bytes / 1048576).toFixed(2)} MB production payload.`);
