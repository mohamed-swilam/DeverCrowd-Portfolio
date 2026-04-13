"use client";
import H1 from "@/components/ui/H1";
import P from "@/components/ui/P";
import { useAdmins } from "@/hooks/useAdmins";
import TiltedCard from '../shared/TiltedCard';
import { useTranslations } from "next-intl";

const OurStack = () => {
    const { data: admins = [] } = useAdmins();
    const t = useTranslations("OurTeam");

    return (
        <section
            id="our-team"
            className="relative min-h-screen flex w-full flex-col items-center justify-center py-16 px-4 sm:px-16  gap-6 overflow-hidden"
        >
            <div className="absolute top-1 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-96 rounded-full bg-white/5 blur-3xl opacity-90 pointer-events-none z-0" />
            <H1>{t("title")}</H1>
            <P variant="muted" className="max-w-2xl text-center mb-2">
                {t("description")}
            </P>
            <div className="flex flex-wrap relative items-center justify-center w-full gap-5">
                {admins.map((admin) => {
                    return (
                        <TiltedCard
                            key={admin._id}
                            imageSrc={admin.pic}
                            altText={admin.username}
                            captionText={admin.username}
                            containerHeight="300px"
                            containerWidth="300px"
                            imageHeight="300px"
                            imageWidth="300px"
                            rotateAmplitude={12}
                            scaleOnHover={1.05}
                            showMobileWarning={false}
                            showTooltip
                            displayOverlayContent
                            overlayContent={
                                <div className="w-full rounded-b-[15px] border-t border-white/10 bg-black/60 px-4 py-3 backdrop-blur-md">
                                    {/* Name + Role */}
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-sm font-semibold text-white leading-none">
                                                {admin.nickname}
                                            </span>
                                            <span className="text-[10px] text-white/50 leading-none">
                                                {admin.email}
                                            </span>
                                        </div>
                                        <span className="shrink-0 rounded-full border border-primary bg-primary/40 px-2.5 py-1 text-[10px] font-semibold text- uppercase tracking-wide">
                                            {admin.role}
                                        </span>
                                    </div>
                                </div>
                            }
                        />
                    )
                })}
            </div>
        </section>
    );
};

export default OurStack;