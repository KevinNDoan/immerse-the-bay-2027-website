import Image from "next/image";
import Link from "next/link";
import { close, product } from "@/content/pitch";
import { PAMPHLET_PDF_PATH } from "@/lib/site";
import { CONTENT, LABELS } from "./layout";

const LINK = "flex min-h-11 items-center text-white/70 transition-colors hover:text-white";

/** Joined to the bottom of the closing panel: a big wordmark and the event on the left, links on the right. */
export function Footer() {
  return (
    <footer className={`${CONTENT} pb-10`}>
      <div className="flex flex-col gap-12 rounded-b-3xl border border-t-0 border-white/10 bg-white/[0.02] px-6 py-10 sm:px-10 md:flex-row md:justify-between md:py-12">
        <div className="flex max-w-sm flex-col gap-5">
          <Link href="#top" aria-label={LABELS.home} className="self-start rounded-md">
            <Image src="/art/wordmark.png" alt="" width={1600} height={600} className="h-12 w-auto sm:h-14" />
          </Link>
          <p className="text-[15px] leading-relaxed text-white/70">{product.event}</p>
        </div>
        <div className="grid grid-cols-2 gap-10 text-[15px] sm:gap-16">
          <nav aria-labelledby="footer-pitch" className="flex flex-col">
            <p id="footer-pitch" className="mb-1 font-medium text-white">
              {LABELS.footerPitch}
            </p>
            <a href="#how" className={LINK}>
              {LABELS.howItWorks}
            </a>
            <a href="#try" className={LINK}>
              {LABELS.tryIt}
            </a>
            <a href="#step-inside" className={LINK}>
              {LABELS.stepInside}
            </a>
            <a href="#questions" className={LINK}>
              {LABELS.questions}
            </a>
          </nav>
          <nav aria-labelledby="footer-take" className="flex flex-col">
            <p id="footer-take" className="mb-1 font-medium text-white">
              {LABELS.footerTake}
            </p>
            <Link href="/pamphlet" className={LINK}>
              {LABELS.pamphlet}
            </Link>
            <a href={PAMPHLET_PDF_PATH} download className={LINK}>
              {close.pdfLabel}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
