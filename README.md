# Pierre the Penguin

A hand-drawn PFP generator for Pierre the Penguin, complete with his tiny pencil
mustache. Mix head styles and props, add a caption, then copy or download the
finished 500x500 PNG.

Pierre deliberately keeps the original character canvas, pose, and attachment
points so every layered generator asset remains aligned.

## Run locally

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks

```bash
npm run lint
npm run build
```

## Character asset contract

- Base: `public/characters/base-pierre.png` (500x500)
- Head layers: `public/characters/heads/` (500x500 transparent PNGs)
- Prop layers: `public/characters/things/` (500x500 transparent PNGs)
- Layer order: Pierre base -> head -> prop -> caption

Keep future layers on the same 500x500 canvas without moving Pierre's crown,
face, hands, or feet.
