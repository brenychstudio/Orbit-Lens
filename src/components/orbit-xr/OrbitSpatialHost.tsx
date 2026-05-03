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
  const [isInspectOpen, setIsInspectOpen] = useState(false);
  const [sessionStatus, setSessionStatus] = useState(
    "Desktop spatial preview. Click nodes or use ← / →.",
  );

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
    sceneRef.current?.setInspectMode(isInspectOpen);
  }, [isInspectOpen]);

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

  const handleToggleInspect = () => {
    setIsInspectOpen((current) => {
      const next = !current;
      setSessionStatus(
        next
          ? "XR Inspect Optics active. Click cards or use wheel focus."
          : "Desktop spatial preview. Click nodes or use в†ђ / в†’.",
      );
      return next;
    });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030407] text-[#f4efe6]">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(circle at 28% 12%, rgba(120,180,210,0.14), transparent 34%), radial-gradient(circle at 72% 72%, rgba(130,110,210,0.08), transparent 38%), linear-gradient(180deg, #061017 0%, #030407 48%, #010203 100%)",
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_28%,rgba(0,0,0,0.72))]" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-5 py-8">
        <div className="relative aspect-[16/8.3] w-[min(94vw,110rem)] overflow-hidden rounded-[3.2rem] border border-white/[0.075] bg-[#05080a]/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(255,255,255,0.025),0_44px_180px_rgba(0,0,0,0.7)]">
          <div className="pointer-events-none absolute inset-0 rounded-[3.2rem] ring-1 ring-white/[0.035]" />
          <div className="pointer-events-none absolute inset-[1px] rounded-[3rem] ring-1 ring-white/[0.018]" />
          <div className="pointer-events-none absolute inset-x-16 top-px h-px bg-gradient-to-r from-transparent via-white/16 to-transparent" />
          <div className="pointer-events-none absolute inset-x-20 bottom-px h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

          <div className="relative z-20 mb-3 flex items-center justify-between rounded-full border border-white/[0.055] bg-white/[0.025] px-5 py-2 text-[0.55rem] uppercase tracking-[0.28em] text-white/36 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
            <div className="flex items-center gap-3">
              <span>Orbit Spatial Interface</span>
              <span className="hidden h-px w-8 bg-white/[0.08] md:block" />
              <span className="hidden text-white/24 md:inline">
                {isInspectOpen ? "Optics inspection field" : "WebXR-ready field"}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleStartVR}
                disabled={!xrSupport.isSupported}
                className="group relative inline-flex items-center gap-2 rounded-full border border-white/[0.075] bg-white/[0.026] px-3 py-1.5 text-[0.5rem] uppercase tracking-[0.22em] text-white/44 transition duration-500 hover:border-white/[0.16] hover:bg-white/[0.05] hover:text-white/78 disabled:cursor-not-allowed disabled:opacity-35"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full transition duration-500 group-hover:scale-110"
                  style={{
                    background: activeMode.accent,
                    boxShadow: `0 0 12px ${activeMode.accent}`,
                  }}
                />
                Enter VR
              </button>

              <span>
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(orbitModes.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.45rem] border border-white/[0.065] bg-black shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div ref={mountRef} className="relative h-[min(74vh,50rem)] w-full" />

            <div className="pointer-events-none absolute inset-0 rounded-[2.45rem] bg-[radial-gradient(circle_at_46%_22%,transparent,rgba(0,0,0,0.22)_48%,rgba(0,0,0,0.58)_100%)]" />

            <div className="pointer-events-none absolute left-8 top-8 z-20 hidden max-w-[16.5rem] rounded-[1.5rem] border border-white/[0.055] bg-black/22 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] backdrop-blur-sm lg:block">
              <p
                className="text-[0.58rem] uppercase tracking-[0.3em]"
                style={{ color: activeMode.accent }}
              >
                {activeMode.eyebrow}
              </p>
              <h1 className="mt-2 text-lg font-light leading-tight tracking-[-0.04em] text-white/72">
                {activeMode.title}
              </h1>
              <p className="mt-2 text-[0.64rem] leading-4 text-white/34">
                {activeMode.tagline}
              </p>
            </div>

            <div className="absolute inset-x-8 bottom-6 z-30 rounded-full border border-white/[0.065] bg-[#05080a]/72 px-4 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_20px_80px_rgba(0,0,0,0.42)]">
              <div className="grid items-center gap-3 md:grid-cols-[0.85fr_1.5fr_auto]">
                <div className="min-w-0">
                  <p className="text-[0.5rem] uppercase tracking-[0.28em] text-white/26">
                    Active spatial field
                  </p>
                  <p className="mt-1 truncate text-[0.62rem] uppercase tracking-[0.22em] text-white/62">
                    {activeMode.signal}
                  </p>
                </div>

                <div className="hidden items-center justify-center gap-2 md:flex">
                  {orbitModes.map((mode, index) => {
                    const isActive = index === activeIndex;

                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        aria-label={`Open ${mode.id} spatial mode`}
                        className="group relative flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.018] transition duration-300 hover:border-white/[0.18] hover:bg-white/[0.05]"
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full transition duration-300"
                          style={{
                            background: isActive
                              ? mode.accent
                              : "rgba(255,255,255,0.24)",
                            boxShadow: isActive ? `0 0 14px ${mode.accent}` : "none",
                            opacity: isActive ? 1 : 0.46,
                          }}
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-end gap-3">
                  <p className="hidden text-[0.62rem] text-white/34 lg:block">
                    {isInspectOpen
                      ? "Click cards / wheel focus"
                      : "Click / wheel / hand pinch"}
                  </p>

                  <button
                    type="button"
                    onClick={handleToggleInspect}
                    className="group relative inline-flex items-center gap-2 rounded-full border border-white/[0.085] bg-white/[0.025] px-4 py-2.5 text-[0.52rem] uppercase tracking-[0.22em] text-white/52 transition duration-300 hover:border-white/[0.16] hover:bg-white/[0.045] hover:text-white/82"
                    aria-pressed={isInspectOpen}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full transition duration-500 group-hover:scale-110"
                      style={{
                        background: activeMode.accent,
                        boxShadow: `0 0 12px ${activeMode.accent}`,
                      }}
                    />
                    {isInspectOpen ? "Close Optics" : "Inspect Optics"}
                  </button>

                  <Link
                    href="/"
                    className="rounded-full border border-white/[0.085] bg-white/[0.025] px-4 py-2.5 text-[0.52rem] uppercase tracking-[0.22em] text-white/52 transition duration-300 hover:border-white/[0.16] hover:bg-white/[0.045] hover:text-white/82"
                  >
                    Back to web
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <p className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 text-[0.5rem] uppercase tracking-[0.28em] text-white/20">
            Spatial preview / WebXR session / hand layer next
          </p>
        </div>
      </section>

      <div className="absolute bottom-5 left-5 z-20 max-w-[20rem] rounded-full border border-white/[0.065] bg-black/35 px-4 py-2 text-[0.56rem] leading-4 text-white/34 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
        {xrSupport.reason}
      </div>

      <div className="absolute bottom-5 right-5 z-20 hidden max-w-[22rem] rounded-full border border-white/[0.065] bg-black/35 px-4 py-2 text-[0.56rem] uppercase tracking-[0.18em] text-white/28 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] lg:block">
        {sessionStatus}
      </div>
    </main>
  );
}
