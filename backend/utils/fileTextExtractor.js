import fs from "fs";
import { fromPath as pdf2picFromPath } from "pdf2pic";
import Tesseract from "tesseract.js";
import mammoth from "mammoth";
import path from "path";
import fetch from "node-fetch";

// Lazy load pdf-parse to avoid initialization issues with test data
let pdfParse = null;

async function getPdfParse() {
  if (!pdfParse) {
    pdfParse = (await import("pdf-parse")).default;
  }
  return pdfParse;
}

function cleanExtractedText(text) {
  if (!text) return "";
  // Remove lines like 'Scanned with ... Scanner' (case-insensitive)
  return text
    .split("\n")
    .filter((line) => !/^scanned with .+scanner$/i.test(line.trim()))
    .join("\n");
}

function isMeaningfulText(text) {
  if (!text || text.trim().length < 50) return false;
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return false;
  const freq = {};
  lines.forEach((l) => {
    freq[l] = (freq[l] || 0) + 1;
  });
  const mostCommon = Math.max(...Object.values(freq));
  if (mostCommon / lines.length > 0.6) return false;
  return true;
}

async function extractTextFromPDF(filePath) {
  // Try pdf-parse first
  const pdfParseModule = await getPdfParse();
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParseModule(dataBuffer);
  let text = cleanExtractedText(data.text);
  if (isMeaningfulText(text)) {
    console.log("Used embedded text extraction");
    return text;
  }
  // Fallback to image-based OCR for the first page
  console.log("Falling back to OCR for PDF");
  const pdf2pic = pdf2picFromPath(filePath, {
    density: 50,
    format: "png",
    saveFilename: "temp",
    savePath: "./",
  });
  let ocrText = "";
  try {
    const page = await pdf2pic(1);
    const {
      data: { text },
    } = await Tesseract.recognize(page.path, "eng");
    ocrText += text + "\n";
    fs.unlinkSync(page.path); // Clean up temp image
  } catch (err) {
    console.error(`OCR failed for PDF page 1:`, err);
  }
  ocrText = cleanExtractedText(ocrText);
  if (!isMeaningfulText(ocrText)) {
    throw new Error(
      "Could not extract meaningful text from your file. Please upload a higher-quality scan or a text-based file."
    );
  }
  return ocrText;
}

async function extractTextFromDOCX(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

async function extractTextFromTXT(filePath) {
  return fs.readFileSync(filePath, "utf-8");
}

// Helper function to encode image to base64
function encodeImageToBase64(filePath) {
  const imageBuffer = fs.readFileSync(filePath);
  return imageBuffer.toString("base64");
}

// Helper function to get MIME type from file extension
function getMimeType(filePath) {
  const ext = filePath.split(".").pop().toLowerCase();
  const mimeTypes = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    bmp: "image/bmp",
    tiff: "image/tiff",
  };
  return mimeTypes[ext] || "image/jpeg";
}

async function extractTextFromImageWithGemini(filePath) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
    GEMINI_API_KEY;

  console.log("🔍 Using GEMINI API for image text extraction...");

  try {
    const base64Image = encodeImageToBase64(filePath);
    const mimeType = getMimeType(filePath);

    const prompt = `Extract all the text content from this image. Include any text, numbers, equations, or code that you can see. Return only the extracted text without any additional commentary.`;

    const body = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Image,
              },
            },
          ],
        },
      ],
    };

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    console.log("✅ Gemini text extraction completed successfully");

    const extractedText =
      result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return extractedText || "";
  } catch (err) {
    console.error("❌ Gemini text extraction error:", err);
    throw err;
  }
}

async function extractTextFromImage(filePath, useGemini = false) {
  if (useGemini) {
    console.log("🤖 Using GEMINI API for image text extraction...");
    return await extractTextFromImageWithGemini(filePath);
  } else {
    console.log("📷 Using TESSERACT OCR for image text extraction...");
    const {
      data: { text },
    } = await Tesseract.recognize(filePath, "eng");
    console.log("✅ Tesseract OCR completed successfully");
    return text;
  }
}

// Supported: PDF, DOCX, TXT, and images (including .webp)
export async function extractTextFromFile(
  filePath,
  mimetype,
  useGeminiForImages = false
) {
  if (mimetype === "application/pdf") {
    return await extractTextFromPDF(filePath);
  } else if (
    mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    filePath.endsWith(".docx")
  ) {
    return await extractTextFromDOCX(filePath);
  } else if (
    mimetype === "text/plain" ||
    filePath.endsWith(".txt") ||
    filePath.endsWith(".sql")
  ) {
    return await extractTextFromTXT(filePath);
  } else if (
    mimetype.startsWith("image/") ||
    [".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tiff"].includes(
      path.extname(filePath).toLowerCase()
    )
  ) {
    return await extractTextFromImage(filePath, useGeminiForImages);
  } else {
    throw new Error("Unsupported file type for text extraction");
  }
}
