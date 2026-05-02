import * as THREE from "three";
import { orbitModes } from "@/data/orbitModes";
import { orbitSpatialTheme } from "./orbitSpatialTheme";

type NavigatorWithXR = Navigator & {
  xr?: {
    requestSession?: (
      mode: "immersive-vr",
      options?: XRSessionInit,
    ) => Promise<XRSession>;
  };
};

type OrbitSpatialSceneOptions = {
  mount: HTMLDivElement;
  initialIndex: number;
  onModeChange?: (index: number) => void;
};

export type OrbitSpatialSceneApi = {
  setMode: (index: number) => void;
  startVR: () => Promise<string>;
  dispose: () => void;
};

function colorFromAccent(accent: string) {
  const match = accent.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);

  if (!match) {
    return new THREE.Color("#9fd6ff");
  }

  return new THREE.Color(
    `rgb(${Number(match[1])}, ${Number(match[2])}, ${Number(match[3])})`,
  );
}

function makeTextTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1600;
  canvas.height = 900;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create XR text canvas context.");
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  return { canvas, context, texture };
}

function drawTextPanel(
  context: CanvasRenderingContext2D,
  texture: THREE.CanvasTexture,
  modeIndex: number,
) {
  const mode = orbitModes[modeIndex];
  const canvas = context.canvas;

  context.clearRect(0, 0, canvas.width, canvas.height);

  const accent = mode.accent;

  context.fillStyle = "rgba(3, 5, 8, 0.58)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const gradient = context.createRadialGradient(1260, 160, 40, 1260, 160, 760);
  gradient.addColorStop(0, accent.replace("0.72", "0.2"));
  gradient.addColorStop(0.42, "rgba(255,255,255,0.025)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "rgba(255,255,255,0.16)";
  context.lineWidth = 2;
  context.strokeRect(44, 44, canvas.width - 88, canvas.height - 88);

  context.strokeStyle = "rgba(255,255,255,0.055)";
  context.strokeRect(70, 70, canvas.width - 140, canvas.height - 140);

  context.font =
    "500 34px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  context.letterSpacing = "7px";
  context.fillStyle = accent;
  context.fillText(mode.eyebrow.toUpperCase(), 104, 160);

  context.letterSpacing = "0px";
  context.font =
    "300 96px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  context.fillStyle = "rgba(244,239,230,0.96)";

  const titleWords = mode.title.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  titleWords.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = context.measureText(testLine).width;

    if (width > 1020 && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  lines.slice(0, 3).forEach((line, index) => {
    context.fillText(line, 104, 282 + index * 102);
  });

  context.font =
    "400 42px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  context.fillStyle = "rgba(244,239,230,0.68)";
  context.fillText(mode.tagline, 104, 650);

  context.font =
    "400 26px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  context.letterSpacing = "3px";
  context.fillStyle = "rgba(244,239,230,0.42)";
  context.fillText(mode.signal.toUpperCase(), 104, 748);

  context.letterSpacing = "0px";
  texture.needsUpdate = true;
}

function createLine(points: THREE.Vector3[], color: THREE.ColorRepresentation) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.26,
  });

  return new THREE.Line(geometry, material);
}

