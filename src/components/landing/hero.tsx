"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Box,
  CalendarCheck,
  Wrench,
  ShieldCheck,
  ArrowUpRight,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

export function Hero() {
  return (
    <section className="border-b border-border bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 py-12 sm:gap-12 sm:py-16 lg:grid-cols-2 lg:py-24">
          {/* Left Side */}
          <div>
            <Badge
              variant="secondary"
              className="mb-6 gap-1.5 px-3 py-1 text-xs font-medium animate-fade-in-up delay-0"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Trusted by hospitals, universities & enterprises
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1] animate-fade-in-up delay-50">
              Enterprise Asset & Resource Management Platform
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground animate-fade-in-up delay-100">
              Track assets, eliminate allocation conflicts, automate maintenance
              workflows and manage resource bookings from a single operational
              platform.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4 animate-fade-in-up delay-200">
              <Link href="/register">
                <Button size="lg" className="gap-2 px-6 btn-enterprise">
                  Explore Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="px-6 btn-enterprise">
                  Request Demo
                </Button>
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
              {[
                { value: "24,580+", label: "Assets Managed" },
                { value: "3,200+", label: "Active Bookings" },
                { value: "1,847", label: "Maintenance Requests" },
                { value: "99.8%", label: "Audit Accuracy" },
              ].map((m, i) => (
                <div key={m.label} className={`animate-fade-in-up`} style={{ animationDelay: `${300 + i * 50}ms` }}>
                  <p className="text-lg font-bold text-foreground">{m.value}</p>
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Dashboard */}
          <div className="relative animate-scale-in delay-200">
            {/* Floating Cards */}
            <div className="absolute -left-4 top-8 z-10 hidden rounded-xl border border-border bg-card p-3 shadow-md xl:block animate-fade-in-up delay-500">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10">
                  <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">12,450 Available</p>
                  <p className="text-[10px] text-muted-foreground">Assets</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-2 top-32 z-10 hidden rounded-xl border border-border bg-card p-3 shadow-md xl:block animate-fade-in-up delay-600">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/10">
                  <Wrench className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">8 Under Maintenance</p>
                  <p className="text-[10px] text-muted-foreground">Active</p>
                </div>
              </div>
            </div>

            <div className="absolute -left-2 bottom-28 z-10 hidden rounded-xl border border-border bg-card p-3 shadow-md xl:block animate-fade-in-up delay-700">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/10">
                  <RotateCcw className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">15 Transfers</p>
                  <p className="text-[10px] text-muted-foreground">This Week</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 bottom-16 z-10 hidden rounded-xl border border-border bg-card p-3 shadow-md xl:block animate-fade-in-up delay-700">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-500/10">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">3 Conflicts</p>
                  <p className="text-[10px] text-muted-foreground">Prevented</p>
                </div>
              </div>
            </div>

            {/* Dashboard */}
            <div className="rounded-2xl border border-border bg-card shadow-lg" role="img" aria-label="Assetrix dashboard preview showing asset status, booking calendar, and maintenance queue">
              <div className="rounded-t-2xl border-b border-border bg-muted/30 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400" aria-hidden="true" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" aria-hidden="true" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-400" aria-hidden="true" />
                  <span className="ml-2 text-xs text-muted-foreground">assetrix.app/dashboard</span>
                </div>
              </div>
              <div className="p-5">
                <div className="mb-4 grid grid-cols-2 gap-3">
                  {[
                    { label: "Available", value: "12,450", icon: Box, change: "+2.4%" },
                    { label: "Bookings", value: "3,200", icon: CalendarCheck, change: "Active" },
                    { label: "Maintenance", value: "1,847", icon: Wrench, change: "98% rate" },
                    { label: "Audit Score", value: "99.8%", icon: ShieldCheck, change: "Pass" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-border bg-background p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-muted-foreground">{stat.label}</span>
                        <stat.icon className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <p className="mt-1 text-base font-bold text-foreground">{stat.value}</p>
                      <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">{stat.change}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-4 rounded-xl border border-border bg-background p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">Asset Utilization</span>
                    <span className="text-[10px] text-muted-foreground">Last 12 months</span>
                  </div>
                  <div className="flex items-end gap-1" style={{ height: 100 }}>
                    {[35, 48, 42, 60, 52, 72, 65, 82, 78, 90, 85, 95].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm bg-primary/20" style={{ height: `${h}%` }}>
                        <div className="rounded-t-sm bg-primary" style={{ height: `${[65, 72, 58, 80, 68, 85, 75, 90, 82, 95, 88, 92][i]}%` }} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border bg-background p-3">
                    <p className="text-[10px] font-semibold text-foreground">Upcoming Returns</p>
                    <div className="mt-2 space-y-2">
                      {[{ name: "Laptop #4821", dept: "Engineering" }, { name: "Projector #127", dept: "Marketing" }, { name: "Camera #89", dept: "Media" }].map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground">{item.name}</span>
                          <span className="rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[8px] font-medium text-amber-600 dark:text-amber-400">{item.dept}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-background p-3">
                    <p className="text-[10px] font-semibold text-foreground">Recent Activity</p>
                    <div className="mt-2 space-y-2">
                      {[{ action: "Asset allocated", time: "2m" }, { action: "Maintenance done", time: "5m" }, { action: "Audit passed", time: "8m" }].map((item) => (
                        <div key={item.action} className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground">{item.action}</span>
                          <span className="text-[8px] text-muted-foreground/60">{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
