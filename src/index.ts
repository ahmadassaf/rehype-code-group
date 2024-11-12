import type { Element, Root } from "hast";
import { toString as hastToString } from "hast-util-to-string";
import type { Plugin } from "unified";
import { SKIP, visit } from "unist-util-visit";

const START_DELIMITER_REGEX = /::: code-group labels=\[([^\]]+)\]/;
const END_DELIMITER = ":::";

const isStartDelimiterNode = (node: Element): boolean => {
  const match = hastToString(node).trim().match(START_DELIMITER_REGEX);
  return node.tagName === "p" && match !== null;
};

const isEndDelimiterNode = (node: Element): boolean => {
  return node.tagName === "p" && hastToString(node).trim() === END_DELIMITER;
};

const rehypeCodeGroup: Plugin<[], Root> = () => {
  return (tree: Root) => {
    const stack: { node: Element | Root; index: number; labels: string[] }[] =
      [];

    visit(tree, "element", (node, index, parent) => {
      if (node.type !== "element" || !parent || index === undefined) {
        return;
      }

      if (isStartDelimiterNode(node)) {
        const startMatch = hastToString(node)
          .trim()
          .match(START_DELIMITER_REGEX);

        if (startMatch) {
          const labels = startMatch[1].split(",").map((label) => label.trim());
          stack.push({ node: parent, index, labels });
        }
        return [SKIP];
      }

      if (isEndDelimiterNode(node)) {
        const start = stack.pop();
        if (start && start.node === parent) {
          const { node: startNode, index: startIndex, labels } = start;
          const children: Element[] = [];

          for (let i = startIndex + 1; i < index; i++) {
            const sibling = startNode.children[i] as Element;

            if (sibling.type === "element") {
              children.push({
                type: "element",
                tagName: "div",
                properties: {
                  className: `rcg-blocks${!children.length ? " rcg-active" : ""}`,
                },
                children: [sibling],
              });
            }
          }

          startNode.children.splice(startIndex, index - startIndex + 1, {
            type: "element",
            tagName: "div",
            properties: { className: "rehype-code-group" },
            children: [
              {
                type: "element",
                tagName: "div",
                properties: { className: "rcg-tabs" },
                children: labels.map((label, i) => ({
                  type: "element",
                  tagName: "button",
                  properties: {
                    className: `rcg-tab${i === 0 ? " rcg-active" : ""}`,
                  },
                  children: [{ type: "text", value: label }],
                })),
              },
              ...children,
            ],
          });
          return [SKIP, startIndex + 1];
        }
      }
    });

    visit(tree, "root", (node) => {
      const head = node.children.find(
        (child) => child.type === "element" && child.tagName === "head",
      ) as Element;

      const styleElement: Element = {
        type: "element",
        tagName: "style",
        properties: {},
        children: [{ type: "text", value: styles }],
      };

      const scriptElement: Element = {
        type: "element",
        tagName: "script",
        properties: { type: "text/javascript" },
        children: [{ type: "text", value: script }],
      };

      if (head) {
        head.children.push(styleElement, scriptElement);
      } else {
        node.children.unshift({
          type: "element",
          tagName: "head",
          properties: {},
          children: [styleElement, scriptElement],
        });
      }
    });
  };
};

const styles = `
.rcg-tabs {
  display: flex;
  border-bottom: 1px solid #ddd;
}
.rcg-tab {
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  background: none;
  outline: none;
}
.rcg-tab.rcg-active {
  border-bottom: 2px solid #007acc;
}
.rcg-blocks {
  display: none;
}
.rcg-blocks.rcg-active {
  display: block;
}
`;

const script = `
document.addEventListener("DOMContentLoaded", function () {
  const codeGroups = document.querySelectorAll(".rehype-code-group");

  codeGroups.forEach((group) => {
    const tabs = group.querySelectorAll(".rcg-tab");
    const blocks = group.querySelectorAll(".rcg-blocks");
    let activeTab = group.querySelector(".rcg-tab.rcg-active");
    let activeBlock = group.querySelector(".rcg-blocks.rcg-active");

    group.addEventListener("click", (event) => {
      const tab = event.target.closest(".rcg-tab");
      if (!tab) return;

      const index = Array.from(tabs).indexOf(tab);
      if (index === -1) return;

      if (activeTab) activeTab.classList.remove("rcg-active");
      if (activeBlock) activeBlock.classList.remove("rcg-active");

      tab.classList.add("rcg-active");
      blocks[index].classList.add("rcg-active");

      activeTab = tab;
      activeBlock = blocks[index];
    });
  });
});
`;

export default rehypeCodeGroup;
