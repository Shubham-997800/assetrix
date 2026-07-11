"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

interface PersonalInfoProps {
  editMode: boolean;
}

const initialData = {
  firstName: "John",
  lastName: "Smith",
  displayName: "John Smith",
  dob: "1990-05-15",
  gender: "",
  language: "English",
  timezone: "Asia/Kolkata",
};

const languages = ["English", "Hindi", "Spanish", "French", "German", "Japanese"];
const timezones = [
  "Asia/Kolkata",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Australia/Sydney",
];

export function PersonalInfo({ editMode }: PersonalInfoProps) {
  const [data, setData] = useState(initialData);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChange = (field: string, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Personal Information</h3>
          <p className="text-xs text-muted-foreground">Your personal details</p>
        </div>
        {saved && (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 animate-fade-in">
            <Save className="h-3 w-3" /> Saved
          </span>
        )}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {[
          { label: "First Name", field: "firstName", type: "text", placeholder: "John" },
          { label: "Last Name", field: "lastName", type: "text", placeholder: "Smith" },
          { label: "Display Name", field: "displayName", type: "text", placeholder: "John Smith" },
          { label: "Date of Birth", field: "dob", type: "date" },
        ].map((item) => (
          <div key={item.field}>
            <label className="text-xs font-medium text-muted-foreground">{item.label}</label>
            <input
              type={item.type}
              value={data[item.field as keyof typeof data]}
              placeholder={item.placeholder}
              disabled={!editMode}
              onChange={(e) => handleChange(item.field, e.target.value)}
              className={`mt-1.5 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none transition-all ${
                editMode
                  ? "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                  : "border-transparent bg-muted/30"
              }`}
            />
          </div>
        ))}

        <div>
          <label className="text-xs font-medium text-muted-foreground">Gender (Optional)</label>
          <select
            value={data.gender}
            disabled={!editMode}
            onChange={(e) => handleChange("gender", e.target.value)}
            className={`mt-1.5 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none transition-all ${
              editMode
                ? "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                : "border-transparent bg-muted/30"
            }`}
          >
            <option value="">Not specified</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Preferred Language</label>
          <select
            value={data.language}
            disabled={!editMode}
            onChange={(e) => handleChange("language", e.target.value)}
            className={`mt-1.5 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none transition-all ${
              editMode
                ? "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                : "border-transparent bg-muted/30"
            }`}
          >
            {languages.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Time Zone</label>
          <select
            value={data.timezone}
            disabled={!editMode}
            onChange={(e) => handleChange("timezone", e.target.value)}
            className={`mt-1.5 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none transition-all ${
              editMode
                ? "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                : "border-transparent bg-muted/30"
            }`}
          >
            {timezones.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {editMode && (
        <div className="mt-5 flex items-center gap-2 border-t border-border pt-5 animate-fade-in">
          <Button size="default" className="btn-enterprise" onClick={handleSave}>
            <Save className="h-3.5 w-3.5" /> Save Changes
          </Button>
          <Button variant="outline" size="sm" className="btn-enterprise">
            <X className="h-3.5 w-3.5" /> Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
