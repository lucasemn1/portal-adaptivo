import { ThemeButton } from "@/app/components/molecules/theme_button";
import { FaMoon } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";

export function DashboardNavbar() {
  return (
    <div
      className="
        flex
        justify-center
        border-b 
        solid
        h-20
        px-2
        md:px-8
      "
    >
      <nav className="w-10/12 flex items-center ">
        <h1
          className="
            font-secondary
            text-highlight
            mr-auto

            text-xl
            md:text-2xl
          "
        >
          Adaptador de Provas
        </h1>

        <div className="flex items-center">
          <h4 className="hidden md:block">Olá, Camila!</h4>

          <ThemeButton>
            <FaMoon />
          </ThemeButton>

          <ThemeButton>
            <MdOutlineLogout />
            Sair
          </ThemeButton>
        </div>
      </nav>
    </div>
  );
}
