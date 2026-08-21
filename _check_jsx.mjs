import { createJiti } from "jiti";
const jiti = createJiti(import.meta.url, { interopDefault: true, requireCache: false, fsCache: false });
const files = process.argv.slice(2);
for (const f of files) {
  try {
    await jiti.import(f);
    console.log(f, ": loaded/parsed OK");
  } catch (e) {
    console.log(f, ": ERROR ->", e.message.split("\n")[0]);
  }
}
