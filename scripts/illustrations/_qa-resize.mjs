// Temporary QA helper — NOT part of the pipeline, deleted after visual QA.
import sharp from "sharp";
import { join } from "node:path";

const QA = "/tmp/claude-0/-home-user-RAMachines/5a040532-ffdf-5d51-8b5c-31de6e01288b/scratchpad/qa";
const ROOT = "/home/user/RAMachines";

const files = process.argv.slice(2);
for (const f of files) {
  const base = f.split("/").pop().replace(".webp", "");
  await sharp(join(ROOT, f)).resize(300).toFile(join(QA, `${base}-300.webp`));
  console.log("wrote", base);
}
