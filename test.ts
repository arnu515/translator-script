import { assertEquals } from "https://deno.land/std@0.122.0/testing/asserts.ts";

async function runProgram(...a: string[]) {
  const p = Deno.run({
    cmd: ["deno", "run", "-A", "mod.ts", ...a],
    stdout: "inherit",
  });

  // wait for program to finish.
  await p.status();

  p.close();
}

Deno.test("Check translation: French", {
  permissions: { read: true, write: true },
}, async () => {
  Deno.writeFileSync(
    "lang/test.json",
    new TextEncoder().encode(JSON.stringify({ one: "man", two: "woman" })),
  );
  await runProgram("lang/test.json", "fr");
  const content = JSON.parse(
    new TextDecoder("utf-8").decode(Deno.readFileSync("lang/fr.json")),
  );

  assertEquals(typeof content, "object");
  assertEquals(content.one, "homme");
  assertEquals(content.two, "femme");
});

Deno.test("Check translation: Hindi", {
  permissions: { read: true, write: true },
}, async () => {
  Deno.writeFileSync(
    "lang/test.json",
    new TextEncoder().encode(JSON.stringify({ one: "man", two: "woman" })),
  );
  await runProgram("lang/test.json", "fr");
  const content = JSON.parse(
    new TextDecoder("utf-8").decode(Deno.readFileSync("lang/hi.json")),
  );

  assertEquals(typeof content, "object");
  assertEquals(content.one, "आदमी");
  assertEquals(content.two, "महिला");
});
