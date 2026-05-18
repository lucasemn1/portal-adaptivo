"use server";

import OpenAI from "openai";
import puppeteer from "puppeteer";
import { pdf } from "pdf-to-img";
import mammoth from "mammoth";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
  if (!mime)
    throw new ActionError(
      "Formato de arquivo não suportado. Envie um PDF ou DOCX.",
      415,
    );
  return mime;
}

async function convertPdfToImages(buffer: Buffer): Promise<string[]> {
  try {
    console.log(
      "[convertPdfToImages] Iniciando conversão do PDF em imagens...",
    );
    const images: string[] = [];
    const doc = await pdf(buffer, { scale: 2 });
    for await (const page of doc) {
      images.push(page.toString("base64"));
    }
    console.log(
      `[convertPdfToImages] ${images.length} página(s) convertida(s).`,
    );
    return images;
  } catch (e) {
    if (e instanceof ActionError) throw e;
    console.error(
      "[convertPdfToImages] Falha ao converter o PDF em imagens.",
      e,
    );
    throw new ActionError("Falha ao converter o PDF em imagens.", 422);
  }
}

async function convertDocxToImages(buffer: Buffer): Promise<string[]> {
  try {
    console.log("[convertDocxToImages] Convertendo DOCX para HTML...");
    const { value: html } = await mammoth.convertToHtml({ buffer });

    console.log(
      "[convertDocxToImages] Renderizando HTML em imagens via Puppeteer...",
    );
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" });

    const fullHeight = await page.evaluate(() => document.body.scrollHeight);
    await page.setViewport({ width: 1240, height: fullHeight });

    const screenshot = await page.screenshot({ type: "png", fullPage: true });
    await browser.close();

    console.log("[convertDocxToImages] DOCX convertido com sucesso.");
    return [Buffer.from(screenshot).toString("base64")];
  } catch (e) {
    if (e instanceof ActionError) throw e;
    console.error(
      "[convertDocxToImages] Falha ao converter o DOCX em imagens.",
      e,
    );
    throw new ActionError("Falha ao converter o DOCX em imagens.", 422);
  }
}

async function convertFileToImages(
  buffer: Buffer,
  mimeType: SupportedMimeType,
): Promise<string[]> {
  if (mimeType === "application/pdf") return convertPdfToImages(buffer);
  return convertDocxToImages(buffer);
}

async function generateAdaptedHtml(
  images: string[],
  description: string,
): Promise<string> {
  try {
    console.log("[generateAdaptedHtml] Enviando imagens para a OpenAI...");

    const imagePlaceholders = images
      .map((_, i) => `IMAGE_${i}: use exactly <img src="__IMAGE_${i}__" />`)
      .join("\n");

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 8000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an accessibility specialist for educational content.
Analyze this school exam and return a single complete HTML file that:

1. REPLICATES the original layout: colors, fonts, structure, header, footer
2. ADAPTS for accessibility based on the following description: "${description}"
   - Minimum font size 16px
   - WCAG AA contrast
   - Visible text description box for all figures
   - Minimum line height 1.6
   - Semantic table headers (<th>)
   - Simplified language preserving pedagogical content

IMAGES: For each image found in the exam, use EXACTLY the placeholder below:
${imagePlaceholders}

CRITICAL RULES:
- Return ONLY raw HTML starting with <!DOCTYPE html>
- Do NOT wrap in markdown code blocks, do NOT use triple backticks
- Do NOT write explanations before or after the HTML
- Use the exact placeholder strings for images: __IMAGE_0__, __IMAGE_1__, etc.
- The HTML must be ready for PDF conversion via puppeteer (A4, @media print).`,
            },
            ...images.map((base64) => ({
              type: "image_url" as const,
              image_url: {
                url: `data:image/png;base64,${base64}`,
                detail: "high" as const,
              },
            })),
          ],
        },
      ],
    });

    console.log("[generateAdaptedHtml] HTML adaptado gerado com sucesso.");

    let html = response.choices[0].message.content!;
    html = html
      .replace(/^```html\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    images.forEach((base64, i) => {
      html = html.replaceAll(
        `__IMAGE_${i}__`,
        `data:image/png;base64,${base64}`,
      );
    });

    return html;
  } catch (e) {
    if (e instanceof ActionError) throw e;
    console.error("[generateAdaptedHtml] Falha ao gerar o HTML adaptado:", e);
    throw new ActionError("Falha ao gerar o HTML adaptado.", 502);
  }
}

async function convertHtmlToPdfBase64(html: string): Promise<string> {
  try {
    console.log(
      "[convertHtmlToPdfBase64] Iniciando conversão do HTML em PDF...",
    );
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "domcontentloaded" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
    });

    await browser.close();
    console.log("[convertHtmlToPdfBase64] PDF gerado com sucesso.");
    return Buffer.from(pdfBuffer).toString("base64");
  } catch (e) {
    if (e instanceof ActionError) throw e;
    console.error(
      "[convertHtmlToPdfBase64] Falha ao converter o HTML em PDF:",
      e,
    );
    throw new ActionError("Falha ao converter o HTML em PDF.", 500);
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
      console.warn("[submit] Campos obrigatórios ausentes.");
      throw new ActionError("Campos obrigatórios não informados.", 400);
    }

    console.log(`[submit] Arquivo recebido: ${file.name} (${file.size} bytes)`);
    console.log(`[submit] Descrição recebida: ${description}`);

    const mimeType = getMimeType(file);
    console.log(`[submit] Tipo de arquivo detectado: ${mimeType}`);

    const buffer = Buffer.from(await file.arrayBuffer());
    const images = await convertFileToImages(buffer, mimeType);
    const html = await generateAdaptedHtml(images, description);
    const pdfBase64 = await convertHtmlToPdfBase64(html);

    console.log("[submit] Processo concluído com sucesso.");
    return { status: 200, data: pdfBase64 };
  } catch (e) {
    if (e instanceof ActionError) {
      console.error(`[submit] ActionError ${e.status}: ${e.message}`);
      return { status: e.status, message: e.message };
    }
    console.error("[submit] Erro inesperado:", e);
    return { status: 500, message: "Erro inesperado." };
  }
}
