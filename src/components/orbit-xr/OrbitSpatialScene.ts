import * as THREE from "three";
import { orbitModes } from "@/data/orbitModes";
import { opticsAssets as rawOpticsAssets } from "@/data/opticsAssets";
import { orbitSpatialTheme } from "./orbitSpatialTheme";
import { createHandPresenceSystem } from "./hands/createHandPresenceSystem.js";
import { createHandVisualProxySystem } from "./hands/createHandVisualProxySystem.js";

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
  setInspectMode: (isOpen: boolean) => void;
  startVR: () => Promise<string>;
  dispose: () => void;
};

type XROpticsAsset = {
  id?: string;
  title?: string;
  label?: string;
  layer?: string;
  name?: string;
  description?: string;
  note?: string;
  image?: string;
  src?: string;
  path?: string;
  asset?: string;
  ratio?: string;
};

const xrOpticsAssets = (rawOpticsAssets as unknown as readonly XROpticsAsset[])
  .slice(0, 5)
  .map((asset, index) => ({
    id: asset.id ?? `xr-optics-${index}`,
    title:
      asset.title ??
      asset.label ??
      asset.layer ??
      asset.name ??
      `Optics layer ${String(index + 1).padStart(2, "0")}`,
    note:
      asset.note ??
      asset.description ??
      asset.layer ??
      "Spatial optics layer",
    image:
      asset.image ??
      asset.src ??
      asset.path ??
      asset.asset ??
      orbitSpatialTheme.productImage,
  }));

function colorFromAccent(accent: string) {
  const match = accent.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);

  if (!match) {
    return new THREE.Color("#9fd6ff");
  }

  return new THREE.Color(
    `rgb(${Number(match[1])}, ${Number(match[2])}, ${Number(match[3])})`,
  );
}

function makeCanvasTexture(width = 1600, height = 900) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create XR canvas context.");
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
  const accent = mode.accent;

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "rgba(3, 5, 8, 0.78)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const glow = context.createRadialGradient(1240, 170, 40, 1240, 170, 740);
  glow.addColorStop(0, accent.replace("0.72", "0.22"));
  glow.addColorStop(0.38, "rgba(255,255,255,0.026)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const lowerGlow = context.createRadialGradient(740, 760, 40, 740, 760, 720);
  lowerGlow.addColorStop(0, "rgba(255,255,255,0.055)");
  lowerGlow.addColorStop(1, "rgba(0,0,0,0)");
  context.fillStyle = lowerGlow;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "rgba(255,255,255,0.09)";
  context.lineWidth = 2;
  context.strokeRect(44, 44, canvas.width - 88, canvas.height - 88);

  context.strokeStyle = "rgba(255,255,255,0.035)";
  context.strokeRect(72, 72, canvas.width - 144, canvas.height - 144);

  context.beginPath();
  context.moveTo(110, 610);
  context.lineTo(1490, 610);
  context.strokeStyle = "rgba(255,255,255,0.09)";
  context.lineWidth = 1;
  context.stroke();

  context.font =
    "500 32px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  context.letterSpacing = "7px";
  context.fillStyle = accent;
  context.fillText(mode.eyebrow.toUpperCase(), 110, 155);

  context.letterSpacing = "0px";
  context.font =
    "300 104px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  context.fillStyle = "rgba(244,239,230,0.96)";

  const words = mode.title.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = context.measureText(testLine).width;

    if (width > 1050 && currentLine) {
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
    context.fillText(line, 110, 278 + index * 98);
  });

  context.font =
    "400 38px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  context.fillStyle = "rgba(244,239,230,0.68)";
  context.fillText(mode.tagline, 110, 692);

  context.font =
    "500 24px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  context.letterSpacing = "4px";
  context.fillStyle = "rgba(244,239,230,0.42)";
  context.fillText(mode.signal.toUpperCase(), 110, 778);

  context.letterSpacing = "0px";

  texture.needsUpdate = true;
}

function createLine(
  points: THREE.Vector3[],
  color: THREE.ColorRepresentation,
  opacity = 0.26,
) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
  });

  return new THREE.Line(geometry, material);
}

const HAND_NODE_HOVER_RADIUS = 0.28;
const HAND_INSPECT_HOVER_RADIUS = 0.62;
const HAND_NAV_HOVER_RADIUS = 0.58;
const HAND_POINTER_MAX_DISTANCE = 4.4;
const HAND_PINCH_SELECT_RADIUS = 0.082;
const HAND_SELECT_COOLDOWN_MS = 720;
const HAND_INSPECT_SELECT_COOLDOWN_MS = 680;
const HAND_NAV_SELECT_COOLDOWN_MS = 760;
const HAND_POINTER_ORIGIN_LERP = 0.24;
const HAND_POINTER_DIRECTION_LERP = 0.18;

function readXRHandJointPosition({
  frame,
  referenceSpace,
  inputSource,
  jointName,
  target,
}: {
  frame: XRFrame;
  referenceSpace: XRReferenceSpace;
  inputSource: XRInputSource;
  jointName: XRHandJoint;
  target: THREE.Vector3;
}) {
  const hand = inputSource.hand;

  if (!hand) {
    return false;
  }

  const jointSpace = hand.get(jointName);

  if (!jointSpace) {
    return false;
  }

  const getJointPose = frame.getJointPose;

  if (typeof getJointPose !== "function") {
    return false;
  }

  const jointPose = getJointPose.call(frame, jointSpace, referenceSpace);

  if (!jointPose) {
    return false;
  }

  const position = jointPose.transform.position;
  target.set(position.x, position.y, position.z);

  return true;
}

function createLabelSprite(label: string) {
  const { canvas, context, texture } = makeCanvasTexture(512, 128);

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "rgba(5,8,11,0.58)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "rgba(255,255,255,0.12)";
  context.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

  context.font =
    "600 34px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  context.letterSpacing = "5px";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "rgba(244,239,230,0.78)";
  context.fillText(label.toUpperCase(), canvas.width / 2, canvas.height / 2);

  texture.needsUpdate = true;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.44, 0.11, 1);
  sprite.userData.texture = texture;

  return sprite;
}

