import { rehype } from "rehype";
import rehypeMinifyWhitespace from "rehype-minify-whitespace";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import rehypeCodeGroup from "../src/index.js";
import type { RehypeCodeGroupOptions } from "../src/options.js";

export const processHtml = async (
  input: string,
  options: RehypeCodeGroupOptions,
) => {
  const file = await rehype()
    .use(rehypeParse, { fragment: true })
    .use(rehypeCodeGroup, options)
    .use(rehypeMinifyWhitespace)
    .use(rehypeStringify)
    .process(input);
  return String(file);
};
