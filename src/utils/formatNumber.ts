export function formatNumber(
  value: number | null | undefined,
  locale: string = "en-US",
): string {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat(locale).format(value);
}

export function formatCompact(
  value: number | null | undefined,
  locale: string = "en-US",
): string {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat(locale, { notation: "compact" }).format(value);
}
