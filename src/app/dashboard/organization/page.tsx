"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Building2,
  FolderTree,
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  CheckCircle,
  X,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Shield,
  AlertTriangle,
  Eye,
  ArrowRight,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════ */

interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  parent: string;
  employees: number;
  assets: number;
  description: string;
  status: "Active" | "Inactive";
}

interface AssetCategory {
  id: string;
  name: string;
  code: string;
  description: string;
  assets: number;
  fields: { name: string; type: string }[];
  sharedAllowed: boolean;
  maintenanceRequired: boolean;
  warrantyTracking: boolean;
  status: "Active" | "Inactive";
}

interface Employee {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
  role: "Employee" | "Department Head" | "Asset Manager" | "Admin";
  status: "Active" | "Inactive";
  lastLogin: string;
}

const initialDepartments: Department[] = [
  { id: "d1", name: "Corporate", code: "CORP", head: "Sarah Chen", parent: "—", employees: 0, assets: 0, description: "Executive leadership and corporate governance", status: "Active" },
  { id: "d2", name: "Engineering", code: "ENG", head: "Raj Kumar", parent: "Corporate", employees: 45, assets: 156, description: "Product development and technical operations", status: "Active" },
  { id: "d3", name: "Operations", code: "OPS", head: "Marcus Webb", parent: "Corporate", employees: 38, assets: 134, description: "Day-to-day business operations and logistics", status: "Active" },
  { id: "d4", name: "Procurement", code: "PROC", head: "Nina Petrov", parent: "Operations", employees: 24, assets: 112, description: "Vendor management and purchasing", status: "Active" },
  { id: "d5", name: "Finance", code: "FIN", head: "Priya Sharma", parent: "Corporate", employees: 18, assets: 89, description: "Financial planning, accounting, and reporting", status: "Active" },
  { id: "d6", name: "Human Resources", code: "HR", head: "Alex Rivera", parent: "Corporate", employees: 15, assets: 67, description: "People operations, hiring, and culture", status: "Active" },
  { id: "d7", name: "Marketing", code: "MKT", head: "Kim Tanaka", parent: "Operations", employees: 22, assets: 54, description: "Brand, demand generation, and communications", status: "Active" },
  { id: "d8", name: "IT Support", code: "ITS", head: "Jordan Lee", parent: "Engineering", employees: 12, assets: 43, description: "Internal IT infrastructure and helpdesk", status: "Inactive" },
];

const initialCategories: AssetCategory[] = [
  { id: "c1", name: "Electronics", code: "ELEC", description: "Computers, monitors, peripherals, and consumer electronics", assets: 312, fields: [{ name: "Warranty Period", type: "Number (months)" }, { name: "Manufacturer", type: "Text" }, { name: "Model Number", type: "Text" }], sharedAllowed: false, maintenanceRequired: true, warrantyTracking: true, status: "Active" },
  { id: "c2", name: "Furniture", code: "FURN", description: "Desks, chairs, storage, and office furniture", assets: 189, fields: [{ name: "Material Type", type: "Dropdown" }, { name: "Supplier", type: "Text" }], sharedAllowed: true, maintenanceRequired: false, warrantyTracking: false, status: "Active" },
  { id: "c3", name: "Vehicles", code: "VEH", description: "Company cars, vans, and transport vehicles", assets: 34, fields: [{ name: "Registration Number", type: "Text" }, { name: "Insurance Expiry", type: "Date" }, { name: "Fuel Type", type: "Dropdown" }], sharedAllowed: true, maintenanceRequired: true, warrantyTracking: false, status: "Active" },
  { id: "c4", name: "Machinery", code: "MACH", description: "Industrial and manufacturing machinery", assets: 67, fields: [{ name: "Serial Number", type: "Text" }, { name: "Capacity", type: "Number" }, { name: "Last Serviced", type: "Date" }], sharedAllowed: false, maintenanceRequired: true, warrantyTracking: true, status: "Active" },
  { id: "c5", name: "IT Equipment", code: "ITEQ", description: "Servers, networking gear, and infrastructure", assets: 98, fields: [{ name: "IP Address", type: "Text" }, { name: " Rack Location", type: "Text" }, { name: "Warranty Period", type: "Number (months)" }], sharedAllowed: false, maintenanceRequired: true, warrantyTracking: true, status: "Active" },
  { id: "c6", name: "Office Equipment", code: "OFF", description: "Printers, projectors, and shared office tools", assets: 145, fields: [{ name: "Model", type: "Text" }, { name: "Toner/Consumable Type", type: "Text" }], sharedAllowed: true, maintenanceRequired: false, warrantyTracking: true, status: "Active" },
];

