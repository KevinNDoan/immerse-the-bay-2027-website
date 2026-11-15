import { BuiltOn } from "@/components/sections/BuiltOn";
import { Close } from "@/components/sections/Close";
import { Demo } from "@/components/sections/Demo";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { PAGE } from "@/components/sections/layout";
import { Nav } from "@/components/sections/Nav";
import { Numbers } from "@/components/sections/Numbers";
import { Questions } from "@/components/sections/Questions";
import { SmoothScroll } from "@/components/sections/SmoothScroll";
import { Spaces } from "@/components/sections/Spaces";
import { TryIt } from "@/components/sections/TryIt";
import { WhyXr } from "@/components/sections/WhyXr";
import { Worlds } from "@/components/sections/Worlds";

/**
 * The pitch, in the shape of harvey.ai: a full-width bar, a light half that tells the story, and a dark half
 * for the worlds, the numbers, the judges' questions and the close.
 */
export default function Home() {
  return (
    <SmoothScroll>
      <div className={PAGE}>
        <Nav />
        <main>
          {/* The light half, in Harvey's order: hero and media, the logo wall, the two audiences, the centred
              feature, the product list, and the quote band. */}
          <Hero />
          <Demo />
          <BuiltOn />
          <Spaces />
          <TryIt />
          <HowItWorks />
          <WhyXr />
          {/* The dark half: the stories, the stats, the security list, and the close. */}
          <Worlds />
          <Numbers />
          <Questions />
          <Close />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
