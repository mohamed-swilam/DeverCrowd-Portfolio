"use client";
import About from "@/components/sections/About";
import Hero from "@/components/sections/Hero";
import Testomonials from "@/components/sections/Testomonials";
import OurStack from "@/components/sections/OurStack";
import OurTeam from "@/components/sections/OurTeam";
import FloatingNav from "@/components/ui/FloatingNav";
import { useLenis } from "@/hooks/useLenis";


const HomePage = () => {
  useLenis();
  return (
    <>
    <FloatingNav />
    <Hero />
    <About />
    <OurStack />
    <OurTeam />
    <Testomonials />
    </>
  );
};

export default HomePage;
