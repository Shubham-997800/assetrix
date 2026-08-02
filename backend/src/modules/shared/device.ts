import type { DeviceInfo } from "../../types";

export function parseUserAgent(userAgent?: string): Omit<DeviceInfo, "ipAddress"> {
  if (!userAgent) {
    return { userAgent: undefined, browserName: undefined, browserVersion: undefined, os: undefined, deviceType: undefined };
  }

  const browserName = /Edg\//.test(userAgent)
    ? "Edge"
    : /Chrome\//.test(userAgent)
      ? "Chrome"
      : /Firefox\//.test(userAgent)
        ? "Firefox"
        : /Safari\//.test(userAgent)
          ? "Safari"
          : undefined;

  let browserVersion: string | undefined;
  if (browserName === "Chrome" || browserName === "Edge") {
    const match = userAgent.match(/(?:Chrome|Edg)\/([\d.]+)/);
    browserVersion = match ? match[1] : undefined;
  } else if (browserName === "Firefox") {
    const match = userAgent.match(/Firefox\/([\d.]+)/);
    browserVersion = match ? match[1] : undefined;
  } else if (browserName === "Safari") {
    const match = userAgent.match(/Version\/([\d.]+).*Safari\//);
    browserVersion = match ? match[1] : undefined;
  }

  const os = /Windows/.test(userAgent)
    ? "Windows"
    : /Mac OS X/.test(userAgent)
      ? "macOS"
      : /Android/.test(userAgent)
        ? "Android"
        : /iPhone|iPad|iPod/.test(userAgent)
          ? "iOS"
          : /Linux/.test(userAgent)
            ? "Linux"
            : undefined;

  const deviceType = /iPhone|Android.*Mobile/.test(userAgent)
    ? "mobile"
    : /iPad/.test(userAgent)
      ? "tablet"
      : "desktop";

  return { userAgent, browserName, browserVersion, os, deviceType };
}

export function getDeviceInfo(userAgent: string | undefined, ipAddress: string | undefined): DeviceInfo {
  const parsed = parseUserAgent(userAgent);
  return { ...parsed, ipAddress };
}
