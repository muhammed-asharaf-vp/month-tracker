const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

export function CheckIcon() {
  return (
    <svg className="h-3.5 w-3.5" {...base} strokeWidth="3">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function TrashIcon() {
  return (
    <svg className="h-[18px] w-[18px]" {...base} strokeWidth="1.75">
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V4h6v3" />
    </svg>
  );
}

export function CalendarIcon() {
  return (
    <svg className="h-8 w-8" {...base} strokeWidth="1.5">
      <rect x="3.5" y="5" width="17" height="15" rx="3" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </svg>
  );
}

export function PlusIcon() {
  return (
    <svg className="h-4 w-4" {...base} strokeWidth="2.5">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
