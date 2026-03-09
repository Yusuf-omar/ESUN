import { NextResponse } from "next/server";

type TargetLocale = "en" | "tr";

const MAX_TEXT_COUNT = 60;
const MAX_TEXT_LENGTH = 600;
const SERVICE_URL = "https://translate.googleapis.com/translate_a/single";

const serverCache = new Map<string, string>();

interface TranslateRequestBody {
  target?: string;
  texts?: unknown;
}

export async function POST(request: Request) {
  let body: TranslateRequestBody;

  try {
    body = (await request.json()) as TranslateRequestBody;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  const target = body.target;
  if (target !== "en" && target !== "tr") {
    return NextResponse.json(
      { message: "Invalid target locale." },
      { status: 400 }
    );
  }

  if (!Array.isArray(body.texts)) {
    return NextResponse.json(
      { message: "texts must be an array of strings." },
      { status: 400 }
    );
  }

  const cleanedTexts = Array.from(
    new Set(
      body.texts
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim())
        .filter((value) => value.length > 0)
        .slice(0, MAX_TEXT_COUNT)
        .map((value) => value.slice(0, MAX_TEXT_LENGTH))
    )
  );

  const translations: Record<string, string> = {};

  await Promise.all(
    cleanedTexts.map(async (sourceText) => {
      const cacheKey = `${target}:${sourceText}`;
      const cached = serverCache.get(cacheKey);
      if (cached) {
        translations[sourceText] = cached;
        return;
      }

      try {
        const translatedText = await translateText(sourceText, target);
        const finalValue = translatedText || sourceText;
        translations[sourceText] = finalValue;
        serverCache.set(cacheKey, finalValue);
      } catch {
        translations[sourceText] = sourceText;
      }
    })
  );

  return NextResponse.json({ translations });
}

async function translateText(sourceText: string, target: TargetLocale) {
  const url = new URL(SERVICE_URL);
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "ar");
  url.searchParams.set("tl", target);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", sourceText);

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Translation service error: ${response.status}`);
  }

  const payload = (await response.json()) as unknown;
  return parseTranslatedPayload(payload);
}

function parseTranslatedPayload(payload: unknown) {
  if (!Array.isArray(payload) || !Array.isArray(payload[0])) {
    return "";
  }

  const segments = payload[0];
  const translatedText = segments
    .map((segment) => {
      if (!Array.isArray(segment)) return "";
      return typeof segment[0] === "string" ? segment[0] : "";
    })
    .join("")
    .trim();

  return translatedText;
}
