export function printHelpScreen() {
  console.log("Auto-i18n Translator");
  console.log(
    "Automatically translates your lang.json file to any language supported by https://libretranslate.de",
  );
  console.log("");
  console.log("SYNTAX:");
  console.log(
    "./translate <path-to-en.json-file> <target-language-two-letter-code> [indent-size]",
  );
  console.log("");
  console.log("EXAMPLE:");
  console.log("./translate lang/en.json fr");
  console.log("");
  console.log(
    "The translated file will be saved to the same path as the source file, with the name <target-language>.json",
  );
  console.log("");
  console.log(
    "To provide your own hosted version of libretranslate, add these three environment variables:",
  );
  console.log("1. LIBRETRANSLATE_URL=url of libretranslate");
  console.log("2. LIBRETRANSLATE_KEY=libretranslate apikey (if required)");
  console.log(
    "2. LIBRETRANSLATE_RATELIMIT=max number of translations per minute (20 by default)",
  );
}

export function getFileContents(filePath: string) {
  try {
    const fileContents = new TextDecoder("utf-8").decode(
      Deno.readFileSync(filePath),
    );
    const content = JSON.parse(fileContents);
    return content;
  } catch {
    return null;
  }
}
