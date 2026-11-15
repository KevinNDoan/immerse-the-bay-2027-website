import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { close } from "@/content/pitch";
import { qrSvg } from "@/lib/qr";
import { PAMPHLET_PDF_PATH, PAMPHLET_URL } from "@/lib/site";
import { CONTENT, LABELS, PILL, PILL_GLASS, PILL_LG, PILL_PRIMARY } from "./layout";
import { Reveal } from "./Reveal";

/**
 * The closing panel: the invitation centred, two ways to take the pitch with you, and the QR code on a
 * paper card. A soft white glow rises from the bottom edge; yellow stays on the buttons. The footer joins on underneath it.
 */
export async function Close() {
  // Ink on paper, so the code reads the usual way round and every scanner takes it.
  const qr = await qrSvg(PAMPHLET_URL, { dark: "#0b0814", light: "#f2f0f7" });
  return (
    <section id="cta" aria-labelledby="cta-title" className={`${CONTENT} pt-20 sm:pt-28`}>
      <Reveal className="relative isolate overflow-hidden rounded-t-3xl bg-white/30 px-6 pt-16 pb-14 text-center shadow-[inset_0_0_10px_rgb(255_255_255/0.55),inset_0_1px_0_rgb(255_255_255/0.6)] backdrop-blur-[40px] backdrop-saturate-150 sm:px-10 sm:pt-24 sm:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[85%] bg-[radial-gradient(60%_80%_at_50%_100%,rgb(255_255_255/0.7),rgb(255_255_255/0.15)_45%,transparent_75%)]"
        />
        <h2 id="cta-title" className="text-[clamp(2.75rem,7vw,5rem)] leading-[0.95] font-medium tracking-[-0.045em]">
          {close.title}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink/75 sm:text-lg">{close.text}</p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/pamphlet" className={`${PILL} ${PILL_PRIMARY} ${PILL_LG} w-full sm:w-auto`}>
            {LABELS.openPamphlet}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
          <a href={PAMPHLET_PDF_PATH} download className={`${PILL} ${PILL_GLASS} ${PILL_LG} w-full sm:w-auto`}>
            {close.pdfLabel}
          </a>
        </div>

        <figure className="mt-12 flex flex-col items-center gap-3">
          <div
            role="img"
            aria-label={`QR code for ${PAMPHLET_URL}`}
            className="size-40 rounded-2xl bg-paper p-2.5 shadow-[0_16px_48px_rgb(11_8_20/0.18)] [&_svg]:block [&_svg]:size-full"
            dangerouslySetInnerHTML={{ __html: qr }}
          />
          <figcaption className="text-sm text-ink/70">{close.qrCaption}</figcaption>
        </figure>
      </Reveal>
    </section>
  );
}
