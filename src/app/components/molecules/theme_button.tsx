import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function ThemeButton(props: Props) {
  return (
    <button
      className="
        border
        bg-gray-100
        hover:bg-gray-600
        hover:text-white
        
        transition
        duration-100

        rounded-3xl

        flex
        items-center
        justify-center
        gap-1!

        min-h-10
        px-3
        
        cursor-pointer
      "
    >
      {props.children}
    </button>
  );
}
