import type { ReactNode } from "react";
import { SyncLoader } from "react-spinners";

interface Props {
  className?: string;
  children: ReactNode;
  disabled?: boolean;

  leftIcon?: ReactNode;
  rightIcon?: ReactNode;

  loading?: boolean;
  type?: "submit" | "button";

  onClick?(): void;
}

export function Button(props: Props) {
  return (
    <button
      type={props.type ?? "button"}
      className={`
        w-full
        h-10
        
        flex
        items-center
        justify-center
        rounded-lg
        transition
        duration-100

        ${
          props.disabled
            ? "bg-gray-400 hover:bg-gray-400 active:bg-gray-400 cursor-auto"
            : "bg-highlight/90 hover:bg-highlight/95 active:bg-highlight text-highlight-contrast cursor-pointer"
        }

        ${props.loading ? "min-w-30" : ""}

        ${props.className}
      `}
      disabled={props.disabled}
      onClick={props.disabled ? () => {} : props.onClick}
    >
      {props.loading ? (
        <div className="w-15">
          <SyncLoader speedMultiplier={0.5} size={5} />
        </div>
      ) : (
        <>
          {props.leftIcon}
          {props.children}
          {props.rightIcon}
        </>
      )}
    </button>
  );
}
