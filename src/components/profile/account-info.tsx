"use client";

const accountData = [
  { label: "User ID", value: "USR-284719" },
  { label: "Account Role", value: "Operations Manager" },
  { label: "Department", value: "Procurement" },
  { label: "Permissions", value: "Read, Write, Approve, Export" },
  { label: "Created", value: "15 January 2025" },
  { label: "Last Login", value: "11 July 2026, 09:15 AM" },
  { label: "Last Password Change", value: "28 June 2026" },
];

export function AccountInfo() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Account Information</h3>
        <p className="text-xs text-muted-foreground">Read-only account details</p>
      </div>
      <div className="mt-5 space-y-3">
        {accountData.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-4 py-2 border-b border-border last:border-0">
            <span className="shrink-0 text-sm text-muted-foreground">{item.label}</span>
            <span className="min-w-0 truncate text-right text-sm font-medium text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
