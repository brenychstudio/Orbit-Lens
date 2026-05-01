"use client";

import Image from "next/image";
import { motion } from "motion/react";

type ProductHeroRevealProps = {
  accent: string;
};

export function ProductHeroReveal({ accent }: ProductHeroRevealProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      <motion.div
        className="absolute left-1/2 top-[46%] h-[42rem] w-[76rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${accent} 0%, rgba(255,255,255,0.08) 24%, rgba(3,4,7,0) 66%)`,
        }}
        animate={{
          opacity: [0.12, 0.2, 0.12],
          scale: [0.96, 1.04, 0.96],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute left-1/2 top-[18%] h-px w-[62vw] -translate-x-1/2"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, rgba(255,255,255,0.42), ${accent}, transparent)`,
        }}
        animate={{
          opacity: [0.08, 0.36, 0.08],
          scaleX: [0.88, 1, 0.88],
        }}
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute left-1/2 top-[47%] hidden h-[31rem] w-[58rem] -translate-x-1/2 -translate-y-1/2 opacity-35 md:block"
        initial={{ opacity: 0, y: 24, scale: 0.96, filter: "blur(18px)" }}
        animate={{
          opacity: 0.22,
          y: [10, -6, 10],
          scale: [0.985, 1, 0.985],
          filter: "blur(0px)",
        }}
        transition={{
          opacity: { duration: 1.4, ease: [0.22, 1, 0.36, 1] },
          y: { duration: 9, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 9, repeat: Infinity, ease: "easeInOut" },
          filter: { duration: 1.4, ease: [0.22, 1, 0.36, 1] },
        }}
      >
        <Image
          src="/glasses/orbit-lens-hero-16x9.png"
          alt="Orbit Lens AI spatial glasses hero product render"
          fill
          priority
          sizes="100vw"
          className="object-contain"
        />
      </motion.div>

      <motion.div
        className="absolute left-[4.5vw] top-[12vh] hidden max-w-[14rem] lg:block"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="mb-3 text-[0.62rem] uppercase tracking-[0.34em] text-white/32">
          Orbit Lens
        </p>
        <p className="text-sm leading-6 text-white/44">
          AI spatial glasses for calmer context, controlled memory and
          field-of-view intelligence.
        </p>
      </motion.div>

      <motion.div
        className="absolute bottom-[9vh] right-[4.5vw] hidden max-w-[15rem] text-right lg:block"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="mb-3 text-[0.62rem] uppercase tracking-[0.34em] text-white/28">
          Product Concept
        </p>
        <p className="text-sm leading-6 text-white/42">
          The page opens like the device interface: spatial, translucent,
          restrained and gesture-led.
        </p>
      </motion.div>

      <motion.div
        className="absolute left-1/2 top-1/2 h-[34rem] w-[70rem] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-white/[0.035]"
        animate={{
          opacity: [0.08, 0.2, 0.08],
          rotate: [0, 1.4, 0],
          scale: [1, 1.018, 1],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 h-[22rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-white/[0.04]"
        animate={{
          opacity: [0.08, 0.18, 0.08],
          rotate: [0, -1.8, 0],
          scale: [1.018, 1, 1.018],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
