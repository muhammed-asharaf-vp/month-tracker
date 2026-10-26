import { MONTHS } from "./constants";

export function age(dob) {
  const d = new Date(dob);
  const n = new Date();
  let a = n.getFullYear() - d.getFullYear();
  const m = n.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && n.getDate() < d.getDate())) a--;
  return a;
}

export function fmt(dob) {
  const d = new Date(dob);
  return d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear();
}

export function initials(name) {
  const p = name.trim().split(/\s+/);
  return ((p[0] || "")[0] + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase();
}
