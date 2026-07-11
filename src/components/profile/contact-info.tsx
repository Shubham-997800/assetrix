"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, CheckCircle, Clock } from "lucide-react";

interface ContactInfoProps {
  editMode: boolean;
}

export function ContactInfo({ editMode }: ContactInfoProps) {
  const [saved, setSaved] = useState(false);
  const [emailVerified] = useState(true);
  const [phoneVerified] = useState(false);
  const [data, setData] = useState({
    email: "john.smith@company.com",
    phone: "+91 98765 43210",
    altPhone: "",
    address: "123 Business Park, SG Highway",
    country: "India",
    state: "Gujarat",
    city: "Ahmedabad",
    postal: "380015",
  });

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const handleChange = (field: string, value: string) => setData((p) => ({ ...p, [field]: value }));

  const ic = editMode
    ? "mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
    : "mt-1.5 w-full rounded-lg border border-transparent bg-muted/30 px-3 py-2 text-sm text-foreground outline-none";

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Contact Information</h3>
          <p className="text-xs text-muted-foreground">How others can reach you</p>
        </div>
        {saved && (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 animate-fade-in">
            <Save className="h-3 w-3" /> Saved
          </span>
        )}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Email Address</label>
          <div className="relative mt-1.5">
            <input type="email" value={data.email} disabled={!editMode}
              onChange={(e) => handleChange("email", e.target.value)} className={`${ic} pr-20`} />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              {emailVerified ? (
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="h-2.5 w-2.5" /> Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                  <Clock className="h-2.5 w-2.5" /> Pending
                </span>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Phone Number</label>
          <div className="relative mt-1.5">
            <input type="tel" value={data.phone} disabled={!editMode}
              onChange={(e) => handleChange("phone", e.target.value)} className={`${ic} pr-20`} />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              {phoneVerified ? (
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="h-2.5 w-2.5" /> Verified
                </span>
              ) : (
                <button className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-500/20">
                  <Clock className="h-2.5 w-2.5" /> Verify
                </button>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Alternate Phone</label>
          <input type="tel" value={data.altPhone} disabled={!editMode} placeholder="+91 XXXXX XXXXX"
            onChange={(e) => handleChange("altPhone", e.target.value)} className={ic} />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Country</label>
          <input type="text" value={data.country} disabled={!editMode}
            onChange={(e) => handleChange("country", e.target.value)} className={ic} />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-muted-foreground">Address</label>
          <input type="text" value={data.address} disabled={!editMode}
            onChange={(e) => handleChange("address", e.target.value)} className={ic} />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">State</label>
          <input type="text" value={data.state} disabled={!editMode}
            onChange={(e) => handleChange("state", e.target.value)} className={ic} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">City</label>
            <input type="text" value={data.city} disabled={!editMode}
              onChange={(e) => handleChange("city", e.target.value)} className={ic} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Postal Code</label>
            <input type="text" value={data.postal} disabled={!editMode}
              onChange={(e) => handleChange("postal", e.target.value)} className={ic} />
          </div>
        </div>
      </div>

      {editMode && (
        <div className="mt-5 flex items-center gap-2 border-t border-border pt-5 animate-fade-in">
          <Button size="default" className="btn-enterprise" onClick={handleSave}>
            <Save className="h-3.5 w-3.5" /> Save Changes
          </Button>
          <Button variant="outline" size="default" className="btn-enterprise">Cancel</Button>
        </div>
      )}
    </div>
  );
}
