import Link from "next/link";
import { Button } from "@/components/ui/button";
import { close } from "@/content/pitch";
import { qrSvg } from "@/lib/qr";
import { PAMPHLET_PDF_PATH, PAMPHLET_URL } from "@/lib/site";
import { LEAD, SECTION, WRAP } from "./layout";
import { Reveal } from "./Reveal";

/** Label on the button to the pamphlet page. Not in pitch.ts; it names the action. */
const OPEN_PAMPHLET = "Read the pamphlet";

/** The last slide: come to the table, and take the pitch with you. */
export async function Close() {
  // Dark on paper: some phone scanners cannot read an inverted (light on dark) code.
  const qr = await qrSvg(PAMPHLET_URL, { dark: "#0b0814", light: "#f2f0f7" });
  return (
    <section id="close" aria-labelledby="close-title" className={SECTION}>
      <div className={`${WRAP} text-center`}>
        <Reveal>
          <h2
            id="close-title"
            className="text-[clamp(3.5rem,11vw,8rem)] leading-[0.9] font-medium tracking-[-0.05em]"
          >
            {close.title}
          </h2>
          <p className={`${LEAD} mx-auto mt-8 max-w-xl`}>{close.text}</p>
        </Reveal>

        <Reveal delay={0.08} className="mt-14 flex flex-col items-center sm:mt-16">
          <figure className="flex flex-col items-center">
            <div
              role="img"
              aria-label={`QR code for ${PAMPHLET_URL}`}
              className="size-40 rounded-2xl bg-paper p-3 [&_svg]:block [&_svg]:size-full"
              dangerouslySetInnerHTML={{ __html: qr }}
            />
            <figcaption className="mt-4 text-sm text-white/70">{close.qrCaption}</figcaption>
          </figure>

          <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild className="h-12 w-full rounded-full px-6 text-base sm:w-auto">
              <Link href="/pamphlet">{OPEN_PAMPHLET}</Link>
            </Button>
            <Button asChild variant="outline" className="h-12 w-full rounded-full px-6 text-base sm:w-auto">
              <a href={PAMPHLET_PDF_PATH} download>
                {close.pdfLabel}
              </a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
