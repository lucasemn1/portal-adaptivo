/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import OpenAI from "openai";
import puppeteer from "puppeteer";
import mammoth from "mammoth";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ActionResponse = {
  status: number;
  message?: string;
  data?: string;
};

type SupportedMimeType =
  | "application/pdf"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

class ActionError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function getMimeType(file: File): SupportedMimeType {
  const mimeTypes: Record<string, SupportedMimeType> = {
    "application/pdf": "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };

  const mime = mimeTypes[file.type];

  if (!mime) {
    throw new ActionError(
      "Formato de arquivo não suportado. Envie PDF ou DOCX.",
      415,
    );
  }

  return mime;
}

async function extractDocxText(buffer: Buffer): Promise<string> {
  try {
    console.log("[extractDocxText] Extraindo texto do DOCX...");

    const result = await mammoth.extractRawText({
      buffer,
    });

    return result.value;
  } catch (e) {
    console.error("[extractDocxText] Falha ao extrair DOCX:", e);

    throw new ActionError("Falha ao processar DOCX.", 422);
  }
}

async function uploadFileToOpenAI(file: File, buffer: Buffer) {
  try {
    console.log("[uploadFileToOpenAI] Enviando arquivo...");

    const uploadedFile = await client.files.create({
      file: new File([new Uint8Array(buffer)], file.name, {
        type: file.type,
      }),
      purpose: "assistants",
    });

    console.log(`[uploadFileToOpenAI] Upload concluído: ${uploadedFile.id}`);

    return uploadedFile;
  } catch (e) {
    console.error("[uploadFileToOpenAI] Falha no upload:", e);

    throw new ActionError("Falha ao enviar arquivo para IA.", 500);
  }
}

async function generateAdaptedHtmlFromPdf(
  fileId: string,
  description: string,
): Promise<string> {
  try {
    console.log("[generateAdaptedHtmlFromPdf] Gerando HTML...");

    const response = await client.responses.create({
      model: "gpt-4.1",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_file",
              file_id: fileId,
            },
            {
              type: "input_text",
              text: `
You are a specialist in accessible educational content.

Analyze this school exam and adapt it for accessibility.

Requirements:
- Maintain the original pedagogical meaning
- Preserve layout as much as possible
- Minimum font size: 16px
- WCAG AA contrast
- Accessible spacing
- Semantic HTML
- Describe all images
- Simplify language for TEA students
- Preserve tables and structure

Accessibility description:
"${description}"

CRITICAL RULES:
- Return ONLY raw HTML
- Start with <!DOCTYPE html>
- Do NOT use markdown
- Do NOT use triple backticks
- HTML must be ready for Puppeteer PDF rendering
- Use A4 layout
- Include print styles
              `.trim(),
            },
          ],
        },
      ],
    });

    let html = response.output_text;

    html = html
      .replace(/^```html\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    console.log("[generateAdaptedHtmlFromPdf] HTML gerado.");

    return html;
  } catch (e) {
    console.error("[generateAdaptedHtmlFromPdf] Falha:", e);

    throw new ActionError("Falha ao gerar HTML adaptado.", 502);
  }
}

async function generateAdaptedHtmlFromDocx(
  text: string,
  description: string,
): Promise<string> {
  try {
    console.log("[generateAdaptedHtmlFromDocx] Gerando HTML...");

    const response = await client.responses.create({
      model: "gpt-4.1",
      input: `
You are a specialist in accessible educational content.

Adapt this educational document for accessibility.

Accessibility requirements:
- Minimum font size: 16px
- WCAG AA contrast
- Accessible spacing
- Semantic HTML
- Simplified language for TEA students

Accessibility description:
"${description}"

DOCUMENT CONTENT:
${text}

CRITICAL RULES:
- Return ONLY raw HTML
- Start with <!DOCTYPE html>
- Do NOT use markdown
- Do NOT use triple backticks
- HTML must be ready for Puppeteer PDF rendering
- Use A4 layout
- Include print styles
      `,
    });

    let html = response.output_text;

    html = html
      .replace(/^```html\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    return html;
  } catch (e) {
    console.error("[generateAdaptedHtmlFromDocx] Falha:", e);

    throw new ActionError("Falha ao gerar HTML adaptado.", 502);
  }
}

async function convertHtmlToPdfBase64(html: string): Promise<string> {
  try {
    console.log("[convertHtmlToPdfBase64] Convertendo HTML em PDF...");

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "load",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        bottom: "20mm",
        left: "15mm",
        right: "15mm",
      },
    });

    await browser.close();

    console.log("[convertHtmlToPdfBase64] PDF gerado.");

    return Buffer.from(pdfBuffer).toString("base64");
  } catch (e) {
    console.error("[convertHtmlToPdfBase64] Falha:", e);

    throw new ActionError("Falha ao gerar PDF.", 500);
  }
}

export default async function submit(
  _: unknown,
  formData: FormData,
): Promise<ActionResponse> {
  try {
    console.log("[submit] Recebendo formulário...");

    const file = formData.get("file") as File;

    const description = formData.get("description") as string;

    if (!file || !description) {
      throw new ActionError("Campos obrigatórios não informados.", 400);
    }

    const mimeType = getMimeType(file);

    const buffer = Buffer.from(await file.arrayBuffer());

    let html = "";

    if (mimeType === "application/pdf") {
      const uploadedFile = await uploadFileToOpenAI(file, buffer);

      html = await generateAdaptedHtmlFromPdf(uploadedFile.id, description);
    } else {
      const text = await extractDocxText(buffer);

      html = await generateAdaptedHtmlFromDocx(text, description);
    }

    const pdfBase64 = await convertHtmlToPdfBase64(html);

    console.log("[submit] Processo concluído com sucesso.");

    return {
      status: 200,
      data: pdfBase64,
    };
  } catch (e) {
    if (e instanceof ActionError) {
      console.error(`[submit] ActionError ${e.status}: ${e.message}`);

      return {
        status: e.status,
        message: e.message,
      };
    }

    console.error("[submit] Erro inesperado:", e);

    return {
      status: 500,
      message: "Erro inesperado.",
    };
  }
}
