import { DashboardNavbar } from "../../../../shared/ui/components/organisms/navbar";

export function RootLayout(props: { children: React.ReactNode }) {
  return (
    <div
      className="
          bg-gray-50

          text-gray-800
          **:border-gray-300
          **:gap-3

          font-bold
        "
    >
      <DashboardNavbar />

      <div className="px-3 py-8 w-11/12 mx-auto md:p-8 md:w-10/12 md:pb-30">
        {props.children}
      </div>
    </div>
  );
}
