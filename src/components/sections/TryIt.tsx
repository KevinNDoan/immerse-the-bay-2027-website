import { TryItDemo } from "@/components/scene";
import { tryIt } from "@/content/pitch";
import { CARD, CONTENT, SECTION } from "./layout";
import { Reveal } from "./Reveal";

/** One large card holding the in-browser void, titled in its footer. */
export function TryIt() {
  return (
    <section id="try" aria-labelledby="try-title" className={`${CONTENT} ${SECTION}`}>
      <Reveal className={`${CARD} overflow-hidden`}>
        <div className="p-3 sm:p-5">
          <TryItDemo />
        </div>
        <div className="flex flex-col gap-1 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 sm:px-6">
          <h2 id="try-title" className="text-xl font-medium tracking-[-0.02em]">
            {tryIt.title}
          </h2>
          <p className="text-sm text-white/70">{tryIt.note}</p>
        </div>
      </Reveal>
    </section>
  );
}
