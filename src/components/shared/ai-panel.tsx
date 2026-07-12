"use client";

import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useDashboard } from "@/contexts/dashboard-context";
import {
  Sparkles, X, TrendingUp, AlertTriangle, Lightbulb, ArrowRight,
  ChevronDown, ChevronUp, Bot, Send, Package, Wrench, CalendarClock,
  ClipboardCheck, BarChart3, RefreshCw, Settings,
} from "lucide-react";

interface Insight {
  id: string;
  type: "suggestion" | "warning" | "prediction" | "info";
  title: string;
  description: string;
  action?: string;
  actionHref?: string;
  priority: "high" | "medium" | "low";
  icon: React.ElementType;
}

interface AIResponse {
  id: string;
  message: string;
  timestamp: number;
}

const PAGE_INSIGHTS: Record<string, Insight[]> = {
  "/dashboard": [
    { id: "d1", type: "warning", title: "Overdue Maintenance Alert", description: "3 assets have overdue maintenance tasks. Schedule service to prevent failures.", action: "View Maintenance", actionHref: "/dashboard/maintenance", priority: "high", icon: Wrench },
    { id: "d2", type: "prediction", title: "Budget Projection", description: "At current spend rate, Q4 budget will be exceeded by 12%. Consider reallocating.", priority: "medium", icon: TrendingUp },
    { id: "d3", type: "suggestion", title: "Idle Asset Opportunity", description: "7 assets have been idle >30 days. Reallocate or decommission to free resources.", action: "View Assets", actionHref: "/dashboard/assets", priority: "medium", icon: Package },
    { id: "d4", type: "info", title: "Audit Compliance", description: "92% of assets verified this quarter. 14 pending verification.", action: "View Audit", actionHref: "/dashboard/audit", priority: "low", icon: ClipboardCheck },
  ],
  "/dashboard/assets": [
    { id: "a1", type: "warning", title: "Warranty Expiring", description: "12 assets have warranties expiring in the next 90 days. Initiate renewals.", priority: "high", icon: AlertTriangle },
    { id: "a2", type: "suggestion", title: "Idle Asset Detection", description: "7 assets idle >30 days. Transfer to active users or mark for disposal.", priority: "medium", icon: Package },
    { id: "a3", type: "prediction", title: "Replacement Due", description: "5 assets approaching end-of-life based on depreciation schedule.", priority: "medium", icon: RefreshCw },
  ],
  "/dashboard/allocations": [
    { id: "l1", type: "warning", title: "Transfer Pending Approval", description: "3 allocation transfers are awaiting manager approval.", action: "Review Transfers", actionHref: "/dashboard/allocations", priority: "high", icon: AlertTriangle },
    { id: "l2", type: "suggestion", title: "Transfer Recommendation", description: "Engineering dept. has 5 idle assets while Sales has 4 pending requests.", priority: "medium", icon: Lightbulb },
  ],
  "/dashboard/bookings": [
    { id: "b1", type: "info", title: "Utilization Rate", description: "Current resource utilization is 78%. Peak hours are 10AM-2PM.", priority: "medium", icon: BarChart3 },
    { id: "b2", type: "warning", title: "Conflict Detected", description: "2 overlapping booking requests for Conference Room B2.", priority: "high", icon: CalendarClock },
  ],
  "/dashboard/maintenance": [
    { id: "m1", type: "prediction", title: "Failure Pattern", description: "3 laptop models show recurring screen issues. Consider bulk replacement.", priority: "high", icon: Wrench },
    { id: "m2", type: "suggestion", title: "Repair vs Replace", description: "2 assets cost more to repair than replacement value. Recommend decommission.", action: "View Tasks", actionHref: "/dashboard/maintenance", priority: "medium", icon: Settings },
    { id: "m3", type: "warning", title: "SLA Risk", description: "4 maintenance tasks at risk of breaching 72-hour SLA.", priority: "high", icon: AlertTriangle },
  ],
  "/dashboard/audit": [
    { id: "u1", type: "warning", title: "Discrepancy Rate", description: "Current cycle has 8% discrepancy rate (target: <5%). Investigate discrepancies.", priority: "high", icon: ClipboardCheck },
    { id: "u2", type: "suggestion", title: "Schedule Next Cycle", description: "Last audit completed 45 days ago. Schedule next quarterly cycle.", priority: "medium", icon: RefreshCw },
  ],
  "/dashboard/reports": [
    { id: "r1", type: "info", title: "Export Available", description: "Generate this month's executive summary with one click.", priority: "low", icon: BarChart3 },
    { id: "r2", type: "prediction", title: "Trend Alert", description: "Maintenance costs trending 15% higher than last quarter.", priority: "medium", icon: TrendingUp },
  ],
};

const TYPE_STYLES: Record<string, string> = {
  suggestion: "bg-primary/10 text-primary border-primary/20",
  warning: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  prediction: "bg-violet-500/10 text-violet-500 border-violet-500/20",
  info: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  suggestion: Lightbulb,
  warning: AlertTriangle,
  prediction: TrendingUp,
  info: Sparkles,
};

const PRIORITY_LABELS: Record<string, string> = {
  high: "High Priority",
  medium: "Medium",
  low: "Low",
};

