# Orbit Lens — AI Spatial Glasses Concept

Orbit Lens is a fictional AI spatial glasses product concept and premium interactive product-interface prototype by Brenych Studio.

The project explores a website that behaves like the product interface itself: a cinematic shell interface where product modes, optical inspection, spatial references, trust states and an optional WebXR layer form one coherent product experience.

This is not a real commercial hardware product. It is a portfolio-grade concept, interface prototype and product storytelling system.

---

## Positioning

- **Type:** Fictional product launch website / interactive interface prototype / WebXR proof layer
- **Concept:** AI spatial glasses for contextual intelligence, live translation, controlled recall, creator capture, focus and visible privacy
- **Studio:** Brenych Studio
- **Core idea:** The website behaves like the spatial interface of the device.

Orbit Lens is designed as a premium technology product surface, not a generic sci-fi dashboard. The visual language is quiet, dark, cinematic, optical and restrained.

---

## Demo Flow

Recommended presentation order:

1. **Vision** — product hero / spatial clarity baseline
2. **Translate** — transparent language layer
3. **Recall** — user-controlled memory logic
4. **Create** — scroll-driven spatial reference orbit
5. **Inspect Optics** — cinematic product inspection reveal
6. **Focus** — quieting system / priority signal
7. **Privacy** — visible trust and consent boundary
8. **Access** — product / studio access terminal
9. **Spatial Mode** — optional WebXR proof layer

Primary demo emphasis:
- web experience first;
- Inspect Optics as the main product-detail reveal;
- Field 04 Reference Orbit as the signature interaction;
- Spatial Mode as an advanced XR proof layer;
- hand-navigation is experimental and should not be treated as final production behavior.

---

## Key Features

### Cinematic Shell Interface

A central glass-like product shell replaces a standard landing page layout. The interface uses wheel, keyboard and staged transitions between product fields.

### Persistent Field Copy Transition System

The main field copy panel remains mounted while its internal text layers transition. This avoids empty gaps and creates a smoother operating-system-like mode switch.

### Scroll-Driven Spatial Reference Orbit

Field 04 uses a pseudo-3D reference orbit where visual cards float, recede and resolve around the active creator capture layer.

### Cinematic Inspect Reveal System

Inspect Optics opens as a cinematic product-inspection layer. The main shell scales smoothly, the base field dims, product cards appear in staged motion, and the user can return without flicker or broken repeat-open behavior.

### Visual Maturity / De-HUD System

The interface has been refined away from game-like HUD density toward quieter optical materiality, muted labels, machined glass controls and a more mature product-launch tone.

### GLSL Atmospheric Light Field

A lightweight WebGL/GLSL shader layer adds subtle optical haze, light diffusion, grain and mode-colored depth. It is intentionally restrained and should not read as a visible "shader effect."

### Optional WebXR Spatial Mode

The `/spatial` route provides an optional WebXR extension of the interface. It is a proof layer showing how the same Orbit Lens product system can move from web into spatial presentation.

---

## Routes

```text
/          Main Orbit Lens web interface
/spatial   Optional WebXR spatial mode
```

---

## Tech Stack

```text
Next.js
React
TypeScript
Tailwind CSS
Motion
Three.js / WebXR
GLSL / WebGL canvas shader
```

---

## Important Project Notes

Orbit Lens is intentionally web-first. The WebXR layer is optional and should not block the core product demo.

The current XR hand layer is experimental. Hand presence has been ported from the WhisperXR system, but hand navigation should be treated as a research layer rather than final production input.

The product is fictional. Avoid wording that implies a real hardware release, real AI processing or commercial device availability.

Recommended wording:

```text
fictional product concept
interactive product interface prototype
WebXR proof layer
experimental hand interaction
premium front-end / spatial UI case study
```

Avoid wording:

```text
real AI glasses
production hardware
available product
final VR control system
real AI processing
```

---

## Local Development

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Run development server for WebXR testing on the LAN:

```bash
npm run dev:https
```

This starts `next dev` with HTTPS and a LAN host so the `/spatial` route can be tested in glasses. If your network IP is different from the auto-detected one, override it with:

```bash
npm run dev:https -- --host 192.168.1.135
```

Open the HTTPS URL printed in the terminal, for example `https://192.168.1.135:3000/`.

Build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

Notes:

* This project uses Next.js. `npm run dev -- --force` is not supported here.
* If styles or runtime behavior look stale, restart the dev server normally.
* Do not commit `.bak` files or local staging assets.

---

## QA Gates

Before presenting or recording:

```bash
npm run lint
npm run build
```

Manual checks:

* Field 01–07 navigation works.
* Field copy transition has no empty gap.
* Field 04 Reference Orbit wheel interaction works.
* Inspect Optics opens, expands a card, closes and repeats correctly.
* Field 07 Access Console reads clearly.
* `/spatial` opens.
* Back to web works.
* OpenGraph and icon routes return images.
* No `.bak` files are staged.

---

## Known Limits

Current known limits:

* XR hand-navigation is experimental.
* Mobile/tablet recovery is postponed until after the flagship web and production polish pass.
* Spatial Mode art direction can be improved in a later XR-specific phase.
* The project is a concept case and does not include real hardware, backend, waitlist storage or AI processing.

---

## Documentation

Relevant project documentation:

```text
docs/orbit-visual-qa-23A.md
docs/orbit-demo-flow-23B.md
docs/orbit-visual-maturity-qa-24E.md
docs/orbit-final-build-gate-24F.md
```

Additional reusable-system PDFs were created outside the repository:

* Scroll-Driven Spatial Reference Orbit documentation
* Cinematic Inspect Reveal System documentation

---

## Portfolio Framing

Orbit Lens should be presented as:

```text
A premium fictional AI spatial glasses product concept and interactive web interface prototype, with an optional WebXR spatial extension.
```

Primary case-study categories:

* premium product storytelling;
* cinematic web interface;
* interactive front-end system;
* AI / AR / wearable product concept;
* WebXR proof layer;
* motion architecture;
* visual maturity / de-HUD system.

---

## Credits

Designed and developed by Brenych Studio.

Orbit Lens is a fictional product concept created for portfolio, interface research and premium front-end system demonstration.
