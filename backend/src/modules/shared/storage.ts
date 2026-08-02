import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { config } from "../../config/env";
import { AppError } from "../../utils/response";
import { HTTP_STATUS } from "../../constants";

let supabase: SupabaseClient | null = null;

function client(): SupabaseClient {
  if (!config.supabase.url || !config.supabase.serviceRoleKey) {
    throw new AppError("Supabase storage is not configured", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
  if (!supabase) {
    supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
      auth: { persistSession: false },
    });
  }
  return supabase;
}

function extension(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "application/pdf": ".pdf",
    "application/msword": ".doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    "application/vnd.ms-excel": ".xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  };
  return map[mime] || "";
}

export interface UploadResult {
  url: string;
  path: string;
  size: number;
}

/**
 * Uploads a buffer to a Supabase Storage bucket and returns the public URL.
 * Falls back to returning a data URL when Supabase is not configured, so the
 * API keeps working in a purely local development environment.
 */
export async function uploadToStorage(
  bucket: string,
  buffer: Buffer,
  mimetype: string,
  folder?: string
): Promise<UploadResult> {
  const ext = extension(mimetype);
  const path = `${folder ? folder + "/" : ""}${randomUUID()}${ext}`;

  if (!config.supabase.url || !config.supabase.serviceRoleKey) {
    const dataUrl = `data:${mimetype};base64,${buffer.toString("base64")}`;
    return { url: dataUrl, path, size: buffer.length };
  }

  const { error } = await client().storage.from(bucket).upload(path, buffer, {
    contentType: mimetype,
    upsert: false,
  });
  if (error) {
    throw new AppError(`Upload failed: ${error.message}`, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }

  const { data } = client().storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl, path, size: buffer.length };
}

export async function deleteFromStorage(bucket: string, path: string): Promise<void> {
  if (!config.supabase.url || !config.supabase.serviceRoleKey) return;
  if (path.startsWith("data:")) return;
  try {
    await client().storage.from(bucket).remove([path]);
  } catch {
    // best effort
  }
}
