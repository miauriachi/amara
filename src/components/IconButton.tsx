import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  active?: boolean;
  children: ReactNode;
};

export const IconButton = ({ label, active, children, className = "", ...props }: Props) => (
  <button
    className={`icon-button ${active ? "is-active" : ""} ${className}`}
    aria-label={label}
    title={label}
    type="button"
    {...props}
  >
    {children}
  </button>
);
