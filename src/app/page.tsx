import { BuiltOn } from "@/components/sections/BuiltOn";
import { Close } from "@/components/sections/Close";
import { Demo } from "@/components/sections/Demo";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { PAGE } from "@/components/sections/layout";
import { Nav } from "@/components/sections/Nav";
import { Questions } from "@/components/sections/Questions";
import { SmoothScroll } from "@/components/sections/SmoothScroll";
import { StepInside } from "@/components/sections/StepInside";
import { TryIt } from "@/components/sections/TryIt";
import { WhyXr } from "@/components/sections/WhyXr";

/** The pitch: a short hero with the demo right under it, then one section per idea. */
export default function Home() {
  return (
    <SmoothScroll>
      <div className={PAGE}>
        <Nav />
        <main>
          <Hero />
          <Demo />
          <HowItWorks />
          <TryIt />
          <StepInside />
          <WhyXr />
          <BuiltOn />
          <Questions />
          <Close />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
