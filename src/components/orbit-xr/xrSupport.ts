export type XRSupportState = {
  isChecking: boolean;
  isSupported: boolean;
  isSecureContext: boolean;
  reason: string;
};

type NavigatorWithXR = Navigator & {
  xr?: {
    isSessionSupported?: (mode: "immersive-vr") => Promise<boolean>;
  };
};

export async function checkXRSupport(): Promise<XRSupportState> {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {
      isChecking: false,
      isSupported: false,
      isSecureContext: false,
      reason: "XR is available only in the browser.",
    };
  }

  const isSecureContext = window.isSecureContext;

  if (!isSecureContext) {
    return {
      isChecking: false,
      isSupported: false,
      isSecureContext,
      reason: "WebXR requires HTTPS or localhost.",
    };
  }

  const xr = (navigator as NavigatorWithXR).xr;

  if (!xr?.isSessionSupported) {
    return {
      isChecking: false,
      isSupported: false,
      isSecureContext,
      reason: "WebXR is not exposed in this browser.",
    };
  }

  try {
    const isSupported = await xr.isSessionSupported("immersive-vr");

    return {
      isChecking: false,
      isSupported,
      isSecureContext,
      reason: isSupported
        ? "Immersive VR session is available."
        : "Immersive VR is not supported on this device/browser.",
    };
  } catch {
    return {
      isChecking: false,
      isSupported: false,
      isSecureContext,
      reason: "Could not verify immersive VR support.",
    };
  }
}
