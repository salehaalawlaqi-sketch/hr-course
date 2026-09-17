export function toText(value) {
  if (typeof value === "string") return value;
  if (value == null) return "";
  if (typeof value === "object") {
    return Object.values(value)
      .filter((v) => typeof v === "string")
      .join(" — ");
  }
  return String(value);
}
