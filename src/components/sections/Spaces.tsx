import { spaces } from "@/content/pitch";
import { CONTENT, SCREEN, SECTION } from "./layout";
import { Picture, type PictureName } from "./pictures";
import { Reveal } from "./Reveal";

const PICTURE: readonly PictureName[] = ["zap", "enter"];

/**
 * Harvey's two-audience cards, as ZAP!'s two spaces: a centred heading and line, then two tall dark cards side
 * by side. Each has its title, a few lines and an outlined button at the top, and a screen set into its
 * lower half.
 */
export function Spaces() {
  return (
    <section id="spaces" aria-labelledby="spaces-title" className={`${CONTENT} ${SECTION}`}>
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 id="spaces-title" className="text-[clamp(2.25rem,4.4vw,3.5rem)] leading-[1.05] font-normal tracking-[-0.035em]">
          {spaces.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ink/75 sm:text-lg">{spaces.text}</p>
      </Reveal>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:mt-12">
        {spaces.items.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.06} className={`flex flex-col overflow-hidden rounded-2xl ${SCREEN}`}>
            <div className="p-6 sm:p-8">
              <h3 className="text-[clamp(1.75rem,2.6vw,2.25rem)] leading-[1.05] font-normal tracking-[-0.03em]">{s.title}</h3>
              <p className="mt-3 max-w-[44ch] text-[15px] leading-relaxed text-white/75">{s.text}</p>
              <a
                href={s.href}
                className="mt-6 inline-flex min-h-11 items-center rounded-lg border-2 border-white/35 px-4 text-sm font-medium text-white transition-colors hover:border-white"
              >
                {s.cta}
              </a>
            </div>
            {/* The screen set into the card, as Harvey sets a product screenshot into each audience card. */}
            <div className="mx-6 mb-0 h-44 rounded-t-xl bg-void-lift shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] sm:mx-8 sm:h-52 lg:h-56">
              <Picture name={PICTURE[i]} scale={1.4} />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