function createProductProxy(accentColor: THREE.Color) {
  const group = new THREE.Group();
  group.name = "Orbit Lens product proxy";

  const lensMaterial = new THREE.MeshBasicMaterial({
    color: accentColor,
    transparent: true,
    opacity: 0.18,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.42,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const lensGeometry = new THREE.TorusGeometry(0.34, 0.018, 18, 96);
  const leftLens = new THREE.Mesh(lensGeometry, ringMaterial.clone());
  const rightLens = new THREE.Mesh(lensGeometry, ringMaterial.clone());

  leftLens.position.x = -0.42;
  rightLens.position.x = 0.42;

  const bridge = new THREE.Mesh(
    new THREE.BoxGeometry(0.36, 0.025, 0.025),
    ringMaterial.clone(),
  );
  bridge.position.y = 0.02;

  const leftGlass = new THREE.Mesh(
    new THREE.CircleGeometry(0.29, 64),
    lensMaterial.clone(),
  );
  const rightGlass = new THREE.Mesh(
    new THREE.CircleGeometry(0.29, 64),
    lensMaterial.clone(),
  );

  leftGlass.position.x = -0.42;
  rightGlass.position.x = 0.42;
  leftGlass.position.z = -0.006;
  rightGlass.position.z = -0.006;

  const brow = new THREE.Mesh(
    new THREE.BoxGeometry(1.08, 0.018, 0.018),
    ringMaterial.clone(),
  );
  brow.position.y = 0.35;

  group.add(leftGlass, rightGlass, leftLens, rightLens, bridge, brow);
  group.scale.setScalar(1.18);
  group.position.set(0, -0.34, -2.02);

  return group;
}

export function createOrbitSpatialScene({
  mount,
  initialIndex,
  onModeChange,
}: OrbitSpatialSceneOptions): OrbitSpatialSceneApi {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType("local-floor");

  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(orbitSpatialTheme.background);
  scene.fog = new THREE.FogExp2(orbitSpatialTheme.background, 0.055);

  const camera = new THREE.PerspectiveCamera(
    58,
    mount.clientWidth / Math.max(mount.clientHeight, 1),
    0.05,
    80,
  );
  camera.position.set(0, 1.58, 3.55);

  const rig = new THREE.Group();
  rig.add(camera);
  scene.add(rig);

  const root = new THREE.Group();
  root.position.set(0, 1.38, 0);
  scene.add(root);

  const currentMode = {
    index: Math.min(Math.max(initialIndex, 0), orbitModes.length - 1),
  };

  const activeAccent = colorFromAccent(orbitModes[currentMode.index].accent);

  const { context, texture } = makeTextTexture();
  drawTextPanel(context, texture, currentMode.index);

  const panelMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.92,
    side: THREE.DoubleSide,
  });

  const panel = new THREE.Mesh(new THREE.PlaneGeometry(4.45, 2.5), panelMaterial);
  panel.position.set(0, 0.18, -2.6);
  root.add(panel);

  const panelEdge = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.PlaneGeometry(4.52, 2.57)),
    new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.16,
    }),
  );
  panelEdge.position.copy(panel.position);
  root.add(panelEdge);

  const product = createProductProxy(activeAccent);
  root.add(product);

  const railPoints: THREE.Vector3[] = [];
  for (let i = 0; i <= 80; i += 1) {
    const t = i / 80;
    const x = THREE.MathUtils.lerp(-1.72, 1.72, t);
    const y = -1.22 - Math.sin(t * Math.PI) * 0.1;
    railPoints.push(new THREE.Vector3(x, y, -2.08));
  }

  const rail = createLine(railPoints, activeAccent);
  root.add(rail);

  const nodeGeometry = new THREE.SphereGeometry(0.045, 24, 24);
  const nodeObjects: THREE.Mesh[] = [];

  orbitModes.forEach((mode, index) => {
    const t =
      orbitModes.length > 1 ? index / Math.max(orbitModes.length - 1, 1) : 0.5;
    const x = THREE.MathUtils.lerp(-1.72, 1.72, t);
    const y = -1.22 - Math.sin(t * Math.PI) * 0.1;

    const material = new THREE.MeshBasicMaterial({
      color: index === currentMode.index ? colorFromAccent(mode.accent) : 0xffffff,
      transparent: true,
      opacity: index === currentMode.index ? 0.95 : 0.34,
      depthWrite: false,
    });

    const node = new THREE.Mesh(nodeGeometry, material);
    node.position.set(x, y, -2.08);
    node.userData.modeIndex = index;
    nodeObjects.push(node);
    root.add(node);
  });

  const starGroup = new THREE.Group();
  const starGeometry = new THREE.SphereGeometry(0.006, 8, 8);
  const starMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.24,
  });

  for (let i = 0; i < 150; i += 1) {
    const star = new THREE.Mesh(starGeometry, starMaterial);
    star.position.set(
      THREE.MathUtils.randFloatSpread(8),
      THREE.MathUtils.randFloat(0.2, 4.5),
      THREE.MathUtils.randFloat(-7, -3),
    );
    starGroup.add(star);
  }

  scene.add(starGroup);

  const pointer = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  function setMode(index: number) {
    const nextIndex = Math.min(Math.max(index, 0), orbitModes.length - 1);
    currentMode.index = nextIndex;

    const mode = orbitModes[nextIndex];
    const nextAccent = colorFromAccent(mode.accent);

    drawTextPanel(context, texture, nextIndex);

    nodeObjects.forEach((node, nodeIndex) => {
      const material = node.material as THREE.MeshBasicMaterial;
      const isActive = nodeIndex === nextIndex;
      material.color.copy(isActive ? nextAccent : new THREE.Color(0xffffff));
      material.opacity = isActive ? 0.95 : 0.34;
    });

    const railMaterial = rail.material as THREE.LineBasicMaterial;
    railMaterial.color.copy(nextAccent);

    product.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = child.material as THREE.MeshBasicMaterial;

        if (material.opacity < 0.24) {
          material.color.copy(nextAccent);
        }
      }
    });

    onModeChange?.(nextIndex);
  }

  function handlePointerDown(event: PointerEvent) {
    const bounds = renderer.domElement.getBoundingClientRect();

    pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    const intersections = raycaster.intersectObjects(nodeObjects, false);
    const first = intersections[0]?.object;

    if (first && typeof first.userData.modeIndex === "number") {
      setMode(first.userData.modeIndex);
    }
  }

  renderer.domElement.addEventListener("pointerdown", handlePointerDown);

  const resizeObserver = new ResizeObserver(() => {
    const width = mount.clientWidth;
    const height = Math.max(mount.clientHeight, 1);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  });

  resizeObserver.observe(mount);

  const clock = new THREE.Clock();

  renderer.setAnimationLoop(() => {
    const elapsed = clock.getElapsedTime();

    root.rotation.y = Math.sin(elapsed * 0.18) * 0.025;
    root.position.y = 1.38 + Math.sin(elapsed * 0.32) * 0.018;

    product.rotation.y = Math.sin(elapsed * 0.45) * 0.065;
    product.position.y = -0.34 + Math.sin(elapsed * 0.58) * 0.018;

    nodeObjects.forEach((node, index) => {
      const isActive = index === currentMode.index;
      const pulse = isActive ? 1 + Math.sin(elapsed * 2.2) * 0.14 : 1;
      node.scale.setScalar(pulse);
    });

    starGroup.rotation.y += 0.00045;

    renderer.render(scene, camera);
  });

  async function startVR() {
    const xr = (navigator as NavigatorWithXR).xr;

    if (!xr?.requestSession) {
      return "WebXR requestSession is not available.";
    }

    try {
      const session = await xr.requestSession("immersive-vr", {
        optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking"],
      });

      await renderer.xr.setSession(session);
      return "VR session active.";
    } catch {
      return "Could not start VR session.";
    }
  }

  function dispose() {
    renderer.setAnimationLoop(null);
    renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
    resizeObserver.disconnect();

    scene.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
        object.geometry?.dispose();

        const material = object.material;

        if (Array.isArray(material)) {
          material.forEach((item) => item.dispose());
        } else {
          material?.dispose();
        }
      }
    });

    texture.dispose();
    renderer.dispose();

    if (renderer.domElement.parentElement === mount) {
      mount.removeChild(renderer.domElement);
    }
  }

  return {
    setMode,
    startVR,
    dispose,
  };
}
