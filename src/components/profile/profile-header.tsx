"use client";

import { useState, useRef } from "react";
import { Camera, CheckCircle, Pencil, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  name: string;
  role: string;
  department: string;
  status: "online" | "offline" | "away";
  joinDate: string;
  initials: string;
}

export function ProfileHeader({ name, role, department, status, joinDate, initials }: ProfileHeaderProps) {
  const [editMode, setEditMode] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadPreview(ev.target?.result as string);
      setShowUpload(true);
    };
    reader.readAsDataURL(file);
  };

  const confirmUpload = () => {
    setAvatarUrl(uploadPreview);
    setShowUpload(false);
    setUploadPreview(null);
  };

  const removeAvatar = () => {
    setAvatarUrl(null);
    setShowUpload(false);
    setUploadPreview(null);
  };

  const statusColors = {
    online: "bg-emerald-500",
    offline: "bg-muted-foreground/40",
    away: "bg-amber-500",
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
        {/* Avatar */}
        <div className="relative self-center sm:self-start">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Change avatar"
          >
            <Camera className="h-3.5 w-3.5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left mt-4 sm:mt-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-xl font-bold text-foreground">{name}</h1>
            <div className="flex items-center gap-1.5 self-center sm:self-auto">
              <div className={`h-2 w-2 rounded-full ${statusColors[status]}`} />
              <span className="text-xs font-medium text-muted-foreground capitalize">{status}</span>
            </div>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">{role} · {department}</p>
          <p className="mt-1 text-xs text-muted-foreground/60">Member since {joinDate}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4 sm:mt-0 self-center sm:self-start">
          <Button variant="outline" size="sm" className="btn-enterprise" onClick={() => setEditMode(!editMode)}>
            <Pencil className="h-3.5 w-3.5" />
            {editMode ? "Cancel" : "Edit Profile"}
          </Button>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 animate-fade-in">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg animate-scale-in">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Update Avatar</h3>
              <button onClick={() => setShowUpload(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 flex justify-center">
              <div className="h-32 w-32 overflow-hidden rounded-2xl bg-muted">
                {uploadPreview && <img src={uploadPreview} alt="Preview" className="h-full w-full object-cover" />}
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">PNG, JPG or WEBP. Max 5MB.</p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 btn-enterprise" onClick={() => { setShowUpload(false); setUploadPreview(null); }}>
                Cancel
              </Button>
              <Button size="sm" className="flex-1 btn-enterprise" onClick={confirmUpload}>
                <Upload className="h-3.5 w-3.5" /> Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {editMode && (
        <p className="mt-4 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 animate-fade-in">
          <Pencil className="h-3 w-3" />
          Edit mode enabled — changes below will be saved
        </p>
      )}
    </div>
  );
}
