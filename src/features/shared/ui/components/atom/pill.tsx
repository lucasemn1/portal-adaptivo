import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClick(): void;
}

export function Pill(props: Props) {
  return <div onClick={props.onClick}>{props.children}</div>;
}
