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
      <nav className="w-10/12 flex items-center">
        <h1
          className="
            font-secondary
            text-highlight
            mx-auto

            text-xl
            font-light
            md:text-2xl
          "
        >
          Adaptador de Provas
        </h1>
      </nav>
    </div>
  );
}
