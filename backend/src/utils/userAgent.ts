interface ParsedUserAgent {
  browserName: string;
  browserVersion: string;
  os: string;
  deviceType: string;
}

const BROWSER_PATTERNS: Array<{ regex: RegExp; name: string }> = [
  { regex: /Edg\/(\d+)/, name: 'Edge' },
  { regex: /OPR\/(\d+)/, name: 'Opera' },
  { regex: /Chrome\/(\d+)/, name: 'Chrome' },
  { regex: /Firefox\/(\d+)/, name: 'Firefox' },
  { regex: /Safari\/(\d+)/, name: 'Safari' },
  { regex: /MSIE (\d+)/, name: 'IE' },
  { regex: /Trident\/.*rv:(\d+)/, name: 'IE' },
];

const OS_PATTERNS: Array<{ regex: RegExp; name: string }> = [
  { regex: /Windows NT 10\.0/, name: 'Windows 10/11' },
  { regex: /Windows NT 6\.3/, name: 'Windows 8.1' },
  { regex: /Windows NT 6\.2/, name: 'Windows 8' },
  { regex: /Windows NT 6\.1/, name: 'Windows 7' },
  { regex: /Windows/, name: 'Windows' },
  { regex: /Mac OS X ([\d_]+)/, name: 'macOS' },
  { regex: /Android ([\d.]+)/, name: 'Android' },
  { regex: /iPhone OS ([\d_]+)/, name: 'iOS' },
  { regex: /iPad.*OS ([\d_]+)/, name: 'iPadOS' },
  { regex: /Linux/, name: 'Linux' },
  { regex: /CrOS/, name: 'ChromeOS' },
];

const MOBILE_REGEX = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i;

export const parseUserAgent = (userAgent?: string): ParsedUserAgent => {
  if (!userAgent) {
    return { browserName: 'Unknown', browserVersion: 'Unknown', os: 'Unknown', deviceType: 'Unknown' };
  }

  let browserName = 'Unknown';
  let browserVersion = 'Unknown';

  for (const pattern of BROWSER_PATTERNS) {
    const match = userAgent.match(pattern.regex);
    if (match) {
      browserName = pattern.name;
      browserVersion = match[1] || 'Unknown';
      break;
    }
  }

  let os = 'Unknown';
  for (const pattern of OS_PATTERNS) {
    const match = userAgent.match(pattern.regex);
    if (match) {
      os = pattern.name;
      if (match[1]) {
        os += ` ${match[1].replace(/_/g, '.')}`;
      }
      break;
    }
  }

  const deviceType = MOBILE_REGEX.test(userAgent) ? 'Mobile' : 'Desktop';

  return { browserName, browserVersion, os, deviceType };
};
