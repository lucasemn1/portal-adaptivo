import { HiBookOpen } from "react-icons/hi";

export function DashboardSidebar() {
  return (
    <aside
      className="
        col-span-2
        h-screen
        p-7

        border-r

        bg-gray-200/50
      "
    >
      <div className="flex gap-2 items-center">
        <span
          className="
            bg-highlight
            text-highlight-contrast
            size-10
            rounded-xl

            flex
            items-center
            justify-center
          "
        >
          <HiBookOpen size={30} color="white" />
        </span>
        <span
          className="
          text-highlight
            font-medium 
            font-secondary
            text-xl
          "
        >
          Apoio ao aluno!
        </span>
      </div>
    </aside>
  );
}