function createHandPointerVisual(accentColor: THREE.Color) {
  const positions = new Float32Array(2 * 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.LineBasicMaterial({
    color: accentColor,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    depthTest: false,
  });

  const line = new THREE.Line(geometry, material);
  line.name = "xr hand pointer ray";
  line.renderOrder = 120;
  line.visible = false;

  const reticleMaterial = new THREE.MeshBasicMaterial({
    color: accentColor,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    depthTest: false,
  });

  const reticle = new THREE.Mesh(
    new THREE.SphereGeometry(0.024, 20, 20),
    reticleMaterial,
  );

  reticle.name = "xr hand pointer reticle";
  reticle.renderOrder = 122;
  reticle.visible = false;

  function setVisible(isVisible: boolean) {
    line.visible = isVisible;
    reticle.visible = isVisible;
  }

  function setAccent(nextAccent: THREE.Color) {
    material.color.copy(nextAccent);
    reticleMaterial.color.copy(nextAccent);
  }

  const smoothOrigin = new THREE.Vector3();
  const smoothEnd = new THREE.Vector3();
  const smoothReticle = new THREE.Vector3();
  let hasSmoothedOnce = false;

  function update({
    origin,
    end,
    hitPoint,
    hasHit,
  }: {
    origin: THREE.Vector3;
    end: THREE.Vector3;
    hitPoint: THREE.Vector3 | null;
    hasHit: boolean;
  }) {
    const targetEnd = hasHit && hitPoint ? hitPoint : end;

    if (!hasSmoothedOnce) {
      smoothOrigin.copy(origin);
      smoothEnd.copy(targetEnd);

      if (hitPoint) {
        smoothReticle.copy(hitPoint);
      }

      hasSmoothedOnce = true;
    }

    smoothOrigin.lerp(origin, 0.34);
    smoothEnd.lerp(targetEnd, hasHit ? 0.3 : 0.2);

    positions[0] = smoothOrigin.x;
    positions[1] = smoothOrigin.y;
    positions[2] = smoothOrigin.z;
    positions[3] = smoothEnd.x;
    positions[4] = smoothEnd.y;
    positions[5] = smoothEnd.z;

    geometry.attributes.position.needsUpdate = true;

    material.opacity = hasHit ? 0.42 : 0.2;
    reticleMaterial.opacity = hasHit ? 0.88 : 0;

    reticle.visible = hasHit && Boolean(hitPoint);

    if (hitPoint) {
      smoothReticle.lerp(hitPoint, 0.32);
      reticle.position.copy(smoothReticle);
    }
  }

  function dispose() {
    geometry.dispose();
    material.dispose();
    reticle.geometry.dispose();
    reticleMaterial.dispose();
  }

  return {
    line,
    reticle,
    setVisible,
    setAccent,
    update,
    dispose,
  };
}
function createVRControlLabel(label: string) {
  const { canvas, context, texture } = makeCanvasTexture(512, 160);

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "rgba(3, 6, 9, 0.72)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "rgba(255,255,255,0.13)";
  context.lineWidth = 2;
  context.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);

  context.font =
    "600 34px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  context.letterSpacing = "7px";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "rgba(244,239,230,0.78)";
  context.fillText(label.toUpperCase(), canvas.width / 2, canvas.height / 2);

  texture.needsUpdate = true;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 0.72,
    depthWrite: false,
    depthTest: false,
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.52, 0.16, 1);
  sprite.userData.texture = texture;

  return sprite;
}

function setObjectOpacity(object: THREE.Object3D, weight: number) {
  object.traverse((child) => {
    if (
      child instanceof THREE.Mesh ||
      child instanceof THREE.Line ||
      child instanceof THREE.Sprite
    ) {
      const material = child.material;

      if (Array.isArray(material)) {
        material.forEach((item) => {
          const baseOpacity =
            typeof item.userData.baseOpacity === "number"
              ? item.userData.baseOpacity
              : item.opacity;

          item.userData.baseOpacity = baseOpacity;
          item.opacity = baseOpacity * weight;
          item.transparent = true;
          item.needsUpdate = true;
        });

        return;
      }

      if (material) {
        const baseOpacity =
          typeof material.userData.baseOpacity === "number"
            ? material.userData.baseOpacity
            : material.opacity;

        material.userData.baseOpacity = baseOpacity;
        material.opacity = baseOpacity * weight;
        material.transparent = true;
        material.needsUpdate = true;
      }
    }
  });
}

function createGlassPlane(
  width: number,
  height: number,
  color: THREE.ColorRepresentation,
  opacity: number,
) {
  return new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
}

function createProductStage() {
  const group = new THREE.Group();
  group.name = "Orbit Lens product stage";

  const textureLoader = new THREE.TextureLoader();
  const productTexture = textureLoader.load(orbitSpatialTheme.productImage);
  productTexture.colorSpace = THREE.SRGBColorSpace;
  productTexture.anisotropy = 8;

  const imagePlane = new THREE.Mesh(
    new THREE.PlaneGeometry(2.86, 1.6),
    new THREE.MeshBasicMaterial({
      map: productTexture,
      transparent: true,
      opacity: 0.86,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  imagePlane.position.set(0, -0.02, 0.012);
  group.add(imagePlane);

  const plate = createGlassPlane(3.02, 1.68, "#030609", 0.3);
  plate.position.z = -0.01;
  group.add(plate);

  const edge = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.PlaneGeometry(3.02, 1.68)),
    new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.18,
    }),
  );
  edge.position.z = 0.018;
  group.add(edge);

  group.position.set(0, -0.9, -1.78);

  return { group, productTexture };
}

