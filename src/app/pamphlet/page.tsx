// The overview judges reach by scanning the QR code at our table. It reads like a shared doc: a white page on
// a grey desk, phone first, readable with no JavaScript. Once opened it is kept for offline reading (see
// OfflineStatus and public/sw.js), and it prints, or saves as the PDF, on one US Letter page.
// All copy comes from src/content/pitch.ts.
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { builtOn, close, pamphlet, pamphletQuestions, product, steps, whyXr } from "@/content/pitch";
import { PAMPHLET_PDF_PATH, SITE_URL } from "@/lib/site";
import { OfflineStatus } from "./OfflineStatus";
import "./pamphlet.css";

export const metadata: Metadata = {
  title: pamphlet.title,
  description: pamphlet.subtitle,
  alternates: { canonical: "/pamphlet" },
};

export default function PamphletPage() {
  const site = SITE_URL.replace(/^https?:\/\//, "");

  return (
    <div className="doc">
      <header className="doc-bar">
        <Link href="/" className="doc-bar-title" aria-label={`${pamphlet.siteLabel}, ${product.name}`}>
          {/* Unoptimized, so its URL is the plain file the offline worker saves. */}
          <Image src="/art/zap-icon.png" alt="" width={512} height={512} className="doc-bar-icon" unoptimized preload />
          <span>{pamphlet.title}</span>
        </Link>
        <div className="doc-bar-actions">
          <OfflineStatus />
          <a className="doc-button" href={PAMPHLET_PDF_PATH} download>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4v11" />
              <path d="m7 10 5 5 5-5" />
              <path d="M5 20h14" />
            </svg>
            <span>PDF</span>
            <span className="sr-only">{close.pdfLabel}</span>
          </a>
        </div>
      </header>

      <main className="doc-page">
        <h1>
          <Image src="/art/zap-wordmark.png" alt={product.name} width={819} height={340} className="doc-wordmark" unoptimized preload />
        </h1>
        <p className="doc-subtitle">{pamphlet.subtitle}</p>

        <h2>{pamphlet.whatTitle}</h2>
        <p>
          {product.headline} {pamphlet.intro}
        </p>

        <h2>{pamphlet.whyTitle}</h2>
        <p className="doc-lead">{pamphlet.whyLead}</p>
        <ul>
          {whyXr.claims.map((c) => (
            <li key={c.title}>
              <strong>{c.title}.</strong> {c.text}
            </li>
          ))}
        </ul>

        <h2>{pamphlet.howTitle}</h2>
        <ol>
          {steps.map((s) => (
            <li key={s.title}>
              <strong>{s.title}.</strong> {s.text}
            </li>
          ))}
        </ol>

        <h2>{pamphlet.questionsTitle}</h2>
        <dl>
          {pamphletQuestions.map((q) => (
            <div key={q.q}>
              <dt>{q.q}</dt>
              <dd>{q.a}</dd>
            </div>
          ))}
        </dl>

        <h2>{pamphlet.techTitle}</h2>
        <dl className="doc-tech">
          {builtOn.items.map((i) => (
            <div key={i.name}>
              <dt>{i.name}</dt>
              <dd>{i.role}</dd>
            </div>
          ))}
        </dl>

        <h2>{pamphlet.trackTitle}</h2>
        <p>{builtOn.trackFit}</p>

        <p className="doc-end">
          {pamphlet.siteLabel} at <Link href="/">{site}</Link>
        </p>
      </main>

      <footer className="doc-footer">{pamphlet.footer}</footer>
    </div>
  );
}
