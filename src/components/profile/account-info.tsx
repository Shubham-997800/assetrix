"use client";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  DEPARTMENT_MANAGER: "Department Manager",
  TECHNICIAN: "Technician",
  EMPLOYEE: "Employee",
};

interface AccountInfoProps {
  user?: {
    id: string;
    role: string;
    department?: { name: string } | null;
    createdAt: string;
    lastLoginAt?: string | null;
  } | null;
}

export function AccountInfo({ user }: AccountInfoProps) {
  const accountData = [
    { label: "User ID", value: user?.id ?? "—" },
    { label: "Account Role", value: user ? ROLE_LABELS[user.role] ?? user.role : "—" },
    { label: "Department", value: user?.department?.name ?? "—" },
    { label: "Permissions", value: "Read, Write, Approve, Export" },
    { label: "Created", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }) : "—" },
    { label: "Last Login", value: user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString("en-US", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "Never" },
  ];

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
