"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Building2,
  FolderTree,
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  ChevronDown,
  CheckCircle,
} from "lucide-react";

const tabs = [
  { id: "departments", label: "Departments", icon: Building2 },
  { id: "categories", label: "Categories", icon: FolderTree },
  { id: "employees", label: "Employees", icon: Users },
];

const departments = [
  { name: "Engineering", head: "R. Kumar", parent: "—", employees: 45, status: "Active" },
  { name: "Procurement", head: "S. Chen", parent: "—", employees: 32, status: "Active" },
  { name: "Operations", head: "M. Webb", parent: "Engineering", employees: 28, status: "Active" },
  { name: "Finance", head: "P. Sharma", parent: "—", employees: 18, status: "Active" },
  { name: "HR", head: "A. Rivera", parent: "—", employees: 12, status: "Active" },
  { name: "Marketing", head: "K. Tanaka", parent: "Operations", employees: 15, status: "Active" },
];

const categories = [
  { name: "IT Equipment", assets: 156, fields: 12 },
  { name: "Furniture", assets: 89, fields: 8 },
  { name: "Vehicles", assets: 34, fields: 10 },
  { name: "Machinery", assets: 67, fields: 15 },
  { name: "Office Supplies", assets: 234, fields: 5 },
  { name: "Audio/Visual", assets: 45, fields: 7 },
];

const employees = [
  { name: "Sarah Chen", role: "Admin", department: "Engineering", status: "Active" },
  { name: "Marcus Webb", role: "Manager", department: "Procurement", status: "Active" },
  { name: "Priya Sharma", role: "Employee", department: "Finance", status: "Active" },
  { name: "Alex Rivera", role: "Manager", department: "Operations", status: "Inactive" },
  { name: "Jordan Lee", role: "Employee", department: "HR", status: "Active" },
  { name: "Kim Tanaka", role: "Employee", department: "Marketing", status: "Active" },
];

/* ── Departments Tab ──────────────────────────────── */

function DepartmentsTab() {
  const [search, setSearch] = useState("");

  const filtered = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.head.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
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
          <Button variant="outline" size="default" className="btn-enterprise">
            <ChevronDown className="h-3.5 w-3.5" /> Filter
          </Button>
          <Button size="default" className="btn-enterprise">
            <Plus className="h-3.5 w-3.5" /> Create Department
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Department", "Head", "Parent", "Employees", "Status", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className={`px-3 py-3 text-xs font-medium text-muted-foreground sm:px-6 ${
                        h === "Parent" ? "hidden sm:table-cell" : ""
                      }`}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((dept) => (
                <tr
                  key={dept.name}
                  className="border-b border-border last:border-0 transition-colors hover:bg-muted/30"
                >
                  <td className="px-3 py-3.5 font-medium text-foreground sm:px-6">
                    {dept.name}
                  </td>
                  <td className="px-3 py-3.5 text-muted-foreground sm:px-6">
                    {dept.head}
                  </td>
                  <td className="hidden px-3 py-3.5 text-muted-foreground sm:table-cell sm:px-6">
                    {dept.parent}
                  </td>
                  <td className="px-3 py-3.5 text-muted-foreground sm:px-6">
                    {dept.employees}
                  </td>
                  <td className="px-3 py-3.5 sm:px-6">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <CheckCircle className="h-3 w-3" />
                      {dept.status}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 sm:px-6">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon-sm" className="btn-enterprise">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="btn-enterprise">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="btn-enterprise">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Categories Tab ───────────────────────────────── */

function CategoriesTab() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((cat) => (
        <div
          key={cat.name}
          className="card-hover rounded-xl border border-border bg-card p-5"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FolderTree className="h-5 w-5 text-primary" />
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon-sm" className="btn-enterprise">
                <Edit className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon-sm" className="btn-enterprise">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <h3 className="mt-4 text-sm font-semibold text-foreground">{cat.name}</h3>
          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
            <span>{cat.assets} assets</span>
            <span>{cat.fields} dynamic fields</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Employees Tab ────────────────────────────────── */

function EmployeesTab() {
  const [search, setSearch] = useState("");

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <Button size="default" className="btn-enterprise">
          <Plus className="h-3.5 w-3.5" /> Add Employee
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Employee", "Role", "Department", "Status", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className={`px-3 py-3 text-xs font-medium text-muted-foreground sm:px-6 ${
                        h === "Department" ? "hidden sm:table-cell" : ""
                      }`}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr
                  key={emp.name}
                  className="border-b border-border last:border-0 transition-colors hover:bg-muted/30"
                >
                  <td className="px-3 py-3.5 font-medium text-foreground sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {emp.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      {emp.name}
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-muted-foreground sm:px-6">
                    {emp.role}
                  </td>
                  <td className="hidden px-3 py-3.5 text-muted-foreground sm:table-cell sm:px-6">
                    {emp.department}
                  </td>
                  <td className="px-3 py-3.5 sm:px-6">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        emp.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {emp.status === "Active" && <CheckCircle className="h-3 w-3" />}
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 sm:px-6">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon-sm" className="btn-enterprise">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="btn-enterprise">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="btn-enterprise">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────── */

export default function OrganizationPage() {
  const [activeTab, setActiveTab] = useState("departments");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Organization Setup
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage departments, asset categories, and team members
        </p>
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

      {/* Content */}
      {activeTab === "departments" && <DepartmentsTab />}
      {activeTab === "categories" && <CategoriesTab />}
      {activeTab === "employees" && <EmployeesTab />}
    </div>
  );
}
