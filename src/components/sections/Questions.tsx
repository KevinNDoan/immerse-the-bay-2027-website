import { Plus } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { pamphlet, questions } from "@/content/pitch";
import { CARD, CONTENT, H2, LABELS, SECTION, SUB } from "./layout";
import { NoscriptList } from "./NoscriptList";
import { Reveal } from "./Reveal";

const ITEMS = questions.map((q) => ({ title: q.q, text: q.a }));

/** The questions judges ask: heading on the left, boxed answers on the right, all closed to start. */
export function Questions() {
  return (
    <section id="questions" aria-labelledby="questions-title" className={`${CONTENT} ${SECTION}`}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <h2 id="questions-title" className={H2}>
            {pamphlet.questionsTitle}
          </h2>
          <p className={`${SUB} mt-4`}>{LABELS.faqSub}</p>
        </Reveal>
        <Reveal delay={0.06} className="lg:col-span-8">
          <Accordion type="single" collapsible data-noscript-hide="questions" className="gap-3">
            {questions.map((q, i) => (
              <AccordionItem key={q.q} value={`q${i}`} className={`${CARD} border px-5 sm:px-6`}>
                <AccordionTrigger className="items-center gap-6 rounded-none py-5 text-base leading-snug font-medium text-white hover:no-underline sm:text-lg **:data-[slot=accordion-trigger-icon]:hidden">
                  {q.q}
                  <Plus
                    aria-hidden
                    className="ml-auto size-5 shrink-0 text-white/70 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-aria-expanded/accordion-trigger:rotate-45 motion-reduce:transition-none"
                  />
                </AccordionTrigger>
                <AccordionContent className="max-w-[62ch] pb-5 text-[15px] leading-relaxed text-white/70 sm:text-base">
                  {q.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <NoscriptList scope="questions" items={ITEMS} />
        </Reveal>
      </div>
    </section>
  );
}
