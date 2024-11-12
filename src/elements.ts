import type { Element, Root } from "hast";
import { getScript } from "./script";
import { type ClassNames, styles } from "./styles";

export type CodeGroup = {
  parentNode: Element | Root;
  startIndex: number;
  tabLabels: string[];
};

const createRcgTabsElement = (
  tabLabels: string[],
  classNames: ClassNames,
): Element => {
  return {
    type: "element",
    tagName: "div",
    properties: { className: classNames.tabContainerClass },
    children: tabLabels.map((label, i) => ({
      type: "element",
      tagName: "button",
      properties: {
        className: `${classNames.tabClass}${i === 0 ? ` ${classNames.activeTabClass}` : ""}`,
      },
      children: [{ type: "text", value: label }],
    })),
  };
};

const createCodeBlockWrapper = (
  codeBlock: Element,
  isActive: boolean,
  classNames: ClassNames,
): Element => {
  return {
    type: "element",
    tagName: "div",
    properties: {
      className: `${classNames.blockContainerClass}${isActive ? ` ${classNames.activeBlockClass}` : ""}`,
    },
    children: [codeBlock],
  };
};

export const createRehypeCodeGroupElement = (
  codeGroup: CodeGroup,
  endIndex: number,
  classNames: ClassNames,
): Element => {
  const { parentNode, startIndex, tabLabels } = codeGroup;
  const codeBlocks: Element[] = [];

  const rcgTabsElement: Element = createRcgTabsElement(tabLabels, classNames);

  for (let i = startIndex + 1; i < endIndex; i++) {
    const codeBlock = parentNode.children[i] as Element;

    if (codeBlock.type === "element") {
      codeBlocks.push(
        createCodeBlockWrapper(codeBlock, !codeBlocks.length, classNames),
      );
    }
  }

  return {
    type: "element",
    tagName: "div",
    properties: { className: classNames.codeGroupClass },
    children: [rcgTabsElement, ...codeBlocks],
  };
};

export const createStyleElement = (): Element => {
  return {
    type: "element",
    tagName: "style",
    properties: {},
    children: [{ type: "text", value: styles }],
  };
};

export const createScriptElement = (classNames: ClassNames): Element => {
  return {
    type: "element",
    tagName: "script",
    properties: { type: "text/javascript" },
    children: [{ type: "text", value: getScript(classNames) }],
  };
};
