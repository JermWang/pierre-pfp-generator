"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import NextImage from "next/image";

const heads = [
  "01","02","03","04","05","06","07","08","09","10","11","12","13",
  "14","15","16","17","18","19","20","21","22","23","24","26","27",
];
const things = ["1","2","4","5","6","7","8","9","10","11","12","13","14","15"];
const colors = ["#232323", "#f6ead2", "#e8903d"];
const baseCharacter = "/characters/base-pierre-original.png";
const contractAddress = "9k5iJ5NAqeYagHVEha21vcWLzJPm4d2tnKGNeJq8pump";

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tab, setTab] = useState<"head" | "thing" | "text">("head");
  const [head, setHead] = useState<string | null>(null);
  const [thing, setThing] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [ink, setInk] = useState("#000000");
  const [copied, setCopied] = useState(false);
  const [contractCopied, setContractCopied] = useState(false);

  const render = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 500, 500);
    const base = await loadImage(baseCharacter);
    ctx.drawImage(base, 0, 0, 500, 500);
    if (head) ctx.drawImage(await loadImage(`/characters/heads-pierre-v3/head-${head}.png`), 0, 0, 500, 500);
    if (thing) ctx.drawImage(await loadImage(`/characters/things-pierre-v3/thing-${thing}.png`), 0, 0, 500, 500);
    if (caption.trim()) {
      ctx.font = "40px 'Courier New', Courier, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = ink;
      ctx.fillText(caption.trim().slice(0, 28), 250, 20, 455);
    }
  }, [head, thing, caption, ink]);

  useEffect(() => { void render(); }, [render]);

  const download = () => {
    const a = document.createElement("a");
    a.download = "pierre-pfp.png";
    a.href = canvasRef.current?.toDataURL("image/png") ?? "";
    a.click();
  };

  const copy = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !navigator.clipboard || typeof ClipboardItem === "undefined") return;
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) return;
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  const copyContract = async () => {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(contractAddress);
    setContractCopied(true);
    window.setTimeout(() => setContractCopied(false), 1400);
  };

  const reset = () => { setHead(null); setThing(null); setCaption(""); };
  const shuffle = () => {
    setHead(heads[Math.floor(Math.random() * heads.length)]);
    setThing(things[Math.floor(Math.random() * things.length)]);
  };

  return (
    <main className="site-shell" id="top">
      <section className="brand-panel" aria-label="Pierre">
        <div className="brand-copy">
          <div className="brand-lockup">
            <small>LE PFP ATELIER</small>
            <h1>pierre&nbsp; <span>the</span>&nbsp; penguin</h1>
          </div>
          <div className="swatches" aria-hidden="true">
            {colors.map((color) => <i key={color} style={{ background: color }} />)}
          </div>
        </div>
        <p className="kicker">EST. SOMEWHERE COLD</p>
      </section>

      <section className="generator">
        <header className="generator-head">
          <div>
            <p className="eyebrow">YOUR TINY PORTRAIT STUDIO</p>
            <h2>Make Pierre <em>yours.</em></h2>
          </div>
          <p className="intro-copy">Pick a look, hand him a prop, add a line.<br />The mustache stays. Naturally.</p>
        </header>

        <button className="contract-strip" onClick={() => void copyContract()} aria-label="Copy Pierre contract address">
          <span>CONTRACT ADDRESS / SOLANA</span>
          <code>{contractAddress}</code>
          <b>{contractCopied ? "COPIED!" : "COPY CA ↗"}</b>
        </button>

        <div className="workspace">
          <div className="preview-wrap">
            <span className="preview-label">LIVE FROM THE ICE</span>
            <canvas ref={canvasRef} width={500} height={500} aria-label="Your Pierre profile picture preview" />
            <span className="corner tl">+</span><span className="corner tr">+</span>
            <span className="corner bl">+</span><span className="corner br">+</span>
          </div>
          <div className="actions">
            <button className="primary" onClick={download}>Save Pierre ↓</button>
            <button onClick={() => void copy()}>{copied ? "Copied!" : "Copy PNG"}</button>
            <button onClick={reset}>Start over</button>
          </div>
        </div>

        <div className="customizer">
          <div className="customizer-heading">
            <span>01 / THE WARDROBE</span>
            <p>Dress the gentleman.</p>
          </div>
          <nav aria-label="Customizer categories">
            <button className={tab === "head" ? "active" : ""} onClick={() => setTab("head")}>Head</button>
            <button className={tab === "thing" ? "active" : ""} onClick={() => setTab("thing")}>Prop</button>
            <button className={tab === "text" ? "active" : ""} onClick={() => setTab("text")}>Text</button>
            <button className="shuffle" onClick={shuffle}>↻ Shuffle</button>
          </nav>
          {tab === "head" && (
            <div className="asset-grid">
              {heads.map((id) => (
                <button key={id} className={head === id ? "selected" : ""} onClick={() => setHead(head === id ? null : id)} aria-label={`Pierre head style ${id}`}>
                  <span className="trait-preview">
                    <NextImage src={baseCharacter} alt="" fill sizes="140px" unoptimized />
                    <NextImage src={`/characters/heads-pierre-v3/head-${id}.png`} alt="" fill sizes="140px" unoptimized />
                  </span>
                </button>
              ))}
            </div>
          )}
          {tab === "thing" && (
            <div className="asset-grid">
              {things.map((id) => (
                <button key={id} className={thing === id ? "selected" : ""} onClick={() => setThing(thing === id ? null : id)} aria-label={`Pierre prop ${id}`}>
                  <span className="trait-preview">
                    <NextImage src={baseCharacter} alt="" fill sizes="140px" unoptimized />
                    <NextImage src={`/characters/things-pierre-v3/thing-${id}.png`} alt="" fill sizes="140px" unoptimized />
                  </span>
                </button>
              ))}
            </div>
          )}
          {tab === "text" && (
            <div className="text-tools">
              <label>Say something<input value={caption} onChange={(e) => setCaption(e.target.value)} maxLength={28} placeholder="BONJOUR!" /></label>
              <label className="color-picker">
                Text color
                <span>
                  <input type="color" value={ink} onChange={(e) => setInk(e.target.value)} aria-label="Choose any text color" />
                  <code>{ink}</code>
                </span>
              </label>
            </div>
          )}
        </div>
      </section>

      <aside className="rail">
        <div className="rail-intro">
          <span>THE BIRD</span>
          <p>Small bird.<br /><i>Big</i> wardrobe.</p>
        </div>
        <div className="rail-cards">
          <div className="rail-card">
            <i className="rail-icon"><NextImage src={baseCharacter} alt="" fill sizes="76px" unoptimized /><NextImage src="/characters/heads-pierre-v3/head-01.png" alt="" fill sizes="76px" unoptimized /></i>
            <span>Made<br />by hand</span>
          </div>
          <div className="rail-card">
            <i className="rail-icon"><NextImage src={baseCharacter} alt="" fill sizes="76px" unoptimized /><NextImage src="/characters/heads-pierre-v3/head-05.png" alt="" fill sizes="76px" unoptimized /></i>
            <span>Dressed<br />for anything</span>
          </div>
          <div className="rail-card">
            <i className="rail-icon"><NextImage src={baseCharacter} alt="" fill sizes="76px" unoptimized /><NextImage src="/characters/heads-pierre-v3/head-12.png" alt="" fill sizes="76px" unoptimized /></i>
            <span>Ready<br />to export</span>
          </div>
        </div>
        <div className="pierre-note">
          <span>PIERRE&apos;S NOTE</span>
          <p>“A little crooked. Impeccably dressed.”</p>
        </div>
      </aside>
    </main>
  );
}
