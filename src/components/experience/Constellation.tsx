"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ArrowUpRight, Plus, RotateCcw, X, Zap } from "lucide-react";

type Idea = { id: number; label: string; x: number; y: number; color: number };
const initial: Idea[] = [
  { id: 1, label: "The Great Wall", x: 24, y: 44, color: 0 },
  { id: 2, label: "Architecture", x: 53, y: 27, color: 1 },
  { id: 3, label: "Biology", x: 75, y: 63, color: 2 },
];
const placements = [[35, 75], [76, 23], [19, 76], [51, 57], [66, 83]];

export function Constellation() {
  const [ideas, setIdeas] = useState<Idea[]>(initial);
  const [links, setLinks] = useState<[number, number][]>([[1, 2]]);
  const [value, setValue] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState("Three thoughts. One connection. Where will you go?");
  const field = useRef<HTMLDivElement>(null);
  const nextId = useRef(4);
  const drag = useRef<{ id: number; x: number; y: number; moved: boolean } | null>(null);
  const full = ideas.length >= 8;

  function add(label: string) {
    const clean = label.trim().slice(0, 36);
    if (!clean || full) return;
    const position = placements[(nextId.current - 4) % placements.length];
    const idea = { id: nextId.current++, label: clean, x: position[0], y: position[1], color: ideas.length % 3 };
    setIdeas(current => [...current, idea]);
    setValue("");
    setStatus(`${clean} is in your constellation. Select two ideas to connect them.`);
  }
  function choose(id: number) {
    const current = ideas.find(idea => idea.id === id)!;
    if (selected === id) { setSelected(null); setStatus("Selection cleared. Choose any two ideas to connect them."); return; }
    if (selected === null) { setSelected(id); setStatus(`${current.label} selected. Choose another idea to make a connection.`); return; }
    const exists = links.some(([a, b]) => (a === id && b === selected) || (b === id && a === selected));
    if (!exists) setLinks(currentLinks => [...currentLinks, [selected, id]]);
    setStatus(exists ? "Those ideas are already connected. Try another pair." : `${ideas.find(idea => idea.id === selected)?.label} and ${current.label}: connected!`);
    setSelected(null);
  }
  function move(event: PointerEvent<HTMLButtonElement>) {
    if (!drag.current || drag.current.id !== Number(event.currentTarget.dataset.idea)) return;
    if (Math.hypot(event.clientX - drag.current.x, event.clientY - drag.current.y) > 5) drag.current.moved = true;
    if (!drag.current.moved || !field.current) return;
    const bounds = field.current.getBoundingClientRect();
    const id = drag.current.id;
    const x = Math.max(14, Math.min(86, (event.clientX - bounds.left) / bounds.width * 100));
    const y = Math.max(17, Math.min(82, (event.clientY - bounds.top) / bounds.height * 100));
    setIdeas(current => current.map(idea => idea.id === id ? { ...idea, x, y } : idea));
  }
  function keyboard(event: KeyboardEvent<HTMLButtonElement>, id: number) {
    const directions: Record<string, [number, number]> = { ArrowLeft: [-3, 0], ArrowRight: [3, 0], ArrowUp: [0, -3], ArrowDown: [0, 3] };
    if (event.key === "Escape") { setSelected(null); return; }
    const direction = directions[event.key];
    if (!direction) return;
    event.preventDefault();
    setIdeas(current => current.map(idea => idea.id === id ? { ...idea, x: Math.max(14, Math.min(86, idea.x + direction[0])), y: Math.max(17, Math.min(82, idea.y + direction[1])) } : idea));
  }

  return <div className="zap-playground">
    <div className="zap-playground-toolbar">
      <span><i /> Your little universe</span>
      <button type="button" onClick={() => { setIdeas(initial); setLinks([[1, 2]]); setSelected(null); setValue(""); nextId.current = 4; setStatus("A fresh start. Three thoughts, one connection."); }}><RotateCcw size={14} /> Start over</button>
    </div>
    <div ref={field} className="zap-idea-field" role="group" aria-label="Your constellation" aria-describedby="constellation-help">
      <svg className="zap-connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {links.map(([a, b]) => {
          const start = ideas.find(idea => idea.id === a);
          const end = ideas.find(idea => idea.id === b);
          return start && end ? <line key={`${a}-${b}`} x1={start.x} y1={start.y} x2={end.x} y2={end.y} vectorEffect="non-scaling-stroke" /> : null;
        })}
      </svg>
      {ideas.map(idea => <button
        type="button" key={idea.id} data-idea={idea.id} data-color={idea.color} aria-pressed={selected === idea.id}
        aria-label={`${idea.label}. Select to connect; use arrow keys to move.`}
        className="zap-idea" style={{ left: `${idea.x}%`, top: `${idea.y}%` }}
        onPointerDown={event => { if (event.button !== 0) return; event.currentTarget.setPointerCapture(event.pointerId); drag.current = { id: idea.id, x: event.clientX, y: event.clientY, moved: false }; }}
        onPointerMove={move}
        onPointerUp={event => { if (!drag.current) return; if (!drag.current.moved) choose(idea.id); drag.current = null; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
        onPointerCancel={() => { drag.current = null; }}
        onClick={event => { if (event.detail === 0) choose(idea.id); }}
        onKeyDown={event => keyboard(event, idea.id)}
      ><span className="zap-idea-glass"><Zap size={24} strokeWidth={1.1} /></span><span className="zap-idea-name">{idea.label}</span></button>)}
      <span className="zap-field-coordinate" aria-hidden="true">A space shaped by you.</span>
      <span className="zap-field-count">{ideas.length.toString().padStart(2, "0")} ideas / {links.length.toString().padStart(2, "0")} connections</span>
    </div>
    <div className="zap-creation">
      <form onSubmit={event => { event.preventDefault(); add(value); }}>
        <Plus size={20} aria-hidden="true" />
        <label htmlFor="new-idea" className="sr-only">What are you curious about?</label>
        <input id="new-idea" value={value} onChange={event => setValue(event.target.value)} maxLength={36} placeholder={full ? "Your universe is full. Remove an idea or start over." : "What are you curious about?"} disabled={full} autoComplete="off" />
        <button type="submit" disabled={!value.trim() || full} aria-label="Create your idea"><ArrowUpRight size={22} /></button>
      </form>
      <div className="zap-playground-bottom">
        <p id="constellation-help">Drag to arrange. Select two ideas to connect. <span className="sr-only">Use Tab to focus ideas, arrow keys to move, and Enter or Space to select.</span></p>
        {selected !== null && <button type="button" className="zap-remove" onClick={() => { setIdeas(current => current.filter(idea => idea.id !== selected)); setLinks(current => current.filter(link => !link.includes(selected))); setSelected(null); setStatus("Idea removed. There is room for a new thought."); }}><X size={13} /> Remove selected</button>}
      </div>
      <p className="zap-playground-status" role="status">{status}</p>
    </div>
  </div>;
}
