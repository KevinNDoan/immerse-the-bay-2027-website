import { BuiltOn } from "@/components/sections/BuiltOn";
import { Close } from "@/components/sections/Close";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Nav } from "@/components/sections/Nav";
import { Problem } from "@/components/sections/Problem";
import { Questions } from "@/components/sections/Questions";
import { SmoothScroll } from "@/components/sections/SmoothScroll";
import { TryIt } from "@/components/sections/TryIt";
import { Worlds } from "@/components/sections/Worlds";
import { WhyXr } from "@/components/sections/WhyXr";

/** The pitch, one slide per section. */
export default function Home() {
  return (
    <SmoothScroll>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <TryIt />
        <Worlds />
        <WhyXr />
        <BuiltOn />
        <Questions />
        <Close />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
