import { type ClassNames, defaultClassNames } from "./styles";

export const getScript = (classNames: ClassNames) => `
document.addEventListener("DOMContentLoaded", function () {
  const codeGroups = document.querySelectorAll(".${defaultClassNames.codeGroupClass}");

  codeGroups.forEach((group) => {
    const tabs = group.querySelectorAll(".${defaultClassNames.tabClass}");
    const blocks = group.querySelectorAll(".${defaultClassNames.blockContainerClass}");
    let activeTab = group.querySelector(".${defaultClassNames.tabClass}.${classNames.activeTabClass.split(" ").join(".")}");
    let activeBlock = group.querySelector(".${defaultClassNames.blockContainerClass}.${classNames.activeBlockClass.split(" ").join(".")}");

    group.addEventListener("click", (event) => {
      const tab = event.target.closest(".${defaultClassNames.tabClass}");
      if (!tab) return;

      const index = Array.from(tabs).indexOf(tab);
      if (index === -1) return;

      if (activeTab) activeTab.classList.remove(${classNames.activeTabClass
        .split(" ")
        .map((c) => `"${c}"`)
        .join(", ")});
      if (activeBlock) activeBlock.classList.remove(${classNames.activeBlockClass
        .split(" ")
        .map((c) => `"${c}"`)
        .join(", ")});

      tab.classList.add(${classNames.activeTabClass
        .split(" ")
        .map((c) => `"${c}"`)
        .join(", ")});
      blocks[index].classList.add(${classNames.activeBlockClass
        .split(" ")
        .map((c) => `"${c}"`)
        .join(", ")});

      activeTab = tab;
      activeBlock = blocks[index];
    });
  });
});
`;