export function AIPanel() {
  const { aiPanelOpen, setAiPanelOpen } = useDashboard();
  const pathname = usePathname();
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<AIResponse[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [filter, setFilter] = useState<"all" | "suggestion" | "warning" | "prediction" | "info">("all");

  const pageInsights = useMemo(() => {
    const base = PAGE_INSIGHTS[pathname] || PAGE_INSIGHTS["/dashboard"] || [];
    if (filter === "all") return base;
    return base.filter((i) => i.type === filter);
  }, [pathname, filter]);

  const handleSend = () => {
    if (!chatInput.trim()) return;
    const userMsg: AIResponse = {
      id: `msg-${Date.now()}`,
      message: chatInput,
      timestamp: Date.now(),
    };
    setChatHistory((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);
    setTimeout(() => {
      const responses: Record<string, string> = {
        default: "I can help you analyze assets, check maintenance schedules, review allocations, or generate reports. What would you like to know?",
      };
      const lowerMsg = userMsg.message.toLowerCase();
      let response = responses.default;
      if (lowerMsg.includes("asset")) response = "You have 247 assets total. 42 are currently idle, 12 have warranties expiring soon, and 5 are due for replacement based on depreciation schedules.";
      else if (lowerMsg.includes("maintenance")) response = "There are 8 pending maintenance tasks, 3 overdue. Average completion time is 2.3 days. 2 tasks are at risk of breaching SLA.";
      else if (lowerMsg.includes("budget") || lowerMsg.includes("cost")) response = "Total asset value: Rs. 2.4 Cr. Maintenance spend this quarter: Rs. 18.5L (12% over budget). Recommend reviewing repair-vs-replace decisions for 5 assets.";
      else if (lowerMsg.includes("audit")) response = "Current audit cycle: 92% verified, 14 pending. Discrepancy rate: 8% (target: <5%). 3 assets have location mismatches.";
      else if (lowerMsg.includes("booking")) response = "Resource utilization: 78%. Peak hours: 10AM-2PM. 2 conflicts detected for Conference Room B2. 3 bookings pending approval.";
      else if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) response = "Hello! I'm your AI assistant. I can help with asset management, maintenance tracking, allocation analysis, and operational insights. How can I help?";

      setChatHistory((prev) => [
        ...prev,
        { id: `resp-${Date.now()}`, message: response, timestamp: Date.now() },
      ]);
      setIsTyping(false);
    }, 800);
  };

  if (!aiPanelOpen) return null;

  return (
    <div className="fixed right-0 top-0 z-50 h-screen w-[380px] border-l border-border bg-card shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Bot className="h-4 w-4 text-primary" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">AI Assistant</p>
            <p className="text-[10px] text-muted-foreground">Assetrix Intelligence</p>
          </div>
        </div>
        <button
          onClick={() => setAiPanelOpen(false)}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Page Insights */}
      <div className="border-b border-border">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <p className="text-xs font-semibold text-foreground">Page Insights</p>
          <div className="flex gap-1">
            {(["all", "warning", "suggestion", "prediction", "info"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-md px-2 py-0.5 text-[10px] font-medium capitalize transition-colors ${
                  filter === f ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="max-h-[220px] overflow-y-auto px-4 pb-3 space-y-2">
          {pageInsights.length === 0 && (
            <p className="py-4 text-center text-xs text-muted-foreground">No insights for this page</p>
          )}
          {pageInsights.map((insight) => {
            const TypeIcon = TYPE_ICONS[insight.type] || Sparkles;
            const expanded = expandedInsight === insight.id;
            return (
              <div key={insight.id} className={`rounded-lg border p-3 ${TYPE_STYLES[insight.type]}`}>
                <button
                  onClick={() => setExpandedInsight(expanded ? null : insight.id)}
                  className="flex w-full items-start gap-2.5 text-left"
                >
                  <TypeIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold">{insight.title}</p>
                      <span className="ml-2 flex-shrink-0 rounded-full bg-background/50 px-1.5 py-0.5 text-[9px] font-medium uppercase">
                        {PRIORITY_LABELS[insight.priority]}
                      </span>
                    </div>
                    {(expanded || insight.priority === "high") && (
                      <p className="mt-1 text-[11px] leading-relaxed opacity-80">{insight.description}</p>
                    )}
                    {expanded && insight.action && (
                      <a
                        href={insight.actionHref || "#"}
                        className="mt-2 inline-flex items-center gap-1 rounded-md bg-background/50 px-2 py-1 text-[10px] font-medium hover:bg-background/80"
                      >
                        {insight.action} <ArrowRight className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  {insight.priority !== "high" && (
                    expanded ? <ChevronUp className="h-3 w-3 flex-shrink-0 opacity-50" /> : <ChevronDown className="h-3 w-3 flex-shrink-0 opacity-50" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {chatHistory.length === 0 && !isTyping && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </span>
            <p className="text-sm font-medium text-foreground">Ask anything</p>
            <p className="mt-1 text-xs text-muted-foreground">I can help with assets, maintenance, bookings, and more.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Asset status", "Budget analysis", "Maintenance schedule", "Utilization report"].map((q) => (
                <button
                  key={q}
                  onClick={() => { setChatInput(q); }}
                  className="rounded-full border border-border bg-muted px-3 py-1.5 text-[11px] text-muted-foreground hover:text-foreground"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatHistory.map((msg) => {
          const isUser = msg.id.startsWith("msg-");
          return (
            <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2.5 text-xs leading-relaxed ${
                  isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {msg.message}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex justify-start">
            <div className="rounded-xl bg-muted px-3 py-2.5 text-xs">
              <span className="inline-flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/40" />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border px-4 py-3">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 py-2">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Ask about assets, maintenance, budget..."
            className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={handleSend}
            disabled={!chatInput.trim()}
            className="rounded-lg bg-primary p-1.5 text-primary-foreground disabled:opacity-30"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
