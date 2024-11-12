![Copy of Untitled Design (3)](https://github.com/user-attachments/assets/48ded515-3a52-43b9-8d9b-34eff5354dce)

# Rehype Code Group Plugin 🤖

A [Rehype](https://github.com/rehypejs/rehype) plugin for grouping code blocks with tabs, allowing you to switch between different code snippets easily. Perfect for documentation and tutorials where you want to show the same code in different languages or configurations.

## Features ✨

- Group code blocks with tabs
- Customizable class names for styling
- Automatically adds necessary styles and scripts to the document

## Installation 📦
Install the plugin using npm or yarn:

```bash
npm install rehype-code-group
# or
pnpm add rehype-code-group
# or
yarn add rehype-code-group
```

## Usage 🚀

### Markdown Syntax

To incorporate code group tabs in your markdown file, use the following syntax:

~~~raw
::: code-group labels=[npm, pnpm, yarn]

```bash
npm install rehype-code-group
```

```bash
pnpm add rehype-code-group
```

```bash
yarn add rehype-code-group
```

:::
~~~

### With Rehype

Here's an example of how to use the plugin with Rehype:

```typescript
import fs from "node:fs/promises";
import { rehype } from "rehype";
import rehypeCodeGroup from "rehype-code-group";

const document = await fs.readFile("example/input.html", "utf8");

const file = await rehype()
  .use(rehypeCodeGroup, {
    customClassNames: {
      activeTabClass: "my-active-tab",
    },
  })
  .process(document);

await fs.writeFile("example/output.html", String(file));
```

### With Astro

You can also use this plugin with Astro (`astro.config.ts`):

```typescript
import { defineConfig } from 'astro/config';
import rehypeCodeGroup from 'rehype-code-group';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // ...
  markdown: {
    // ...
    rehypePlugins: [
      // ...
      rehypeCodeGroup,
    ],
  },
  // ...
})
```

## Customization 🎨

You can customize the class names used by the plugin to match your project's styles. The available options are:

- customClassNames: An object to override the default class names.

### Example

```typescript
.use(rehypeCodeGroup, {
  customClassNames: {
    codeGroupClass: "my-code-group",
    tabContainerClass: "my-tab-container",
    tabClass: "my-tab",
    activeTabClass: "my-active-tab",
    blockContainerClass: "my-block-container",
    activeBlockClass: "my-active-block",
  },
})
```

### Output Example 📄

Given the following input HTML: [input.html](https://github.com/ITZSHOAIB/rehype-code-group/blob/main/example/input.html)

The plugin will produce the following output: [output.html](https://github.com/ITZSHOAIB/rehype-code-group/blob/main/example/output.html)

## Contributing 🤝
Contributions are welcome! Please read the contributing guidelines first.

## License 📄
This project is licensed under the MIT License - see the [LICENSE](https://github.com/ITZSHOAIB/rehype-code-group?tab=MIT-1-ov-file) file for details.

---

Happy coding! 🎉
