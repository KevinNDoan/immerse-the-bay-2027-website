import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { pamphlet, questions } from "@/content/pitch";
import { H2, SECTION, WRAP } from "./layout";
import { Reveal } from "./Reveal";

/** The questions judges ask, all closed to start, one open at a time. */
export function Questions() {
  return (
    <section id="questions" aria-labelledby="questions-title" className={SECTION}>
      <div className={`${WRAP} max-w-3xl`}>
        <Reveal className="text-center">
          <h2 id="questions-title" className={H2}>
            {pamphlet.questionsTitle}
          </h2>
        </Reveal>
        <Reveal delay={0.06} className="mt-14 sm:mt-16">
          <Accordion type="single" collapsible className="border-t border-white/15">
            {questions.map((q, i) => (
              <AccordionItem key={q.q} value={`q${i}`} className="border-b border-white/15">
                <AccordionTrigger className="items-center gap-6 rounded-none py-6 text-lg leading-snug font-medium tracking-[-0.01em] text-white hover:no-underline sm:text-xl **:data-[slot=accordion-trigger-icon]:size-5 **:data-[slot=accordion-trigger-icon]:text-white/70">
                  {q.q}
                </AccordionTrigger>
                <AccordionContent className="max-w-[60ch] pb-7 text-base leading-relaxed text-white/70 sm:text-lg">
                  {q.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
