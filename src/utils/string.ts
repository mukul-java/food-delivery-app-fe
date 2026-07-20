export function titleize(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export function initials(value: string | null | undefined, fallback = "AD"): string {
  if (!value) return fallback;
  const parts = value.trim().split(/\s+/);
  const chars =
    parts.length >= 2 ? parts[0][0] + parts[1][0] : value.slice(0, 2);
  return chars.toUpperCase();
}

export function humanizeStatus(status: string | null | undefined): string {
  if (!status) return "";
  return status.replace(/_/g, " ");
}

export function truncate(value: string, max = 40): string {
  if (!value) return "";
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}
