"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, CirclePlay, Layers3, Link2, Menu, Pause, Play, RotateCcw, X } from "lucide-react";
import { HeadsetDemo } from "./HeadsetDemo";
import { useSectionScroll } from "@/components/sections/SmoothScroll";
import { destinations, rituals } from "./content";
import type { UniverseProps } from "./UniverseCanvas";
import "./experience.css";

const UniverseCanvas = dynamic(() => import("./UniverseCanvas"), { ssr: false });

function Visual({ description, ...props }: UniverseProps & { description: string }) {
  const [ready, setReady] = useState(false);
  const fallbackWorlds = props.variant === "world" ? [props.world ?? 0, ((props.world ?? 0) + 1) % 3, ((props.world ?? 0) + 2) % 3] : [0, 1, 2];
  return <div className={`zap-visual zap-visual-${props.variant}`} data-ready={ready} data-spread={props.spread} role="img" aria-label={description}>
    <div className="zap-marble-fallback" aria-hidden="true">{fallbackWorlds.map(index => <span key={index} data-world={index} style={{ backgroundImage: `url(${destinations[index].image})` }} />)}</div>
    <UniverseCanvas {...props} onReady={setReady} />
  </div>;
}

export function ZapExperience() {
  const scrollToSection = useSectionScroll();
  const [menuOpen, setMenuOpen] = useState(false);
  const [motionPaused, setMotionPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [step, setStep] = useState(0);
  const [world, setWorld] = useState(0);
  const [spread, setSpread] = useState(true);
  const [connected, setConnected] = useState(false);
  const [assembled, setAssembled] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const paused = motionPaused || reduced;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    const wide = window.matchMedia("(min-width: 901px)");
    const onWide = () => { if (wide.matches) setMenuOpen(false); };
    window.addEventListener("keydown", close);
    wide.addEventListener("change", onWide);
    return () => { window.removeEventListener("keydown", close); wide.removeEventListener("change", onWide); };
  }, [menuOpen]);

  useEffect(() => {
    if (demoOpen) { dialog.current?.showModal(); document.body.style.overflow = "hidden"; }
    else { dialog.current?.close(); document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [demoOpen]);

  function visit(index: number) { setWorld(index); scrollToSection("worlds", paused); }

  return <div className="zap-experience" data-paused={paused}>
    <a className="zap-skip" href="#main">Skip to content</a>
    <header className="zap-header">
      <Link href="/" className="zap-logo" aria-label="ZAP! home"><Image src="/art/zap-wordmark.png" alt="ZAP!" width={819} height={340} preload /></Link>
      <nav aria-label="Main navigation" className="zap-desktop-nav"><a href="#experience">The idea</a><a href="#worlds">The worlds</a><a href="#build">The making</a></nav>
      <div className="zap-header-actions"><button onClick={() => setDemoOpen(true)} className="zap-pill zap-header-cta">Headset demo <CirclePlay size={16} /></button><button className="zap-menu-toggle" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div>
      <nav id="mobile-navigation" className="zap-mobile-nav" aria-label="Mobile navigation" hidden={!menuOpen}>{[["experience", "The idea"], ["worlds", "The worlds"], ["build", "The making"]].map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight /></a>)}</nav>
    </header>

    <main id="main">
      <section id="opening" className="zap-slide zap-hero" aria-labelledby="hero-heading">
        <div className="zap-sky-grain" aria-hidden="true" />
        <Visual variant="hero" paused={paused} onSelectWorld={visit} description="Glass marbles float around the title, holding a miniature Great Wall, a watchtower and a DNA helix." />
        <div className="zap-hero-content">
          <p className="zap-eyebrow">Spatial knowledge for Meta Quest</p>
          <h1 id="hero-heading">Every idea.<br /><em>A world inside.</em></h1>
          <p className="zap-hero-description">Speak it. Hold it. Step inside.</p>
          <a href="#experience" className="zap-pill zap-primary">Meet ZAP! <ArrowUpRight size={18} /></a>
        </div>
        <div className="zap-hero-bottom"><span>Immerse the Bay</span><a href="#experience" className="zap-scroll"><ArrowDown size={15} /> Follow the thought</a><button onClick={() => setMotionPaused(!motionPaused)} disabled={reduced} aria-label={reduced ? "Motion reduced by system preference" : paused ? "Resume animations" : "Pause animations"} aria-pressed={paused}>{paused ? <Play size={13} /> : <Pause size={13} />} Motion {paused ? "off" : "on"}</button></div>
      </section>

      <section id="experience" className="zap-slide zap-space" aria-labelledby="intro-heading">
        <Visual variant="space" spread={spread} paused={paused} description={spread ? "Three world marbles spread into a spatial map, joined by golden connections." : "The same three world marbles line up in a narrow vertical list."} />
        <div className="zap-slide-heading"><span className="zap-eyebrow">01 / Beyond the sidebar</span><h2 id="intro-heading">Give your<br />ideas <em>space.</em></h2></div>
        <div className="zap-slide-dock"><div className="zap-segmented" role="group" aria-label="Compare a list with a spatial map"><button aria-pressed={!spread} onClick={() => setSpread(false)}>A list</button><button aria-pressed={spread} onClick={() => setSpread(true)}>A world</button></div><p>Thinking you can reach out and touch.</p></div>
      </section>

      <section id="ritual" className="zap-slide zap-ritual" aria-labelledby="ritual-heading">
        <Visual variant="ritual" step={step} paused={paused} description={rituals[step].visual} />
        <div className="zap-slide-heading"><span className="zap-eyebrow">02 / Voice to world</span><h2 id="ritual-heading" key={step}>{rituals[step].title}<br /><em>{rituals[step].accent}</em></h2><p className="zap-one-line" aria-live="polite">{rituals[step].caption}</p></div>
        <div className="zap-slide-dock"><div className="zap-step-tabs" role="group" aria-label="Show an interaction">{rituals.map((item, index) => <button key={item.short} onClick={() => setStep(index)} aria-pressed={step === index}><span>0{index + 1}</span>{item.short}<ArrowUpRight size={16} /></button>)}</div></div>
      </section>

      <section id="worlds" className="zap-slide zap-worlds" data-world={world} data-tone="dark" aria-labelledby="world-heading">
        <Visual variant="world" world={world} paused={paused} onSelectWorld={setWorld} description={`A large glass marble containing ${destinations[world].name}, with the other two worlds floating beside it. Drag a marble to turn its miniature world.`} />
        <div className="zap-world-heading"><span className="zap-eyebrow">03 / Three prepared worlds</span><h2 id="world-heading">Pick a <em>little universe.</em></h2></div>
        <div className="zap-world-caption" aria-live="polite"><span>0{world + 1} / 03</span><h3>{destinations[world].name}</h3><p>{destinations[world].caption}</p></div>
        <div className="zap-world-dock"><div className="zap-world-switcher"><button onClick={() => setWorld((world + 2) % 3)} aria-label="Previous world"><ArrowLeft size={18} /></button><div className="zap-world-dots" role="group" aria-label="Choose a world">{destinations.map((item, index) => <button key={item.name} aria-label={item.name} aria-pressed={world === index} onClick={() => setWorld(index)}><i /></button>)}</div><button onClick={() => setWorld((world + 1) % 3)} aria-label="Next world"><ArrowRight size={18} /></button></div><span className="zap-drag-hint">Drag a marble to turn it</span><button className="zap-text-button" onClick={() => setDemoOpen(true)}>See it in the headset <CirclePlay size={16} /></button></div>
      </section>

      <section id="play" className="zap-slide zap-connections-slide" aria-labelledby="play-heading">
        <Visual variant="connections" connected={connected} paused={paused} description={connected ? "Golden threads link the three world marbles, with sparks traveling between related ideas." : "Three separate world marbles wait to be connected."} />
        <div className="zap-slide-heading"><span className="zap-eyebrow">04 / A constellation of ideas</span><h2 id="play-heading">Make a<br /><em>connection.</em></h2></div>
        <div className="zap-slide-dock"><button className="zap-pill zap-primary" aria-pressed={connected} onClick={() => setConnected(!connected)}>{connected ? <><RotateCcw size={17} /> Start again</> : <><Link2 size={17} /> Link these ideas</>}</button><p aria-live="polite">3 ideas. {connected ? "3 connections." : "One possibility."}</p></div>
      </section>

      <section id="build" className="zap-slide zap-build" aria-labelledby="build-heading">
        <Visual variant="build" assembled={assembled} paused={paused} description={assembled ? "A complete glass marble holds a miniature world with solid geometry." : "The marble separates into two glass hemispheres, revealing the miniature world and its geometry inside."} />
        <div className="zap-slide-heading"><span className="zap-eyebrow">05 / The making</span><h2 id="build-heading">A world,<br /><em>assembled.</em></h2></div>
        <div className="zap-build-labels"><p><span>Worlds</span>World Labs</p><p><span>Voice + intelligence</span>Whisper + GPT-6 Luna</p><p><span>Built for Quest</span>Unity + C# + Figma</p></div>
        <div className="zap-slide-dock"><button className="zap-pill zap-outline" aria-pressed={assembled} onClick={() => setAssembled(!assembled)}><Layers3 size={17} />{assembled ? "Peek inside" : "Bring it together"}</button><p>Real geometry. Voice first.</p></div>
      </section>

      <section id="next" className="zap-slide zap-future" aria-labelledby="close-heading">
        <Visual variant="future" paused={paused} description="A growing constellation of miniature worlds and empty glass marbles suggests new worlds and shared spaces to come." />
        <div className="zap-future-heading"><span className="zap-eyebrow">06 / What comes next</span><h2 id="close-heading">More worlds.<br /><em>More minds.</em></h2></div>
        <div className="zap-future-labels"><span>Worlds on demand</span><span>Suggested links</span><span>Shared spaces</span></div>
        <footer className="zap-footer"><Link href="/" aria-label="ZAP! home"><Image src="/art/zap-wordmark.png" alt="ZAP!" width={819} height={340} /></Link><button className="zap-pill zap-primary" onClick={() => setDemoOpen(true)}>Step inside <CirclePlay size={18} /></button><span>Built with curiosity.</span></footer>
      </section>
    </main>

    <dialog data-lenis-prevent ref={dialog} className="zap-demo-dialog" onCancel={() => setDemoOpen(false)} onClose={() => setDemoOpen(false)} onClick={event => { if (event.target === event.currentTarget) setDemoOpen(false); }} aria-labelledby="demo-heading">
      <div className="zap-demo-bar"><h2 id="demo-heading">ZAP! in the headset</h2><button onClick={() => setDemoOpen(false)} aria-label="Close headset demo"><X size={22} /></button></div>
      {demoOpen && <HeadsetDemo />}
    </dialog>
  </div>;
}
