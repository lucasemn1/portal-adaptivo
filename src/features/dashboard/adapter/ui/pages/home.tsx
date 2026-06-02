import { HiOutlineLightBulb } from "react-icons/hi2";
import { DashboardCard } from "../../../../shared/ui/components/atom/card";
import { DashboardHomeForm } from "../components/adapter-form/form";

export function DashboardHomeAdapter() {
  return (
    <div className="flex flex-col gap-7!">
      <section
        className="
          text-highlight-contrast
          rounded-2xl
          p-7

          flex
          flex-col
          
          bg-highlight
          bg-[url(/assets/img/star.png)]
          bg-no-repeat
          bg-top-right

          bg-size-[30%]
          md:bg-size-[15%]
        "
      >
        <h2 className="text-2xl">Transforme seu material com facilidade</h2>
        <p>
          Nosso assistente ajuda você a adaptar avaliações para diferentes
          necessidades pedagógicas em segundos. <br /> Siga os passos abaixo.
        </p>
      </section>

      <div className="grid grid-cols-12 gap-7!">
        <div className="col-span-12 md:col-span-4">
          <DashboardCard
            titleLeft={<HiOutlineLightBulb />}
            title="Dicas pedagógicas"
            className="bg-highlight/5"
          >
            <div className="flex flex-col">
              <DashboardCard
                title={<small className="font-bold">Clareza Visual</small>}
                className="gap-1!"
              >
                <div className="text-sm font-medium">
                  Evite blocos de texto muito densos. Use listas com marcadores
                  para facilitar a leitura.
                </div>
              </DashboardCard>

              <DashboardCard
                title={<small className="font-bold">Enunciados Diretos</small>}
                className="gap-1!"
              >
                <div className="text-sm font-medium">
                  Substitua orações subordinadas por frases curtas e diretas.
                  Use uma ideia por sentença.
                </div>
              </DashboardCard>

              <DashboardCard
                title={<small className="font-bold">Suporte Gráfico</small>}
                className="gap-1!"
              >
                <div className="text-sm font-medium">
                  Inclua ícones ou imagens que ilustrem o conceito principal da
                  questão para apoio visual.
                </div>
              </DashboardCard>
            </div>
          </DashboardCard>
        </div>

        <div className="col-span-12 flex flex-col gap-6! md:col-span-8 ">
          <DashboardHomeForm />
        </div>
      </div>
    </div>
  );
}
