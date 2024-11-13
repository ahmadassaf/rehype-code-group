import type { Element, Root } from "hast";
import type { ClassNames } from "./options";
import { getScript } from "./script";
import { styles } from "./styles";

export type CodeGroup = {
  parentNode: Element | Root;
  startIndex: number;
  tabLabels: string[];
};

const generateUniqueId = (): string => {
  return `rcg-${Math.random().toString(36).substr(2, 9)}`;
};

const createRcgTabsElement = (
  tabLabels: string[],
  classNames: ClassNames,
  uniqueId: string,
): Element => {
  return {
    type: "element",
    tagName: "div",
    properties: { className: classNames.tabContainerClass, role: "tablist" },
    children: tabLabels.map((label, i) => ({
      type: "element",
      tagName: "button",
      properties: {
        className: `${classNames.tabClass}${i === 0 ? ` ${classNames.activeTabClass}` : ""}`,
        role: "tab",
        "aria-selected": i === 0 ? "true" : "false",
        "aria-controls": `${uniqueId}-block-${i}`,
        id: `${uniqueId}-tab-${i}`,
        tabindex: i === 0 ? "0" : "-1",
      },
      children: [{ type: "text", value: label }],
    })),
  };
};

const createCodeBlockWrapper = (
  codeBlock: Element,
  classNames: ClassNames,
  uniqueId: string,
  idx: number,
): Element => {
  const isActive = idx === 0;
  return {
    type: "element",
    tagName: "div",
    properties: {
      className: `${classNames.blockContainerClass}${isActive ? ` ${classNames.activeBlockClass}` : ""}`,
      role: "tabpanel",
      "aria-labelledby": `${uniqueId}-tab-${idx}`,
      id: `${uniqueId}-block-${idx}`,
      hidden: !isActive,
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
  const uniqueId = generateUniqueId();

  const rcgTabsElement: Element = createRcgTabsElement(
    tabLabels,
    classNames,
    uniqueId,
  );

  for (let i = startIndex + 1; i < endIndex; i++) {
    const codeBlock = parentNode.children[i] as Element;

    if (codeBlock.type === "element") {
      codeBlocks.push(
        createCodeBlockWrapper(
          codeBlock,
          classNames,
          uniqueId,
          codeBlocks.length,
        ),
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
