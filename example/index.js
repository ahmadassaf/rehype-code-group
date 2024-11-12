import fs from "node:fs/promises";
import { rehype } from "rehype";
import rehypeCodeGroup from "../dist/index.mjs";

const document = await fs.readFile("example/input.html", "utf8");

const file = await rehype()
  .data("settings", { fragment: true })
  .use(rehypeCodeGroup)
  .process(document);

await fs.writeFile("example/output.html", String(file));
