"use client";
import H1 from "@/components/ui/H1";
import P from "@/components/ui/P";
import DomeGallery from "../shared/DomeGallery";

const OurStack = () => {
    return (
        <section
            id="our-stack"
            className="relative min-h-screen flex w-full flex-col items-center justify-center py-16 px-4 sm:px-16 gap-6 overflow-hidden"
        >
            <div className="absolute top-1 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-96 rounded-full bg-white/5 blur-3xl opacity-90 pointer-events-none z-0" />
            <H1>The Stack Behind the Work</H1>
            <P variant="muted" className="max-w-2xl text-center mb-2">
                Every project is built on a foundation of modern, battle-tested technologies — chosen for performance, scalability, and long-term maintainability.
            </P>
            <div id="logoloop" className="flex flex-col relative h-[50vh] items-center justify-center w-full md:w-[50%]">
                <DomeGallery
                    fit={0.5}
                    minRadius={200}
                    maxVerticalRotationDeg={20}
                    segments={12}
                    dragDampening={2}
                    overlayBlurColor="background"
                />
            </div>
        </section>
    );
};

export default OurStack;