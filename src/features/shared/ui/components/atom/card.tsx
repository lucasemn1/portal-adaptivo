import type { ReactNode } from "react";
import { forwardRef } from "react";

interface Props {
  id?: string;
  titleLeft?: ReactNode;
  title?: ReactNode;
  className?: string;
  children: ReactNode;
}

export const DashboardCard = forwardRef<HTMLDivElement, Props>((props, ref) => {
  return (
    <div
      ref={ref}
      className={`
        border
        p-5
        rounded-2xl

        w-full
        flex
        flex-col

        bg-gray-50

        ${props.className}
      `}
    >
      <div className="flex items-center">
        {props.titleLeft && (
          <span
            className="
            bg-highlight
            text-highlight-contrast

            h-10
            min-w-10

            flex
            items-center
            justify-center

            rounded-3xl
            text-xl
          "
          >
            {props.titleLeft}
          </span>
        )}

        <span className="text-lg font-medium">{props.title}</span>
      </div>

      <div className="mt-1">{props.children}</div>
    </div>
  );
});

DashboardCard.displayName = "DashboardCard";
