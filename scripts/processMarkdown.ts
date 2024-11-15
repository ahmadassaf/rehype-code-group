import { rehype } from "rehype";
import rehypeMinifyWhitespace from "rehype-minify-whitespace";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeCodeGroup from "../src/index.js";
import type { RehypeCodeGroupOptions } from "../src/options.js";

export const processMarkdown = async (
  input: string,
  options: RehypeCodeGroupOptions,
) => {
  const file = await rehype()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeCodeGroup, options)
    .use(rehypeMinifyWhitespace)
    .use(rehypeStringify)
    .process(input);
  return String(file);
};
