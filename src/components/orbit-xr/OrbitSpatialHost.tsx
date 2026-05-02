"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { orbitModes } from "@/data/orbitModes";
import {
  createOrbitSpatialScene,
  type OrbitSpatialSceneApi,
} from "./OrbitSpatialScene";
import { checkXRSupport, type XRSupportState } from "./xrSupport";

const initialXRState: XRSupportState = {
  isChecking: true,
  isSupported: false,
  isSecureContext: false,
  reason: "Checking WebXR support...",
};

export function OrbitSpatialHost() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<OrbitSpatialSceneApi | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [xrSupport, setXRSupport] = useState<XRSupportState>(initialXRState);
  const [sessionStatus, setSessionStatus] = useState("Desktop spatial preview.");

  useEffect(() => {
    let isMounted = true;

    checkXRSupport().then((state) => {
      if (isMounted) {
        setXRSupport(state);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount || sceneRef.current) {
      return;
    }

    sceneRef.current = createOrbitSpatialScene({
      mount,
      initialIndex: 0,
      onModeChange: setActiveIndex,
    });

    return () => {
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.setMode(activeIndex);
  }, [activeIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        setActiveIndex((current) => (current + 1) % orbitModes.length);
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex(
          (current) => (current - 1 + orbitModes.length) % orbitModes.length,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const activeMode = orbitModes[activeIndex];

  const handleStartVR = async () => {
    const result = await sceneRef.current?.startVR();

    if (result) {
      setSessionStatus(result);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030407] text-[#f4efe6]">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 50% 10%, rgba(150,205,255,0.12), transparent 34%), radial-gradient(circle at 70% 80%, rgba(174,146,255,0.08), transparent 36%), #030407",
        }}
      />

      <div ref={mountRef} className="absolute inset-0" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(0,0,0,0.62))]" />

      <header className="absolute left-5 right-5 top-5 z-20 flex items-center justify-between gap-4">
        <div className="rounded-full border border-white/[0.075] bg-black/35 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <p className="text-[0.58rem] uppercase tracking-[0.34em] text-white/34">
            Orbit Lens
          </p>
          <p className="mt-1 text-[0.68rem] uppercase tracking-[0.22em] text-white/68">
            Spatial Mode / Foundation
          </p>
        </div>

        <Link
          href="/"
          className="rounded-full border border-white/[0.085] bg-white/[0.025] px-4 py-3 text-[0.58rem] uppercase tracking-[0.24em] text-white/52 transition duration-300 hover:border-white/[0.16] hover:bg-white/[0.045] hover:text-white/82"
        >
          Back to web
        </Link>
      </header>

      <aside className="absolute bottom-5 left-5 z-20 w-[min(25rem,calc(100vw-2.5rem))] rounded-[1.75rem] border border-white/[0.075] bg-black/45 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.045),0_24px_80px_rgba(0,0,0,0.48)] backdrop-blur-md">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p
              className="text-[0.58rem] uppercase tracking-[0.3em]"
              style={{ color: activeMode.accent }}
            >
              {activeMode.eyebrow}
            </p>
            <h1 className="mt-2 max-w-[19rem] text-xl font-light leading-tight tracking-[-0.04em] text-white/92">
              {activeMode.title}
            </h1>
          </div>

          <span className="mt-1 rounded-full border border-white/[0.075] px-2.5 py-1 text-[0.52rem] uppercase tracking-[0.2em] text-white/38">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(orbitModes.length).padStart(2, "0")}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {orbitModes.map((mode, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Open ${mode.id} spatial mode`}
                className="group relative flex h-9 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.02] transition duration-300 hover:border-white/[0.18] hover:bg-white/[0.05]"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full transition duration-300"
                  style={{
                    background: isActive ? mode.accent : "rgba(255,255,255,0.28)",
                    boxShadow: isActive ? `0 0 12px ${mode.accent}` : "none",
                    opacity: isActive ? 1 : 0.5,
                  }}
                />
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-[14rem] text-[0.65rem] leading-5 text-white/42">
            {xrSupport.reason}
          </p>

          <button
            type="button"
            onClick={handleStartVR}
            disabled={!xrSupport.isSupported}
            className="rounded-full border border-white/[0.1] bg-white/[0.035] px-4 py-2.5 text-[0.54rem] uppercase tracking-[0.22em] text-white/56 transition duration-300 hover:border-white/[0.2] hover:bg-white/[0.06] hover:text-white/86 disabled:cursor-not-allowed disabled:opacity-35"
          >
            Enter VR
          </button>
        </div>

        <p className="mt-3 text-[0.55rem] uppercase tracking-[0.22em] text-white/25">
          {sessionStatus}
        </p>
      </aside>

      <div className="absolute right-5 top-1/2 z-20 hidden w-48 -translate-y-1/2 rounded-[1.5rem] border border-white/[0.07] bg-black/35 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] backdrop-blur-md lg:block">
        <p className="mb-3 text-[0.5rem] uppercase tracking-[0.28em] text-white/28">
          Controls
        </p>
        <div className="space-y-2 text-[0.62rem] leading-5 text-white/42">
          <p>Desktop: click spatial nodes.</p>
          <p>Keyboard: ← / → switch modes.</p>
          <p>VR: foundation session only.</p>
          <p>Hands: next task.</p>
        </div>
      </div>
    </main>
  );
}
