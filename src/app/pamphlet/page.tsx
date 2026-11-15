// The leave-behind judges reach by scanning the QR code at our table. Static, readable with no JavaScript,
// and printable on two US Letter pages (see pamphlet.css). All copy comes from src/content/pitch.ts.
import type { Metadata } from "next";
import Image from "next/image";
import { builtOn, close, pamphlet, product, questions, steps, whyXr, worlds } from "@/content/pitch";
import { qrSvg } from "@/lib/qr";
import { PAMPHLET_PDF_PATH, PAMPHLET_URL } from "@/lib/site";
import "./pamphlet.css";

export const metadata: Metadata = {
  title: `${product.name} pamphlet`,
  description: pamphlet.intro,
  alternates: { canonical: "/pamphlet" },
};

function DownloadButton() {
  return (
    <a className="pamphlet-download" href={PAMPHLET_PDF_PATH} download>
      <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4v11" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 20h14" />
      </svg>
      {close.pdfLabel}
    </a>
  );
}

export default async function PamphletPage() {
  // Ink on Paper so every phone camera reads it, on screen and in print.
  const qr = await qrSvg(PAMPHLET_URL, { dark: "#0b0814", light: "#f2f0f7", margin: 2 });

  return (
    <main className="pamphlet">
      <header className="pamphlet-hero">
        <h1>
          <Image
            className="pamphlet-wordmark"
            src="/art/wordmark.png"
            alt={product.name}
            width={1600}
            height={600}
            sizes="(max-width: 640px) 60vw, 320px"
            preload
          />
        </h1>
        <p className="pamphlet-headline">{product.headline}</p>
        <p className="pamphlet-intro">{pamphlet.intro}</p>
        <DownloadButton />
      </header>

      <section className="pamphlet-section" aria-labelledby="how">
        <h2 id="how">{pamphlet.howTitle}</h2>
        <ol className="pamphlet-grid pamphlet-grid-2">
          {steps.map((step) => (
            <li key={step.title} className="pamphlet-item">
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="pamphlet-section" aria-labelledby="why">
        <h2 id="why">{pamphlet.whyTitle}</h2>
        <ul className="pamphlet-grid pamphlet-grid-3">
          {whyXr.claims.map((claim) => (
            <li key={claim.title} className="pamphlet-item">
              <h3>{claim.title}</h3>
              <p>{claim.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="pamphlet-section" aria-labelledby="worlds">
        <h2 id="worlds">{worlds.title}</h2>
        <p className="pamphlet-lede">{worlds.text}</p>
        <ul className="pamphlet-grid pamphlet-grid-3">
          {worlds.points.map((point) => (
            <li key={point.title} className="pamphlet-item">
              <h3>{point.title}</h3>
              <p>{point.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="pamphlet-section pamphlet-questions" aria-labelledby="questions">
        <h2 id="questions">{pamphlet.questionsTitle}</h2>
        <dl className="pamphlet-qa" style={{ "--qa-rows": Math.ceil(questions.length / 2) } as React.CSSProperties}>
          {questions.map((item) => (
            <div key={item.q} className="pamphlet-qa-item">
              <dt>{item.q}</dt>
              <dd>{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="pamphlet-section pamphlet-closing">
        <section aria-labelledby="built-on">
          <h2 id="built-on">{builtOn.title}</h2>
          <ul className="pamphlet-tech">
            {builtOn.items.map((item) => (
              <li key={item.name}>
                <strong>{item.name}</strong>
                <span>{item.role}</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="track">
          <h2 id="track">Track fit</h2>
          <p>{builtOn.trackFit}</p>
          <figure className="pamphlet-qr">
            {/* Server-made SVG markup from our own qrcode helper, not user input. */}
            <div className="pamphlet-qr-code" role="img" aria-label={`QR code for ${PAMPHLET_URL}`} dangerouslySetInnerHTML={{ __html: qr }} />
            <figcaption>
              <strong>{close.qrCaption}</strong>
              <span>{PAMPHLET_URL}</span>
            </figcaption>
          </figure>
        </section>
      </div>

      <footer className="pamphlet-footer">
        <DownloadButton />
        <p>{pamphlet.footer}</p>
      </footer>
    </main>
  );
}
