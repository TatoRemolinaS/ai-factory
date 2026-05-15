import type { OnboardingData } from "./types";

export async function apiGet(slug: string): Promise<OnboardingData> {
  const res = await fetch(`/api/${slug}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Error ${res.status}: No se pudo cargar el brief.`);
  return res.json();
}

export async function apiPatch(slug: string, partial: Record<string, unknown>): Promise<void> {
  const res = await fetch(`/api/${slug}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(partial),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "No se pudo guardar el cambio.");
  }
}

export async function apiApprove(
  slug: string,
  payload: { selected_palette: string | null; selected_typography: string | null; all_answered: boolean; notes: string }
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`/api/${slug}/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.json();
  return body;
}
