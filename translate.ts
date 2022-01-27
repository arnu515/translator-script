const LIBRETRANSLATE_URL = Deno.env.get("LIBRETRANSLATE_URL") ||
  "https://libretranslate.de";
const LIBRETRANSLATE_KEY = Deno.env.get("LIBRETRANSLATE_KEY") || undefined;
let RATELIMIT = parseInt(Deno.env.get("LIBRETRANSLATE_RATELIMIT") || "20");
let translatedTimes = 0;

if (isNaN(RATELIMIT)) RATELIMIT = 0;

export async function translate(word: string, target: string): Promise<string> {
  if (RATELIMIT !== 0 && translatedTimes >= RATELIMIT) {
    console.log("Rate limited. Waiting for one minute to pass...");
    const time = Date.now();
    while (Date.now() - time < 60 * 1000) {
      // Waiting...
    }
    console.log("One minute has passed, continuing...");
    translatedTimes = 0;
  }

  const res = await fetch(LIBRETRANSLATE_URL + "/translate", {
    method: "POST",
    body: JSON.stringify({
      q: word,
      source: "en",
      target,
      format: "text",
      api_key: LIBRETRANSLATE_KEY,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  translatedTimes += 1;
  if (res.status === 429) {
    // rate limited
    translatedTimes = RATELIMIT + 1;
    return await translate(word, target);
  }
  const data = await res.json();
  if (data.error) {
    console.log("ERROR: " + data.error);
    Deno.exit(1);
  } else {
    console.log(
      `Translated ${word} to ${target}: ${data.translatedText}`,
    );
    return data.translatedText;
  }
}

export async function translateObject(
  object: Record<string, any>,
  target: string,
): Promise<any> {
  const translatedObject: any = {};
  for (const key of Object.keys(object)) {
    if (typeof object[key] === "string") {
      translatedObject[key] = await translate(object[key], target);
    } else if (typeof object[key] === "object") {
      translatedObject[key] = await translateObject(object[key], target);
    }
  }
  return translatedObject;
}
