import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { close } from "@/content/pitch";
import { qrSvg } from "@/lib/qr";
import { PAMPHLET_PDF_PATH, PAMPHLET_URL } from "@/lib/site";
import { CONTENT, DARK, H1, LABELS, PILL, PILL_LG, PILL_PRIMARY, SECTION } from "./layout";
import { Reveal } from "./Reveal";

/**
 * Harvey's closing bar, on the dark half: the invitation on the left, the two ways to take the pitch with you
 * on the right, and the QR code on a paper card beside them. The footer follows under a rule.
 */
export async function Close() {
  // Ink on paper, so the code reads the usual way round and every scanner takes it.
  const qr = await qrSvg(PAMPHLET_URL, { dark: "#0b0814", light: "#f2f0f7" });
  return (
    <section id="cta" aria-labelledby="cta-title" data-tone="dark" className={`${DARK} ${SECTION}`}>
      <Reveal className={`${CONTENT} grid items-center gap-10 lg:grid-cols-12 lg:gap-8`}>
        <div className="lg:col-span-6">
          <h2 id="cta-title" className={H1}>
            {close.title}
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">{close.text}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/pamphlet" className={`${PILL} ${PILL_PRIMARY} ${PILL_LG}`}>
              {LABELS.openPamphlet}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <a href={PAMPHLET_PDF_PATH} download className={`${PILL} ${PILL_LG} border-2 border-white/25 text-white hover:border-white/60 hover:bg-white/5`}>
              {close.pdfLabel}
            </a>
          </div>
        </div>
        <figure className="flex flex-col items-start gap-3 lg:col-span-4 lg:col-start-9 lg:items-center">
          <div
            role="img"
            aria-label={`QR code for ${PAMPHLET_URL}`}
            className="size-44 rounded-2xl bg-paper p-2.5 [&_svg]:block [&_svg]:size-full"
            dangerouslySetInnerHTML={{ __html: qr }}
          />
          <figcaption className="text-sm text-white/70">{close.qrCaption}</figcaption>
        </figure>
      </Reveal>
    </section>
  );
}
