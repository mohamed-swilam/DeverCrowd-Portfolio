"use client";

import { motion, MotionStyle } from "motion/react";
import Logo from "../shared/Logo";
import { MdDesignServices } from "react-icons/md";
import { IoTerminal } from "react-icons/io5";
import { BsShieldLockFill } from "react-icons/bs";
import { FaHandsHelping } from "react-icons/fa";

interface CubeProps {
  cubeSize: number;
  style?: MotionStyle;
}

export default function Cube({ cubeSize, style }: CubeProps) {
  const half = cubeSize / 2;

  const faceClass =
    "absolute w-full h-full flex flex-col items-center justify-center gap-4 rounded-[inherit] overflow-hidden bg-[radial-gradient(circle_at_center,_#0A0F2C,_#000000)] border-[10px] border-black text-[#3A82F6] backface-hidden shadow-[0px_0px_15px_3px_#3B82F6] transition-shadow duration-300";

  return (
    <motion.div
      style={{ width: cubeSize, height: cubeSize, ...style }}
      className="relative transform-3d select-none font-extrabold rounded-3xl border z-1 group"
    >
      {/* Front — Support */}
      <div className={faceClass} style={{ transform: `translateZ(${half}px)` }}>
        <FaHandsHelping className="text-7xl" />
        <p className="uppercase xs:text-3xl">Support</p>
      </div>

      {/* Back — Development */}
      <div className={faceClass} style={{ transform: `translateZ(-${half}px) rotateY(180deg)` }}>
        <IoTerminal className="text-7xl" />
        <p className="uppercase xs:text-3xl">Development</p>
      </div>

      {/* Right — Security */}
      <div className={faceClass} style={{ transform: `translateX(${half}px) rotateY(90deg)` }}>
        <BsShieldLockFill className="text-7xl" />
        <p className="uppercase xs:text-3xl">Security</p>
      </div>

      {/* Left — Design */}
      <div className={faceClass} style={{ transform: `translateX(-${half}px) rotateY(-90deg)` }}>
        <MdDesignServices className="text-7xl" />
        <p className="uppercase xs:text-3xl">Design</p>
      </div>

      {/* Top — Logo */}
      <div
        className="absolute w-full h-full flex flex-col items-center justify-center gap-2 rounded-[inherit] overflow-hidden bg-[radial-gradient(circle_at_center,_#0A0F2C,_#000000)] border-[10px] border-black shadow-[0px_0px_15px_3px_#3B82F6]"
        style={{ transform: `translateY(-${half}px) rotateX(90deg)` }}
      >
        <Logo width={300} height={30} className="w-[90%]" />
        <p className="xs:text-3xl font-bold">
          Dever<span className="text-primary">Crowd</span>
        </p>
      </div>

      {/* Bottom */}
      <div
        className="absolute w-full h-full bg-black rounded-[inherit] overflow-hidden border-[10px] border-black shadow-lg"
        style={{ transform: `translateY(${half}px) rotateX(-90deg)` }}
      />
    </motion.div>
  );
}