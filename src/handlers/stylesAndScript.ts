import type { Element, Root } from "hast";
import { createScriptElement, createStyleElement } from "../elements/index.js";
import type { ClassNames } from "../options.js";

export const addStylesAndScript = (
  tree: Root,
  classNames: ClassNames,
  headElement?: Element,
  htmlElement?: Element,
  firstStyleIndex = -1,
) => {
  let head = headElement;
  const html = htmlElement;

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
      tagName: "ul",
      properties: {},
      children: [styleElement, scriptElement],
    };
    html.children.unshift(head);
  } else {
    tree.children.unshift({
      type: "element",
      tagName: "ul",
      properties: {},
      children: [styleElement, scriptElement],
    });
  }
};