const initialEmployees: Employee[] = [
  { id: "e1", name: "Sarah Chen", email: "sarah.chen@assetrix.com", employeeId: "EMP-001", department: "Engineering", role: "Admin", status: "Active", lastLogin: "2 min ago" },
  { id: "e2", name: "Raj Kumar", email: "raj.kumar@assetrix.com", employeeId: "EMP-002", department: "Engineering", role: "Department Head", status: "Active", lastLogin: "1 hr ago" },
  { id: "e3", name: "Marcus Webb", email: "marcus.webb@assetrix.com", employeeId: "EMP-003", department: "Operations", role: "Department Head", status: "Active", lastLogin: "30 min ago" },
  { id: "e4", name: "Priya Sharma", email: "priya.sharma@assetrix.com", employeeId: "EMP-004", department: "Finance", role: "Asset Manager", status: "Active", lastLogin: "3 hr ago" },
  { id: "e5", name: "Alex Rivera", email: "alex.rivera@assetrix.com", employeeId: "EMP-005", department: "Human Resources", role: "Department Head", status: "Active", lastLogin: "5 hr ago" },
  { id: "e6", name: "Kim Tanaka", email: "kim.tanaka@assetrix.com", employeeId: "EMP-006", department: "Marketing", role: "Employee", status: "Active", lastLogin: "1 day ago" },
  { id: "e7", name: "Jordan Lee", email: "jordan.lee@assetrix.com", employeeId: "EMP-007", department: "IT Support", role: "Asset Manager", status: "Active", lastLogin: "12 min ago" },
  { id: "e8", name: "Nina Petrov", email: "nina.petrov@assetrix.com", employeeId: "EMP-008", department: "Procurement", role: "Department Head", status: "Active", lastLogin: "2 hr ago" },
  { id: "e9", name: "Tom Bradley", email: "tom.bradley@assetrix.com", employeeId: "EMP-009", department: "Finance", role: "Employee", status: "Inactive", lastLogin: "15 days ago" },
  { id: "e10", name: "Lisa Wang", email: "lisa.wang@assetrix.com", employeeId: "EMP-010", department: "Engineering", role: "Employee", status: "Active", lastLogin: "4 hr ago" },
  { id: "e11", name: "David Okafor", email: "david.okafor@assetrix.com", employeeId: "EMP-011", department: "Operations", role: "Employee", status: "Active", lastLogin: "6 hr ago" },
  { id: "e12", name: "Maria Garcia", email: "maria.garcia@assetrix.com", employeeId: "EMP-012", department: "Marketing", role: "Employee", status: "Active", lastLogin: "1 hr ago" },
];

const roleColors: Record<string, string> = {
  Admin: "bg-red-500/10 text-red-600 dark:text-red-400",
  "Department Head": "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  "Asset Manager": "bg-primary/10 text-primary",
  Employee: "bg-muted text-muted-foreground",
};

/* ═══════════════════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════════════════ */

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 shadow-lg">
        <CheckCircle className="h-4 w-4 text-emerald-500" />
        <span className="text-sm text-foreground">{message}</span>
        <button onClick={onClose} className="ml-2 text-muted-foreground hover:text-foreground">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onCancel} />
      <div className="relative z-10 mx-4 w-full max-w-sm animate-scale-in rounded-xl border border-border bg-card p-5 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{message}</p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onCancel} className="btn-enterprise">Cancel</Button>
          <Button size="sm" onClick={onConfirm} className="btn-enterprise">Confirm</Button>
        </div>
      </div>
    </div>
  );
}

function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative z-10 mx-4 w-full max-w-lg animate-scale-in rounded-xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

function SkeletonRow({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-border">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-3.5">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </td>
      ))}
    </tr>
  );
}

