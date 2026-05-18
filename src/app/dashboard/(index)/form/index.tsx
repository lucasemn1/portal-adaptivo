"use client";

import submit from "../actions";
import { useActionState, useEffect, useRef } from "react";
import { DashboardCard } from "../../components/atom/card";
import { DashboardDocumentInput } from "../../components/molecules/document_input";
import { Input } from "../../components/molecules/input";
import { Button } from "../../components/molecules/button";
import { useFormState } from "./state";

export function DashboardHomeForm() {
  const downloadAreaRef = useRef<HTMLDivElement>(null);
  const [actionState, formAction, isPending] = useActionState(submit, null);
  const { form, isInvalidForm, setValue } = useFormState();

  useEffect(() => {
    if (actionState?.data && downloadAreaRef.current) {
      alert("Carregou o PDF");
      downloadAreaRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [actionState?.data]);

  function handleDownload() {
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${actionState!.data}`;
    link.download = "prova_adaptada.pdf";
    link.click();
  }

  return (
    <form
      action={formAction}
      className="flex flex-col items-center w-full gap-6!"
    >
      <DashboardCard titleLeft="1" title="Upload do arquivo original">
        <DashboardDocumentInput
          file={form.file.value}
          onInput={(file) => {
            setValue("file", file);
          }}
          name="file"
        />
      </DashboardCard>
      <DashboardCard titleLeft="2" title="Descreva as necessidades do aluno">
        <Input
          label="Quais adaptações o aluno precisa?"
          placeholder="Ex.: O aluno possui baixa visão, precisa que amplie a fonte e simplifique o enunciado, colocando as palavras-chave em negrito"
          showAs="textarea"
          name="description"
          value={form.description.value}
          onInput={(value) => setValue("description", value)}
        />
      </DashboardCard>

      <Button
        className="w-max ml-auto px-5"
        loading={isPending}
        disabled={isPending || isInvalidForm}
      >
        Enviar
      </Button>

      {actionState?.data && (
        <DashboardCard
          titleLeft="3"
          title="Faça o download"
          id="download-area"
          ref={downloadAreaRef}
        >
          <div
            className="
              min-h-40
              flex
              flex-col
              items-center
              justify-center
              border rounded-lg
              bg-highlight/5
              border-highlight/50!
            "
          >
            <div className="text-lg text-highlight">
              O seu arquivo está pronto para ser baixado!
            </div>
            <Button className="w-max px-6" onClick={handleDownload}>
              Clique aqui para baixá-lo.
            </Button>
          </div>
        </DashboardCard>
      )}
    </form>
  );
}
