import Link from "next/link";
import { Plus } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { pamphlet, questions } from "@/content/pitch";
import { CONTENT, DARK, H2, LABELS, PILL, SECTION, SPLIT_LEFT, SPLIT_RIGHT } from "./layout";
import { NoscriptList } from "./NoscriptList";
import { Reveal } from "./Reveal";

const ITEMS = questions.map((q) => ({ title: q.q, text: q.a }));

/**
 * Harvey's security list, as the judges' questions: the heading, a line and a button on the left; on the
 * right one ruled row per question that opens in place, all closed to start.
 */
export function Questions() {
  return (
    <section id="questions" aria-labelledby="questions-title" data-tone="dark" className={`${DARK} ${SECTION}`}>
      <div className={`${CONTENT} grid gap-10 lg:grid-cols-12 lg:gap-8`}>
        <Reveal className={`${SPLIT_LEFT} lg:sticky lg:top-28 lg:self-start`}>
          <h2 id="questions-title" className={H2}>
            {pamphlet.questionsTitle}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/70 sm:text-lg">{LABELS.faqSub}</p>
          <Link href="/pamphlet" className={`${PILL} mt-7 border-2 border-white/25 text-white hover:border-white/60 hover:bg-white/5`}>
            {LABELS.openPamphlet}
          </Link>
        </Reveal>
        <Reveal delay={0.06} className={SPLIT_RIGHT}>
          <Accordion type="single" collapsible data-noscript-hide="questions" className="border-t-2 border-white/15">
            {questions.map((q, i) => (
              <AccordionItem key={q.q} value={`q${i}`} className="border-b-2 border-white/10 last:border-b-2">
                <AccordionTrigger className="items-center gap-6 rounded-none py-4 focus-visible:ring-2 focus-visible:ring-zap text-base leading-snug font-medium text-white hover:no-underline sm:text-[17px] **:data-[slot=accordion-trigger-icon]:hidden">
                  {q.q}
                  <Plus
                    aria-hidden
                    className="ml-auto size-5 shrink-0 text-white/60 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-aria-expanded/accordion-trigger:rotate-45 motion-reduce:transition-none"
                  />
                </AccordionTrigger>
                <AccordionContent className="max-w-[60ch] pb-5 text-[15px] leading-relaxed text-white/70 sm:text-base">
                  {q.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <NoscriptList scope="questions" items={ITEMS} tone="dark" />
        </Reveal>
      </div>
    </section>
  );
}