/* ═══════════════════════════════════════════════════════
   DEPARTMENTS TAB
   ═══════════════════════════════════════════════════════ */

function DepartmentsTab({
  showToast,
}: {
  showToast: (msg: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"name" | "employees" | "assets">("name");
  const [departments, setDepartments] = useState(initialDepartments);
  const [createOpen, setCreateOpen] = useState(false);
  const [editDept, setEditDept] = useState<Department | null>(null);
  const [confirm, setConfirm] = useState<{ open: boolean; id: string }>({ open: false, id: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = departments
    .filter(
      (d) =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.code.toLowerCase().includes(search.toLowerCase()) ||
        d.head.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      if (sort === "employees") return b.employees - a.employees;
      if (sort === "assets") return b.assets - a.assets;
      return a.name.localeCompare(b.name);
    });

  const deactivate = (id: string) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "Inactive" } : d)),
    );
    setConfirm({ open: false, id: "" });
    showToast("Department deactivated");
  };

  const createDept = (data: Omit<Department, "id" | "employees" | "assets">) => {
    const newDept: Department = {
      ...data,
      id: `d${Date.now()}`,
      employees: 0,
      assets: 0,
    };
    setDepartments((prev) => [...prev, newDept]);
    setCreateOpen(false);
    showToast("Department created");
  };

  const updateDept = (data: Department) => {
    setDepartments((prev) => prev.map((d) => (d.id === data.id ? data : d)));
    setEditDept(null);
    showToast("Department updated");
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="btn-enterprise" onClick={() => setSort(sort === "name" ? "employees" : sort === "employees" ? "assets" : "name")}>
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sort: {sort === "name" ? "Name" : sort === "employees" ? "Employees" : "Assets"}</span>
          </Button>
          <Button size="sm" className="btn-enterprise" onClick={() => setCreateOpen(true)}>
            <Plus className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Create Department</span>
          </Button>
        </div>
      </div>

      {/* Hierarchy hint */}
      <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Department Hierarchy:</span>{" "}
          Corporate → Operations, Finance, HR, Engineering → Procurement, Marketing, IT Support
        </p>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Department", "Code", "Head", "Parent", "Employees", "Assets", "Status", "Actions"].map((h) => (
                  <th key={h} className={`px-4 py-3 text-xs font-medium text-muted-foreground ${h === "Parent" || h === "Code" ? "hidden lg:table-cell" : ""}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  <SkeletonRow cols={8} />
                  <SkeletonRow cols={8} />
                  <SkeletonRow cols={8} />
                  <SkeletonRow cols={8} />
                </>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No departments found
                  </td>
                </tr>
              ) : (
                filtered.map((dept) => (
                  <tr key={dept.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{dept.name}</p>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">{dept.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-mono font-medium text-muted-foreground">{dept.code}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{dept.head}</td>
                    <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">{dept.parent}</td>
                    <td className="px-4 py-3 text-muted-foreground">{dept.employees}</td>
                    <td className="px-4 py-3 text-muted-foreground">{dept.assets}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${dept.status === "Active" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                        {dept.status === "Active" && <CheckCircle className="h-3 w-3" />}
                        {dept.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 btn-enterprise" onClick={() => setEditDept(dept)}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        {dept.status === "Active" && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 btn-enterprise" onClick={() => setConfirm({ open: true, id: dept.id })}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">Showing {filtered.length} of {departments.length} departments</p>
        </div>
      </div>

      {/* Create Modal */}
      <Modal open={createOpen} title="Create Department" onClose={() => setCreateOpen(false)}>
        <DepartmentForm
          departments={departments}
          onSubmit={createDept}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editDept} title="Edit Department" onClose={() => setEditDept(null)}>
        {editDept && (
          <DepartmentForm
            departments={departments}
            initial={editDept}
            onSubmit={(data) => updateDept({ ...editDept, ...data })}
            onCancel={() => setEditDept(null)}
          />
        )}
      </Modal>

      {/* Confirm */}
      <ConfirmDialog
        open={confirm.open}
        title="Deactivate Department"
        message="This will remove the department from active use. Assets and employees will need reassignment."
        onConfirm={() => deactivate(confirm.id)}
        onCancel={() => setConfirm({ open: false, id: "" })}
      />
    </div>
  );
}

function DepartmentForm({
  departments,
  initial,
  onSubmit,
  onCancel,
}: {
  departments: Department[];
  initial?: Department;
  onSubmit: (data: Omit<Department, "id" | "employees" | "assets">) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [code, setCode] = useState(initial?.code || "");
  const [head, setHead] = useState(initial?.head || "");
  const [parent, setParent] = useState(initial?.parent || "—");
  const [description, setDescription] = useState(initial?.description || "");
  const [status, setStatus] = useState<"Active" | "Inactive">(initial?.status || "Active");

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Department Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground outline-none focus:border-primary" placeholder="e.g. Engineering" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Department Code</label>
          <input value={code} onChange={(e) => setCode(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground outline-none focus:border-primary" placeholder="e.g. ENG" />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">Department Head</label>
        <input value={head} onChange={(e) => setHead(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground outline-none focus:border-primary" placeholder="e.g. Raj Kumar" />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">Parent Department</label>
        <select value={parent} onChange={(e) => setParent(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
          <option value="—">None (Top Level)</option>
          {departments.filter((d) => d.id !== initial?.id).map((d) => (
            <option key={d.id} value={d.name}>{d.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground outline-none focus:border-primary" rows={2} placeholder="Brief description..." />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">Status</label>
        <div className="flex gap-2">
          {(["Active", "Inactive"] as const).map((s) => (
            <button key={s} onClick={() => setStatus(s)} className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${status === s ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={onCancel} className="btn-enterprise">Cancel</Button>
        <Button size="sm" onClick={() => onSubmit({ name, code, head, parent, description, status })} className="btn-enterprise">
          {initial ? "Save Changes" : "Create Department"}
        </Button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CATEGORIES TAB
   ═══════════════════════════════════════════════════════ */

function CategoriesTab({
  showToast,
}: {
  showToast: (msg: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState(initialCategories);
  const [createOpen, setCreateOpen] = useState(false);
  const [editCat, setEditCat] = useState<AssetCategory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()),
  );

  const createCat = (data: Omit<AssetCategory, "id" | "assets">) => {
    setCategories((prev) => [...prev, { ...data, id: `c${Date.now()}`, assets: 0 }]);
    setCreateOpen(false);
    showToast("Category created");
  };

  const updateCat = (data: AssetCategory) => {
    setCategories((prev) => prev.map((c) => (c.id === data.id ? data : c)));
    setEditCat(null);
    showToast("Category updated");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <Button size="sm" className="btn-enterprise" onClick={() => setCreateOpen(true)}>
          <Plus className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Create Category</span>
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Category", "Code", "Assets", "Dynamic Fields", "Features", "Status", "Actions"].map((h) => (
                  <th key={h} className={`px-4 py-3 text-xs font-medium text-muted-foreground ${h === "Code" || h === "Features" ? "hidden lg:table-cell" : ""}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  <SkeletonRow cols={7} />
                  <SkeletonRow cols={7} />
                  <SkeletonRow cols={7} />
                </>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">No categories found</td>
                </tr>
              ) : (
                filtered.map((cat) => (
                  <tr key={cat.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                          <FolderTree className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{cat.name}</p>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">{cat.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-mono font-medium text-muted-foreground">{cat.code}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{cat.assets}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {cat.fields.slice(0, 2).map((f) => (
                          <span key={f.name} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{f.name}</span>
                        ))}
                        {cat.fields.length > 2 && (
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">+{cat.fields.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        {cat.sharedAllowed && <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-emerald-600 dark:text-emerald-400">Shared</span>}
                        {cat.maintenanceRequired && <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-amber-600 dark:text-amber-400">Maint.</span>}
                        {cat.warrantyTracking && <span className="rounded bg-primary/10 px-1.5 py-0.5 text-primary">Warranty</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="h-3 w-3" /> {cat.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 btn-enterprise" onClick={() => setEditCat(cat)}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 btn-enterprise">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">Showing {filtered.length} of {categories.length} categories</p>
        </div>
      </div>

      {/* Create Modal */}
      <Modal open={createOpen} title="Create Asset Category" onClose={() => setCreateOpen(false)}>
        <CategoryForm onSubmit={createCat} onCancel={() => setCreateOpen(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editCat} title="Edit Asset Category" onClose={() => setEditCat(null)}>
        {editCat && (
          <CategoryForm initial={editCat} onSubmit={(data) => updateCat({ ...editCat, ...data })} onCancel={() => setEditCat(null)} />
        )}
      </Modal>
    </div>
  );
}

function CategoryForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: AssetCategory;
  onSubmit: (data: Omit<AssetCategory, "id" | "assets">) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [code, setCode] = useState(initial?.code || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [shared, setShared] = useState(initial?.sharedAllowed ?? false);
  const [maintenance, setMaintenance] = useState(initial?.maintenanceRequired ?? false);
  const [warranty, setWarranty] = useState(initial?.warrantyTracking ?? false);
  const [fields, setFields] = useState(initial?.fields || []);

  const addField = () => setFields((prev) => [...prev, { name: "", type: "Text" }]);
  const removeField = (i: number) => setFields((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Category Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground outline-none focus:border-primary" placeholder="e.g. Electronics" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Category Code</label>
          <input value={code} onChange={(e) => setCode(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground outline-none focus:border-primary" placeholder="e.g. ELEC" />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground outline-none focus:border-primary" rows={2} placeholder="Brief description..." />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Category Settings</label>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Shared Resource", value: shared, set: setShared },
            { label: "Maintenance Required", value: maintenance, set: setMaintenance },
            { label: "Warranty Tracking", value: warranty, set: setWarranty },
          ].map((s) => (
            <label key={s.label} className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" checked={s.value} onChange={(e) => s.set(e.target.checked)} className="h-3.5 w-3.5 rounded border-border text-primary" />
              {s.label}
            </label>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Dynamic Fields</label>
          <button type="button" onClick={addField} className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80">
            <Plus className="h-3 w-3" /> Add Field
          </button>
        </div>
        {fields.map((f, i) => (
          <div key={i} className="flex items-center gap-2">
            <input value={f.name} onChange={(e) => { const n = [...fields]; n[i] = { ...n[i], name: e.target.value }; setFields(n); }} className="flex-1 rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary" placeholder="Field name" />
            <select value={f.type} onChange={(e) => { const n = [...fields]; n[i] = { ...n[i], type: e.target.value }; setFields(n); }} className="w-32 rounded-lg border border-border bg-muted/30 px-2 py-1.5 text-sm text-foreground outline-none focus:border-primary">
              <option>Text</option>
              <option>Number</option>
              <option>Date</option>
              <option>Dropdown</option>
            </select>
            <button onClick={() => removeField(i)} className="rounded p-1 text-muted-foreground hover:text-destructive"><X className="h-3.5 w-3.5" /></button>
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={onCancel} className="btn-enterprise">Cancel</Button>
        <Button size="sm" onClick={() => onSubmit({ name, code, description, sharedAllowed: shared, maintenanceRequired: maintenance, warrantyTracking: warranty, fields, status: "Active" })} className="btn-enterprise">
          {initial ? "Save Changes" : "Create Category"}
        </Button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   EMPLOYEES TAB
   ═══════════════════════════════════════════════════════ */

function EmployeesTab({
  showToast,
}: {
  showToast: (msg: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [page, setPage] = useState(1);
  const perPage = 8;
  const [employees, setEmployees] = useState(initialEmployees);
  const [promoteEmp, setPromoteEmp] = useState<Employee | null>(null);
  const [confirm, setConfirm] = useState<{ open: boolean; id: string; action: string }>({ open: false, id: "", action: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = employees.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase()) || e.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All" || e.role === roleFilter;
    const matchStatus = statusFilter === "All" || e.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const promote = (id: string, newRole: Employee["role"]) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, role: newRole } : e)));
    setPromoteEmp(null);
    showToast(`Employee promoted to ${newRole}`);
  };

  const deactivate = (id: string) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, status: "Inactive" } : e)));
    setConfirm({ open: false, id: "", action: "" });
    showToast("Employee deactivated");
  };

  return (
    <div className="space-y-4">
      {/* Role assignment notice */}
      <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div>
          <p className="text-sm font-medium text-foreground">Role Assignment</p>
          <p className="text-xs text-muted-foreground">
            Roles are assigned by Admin only from this directory. Users cannot self-assign elevated roles.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search by name, email, or ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }} className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Department Head">Dept Head</option>
            <option value="Asset Manager">Asset Mgr</option>
            <option value="Employee">Employee</option>
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Employee", "ID", "Department", "Role", "Status", "Last Login", "Actions"].map((h) => (
                  <th key={h} className={`px-4 py-3 text-xs font-medium text-muted-foreground ${h === "ID" || h === "Last Login" ? "hidden lg:table-cell" : ""}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  <SkeletonRow cols={7} />
                  <SkeletonRow cols={7} />
                  <SkeletonRow cols={7} />
                  <SkeletonRow cols={7} />
                </>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">No employees found</td>
                </tr>
              ) : (
                paginated.map((emp) => (
                  <tr key={emp.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {emp.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{emp.name}</p>
                          <p className="text-[11px] text-muted-foreground">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-mono text-muted-foreground">{emp.employeeId}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{emp.department}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${roleColors[emp.role]}`}>
                        {emp.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${emp.status === "Active" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                        {emp.status === "Active" && <CheckCircle className="h-3 w-3" />}
                        {emp.status}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-xs text-muted-foreground lg:table-cell">{emp.lastLogin}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {emp.role === "Employee" && emp.status === "Active" && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 btn-enterprise" onClick={() => setPromoteEmp(emp)} title="Promote">
                            <ArrowUp className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-7 w-7 btn-enterprise" onClick={() => setConfirm({ open: true, id: emp.id, action: "deactivate" })} title="Deactivate">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Showing {((page - 1) * perPage) + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length} employees
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-7 w-7" disabled={page === 1} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`flex h-7 w-7 items-center justify-center rounded text-xs font-medium transition-colors ${page === i + 1 ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
              >
                {i + 1}
              </button>
            ))}
            <Button variant="outline" size="icon" className="h-7 w-7" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Promote Modal */}
      <Modal open={!!promoteEmp} title="Promote Employee" onClose={() => setPromoteEmp(null)}>
        {promoteEmp && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {promoteEmp.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{promoteEmp.name}</p>
                <p className="text-xs text-muted-foreground">{promoteEmp.email} · {promoteEmp.department}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Assign new role:</p>
              <div className="grid grid-cols-2 gap-2">
                {(["Department Head", "Asset Manager"] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => promote(promoteEmp.id, role)}
                    className="flex items-center gap-2 rounded-lg border border-border p-3 text-left transition-all hover:border-primary/30 hover:bg-primary/5"
                  >
                    <ArrowRight className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{role}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {role === "Department Head" ? "Manages department operations" : "Manages asset lifecycle"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setPromoteEmp(null)} className="btn-enterprise">Cancel</Button>
          </div>
        )}
      </Modal>

      {/* Confirm */}
      <ConfirmDialog
        open={confirm.open}
        title="Deactivate Employee"
        message="This employee will lose access to the platform. Their assets will need to be transferred."
        onConfirm={() => deactivate(confirm.id)}
        onCancel={() => setConfirm({ open: false, id: "", action: "" })}
      />
    </div>
  );
}

/* missing ArrowUp icon */
function ArrowUp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5" /><path d="m5 12 7-7 7 7" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════ */

const tabs = [
  { id: "departments", label: "Departments", icon: Building2 },
  { id: "categories", label: "Asset Categories", icon: FolderTree },
  { id: "employees", label: "Employee Directory", icon: Users },
];

export default function OrganizationPage() {
  const [activeTab, setActiveTab] = useState("departments");
  const [toast, setToast] = useState("");

  const showToast = useCallback((msg: string) => setToast(msg), []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Organization Setup</h1>
        <p className="mt-1 text-sm text-muted-foreground">Master data management — departments, categories, and employee directory</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex gap-1 overflow-x-auto" aria-label="Organization tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "departments" && <DepartmentsTab showToast={showToast} />}
      {activeTab === "categories" && <CategoriesTab showToast={showToast} />}
      {activeTab === "employees" && <EmployeesTab showToast={showToast} />}

      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}
