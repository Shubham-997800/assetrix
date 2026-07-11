"use client";

const activityLog = [
  { time: "09:10 AM", event: "Password Changed", description: "Password was updated successfully", device: "Chrome · Windows 11" },
  { time: "11:15 AM", event: "Profile Updated", description: "Personal information was modified", device: "Chrome · Windows 11" },
  { time: "01:22 PM", event: "Logged In", description: "Successful login from new device", device: "Safari · macOS Sonoma" },
  { time: "03:05 PM", event: "Dark Mode Enabled", description: "Theme preference changed to dark", device: "Chrome · Windows 11" },
  { time: "04:20 PM", event: "Email Updated", description: "Email address was changed", device: "Chrome · Windows 11" },
  { time: "05:45 PM", event: "Two-Factor Enabled", description: "2FA was enabled on account", device: "Chrome · Windows 11" },
  { time: "Yesterday", event: "Session Revoked", description: "Revoked all other active sessions", device: "Chrome · Windows 11" },
];

const eventColors: Record<string, string> = {
  "Password Changed": "bg-amber-500",
  "Profile Updated": "bg-primary",
  "Logged In": "bg-emerald-500",
  "Dark Mode Enabled": "bg-violet-500",
  "Email Updated": "bg-blue-500",
  "Two-Factor Enabled": "bg-emerald-500",
  "Session Revoked": "bg-red-500",
};

export function ActivityLog() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Activity Log</h3>
        <p className="text-xs text-muted-foreground">Recent account activity</p>
      </div>

      <div className="mt-5 space-y-0">
        {activityLog.map((item, i) => (
          <div key={i} className="flex gap-4 py-3 border-b border-border last:border-0">
            <div className="relative flex flex-col items-center">
              <div className={`h-2.5 w-2.5 rounded-full ${eventColors[item.event] || "bg-muted-foreground"}`} />
              {i < activityLog.length - 1 && <div className="mt-1 w-px flex-1 bg-border" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{item.event}</span>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground/60">{item.device}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
