import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HERO_SPORT_ICONS = [
  { sport: "Basketball", icon: "🏀" },
  { sport: "Football", icon: "⚽" },
  { sport: "Baseball", icon: "⚾" },
  { sport: "Tennis", icon: "🎾" },
  { sport: "Cricket", icon: "🏏" },
  { sport: "Rugby", icon: "🏉" },
  { sport: "American Football", icon: "🏈" },
  { sport: "Ice Hockey", icon: "🏒" },
  { sport: "Motorsport", icon: "🏎️" },
  { sport: "Swimming", icon: "🏊" },
];

export default function Home() {
  const MotionSection = motion.section;
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, 80]);
  const [activeIconIndex, setActiveIconIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIconIndex((prev) => (prev + 1) % HERO_SPORT_ICONS.length);
    }, 1400);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-8 sm:pt-10">
      <MotionSection id="home-hero" style={{ y: heroY }} className="elev8-shell animate-rise">
        <p className="text-center text-xs font-semibold tracking-[0.34em] text-primary/90 uppercase">
          PLAYERVAULT · UNLOCK PLAYER INSIGHTS
        </p>
        <h1 className="mx-auto mt-5 max-w-3xl text-center text-4xl font-black leading-tight tracking-tight sm:text-6xl">
          Explore Players Across <span className="text-primary">Every Sport</span>
        </h1>

        <div className="mx-auto mt-6 max-w-xl rounded-full border border-border/80 bg-card/70 px-5 py-2 text-center text-sm text-muted-foreground backdrop-blur">
          Search, filter, and uncover detailed player profiles in one place.
        </div>

        <div className="mx-auto mt-10 flex w-full max-w-[320px] justify-center">
          <div className="hero-core">
            <div className="hero-core__ring" />
            <div className="hero-core__orbit" aria-hidden="true">
              {HERO_SPORT_ICONS.map((item, index) => (
                <span
                  key={item.sport}
                  className="hero-core__sport"
                  style={{ "--index": index, "--total": HERO_SPORT_ICONS.length }}
                  title={item.sport}
                >
                  {item.icon}
                </span>
              ))}
            </div>
            <div className="hero-core__player" aria-label={`Current sport icon: ${HERO_SPORT_ICONS[activeIconIndex].sport}`}>
              {HERO_SPORT_ICONS[activeIconIndex].icon}
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Button asChild size="lg" className="rounded-full px-8 text-sm font-bold tracking-[0.16em] uppercase shadow-[0_0_28px_rgba(230,76,160,0.55)] brightness-110 hover:brightness-125 transition-[filter,box-shadow] hover:shadow-[0_0_40px_rgba(230,76,160,0.75)]">
            <Link to="/search">Start Search Journey</Link>
          </Button>
        </div>
      </MotionSection>

      <section id="home-marquee" className="mt-8 marquee-wrap" aria-hidden="true">
        <div className="marquee-track">
          <span>Basketball</span>
          <span>Football</span>
          <span>Cricket</span>
          <span>Live search</span>
          <span>Animated filters</span>
          <span>Player profiles</span>
        </div>
      </section>

      <section id="home-panels" className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card className="elev8-card animate-rise-delay">
          <CardHeader>
            <CardTitle>Smarter talent discovery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Explore verified athlete profiles, compare key details in seconds, and move from shortlist to decision with confidence.
            </p>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/search">Explore Players</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="elev8-card animate-rise-delay-2">
          <CardHeader>
            <CardTitle>Why teams choose PlayerVault</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="list-disc space-y-1 pl-5">
              <li>Cross-sport search with fast, intuitive filtering</li>
              <li>Clean player profiles with age, position, team, and nationality</li>
              <li>Responsive experience designed for desktop and mobile scouting</li>
              <li>Quick comparison workflows for recruiters, analysts, and fans</li>
              <li>Accessible interface with privacy-first design principles</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
