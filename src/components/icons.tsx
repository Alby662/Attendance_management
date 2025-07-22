import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7 7h10v10" />
      <path d="M10 3v3h3" />
      <path d="M17 3v3h-3" />
      <path d="M21 7h-3v3" />
      <path d="M21 17h-3v-3" />
      <path d="M17 21v-3h-3" />
      <path d="M10 21v-3h3" />
      <path d="M3 17h3v-3" />
      <path d="M3 7h3v3" />
    </svg>
  );
}
