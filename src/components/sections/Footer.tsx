import Image from "next/image";
import Link from "next/link";
import { close, product } from "@/content/pitch";
import { PAMPHLET_PDF_PATH } from "@/lib/site";
import { CONTENT, DARK, LABELS } from "./layout";

const LINK = "flex min-h-11 items-center text-white/65 transition-colors hover:text-white";

/** Harvey's footer, on the Void: the wordmark and the event on the left, the link columns on the right. */
export function Footer() {
  return (
    <footer data-tone="dark" className={DARK}>
      <div className={`${CONTENT} flex flex-col gap-12 border-t-2 border-white/10 pt-12 pb-14 md:flex-row md:justify-between`}>
        <div className="flex max-w-sm flex-col gap-5">
          <Link href="#top" aria-label={LABELS.home} className="self-start rounded-md">
            <Image src="/art/zap-wordmark.png" alt="" width={819} height={340} className="h-14 w-auto sm:h-16" />
          </Link>
          <p className="text-[15px] leading-relaxed text-white/65">{product.event}</p>
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
