import "../globals.css";

import { Roboto, Lobster } from "next/font/google";
import { DashboardNavbar } from "./components/organisms/navbar";

const roboto = Roboto({
  variable: "--font-roboto",
});
const pacifico = Lobster({
  weight: "400",
  variable: "--font-lobster",
});

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      data-theme="dark"
      className={`${pacifico.variable} ${roboto.variable} font-display`}
    >
      <body
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
      </body>
    </html>
  );
}
