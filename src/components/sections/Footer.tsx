import Image from "next/image";
import { product } from "@/content/pitch";
import { WRAP } from "./layout";

/** One quiet line to close the page. */
export function Footer() {
  return (
    <footer className="border-t border-white/15">
      <div className={`${WRAP} flex flex-col items-start gap-4 py-10 sm:flex-row sm:items-center sm:justify-between`}>
        <Image src="/art/wordmark.png" alt="ZAP!" width={1600} height={600} className="h-5 w-auto opacity-80" />
        <p className="text-sm text-white/70">{product.event}</p>
      </div>
    </footer>
  );
}
