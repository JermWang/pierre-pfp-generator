import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function pngSize(url) {
  const bytes = await readFile(url);
  assert.equal(bytes.toString("ascii", 1, 4), "PNG");
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

test("Pierre and every generator layer share the 500x500 canvas", async () => {
  const characterRoot = new URL("../public/characters/", import.meta.url);
  const heads = await readdir(new URL("heads-pierre/", characterRoot));
  const faces = await readdir(new URL("faces/", characterRoot));
  const things = await readdir(new URL("things-pierre/", characterRoot));
  const assets = [
    new URL("base-pierre-v4.png", characterRoot),
    ...heads.map((name) => new URL(`heads-pierre/${name}`, characterRoot)),
    ...faces.map((name) => new URL(`faces/${name}`, characterRoot)),
    ...things.map((name) => new URL(`things-pierre/${name}`, characterRoot)),
  ];

  assert.equal(heads.length, 26);
  assert.deepEqual(faces, ["face-mustache.png"]);
  assert.equal(things.length, 14);
  for (const asset of assets) {
    assert.deepEqual(await pngSize(asset), { width: 500, height: 500 }, asset.pathname);
  }
});

test("the product surface no longer references the retired monkey brand", async () => {
  const files = ["app/page.tsx", "app/layout.tsx", "README.md", "package.json"];
  for (const file of files) {
    const source = await readFile(new URL(file, root), "utf8");
    assert.doesNotMatch(source, /rondo|base-monkey|the monkey/i, file);
    assert.doesNotMatch(source, /wonky/i, file);
  }
});