function createInspectCard({
  asset,
  index,
  textureLoader,
  accentColor,
}: {
  asset: (typeof xrOpticsAssets)[number];
  index: number;
  textureLoader: THREE.TextureLoader;
  accentColor: THREE.Color;
}) {
  const group = new THREE.Group();
  group.name = `xr inspect card ${asset.id}`;
  group.userData.inspectIndex = index;

  const imageTexture = textureLoader.load(asset.image, (loadedTexture) => {
    const source = loadedTexture.image as {
      width?: number;
      height?: number;
      naturalWidth?: number;
      naturalHeight?: number;
    };

    const sourceWidth = source.naturalWidth ?? source.width ?? 1600;
    const sourceHeight = source.naturalHeight ?? source.height ?? 900;
    const aspect = sourceWidth / Math.max(sourceHeight, 1);

    const maxWidth = 1.14;
    const maxHeight = 0.66;
    const targetRatio = maxWidth / maxHeight;

    const width = aspect >= targetRatio ? maxWidth : maxHeight * aspect;
    const height = aspect >= targetRatio ? maxWidth / aspect : maxHeight;

    image.scale.set(width, height, 1);
    loadedTexture.needsUpdate = true;
  });
  imageTexture.colorSpace = THREE.SRGBColorSpace;
  imageTexture.anisotropy = 8;

  const card = createGlassPlane(1.26, 0.82, "#05080a", 0.42);
  card.name = "xr inspect card backing";
  card.userData.inspectIndex = index;
  card.renderOrder = 30 + index;

  const cardMaterial = card.material as THREE.MeshBasicMaterial;
  cardMaterial.depthTest = false;
  group.add(card);

  const image = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      map: imageTexture,
      transparent: true,
      opacity: 0.82,
      side: THREE.DoubleSide,
      depthWrite: false,
      depthTest: false,
    }),
  );
  image.name = "xr inspect card image";
  image.userData.inspectIndex = index;
  image.position.set(0, 0.06, 0.035);
  image.scale.set(1.14, 0.64, 1);
  image.renderOrder = 32 + index;
  image.userData.texture = imageTexture;
  group.add(image);

  const edge = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.28, 0.84)),
    new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.13,
      depthTest: false,
    }),
  );
  edge.name = "xr inspect card edge";
  edge.userData.inspectIndex = index;
  edge.position.z = 0.052;
  edge.renderOrder = 33 + index;
  group.add(edge);

  const accentLine = createLine(
    [
      new THREE.Vector3(-0.48, -0.27, 0.062),
      new THREE.Vector3(0.48, -0.27, 0.062),
    ],
    accentColor,
    0.24,
  );
  accentLine.name = "xr inspect card accent line";
  accentLine.userData.inspectIndex = index;
  accentLine.renderOrder = 34 + index;
  const accentMaterial = accentLine.material as THREE.LineBasicMaterial;
  accentMaterial.depthTest = false;
  group.add(accentLine);

  const label = createLabelSprite(asset.title);
  label.name = "xr inspect card label";
  label.userData.inspectIndex = index;
  label.position.set(0, -0.46, 0.07);
  label.scale.set(0.5, 0.12, 1);
  label.renderOrder = 35 + index;
  const labelMaterial = label.material as THREE.SpriteMaterial;
  labelMaterial.depthTest = false;
  labelMaterial.opacity = 0.34;
  group.add(label);

  const positions = [
    new THREE.Vector3(-2.28, -0.18, -0.72),
    new THREE.Vector3(-1.12, 0.12, -0.62),
    new THREE.Vector3(0, 0.28, -0.54),
    new THREE.Vector3(1.12, 0.12, -0.62),
    new THREE.Vector3(2.28, -0.18, -0.72),
  ];

  const rotations = [
    new THREE.Euler(0, 0.2, -0.035),
    new THREE.Euler(0, 0.1, -0.012),
    new THREE.Euler(0, 0, 0),
    new THREE.Euler(0, -0.1, 0.012),
    new THREE.Euler(0, -0.2, 0.035),
  ];

  const fallbackPosition = new THREE.Vector3(
    THREE.MathUtils.lerp(-2.2, 2.2, index / Math.max(xrOpticsAssets.length - 1, 1)),
    -0.62,
    -0.66,
  );

  group.position.copy(positions[index] ?? fallbackPosition);
  group.rotation.copy(rotations[index] ?? new THREE.Euler(0, 0, 0));
  group.scale.setScalar(index === 2 ? 0.88 : 0.78);

  group.userData.basePosition = group.position.clone();
  group.userData.baseRotation = group.rotation.clone();
  group.userData.baseScale = group.scale.x;

  return {
    group,
    hitObject: image,
    imageTexture,
  };
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

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType("local-floor");

  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(orbitSpatialTheme.background);
  scene.fog = new THREE.FogExp2(orbitSpatialTheme.background, 0.052);

  const camera = new THREE.PerspectiveCamera(
    58,
    mount.clientWidth / Math.max(mount.clientHeight, 1),
    0.05,
    90,
  );
  camera.position.set(0, 1.44, 2.58);

  const rig = new THREE.Group();
  rig.add(camera);
  scene.add(rig);

  const root = new THREE.Group();
  root.position.set(0, 0.98, -1.92);
  root.scale.setScalar(0.78);
  scene.add(root);

  const currentMode = {
    index: Math.min(Math.max(initialIndex, 0), orbitModes.length - 1),
  };
  const inspectState = {
    isOpen: false,
    weight: 0,
    focusedIndex: null as number | null,
  };

  const activeAccent = colorFromAccent(orbitModes[currentMode.index].accent);

  const { context, texture } = makeCanvasTexture();
  drawTextPanel(context, texture, currentMode.index);

  const panelGroup = new THREE.Group();
  panelGroup.position.set(0, 0.2, -2.28);
  root.add(panelGroup);

  const panelMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.92,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const mainPanel = new THREE.Mesh(new THREE.PlaneGeometry(5.55, 3.1), panelMaterial);
  panelGroup.add(mainPanel);

  const backing = createGlassPlane(5.72, 3.25, "#020407", 0.5);
  backing.position.z = -0.025;
  panelGroup.add(backing);

  const leftWing = createGlassPlane(1.38, 2.7, "#071018", 0.26);
  leftWing.position.set(-3.16, -0.02, 0.02);
  leftWing.rotation.y = 0.34;
  panelGroup.add(leftWing);

  const rightWing = createGlassPlane(1.38, 2.7, "#071018", 0.26);
  rightWing.position.set(3.16, -0.02, 0.02);
  rightWing.rotation.y = -0.34;
  panelGroup.add(rightWing);

  const panelEdge = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.PlaneGeometry(5.62, 3.16)),
    new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.16,
    }),
  );
  panelEdge.position.z = 0.018;
  panelGroup.add(panelEdge);

  const scanline = createLine(
    [new THREE.Vector3(-2.12, -0.46, 0.03), new THREE.Vector3(2.12, -0.46, 0.03)],
    activeAccent,
    0.34,
  );
  panelGroup.add(scanline);

  const { group: productStage, productTexture } = createProductStage();
  root.add(productStage);

  const textureLoader = new THREE.TextureLoader();

  const inspectGroup = new THREE.Group();
  inspectGroup.name = "XR Inspect Optics layer";
  inspectGroup.visible = false;
  inspectGroup.position.set(0, 0.08, -0.58);
  root.add(inspectGroup);

  const inspectHitObjects: THREE.Object3D[] = [];
  const inspectTextures: THREE.Texture[] = [];

  xrOpticsAssets.forEach((asset, index) => {
    const { group, hitObject, imageTexture } = createInspectCard({
      asset,
      index,
      textureLoader,
      accentColor: activeAccent,
    });

    inspectGroup.add(group);
    inspectHitObjects.push(hitObject);
    inspectTextures.push(imageTexture);
  });

  setObjectOpacity(inspectGroup, 0);

  const inspectHandHoverFrame = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.42, 0.94)),
    new THREE.LineBasicMaterial({
      color: activeAccent,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      depthTest: false,
    }),
  );

  inspectHandHoverFrame.name = "hand hover inspect card frame";
  inspectHandHoverFrame.visible = false;
  inspectHandHoverFrame.renderOrder = 96;
  inspectGroup.add(inspectHandHoverFrame);

  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(0.78, 0.003, 12, 160),
    new THREE.MeshBasicMaterial({
      color: activeAccent,
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
    }),
  );
  halo.rotation.x = Math.PI / 2.16;
  halo.position.set(0, -0.86, -1.74);
  root.add(halo);

  const railPoints: THREE.Vector3[] = [];
  for (let i = 0; i <= 96; i += 1) {
    const t = i / 96;
    const x = THREE.MathUtils.lerp(-2.05, 2.05, t);
    const y = -1.42 - Math.sin(t * Math.PI) * 0.12;
    const z = -1.48 - Math.sin(t * Math.PI) * 0.08;
    railPoints.push(new THREE.Vector3(x, y, z));
  }

  const rail = createLine(railPoints, activeAccent, 0.28);
  root.add(rail);

  const activeHalo = new THREE.Mesh(
    new THREE.TorusGeometry(0.066, 0.003, 10, 48),
    new THREE.MeshBasicMaterial({
      color: activeAccent,
      transparent: true,
      opacity: 0.62,
      depthWrite: false,
    }),
  );
  activeHalo.rotation.x = Math.PI / 2;
  root.add(activeHalo);

  const handHoverHalo = new THREE.Mesh(
    new THREE.TorusGeometry(0.108, 0.004, 10, 56),
    new THREE.MeshBasicMaterial({
      color: activeAccent,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      depthTest: false,
    }),
  );
  handHoverHalo.name = "hand hover mode node halo";
  handHoverHalo.rotation.x = Math.PI / 2;
  handHoverHalo.visible = false;
  handHoverHalo.renderOrder = 72;
  root.add(handHoverHalo);

  type VRNavAction = "prev" | "next" | "inspect" | "exit";

  const vrNavGroup = new THREE.Group();
  vrNavGroup.name = "VR runtime navigation console";
  vrNavGroup.position.set(0, -0.46, -0.32);
  vrNavGroup.visible = false;
  root.add(vrNavGroup);

  const vrNavHitObjects: THREE.Mesh[] = [];
  const vrNavLabels: THREE.Sprite[] = [];
  const vrNavActions: VRNavAction[] = ["prev", "next", "inspect", "exit"];
  const vrNavLabelMap: Record<VRNavAction, string> = {
    prev: "Prev",
    next: "Next",
    inspect: "Inspect",
    exit: "Exit",
  };

  const vrNavState = {
    hoveredAction: null as VRNavAction | null,
    lastPinchActive: false,
    lastSelectAt: 0,
    isImmersive: false,
  };

  const vrNavWorldPosition = new THREE.Vector3();
  const handPointerRaycaster = new THREE.Raycaster();
  handPointerRaycaster.far = HAND_POINTER_MAX_DISTANCE;

  const handPointerOrigin = new THREE.Vector3();
  const handPointerBase = new THREE.Vector3();
  const handPointerThumb = new THREE.Vector3();
  const handPointerDirection = new THREE.Vector3();
  const handPointerEnd = new THREE.Vector3();
  const handPointerHitPoint = new THREE.Vector3();
  const handPointerSmoothOrigins = [new THREE.Vector3(), new THREE.Vector3()];
  const handPointerSmoothDirections = [
    new THREE.Vector3(0, 0, -1),
    new THREE.Vector3(0, 0, -1),
  ];
  const handPointerHasSmooth = [false, false];

  const handPointerVisuals = [
    createHandPointerVisual(activeAccent),
    createHandPointerVisual(activeAccent),
  ];

  handPointerVisuals.forEach((visual) => {
    scene.add(visual.line);
    scene.add(visual.reticle);
  });

  vrNavActions.forEach((action, index) => {
    const x = THREE.MathUtils.lerp(-1.35, 1.35, index / 3);

    const button = new THREE.Mesh(
      new THREE.PlaneGeometry(action === "inspect" ? 1.42 : 1.06, 0.58),
      new THREE.MeshBasicMaterial({
        color: action === "inspect" ? activeAccent : new THREE.Color("#091016"),
        transparent: true,
        opacity: action === "inspect" ? 0.24 : 0.18,
        side: THREE.DoubleSide,
        depthWrite: false,
        depthTest: false,
      }),
    );

    button.name = `vr nav ${action}`;
    button.userData.vrNavAction = action;
    button.position.set(x, 0, 0);
    button.renderOrder = 100;
    vrNavGroup.add(button);
    vrNavHitObjects.push(button);

    const label = createVRControlLabel(vrNavLabelMap[action]);
    label.name = `vr nav ${action} label`;
    label.position.set(x, 0.006, 0.026);
    label.renderOrder = 104;
    vrNavGroup.add(label);
    vrNavLabels.push(label);

    const edge = new THREE.LineSegments(
      new THREE.EdgesGeometry(
        new THREE.PlaneGeometry(action === "inspect" ? 1.44 : 1.08, 0.6),
      ),
      new THREE.LineBasicMaterial({
        color: action === "inspect" ? activeAccent : 0xffffff,
        transparent: true,
        opacity: action === "inspect" ? 0.22 : 0.12,
        depthTest: false,
      }),
    );

    edge.name = `vr nav ${action} edge`;
    edge.position.set(x, 0, 0.032);
    edge.renderOrder = 103;
    vrNavGroup.add(edge);
  });

  const nodeGeometry = new THREE.SphereGeometry(0.038, 20, 20);
  const nodeObjects: THREE.Mesh[] = [];
  const nodeLabels: THREE.Sprite[] = [];
  const handNodeInteraction = {
    hoveredIndex: null as number | null,
    lastPinchActive: false,
    lastSelectAt: 0,
  };

  const handInspectInteraction = {
    hoveredIndex: null as number | null,
    lastPinchActive: false,
    lastSelectAt: 0,
  };

  const handIndexTipWorld = new THREE.Vector3();
  const handThumbTipWorld = new THREE.Vector3();
  const nodeWorldPosition = new THREE.Vector3();
  const inspectCardWorldPosition = new THREE.Vector3();

  orbitModes.forEach((mode, index) => {
    const t =
      orbitModes.length > 1 ? index / Math.max(orbitModes.length - 1, 1) : 0.5;
    const x = THREE.MathUtils.lerp(-2.05, 2.05, t);
    const y = -1.42 - Math.sin(t * Math.PI) * 0.12;
    const z = -1.48 - Math.sin(t * Math.PI) * 0.08;

    const material = new THREE.MeshBasicMaterial({
      color: index === currentMode.index ? colorFromAccent(mode.accent) : 0xffffff,
      transparent: true,
      opacity: index === currentMode.index ? 0.95 : 0.32,
      depthWrite: false,
    });

    const node = new THREE.Mesh(nodeGeometry, material);
    node.position.set(x, y, z);
    node.userData.modeIndex = index;
    nodeObjects.push(node);
    root.add(node);

    const label = createLabelSprite(String(index + 1).padStart(2, "0"));
    label.position.set(x, y - 0.14, z + 0.005);
    label.material.opacity = index === currentMode.index ? 0.58 : 0.22;
    nodeLabels.push(label);
    root.add(label);
  });

  activeHalo.position.copy(nodeObjects[currentMode.index].position);

  const atmosphereGroup = new THREE.Group();
  scene.add(atmosphereGroup);

  const starGeometry = new THREE.SphereGeometry(0.006, 8, 8);
  const starMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.24,
  });

  for (let i = 0; i < 170; i += 1) {
    const star = new THREE.Mesh(starGeometry, starMaterial);
    star.position.set(
      THREE.MathUtils.randFloatSpread(8),
      THREE.MathUtils.randFloat(0.16, 4.8),
      THREE.MathUtils.randFloat(-7.5, -3.4),
    );
    atmosphereGroup.add(star);
  }

  const horizonLines: THREE.Line[] = [];
  for (let i = 0; i < 5; i += 1) {
    const y = -0.22 - i * 0.18;
    const line = createLine(
      [new THREE.Vector3(-4.6, y, -4.6), new THREE.Vector3(4.6, y, -4.6)],
      "rgba(255,255,255,0.14)",
      0.07,
    );
    horizonLines.push(line);
    atmosphereGroup.add(line);
  }

  const pointer = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const controllerRaycaster = new THREE.Raycaster();
  const tempMatrix = new THREE.Matrix4();

  function updateNodeVisuals(nextIndex: number, nextAccent: THREE.Color) {
    nodeObjects.forEach((node, nodeIndex) => {
      const material = node.material as THREE.MeshBasicMaterial;
      const isActive = nodeIndex === nextIndex;
      material.color.copy(isActive ? nextAccent : new THREE.Color(0xffffff));
      material.opacity = isActive ? 0.95 : 0.32;

      const labelMaterial = nodeLabels[nodeIndex].material as THREE.SpriteMaterial;
      labelMaterial.opacity = isActive ? 0.58 : 0.22;
    });

    activeHalo.position.copy(nodeObjects[nextIndex].position);

    const activeHaloMaterial = activeHalo.material as THREE.MeshBasicMaterial;
    activeHaloMaterial.color.copy(nextAccent);

    const handHoverHaloMaterial = handHoverHalo.material as THREE.MeshBasicMaterial;
    handHoverHaloMaterial.color.copy(nextAccent);

    const railMaterial = rail.material as THREE.LineBasicMaterial;
    railMaterial.color.copy(nextAccent);

    const scanlineMaterial = scanline.material as THREE.LineBasicMaterial;
    scanlineMaterial.color.copy(nextAccent);

    const haloMaterial = halo.material as THREE.MeshBasicMaterial;
    haloMaterial.color.copy(nextAccent);
  }

  function setMode(index: number) {
    const nextIndex = Math.min(Math.max(index, 0), orbitModes.length - 1);
    currentMode.index = nextIndex;

    const mode = orbitModes[nextIndex];
    const nextAccent = colorFromAccent(mode.accent);

    drawTextPanel(context, texture, nextIndex);
    updateNodeVisuals(nextIndex, nextAccent);

    handPointerVisuals.forEach((visual) => {
      visual.setAccent(nextAccent);
    });

    inspectGroup.traverse((child) => {
      if (
        child instanceof THREE.Line &&
        child.name === "xr inspect card accent line"
      ) {
        const material = child.material as THREE.LineBasicMaterial;
        material.color.copy(nextAccent);
      }
    });

    const inspectHoverFrameMaterial =
      inspectHandHoverFrame.material as THREE.LineBasicMaterial;
    inspectHoverFrameMaterial.color.copy(nextAccent);

    productStage.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.name === "product subtle signal dot"
      ) {
        const material = child.material as THREE.MeshBasicMaterial;
        material.color.copy(nextAccent);
      }

      if (
        child instanceof THREE.Line &&
        child.name === "product optical reflection line"
      ) {
        const material = child.material as THREE.LineBasicMaterial;
        material.color.copy(nextAccent);
      }
    });

    onModeChange?.(nextIndex);
  }

  function findNearestModeNodeFromHand(tipPosition: THREE.Vector3) {
    let nearestIndex: number | null = null;
    let nearestDistance = Infinity;

    nodeObjects.forEach((node, index) => {
      node.getWorldPosition(nodeWorldPosition);

      const distance = tipPosition.distanceTo(nodeWorldPosition);

      if (distance < nearestDistance && distance <= HAND_NODE_HOVER_RADIUS) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    return nearestIndex;
  }

  function updateHandNodeInteraction(
    elapsed: number,
    frame: XRFrame | undefined,
  ) {
    if (inspectState.isOpen) {
      handNodeInteraction.hoveredIndex = null;
      handNodeInteraction.lastPinchActive = false;
      handHoverHalo.visible = false;
      return;
    }

    const xrManager = renderer.xr as THREE.WebXRManager & {
      getReferenceSpace?: () => XRReferenceSpace | null;
      getSession?: () => XRSession | null;
    };

    const referenceSpace =
      typeof xrManager.getReferenceSpace === "function"
        ? xrManager.getReferenceSpace()
        : null;

    const session =
      typeof xrManager.getSession === "function" ? xrManager.getSession() : null;

    if (!frame || !referenceSpace || !session) {
      handNodeInteraction.hoveredIndex = null;
      handNodeInteraction.lastPinchActive = false;
      handHoverHalo.visible = false;
      return;
    }

    let nextHoveredIndex: number | null = null;
    let isPinchActive = false;

    Array.from(session.inputSources).forEach((inputSource) => {
      if (!inputSource.hand) {
        return;
      }

      const hasIndexTip = readXRHandJointPosition({
        frame,
        referenceSpace,
        inputSource,
        jointName: "index-finger-tip",
        target: handIndexTipWorld,
      });

      if (!hasIndexTip) {
        return;
      }

      const hoveredIndex = findNearestModeNodeFromHand(handIndexTipWorld);

      if (hoveredIndex !== null) {
        nextHoveredIndex = hoveredIndex;
      }

      const hasThumbTip = readXRHandJointPosition({
        frame,
        referenceSpace,
        inputSource,
        jointName: "thumb-tip",
        target: handThumbTipWorld,
      });

      if (!hasThumbTip) {
        return;
      }

      const pinchDistance = handIndexTipWorld.distanceTo(handThumbTipWorld);

      if (pinchDistance <= HAND_PINCH_SELECT_RADIUS) {
        isPinchActive = true;
      }
    });

    handNodeInteraction.hoveredIndex = nextHoveredIndex;

    if (nextHoveredIndex !== null) {
      const hoveredNode = nodeObjects[nextHoveredIndex];
      hoveredNode.getWorldPosition(nodeWorldPosition);

      handHoverHalo.visible = true;
      handHoverHalo.position.copy(hoveredNode.position);

      const hoverMaterial = handHoverHalo.material as THREE.MeshBasicMaterial;
      hoverMaterial.opacity = 0.24 + Math.sin(elapsed * 2.4) * 0.08;
    } else {
      handHoverHalo.visible = false;
    }

    const now = performance.now();
    const canSelect = now - handNodeInteraction.lastSelectAt > HAND_SELECT_COOLDOWN_MS;

    if (
      isPinchActive &&
      !handNodeInteraction.lastPinchActive &&
      canSelect &&
      handNodeInteraction.hoveredIndex !== null
    ) {
      setMode(handNodeInteraction.hoveredIndex);
      handNodeInteraction.lastSelectAt = now;
    }

    handNodeInteraction.lastPinchActive = isPinchActive;
  }

  function findNearestInspectCardFromHand(tipPosition: THREE.Vector3) {
    let nearestIndex: number | null = null;
    let nearestDistance = Infinity;

    inspectGroup.children.forEach((child) => {
      if (typeof child.userData.inspectIndex !== "number") {
        return;
      }

      child.getWorldPosition(inspectCardWorldPosition);

      const distance = tipPosition.distanceTo(inspectCardWorldPosition);

      if (distance < nearestDistance && distance <= HAND_INSPECT_HOVER_RADIUS) {
        nearestDistance = distance;
        nearestIndex = child.userData.inspectIndex;
      }
    });

    return nearestIndex;
  }

  function updateHandInspectInteraction(
    elapsed: number,
    frame: XRFrame | undefined,
  ) {
    if (!inspectState.isOpen || inspectState.weight < 0.35) {
      handInspectInteraction.hoveredIndex = null;
      handInspectInteraction.lastPinchActive = false;
      inspectHandHoverFrame.visible = false;
      return;
    }

    const xrManager = renderer.xr as THREE.WebXRManager & {
      getReferenceSpace?: () => XRReferenceSpace | null;
      getSession?: () => XRSession | null;
    };

    const referenceSpace =
      typeof xrManager.getReferenceSpace === "function"
        ? xrManager.getReferenceSpace()
        : null;

    const session =
      typeof xrManager.getSession === "function" ? xrManager.getSession() : null;

    if (!frame || !referenceSpace || !session) {
      handInspectInteraction.hoveredIndex = null;
      handInspectInteraction.lastPinchActive = false;
      inspectHandHoverFrame.visible = false;
      return;
    }

    let nextHoveredIndex: number | null = null;
    let isPinchActive = false;

    Array.from(session.inputSources).forEach((inputSource) => {
      if (!inputSource.hand) {
        return;
      }

      const hasIndexTip = readXRHandJointPosition({
        frame,
        referenceSpace,
        inputSource,
        jointName: "index-finger-tip",
        target: handIndexTipWorld,
      });

      if (!hasIndexTip) {
        return;
      }

      const hoveredIndex = findNearestInspectCardFromHand(handIndexTipWorld);

      if (hoveredIndex !== null) {
        nextHoveredIndex = hoveredIndex;
      }

      const hasThumbTip = readXRHandJointPosition({
        frame,
        referenceSpace,
        inputSource,
        jointName: "thumb-tip",
        target: handThumbTipWorld,
      });

      if (!hasThumbTip) {
        return;
      }

      const pinchDistance = handIndexTipWorld.distanceTo(handThumbTipWorld);

      if (pinchDistance <= HAND_PINCH_SELECT_RADIUS) {
        isPinchActive = true;
      }
    });

    handInspectInteraction.hoveredIndex = nextHoveredIndex;

    if (nextHoveredIndex !== null) {
      const hoveredCard = inspectGroup.children.find(
        (child) => child.userData.inspectIndex === nextHoveredIndex,
      );

      if (hoveredCard) {
        inspectHandHoverFrame.visible = true;
        inspectHandHoverFrame.position.copy(hoveredCard.position);
        inspectHandHoverFrame.rotation.copy(hoveredCard.rotation);

        const frameMaterial = inspectHandHoverFrame.material as THREE.LineBasicMaterial;
        frameMaterial.opacity = 0.18 + Math.sin(elapsed * 2.4) * 0.07;
      }
    } else {
      inspectHandHoverFrame.visible = false;
    }

    const now = performance.now();
    const canSelect =
      now - handInspectInteraction.lastSelectAt > HAND_INSPECT_SELECT_COOLDOWN_MS;

    if (
      isPinchActive &&
      !handInspectInteraction.lastPinchActive &&
      canSelect &&
      handInspectInteraction.hoveredIndex !== null
    ) {
      inspectState.focusedIndex =
        inspectState.focusedIndex === handInspectInteraction.hoveredIndex
          ? null
          : handInspectInteraction.hoveredIndex;

      handInspectInteraction.lastSelectAt = now;
    }

    handInspectInteraction.lastPinchActive = isPinchActive;
  }

  function updateHandVRNavInteraction(frame: XRFrame | undefined) {
    if (!vrNavState.isImmersive) {
      vrNavState.hoveredAction = null;
      vrNavState.lastPinchActive = false;

      handPointerVisuals.forEach((visual) => {
        visual.setVisible(false);
      });

      return;
    }

    const xrManager = renderer.xr as THREE.WebXRManager & {
      getReferenceSpace?: () => XRReferenceSpace | null;
      getSession?: () => XRSession | null;
    };

    const referenceSpace =
      typeof xrManager.getReferenceSpace === "function"
        ? xrManager.getReferenceSpace()
        : null;

    const session =
      typeof xrManager.getSession === "function" ? xrManager.getSession() : null;

    if (!frame || !referenceSpace || !session) {
      vrNavState.hoveredAction = null;
      vrNavState.lastPinchActive = false;

      handPointerVisuals.forEach((visual) => {
        visual.setVisible(false);
      });

      return;
    }

    let nextHoveredAction: VRNavAction | null = null;
    let isPinchActive = false;
    let hasAnyHand = false;

    Array.from(session.inputSources).forEach((inputSource, sourceIndex) => {
      if (!inputSource.hand) {
        return;
      }

      const pointerIndex = sourceIndex % handPointerVisuals.length;
      const pointerVisual = handPointerVisuals[pointerIndex];

      const hasIndexTip = readXRHandJointPosition({
        frame,
        referenceSpace,
        inputSource,
        jointName: "index-finger-tip",
        target: handIndexTipWorld,
      });

      const hasIndexBase =
        readXRHandJointPosition({
          frame,
          referenceSpace,
          inputSource,
          jointName: "index-finger-phalanx-proximal",
          target: handPointerBase,
        }) ||
        readXRHandJointPosition({
          frame,
          referenceSpace,
          inputSource,
          jointName: "index-finger-metacarpal",
          target: handPointerBase,
        });

      if (!hasIndexTip || !hasIndexBase) {
        pointerVisual.setVisible(false);
        handPointerHasSmooth[pointerIndex] = false;
        return;
      }

      hasAnyHand = true;

      handPointerDirection.subVectors(handIndexTipWorld, handPointerBase);

      if (handPointerDirection.lengthSq() < 0.00001) {
        pointerVisual.setVisible(false);
        handPointerHasSmooth[pointerIndex] = false;
        return;
      }

      handPointerDirection.normalize();

      const smoothOrigin = handPointerSmoothOrigins[pointerIndex];
      const smoothDirection = handPointerSmoothDirections[pointerIndex];

      if (!handPointerHasSmooth[pointerIndex]) {
        smoothOrigin.copy(handIndexTipWorld);
        smoothDirection.copy(handPointerDirection);
        handPointerHasSmooth[pointerIndex] = true;
      }

      smoothOrigin.lerp(handIndexTipWorld, HAND_POINTER_ORIGIN_LERP);
      smoothDirection.lerp(handPointerDirection, HAND_POINTER_DIRECTION_LERP);

      if (smoothDirection.lengthSq() < 0.00001) {
        smoothDirection.copy(handPointerDirection);
      }

      smoothDirection.normalize();

      handPointerEnd
        .copy(smoothOrigin)
        .addScaledVector(smoothDirection, HAND_POINTER_MAX_DISTANCE);

      handPointerRaycaster.set(smoothOrigin, smoothDirection);

      const navIntersections = handPointerRaycaster.intersectObjects(
        vrNavHitObjects,
        false,
      );

      const navHit = navIntersections[0];
      let hitAction: VRNavAction | null = null;
      let hasHit = false;

      if (navHit?.object?.userData.vrNavAction) {
        hitAction = navHit.object.userData.vrNavAction as VRNavAction;
        handPointerHitPoint.copy(navHit.point);
        hasHit = true;
      }

      pointerVisual.setVisible(true);
      pointerVisual.update({
        origin: smoothOrigin,
        end: handPointerEnd,
        hitPoint: hasHit ? handPointerHitPoint : null,
        hasHit,
      });

      if (hitAction) {
        nextHoveredAction = hitAction;
      }

      const hasThumbTip = readXRHandJointPosition({
        frame,
        referenceSpace,
        inputSource,
        jointName: "thumb-tip",
        target: handPointerThumb,
      });

      if (!hasThumbTip) {
        return;
      }

      const pinchDistance = handIndexTipWorld.distanceTo(handPointerThumb);

      if (pinchDistance <= HAND_PINCH_SELECT_RADIUS) {
        isPinchActive = true;
      }
    });

    if (!hasAnyHand) {
      handPointerVisuals.forEach((visual) => {
        visual.setVisible(false);
      });

      handPointerHasSmooth[0] = false;
      handPointerHasSmooth[1] = false;
    }

    vrNavState.hoveredAction = nextHoveredAction;

    const now = performance.now();
    const canSelect = now - vrNavState.lastSelectAt > HAND_NAV_SELECT_COOLDOWN_MS;

    if (
      isPinchActive &&
      !vrNavState.lastPinchActive &&
      canSelect &&
      vrNavState.hoveredAction
    ) {
      runVRNavAction(vrNavState.hoveredAction);
      vrNavState.lastSelectAt = now;
    }

    vrNavState.lastPinchActive = isPinchActive;
  }
  function setInspectMode(isOpen: boolean) {
    inspectState.isOpen = isOpen;

    if (!isOpen) {
      inspectState.focusedIndex = null;
    }
  }

  function runVRNavAction(action: VRNavAction) {
    if (action === "prev") {
      setMode((currentMode.index - 1 + orbitModes.length) % orbitModes.length);
      return;
    }

    if (action === "next") {
      setMode((currentMode.index + 1) % orbitModes.length);
      return;
    }

    if (action === "inspect") {
      setInspectMode(!inspectState.isOpen);
      return;
    }

    if (action === "exit") {
      const xrManager = renderer.xr as THREE.WebXRManager & {
        getSession?: () => XRSession | null;
      };

      const session =
        typeof xrManager.getSession === "function" ? xrManager.getSession() : null;

      session?.end();
    }
  }

  function handlePointerDown(event: PointerEvent) {
    const bounds = renderer.domElement.getBoundingClientRect();

    pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    if (inspectState.isOpen) {
      const inspectIntersections = raycaster.intersectObjects(inspectHitObjects, false);
      const inspectObject = inspectIntersections[0]?.object;

      if (inspectObject && typeof inspectObject.userData.inspectIndex === "number") {
        inspectState.focusedIndex =
          inspectState.focusedIndex === inspectObject.userData.inspectIndex
            ? null
            : inspectObject.userData.inspectIndex;

        return;
      }
    }

    const intersections = raycaster.intersectObjects(nodeObjects, false);
    const first = intersections[0]?.object;

    if (first && typeof first.userData.modeIndex === "number") {
      setMode(first.userData.modeIndex);
    }
  }

  let lastWheelAt = 0;
  function handleWheel(event: WheelEvent) {
    const now = performance.now();

    if (now - lastWheelAt < 520) {
      return;
    }

    lastWheelAt = now;

    if (inspectState.isOpen && xrOpticsAssets.length > 0) {
      const direction = event.deltaY > 0 ? 1 : -1;
      const currentFocused = inspectState.focusedIndex ?? 0;

      inspectState.focusedIndex =
        (currentFocused + direction + xrOpticsAssets.length) % xrOpticsAssets.length;

      return;
    }

    const direction = event.deltaY > 0 ? 1 : -1;
    setMode((currentMode.index + direction + orbitModes.length) % orbitModes.length);
  }

  renderer.domElement.addEventListener("pointerdown", handlePointerDown);
  renderer.domElement.addEventListener("wheel", handleWheel, { passive: true });

  const controllerLineGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, -1.45),
  ]);

  function makeController(index: number) {
    const controller = renderer.xr.getController(index);
    const line = new THREE.Line(
      controllerLineGeometry,
      new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.28,
      }),
    );

    controller.add(line);

    controller.addEventListener("connected", (event) => {
      const inputSource = event.data as XRInputSource | undefined;

      line.visible = !inputSource?.hand;
    });

    controller.addEventListener("disconnected", () => {
      line.visible = true;
    });

    controller.addEventListener("selectstart", () => {
      tempMatrix.identity().extractRotation(controller.matrixWorld);

      controllerRaycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
      controllerRaycaster.ray.direction
        .set(0, 0, -1)
        .applyMatrix4(tempMatrix);

      if (vrNavState.isImmersive) {
        const navIntersections = controllerRaycaster.intersectObjects(
          vrNavHitObjects,
          false,
        );

        const navObject = navIntersections[0]?.object;

        if (navObject && navObject.userData.vrNavAction) {
          runVRNavAction(navObject.userData.vrNavAction as VRNavAction);
          return;
        }
      }

      if (inspectState.isOpen) {
        const inspectIntersections = controllerRaycaster.intersectObjects(
          inspectHitObjects,
          false,
        );
        const inspectObject = inspectIntersections[0]?.object;

        if (inspectObject && typeof inspectObject.userData.inspectIndex === "number") {
          inspectState.focusedIndex =
            inspectState.focusedIndex === inspectObject.userData.inspectIndex
              ? null
              : inspectObject.userData.inspectIndex;

          return;
        }
      }

      const intersections = controllerRaycaster.intersectObjects(nodeObjects, false);
      const first = intersections[0]?.object;

      if (first && typeof first.userData.modeIndex === "number") {
        setMode(first.userData.modeIndex);
      }
    });

    scene.add(controller);

    return controller;
  }

  const controllerA = makeController(0);
  const controllerB = makeController(1);

  const handPresence = createHandPresenceSystem({
    scene,
    renderer,
    rigParent: rig,
  });

  const handVisualProxy = createHandVisualProxySystem({
    handPresence,
    renderer,
  });

  const resizeObserver = new ResizeObserver(() => {
    const width = mount.clientWidth;
    const height = Math.max(mount.clientHeight, 1);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  });

  resizeObserver.observe(mount);

  const clock = new THREE.Clock();

  renderer.setAnimationLoop((_time, xrFrame) => {
    const delta = Math.min(clock.getDelta(), 0.05);
    const elapsed = clock.elapsedTime;

    root.rotation.y = Math.sin(elapsed * 0.16) * 0.01;
    root.position.y = 0.98 + Math.sin(elapsed * 0.28) * 0.006;

    panelGroup.rotation.y = Math.sin(elapsed * 0.18) * 0.018;
    panelMaterial.opacity = 0.9 + Math.sin(elapsed * 0.7) * 0.018;

    productStage.rotation.y = Math.sin(elapsed * 0.34) * 0.035;
    productStage.position.y = -0.9 + Math.sin(elapsed * 0.52) * 0.008;

    inspectState.weight = THREE.MathUtils.damp(
      inspectState.weight,
      inspectState.isOpen ? 1 : 0,
      5.8,
      delta,
    );

    inspectGroup.visible = inspectState.weight > 0.01;
    setObjectOpacity(inspectGroup, inspectState.weight);

    const normalSceneWeight = 1 - inspectState.weight * 0.46;
    const productOpacityWeight = 1 - inspectState.weight * 0.28;
    const productDisplayWeight = 1 - inspectState.weight * 0.12;

    setObjectOpacity(panelGroup, normalSceneWeight);
    setObjectOpacity(productStage, productOpacityWeight);
    setObjectOpacity(rail, 1 - inspectState.weight * 0.32);
    setObjectOpacity(activeHalo, 1 - inspectState.weight * 0.24);

    productStage.scale.setScalar(productDisplayWeight);

    inspectGroup.children.forEach((card, index) => {
      const basePosition = card.userData.basePosition as THREE.Vector3 | undefined;
      const baseRotation = card.userData.baseRotation as THREE.Euler | undefined;
      const baseScale =
        typeof card.userData.baseScale === "number" ? card.userData.baseScale : 0.82;

      if (!basePosition || !baseRotation) {
        return;
      }

      const isFocused = inspectState.focusedIndex === index;
      const isHandHovered = handInspectInteraction.hoveredIndex === index;
      const drift = Math.sin(elapsed * 0.62 + index * 0.9) * 0.028;

      const targetPosition = isFocused
        ? new THREE.Vector3(0, 0.02, -1.12)
        : new THREE.Vector3(basePosition.x, basePosition.y + drift, basePosition.z);

      card.position.lerp(targetPosition, isFocused ? 0.09 : 0.045);

      card.rotation.x = THREE.MathUtils.lerp(
        card.rotation.x,
        isFocused ? 0 : baseRotation.x,
        0.075,
      );
      card.rotation.y = THREE.MathUtils.lerp(
        card.rotation.y,
        isFocused ? 0 : baseRotation.y,
        0.075,
      );
      card.rotation.z = THREE.MathUtils.lerp(
        card.rotation.z,
        isFocused ? 0 : baseRotation.z,
        0.075,
      );

      const targetScale = isFocused
        ? 1.04
        : isHandHovered
          ? baseScale * 1.12
          : baseScale;

      card.scale.setScalar(
        THREE.MathUtils.lerp(
          card.scale.x,
          targetScale,
          isFocused || isHandHovered ? 0.09 : 0.055,
        ),
      );

      card.traverse((child) => {
        if (
          child instanceof THREE.Mesh ||
          child instanceof THREE.Line ||
          child instanceof THREE.Sprite
        ) {
          const material = child.material;

          if (Array.isArray(material)) {
            material.forEach((item) => {
              if (typeof item.userData.baseOpacity !== "number") {
                item.userData.baseOpacity = item.opacity;
              }

              item.opacity =
                item.userData.baseOpacity *
                inspectState.weight *
                (isHandHovered && !isFocused ? 1.18 : 1);
            });

            return;
          }

          if (material) {
            if (typeof material.userData.baseOpacity !== "number") {
              material.userData.baseOpacity = material.opacity;
            }

            material.opacity =
              material.userData.baseOpacity *
              inspectState.weight *
              (isHandHovered && !isFocused ? 1.18 : 1);
          }
        }
      });
    });

    halo.rotation.z += 0.0024;
    activeHalo.rotation.z -= 0.006;

    const activeAccentPulse = 1 + Math.sin(elapsed * 2.15) * 0.14;

    nodeObjects.forEach((node, index) => {
      const isActive = index === currentMode.index;
      const isHovered = handNodeInteraction.hoveredIndex === index;
      const pulse = isActive ? activeAccentPulse : 1;
      const hoverBoost = isHovered ? 1.42 : 1;

      node.scale.setScalar(pulse * hoverBoost);

      const material = node.material as THREE.MeshBasicMaterial;
      material.opacity = isHovered ? 0.96 : isActive ? 0.95 : 0.32;
    });

    const scanlineMaterial = scanline.material as THREE.LineBasicMaterial;
    scanlineMaterial.opacity = 0.18 + Math.sin(elapsed * 1.4) * 0.08;

    atmosphereGroup.rotation.y += 0.00038;

    handPresence.update({
      currentRoomId: "signal-corridor",
    });

    handVisualProxy.update({
      currentRoomId: "signal-corridor",
      timeMs: performance.now(),
    });

    updateHandVRNavInteraction(xrFrame);

    if (!vrNavState.isImmersive) {
      updateHandNodeInteraction(elapsed, xrFrame);
      updateHandInspectInteraction(elapsed, xrFrame);
    }

    vrNavGroup.visible = vrNavState.isImmersive;

    vrNavHitObjects.forEach((button) => {
      const action = button.userData.vrNavAction as VRNavAction;
      const isHovered = vrNavState.hoveredAction === action;
      const isInspectButton = action === "inspect";
      const isInspectActive = isInspectButton && inspectState.isOpen;

      const material = button.material as THREE.MeshBasicMaterial;
      material.opacity = isHovered
        ? 0.42
        : isInspectActive
          ? 0.34
          : isInspectButton
            ? 0.24
            : 0.18;

      material.color.copy(
        isInspectActive || isHovered ? activeAccent : new THREE.Color("#091016"),
      );

      button.scale.setScalar(isHovered ? 1.12 : 1);
    });

    vrNavLabels.forEach((label, index) => {
      const action = vrNavActions[index];
      const isHovered = vrNavState.hoveredAction === action;
      const material = label.material as THREE.SpriteMaterial;
      material.opacity = isHovered ? 0.94 : 0.7;
      label.scale.set(isHovered ? 0.58 : 0.52, isHovered ? 0.18 : 0.16, 1);
    });

    horizonLines.forEach((line, index) => {
      const material = line.material as THREE.LineBasicMaterial;
      material.opacity = 0.045 + Math.sin(elapsed * 0.42 + index) * 0.018;
    });

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

      session.addEventListener("end", () => {
        vrNavState.isImmersive = false;
        vrNavState.hoveredAction = null;
        vrNavGroup.visible = false;
      });

      await renderer.xr.setSession(session);
      vrNavState.isImmersive = true;
      vrNavGroup.visible = true;

      return "VR session active. Use VR controls, hands, or controller fallback.";
    } catch {
      return "Could not start VR session.";
    }
  }

  function dispose() {
    renderer.setAnimationLoop(null);
    renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
    renderer.domElement.removeEventListener("wheel", handleWheel);
    resizeObserver.disconnect();

    controllerA.clear();
    controllerB.clear();

    try {
      handVisualProxy.dispose();
    } catch {}

    try {
      handPresence.dispose();
    } catch {}

    handPointerVisuals.forEach((visual) => {
      scene.remove(visual.line);
      scene.remove(visual.reticle);
      visual.dispose();
    });

    scene.traverse((object) => {
      if (
        object instanceof THREE.Mesh ||
        object instanceof THREE.Line ||
        object instanceof THREE.Sprite
      ) {
        object.geometry?.dispose();

        const material = object.material;

        if (Array.isArray(material)) {
          material.forEach((item) => item.dispose());
        } else {
          material?.dispose();
        }

        const textureFromUserData = object.userData.texture;

        if (textureFromUserData instanceof THREE.Texture) {
          textureFromUserData.dispose();
        }
      }
    });

    inspectTextures.forEach((item) => item.dispose());
    productTexture.dispose();
    texture.dispose();
    controllerLineGeometry.dispose();
    renderer.dispose();

    if (renderer.domElement.parentElement === mount) {
      mount.removeChild(renderer.domElement);
    }
  }

  return {
    setMode,
    setInspectMode,
    startVR,
    dispose,
  };
}
