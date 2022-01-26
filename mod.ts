import * as dansi from "https://deno.land/x/dansi@0.1.0/mod.ts";
import { dirname } from "https://deno.land/std@0.122.0/path/mod.ts";
import { getFileContents, printHelpScreen } from "./util.ts";
import { translateObject } from "./translate.ts";

if (Deno.args.includes("--help") || Deno.args.includes("help")) {
  printHelpScreen();
  Deno.exit(0);
}

const filePath = Deno.args[0];
const target = Deno.args[1];
let indentSize = parseInt(Deno.args[2]);

if (!filePath || !target) {
  console.log(
    dansi.red(
      "USAGE: ./translate <path-to-en.json> <target-language-two-letter-code> [json-indent-size]",
    ),
  );
  console.log("");
  console.log(dansi.yellow("Run ./translate --help for more information"));
  Deno.exit(1);
}

if (indentSize === undefined || isNaN(indentSize)) {
  indentSize = 2;
}

async function main() {
  const content = getFileContents(filePath);
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    console.log(
      dansi.red("ERROR: File doesn't exist, or isn't a valid JSON object"),
    );
    Deno.exit(1);
  }

  const translated = await translateObject(content, target);
  const translatedPath = (dirname(filePath) + "/").replace("./", "") + target +
    ".json";

  Deno.writeFileSync(
    translatedPath,
    new TextEncoder().encode(JSON.stringify(translated, undefined, indentSize)),
  );
  console.log(dansi.green("\nSaved to " + translatedPath));
}

main().catch((e) => {
  throw e;
});
