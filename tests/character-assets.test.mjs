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
  const heads = await readdir(new URL("heads-pierre-v3/", characterRoot));
  const things = await readdir(new URL("things-pierre-v3/", characterRoot));
  const assets = [
    new URL("base-pierre-bingo.png", characterRoot),
    new URL("faces/face-mustache-bingo.png", characterRoot),
    ...heads.map((name) => new URL(`heads-pierre-v3/${name}`, characterRoot)),
    ...things.map((name) => new URL(`things-pierre-v3/${name}`, characterRoot)),
  ];

  assert.equal(heads.length, 26);
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

test("the product surface includes the exact Pierre contract address", async () => {
  const source = await readFile(new URL("app/page.tsx", root), "utf8");
  assert.match(source, /9k5iJ5NAqeYagHVEha21vcWLzJPm4d2tnKGNeJq8pump/);
});
