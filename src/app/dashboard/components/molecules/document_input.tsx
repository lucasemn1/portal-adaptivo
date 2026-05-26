"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { BsCloudUpload } from "react-icons/bs";
import { HiDocumentCheck } from "react-icons/hi2";

interface Props {
  file?: File;
  name?: string;
  onInput(file?: File): void;
}

export function DashboardDocumentInput(props: Props) {
  const onDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      console.log("onDropAccepted", acceptedFiles);
      if (acceptedFiles.length > 0) {
        props.onInput(acceptedFiles[0]);
      }
    },
    [props],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDropAccepted,
    onDropRejected: (rejectedFiles) => {
      console.log("onDropRejected", rejectedFiles);
    },
    onFileDialogCancel: () => {
      console.log("onFileDialogCancel");
    },
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    multiple: false,
  });

  const inputProps = getInputProps({
    onChange(event) {
      console.log("input onChange", event.target.files);
    },
  });

  const renderDraggbleContent = (
    <div className="flex flex-col items-center gap-0! justify-center text-center">
      <BsCloudUpload size={40} />
      <h4 className="mt-2">Clique para selecionar ou arraste o PDF</h4>
      <h5 className="text-sm opacity-60">PDF ou DOCX (Máx. 10MB)</h5>
    </div>
  );

  const renderFulledDraggble = (
    <div className="flex flex-col items-center gap-0! justify-center text-center">
      <HiDocumentCheck size={40} />
      <h4 className="mt-2">{props.file?.name}</h4>
    </div>
  );

  return (
    <div
      {...getRootProps()}
      className={`
        border border-dashed
        ${props.file ? "border-green-400! bg-green-50 text-green-900!" : ""}
        p-3 h-60 rounded-2xl
        flex flex-col items-center justify-center
        cursor-pointer
      `}
    >
      <input
        {...inputProps}
        className="block"
        name={props.name}
        style={{}}
        onChange={(e) => inputProps.onChange(e)}
      />
      {props.file ? renderFulledDraggble : renderDraggbleContent}
    </div>
  );
}
