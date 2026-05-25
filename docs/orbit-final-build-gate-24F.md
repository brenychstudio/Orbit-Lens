# Orbit Lens — Final Build Gate 24F

## Purpose

This document records the final production-polish gate before Orbit Lens moves into portfolio capture, case packaging or a dedicated XR continuation phase.

This is a repo / production-readiness checklist, not a new design task.

---

## Current Status

Latest completed milestones:

- 23A — Web Visual QA after media refresh
- 23B — Demo Flow Lock
- 24A — Persistent Field Copy Transition System
- 24B — Field 02 Translate Layer Polish
- 24C — Field 05 Focus Quieting Polish
- 24D — Field 06 Privacy / Trust Boundary Polish
- 24E-A — Visual Maturity Atmosphere POC
- 24E-B — De-HUD Material System Pass
- 24E-C — Product Hero / Field 01 Hardware Confidence
- 24E-D — GLSL Atmospheric Light Field Prototype
- 24E-E — Full Visual Maturity QA
- 24E-F — Low-height fit + Inspect clipping fix
- 24F-A — Metadata / OG / Favicon / Product Disclaimer
- 24F-B — README / Repo Hygiene / Final Build Gate

---

## Production Gate Checklist

### Build / Lint

- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] No build warnings that block deploy
- [ ] No broken imports
- [ ] No missing assets

Notes:

---

### Main Web Experience

- [ ] Field 01 Vision loads cleanly
- [ ] Field 02 Translate reads clearly
- [ ] Field 03 Recall reads clearly
- [ ] Field 04 Reference Orbit works
- [ ] Field 05 Focus reads clearly
- [ ] Field 06 Privacy reads clearly
- [ ] Field 07 Access reads clearly
- [ ] Field navigation works by wheel
- [ ] Field navigation works by keyboard
- [ ] Persistent copy transition has no empty gap
- [ ] Bottom rail does not overlap important content
- [ ] Low-height desktop layout is acceptable at 1366x768
- [ ] 1440x900 and 1920x1080 regressions checked

Notes:

---

### Inspect Optics

- [ ] Inspect Optics opens smoothly
- [ ] Inspect Optics closes smoothly
- [ ] Return is visible
- [ ] Intro/header copy is not clipped
- [ ] Cards do not collide with bottom rail
- [ ] Expanded card opens
- [ ] Expanded card closes
- [ ] Repeat open works
- [ ] No flicker or repaint glitch

Notes:

---

### Visual Maturity

- [ ] Site feels less HUD/game-like
- [ ] Shell material feels premium
- [ ] Top strip is quieter
- [ ] Bottom rail is less neon-like
- [ ] GLSL layer adds depth without becoming decorative
- [ ] Product hero feels more like premium hardware launch
- [ ] No field became too dark or muddy
- [ ] The interface still feels usable

Notes:

---

### Metadata / Social / Icons

- [ ] Homepage title is correct
- [ ] Homepage description is correct
- [ ] OpenGraph metadata is present
- [ ] Twitter metadata is present
- [ ] `/opengraph-image` returns image
- [ ] `/twitter-image` returns image
- [ ] `/icon` returns image
- [ ] `/apple-icon` returns image
- [ ] `manifest.ts` works
- [ ] Product disclaimer is present and not intrusive

Notes:

---

### Spatial Mode

- [ ] `/spatial` route loads
- [ ] Back to web works
- [ ] Enter VR is available where supported
- [ ] Spatial Mode is presented as optional XR proof layer
- [ ] Hand navigation is not presented as production-final
- [ ] Web demo does not depend on XR being perfect

Notes:

---

### Repo Hygiene

- [ ] `git status` reviewed
- [ ] No `.bak` files staged
- [ ] No local-only `public/interface/new/` assets staged unless intentionally needed
- [ ] No unrelated XR experimental files staged
- [ ] No accidental `git add .`
- [ ] README updated
- [ ] Final build gate doc updated
- [ ] Commit is scoped

Notes:

---

## Known Non-Blocking Items

- XR hand-navigation is experimental.
- Mobile/tablet recovery is postponed.
- Spatial Mode art direction can be improved in a later XR phase.
- Further product-render improvements may be added later.
- Field Expanded Mode is not part of current production gate.

---

## Final Decision

Choose one after final QA:

- [ ] Ready for production polish completion
- [ ] Ready for portfolio capture
- [ ] Needs minor visual fix
- [ ] Needs metadata / OG fix
- [ ] Needs repo cleanup
- [ ] Needs build fix

Decision notes:

---

## Recommended Next Step

If this gate passes:

```text
24G — Demo Capture Preparation
```

Possible outputs:

* desktop screenshot list
* Inspect Optics capture list
* Field 04 interaction capture
* short 60–90 second demo recording script
* portfolio case copy draft

If this gate does not pass:

* fix only the failed checklist item
* do not reopen large design tasks unless necessary
