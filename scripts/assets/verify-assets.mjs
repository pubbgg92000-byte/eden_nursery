import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { access, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const root = process.cwd();
const manifest = JSON.parse(await readFile(path.join(root, "public/assets/manifest.json"), "utf8"));
const exec = promisify(execFile);
const required = [
  "public/models/tree.glb", "public/models/flowers.glb", "public/models/vines.glb", "public/models/grass.glb",
  "public/models/rocks.glb", "public/models/roots.glb", "public/hdr/forest.hdr",
  "public/plants/monstera.jpg", "public/plants/fiddle-leaf.jpg", "public/plants/calathea.jpg",
  "public/plants/peace-lily.jpg", "public/plants/snake-plant.jpg", "public/particles/pollen.svg",
  "public/audio/forest-ambience.m4a", "public/environment/forest-noise.svg",
  "public/draco/draco_decoder.wasm"
];

for (const file of required) {
  await access(path.join(root, file));
  if ((await stat(path.join(root, file))).size === 0) throw new Error(`${file} is empty.`);
  if (!manifest.assets.some((asset) => asset.path === file)) throw new Error(`${file} is absent from asset manifest.`);
}

for (const asset of manifest.assets) {
  const data = await readFile(path.join(root, asset.path));
  const sha256 = createHash("sha256").update(data).digest("hex");
  if (asset.bytes !== data.byteLength || asset.sha256 !== sha256) throw new Error(`${asset.path} differs from its manifest record.`);
}

for (const model of ["tree.glb", "flowers.glb", "vines.glb", "grass.glb", "rocks.glb", "roots.glb"]) {
  await exec(path.join(root, "node_modules/.bin/gltf-transform"), ["inspect", path.join(root, "public/models", model)]);
}

const heroTreeBytes = (await stat(path.join(root, "public/models/tree.glb"))).size;
if (heroTreeBytes > 10 * 1024 * 1024) throw new Error("Hero tree exceeds the 10 MB production budget.");
if (!manifest.attributions.some((value) => value.includes("Vines by Poly by Google"))) throw new Error("CC-BY attribution is absent.");
console.log(`Verified ${manifest.assets.length} manifested assets and six GLBs; hero tree ${(heroTreeBytes / 1024).toFixed(1)} KB.`);
