import type { Element, Root } from "hast";
import { toString as hastToString } from "hast-util-to-string";
import type { Plugin } from "unified";
import { SKIP, visit } from "unist-util-visit";
import {
  type CodeGroup,
  createRehypeCodeGroupElement,
  createScriptElement,
  createStyleElement,
} from "./elements";
import type { RehypeCodeGroupOptions } from "./options";
import { type ClassNames, getClassNames } from "./styles";

const START_DELIMITER_REGEX = /::: code-group labels=\[([^\]]+)\]/;
const END_DELIMITER = ":::";

const isStartDelimiterNode = (node: Element): boolean => {
  const match = hastToString(node).trim().match(START_DELIMITER_REGEX);
  return node.tagName === "p" && match !== null;
};

const isEndDelimiterNode = (node: Element): boolean => {
  return node.tagName === "p" && hastToString(node).trim() === END_DELIMITER;
};

const rehypeCodeGroup: Plugin<[RehypeCodeGroupOptions], Root> = (
  options = {},
) => {
  const { customClassNames } = options;
  const classNames = getClassNames(customClassNames);

  return (tree: Root) => {
    const codeGroups: CodeGroup[] = [];
    let codeGroupFound = false;

    // Find code groups and wrap them in a rehype-code-group element
    visit(tree, "element", (node, index, parent) => {
      if (node.type !== "element" || !parent || index === undefined) {
        return;
      }

      if (isStartDelimiterNode(node)) {
        const startMatch = hastToString(node)
          .trim()
          .match(START_DELIMITER_REGEX);

        if (!startMatch) {
          return;
        }

        const tabLabels = startMatch[1].split(",").map((label) => label.trim());
        codeGroups.push({ parentNode: parent, startIndex: index, tabLabels });

        return [SKIP];
      }

      if (!isEndDelimiterNode(node)) {
        return;
      }

      const codeGroup = codeGroups.pop();
      const endIndex = index;

      if (codeGroup && codeGroup.parentNode === parent) {
        const { parentNode, startIndex } = codeGroup;

        const rehypeCodeGroupElement: Element = createRehypeCodeGroupElement(
          codeGroup,
          endIndex,
          classNames,
        );

        parentNode.children.splice(
          startIndex,
          endIndex - startIndex + 1,
          rehypeCodeGroupElement,
        );
        codeGroupFound = true;
        return [SKIP, startIndex + 1];
      }
    });

    if (codeGroupFound) {
      addStylesAndScript(tree, classNames);
    }
  };
};

// Add styles and script to the head of the document
const addStylesAndScript = (tree: Root, classNames: ClassNames) => {
  let head: Element | undefined;
  let html: Element | undefined;
  let firstStyleIndex = -1;

  visit(tree, "element", (node, index) => {
    if (node.tagName === "head") {
      head = node;
    }
    if (node.tagName === "html") {
      html = node;
    }
    if (node.tagName === "style" && firstStyleIndex === -1) {
      firstStyleIndex = index ?? -1;
    }
  });

  const styleElement: Element = createStyleElement();
  const scriptElement: Element = createScriptElement(classNames);

  if (head) {
    if (firstStyleIndex !== -1) {
      head.children.splice(firstStyleIndex, 0, styleElement);
    } else {
      head.children.push(styleElement);
    }
    head.children.push(scriptElement);
  } else if (html) {
    head = {
      type: "element",
      tagName: "head",
      properties: {},
      children: [styleElement, scriptElement],
    };
    html.children.unshift(head);
  } else {
    tree.children.unshift({
      type: "element",
      tagName: "head",
      properties: {},
      children: [styleElement, scriptElement],
    });
  }
};

export default rehypeCodeGroup;
