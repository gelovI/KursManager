import { CourseItem } from "./courseItem.js";
import Sortable from "/node_modules/sortablejs/modular/sortable.core.esm.js";

class CourseContainer {
  constructor(id) {
    const containerWrapper = document.getElementById("container-wrapper");
    this.wrapper = containerWrapper || document.querySelector('.course-container');
    this.container = document.getElementById(id);
    this.items = [];
    this.createdContainers = [];
  }

  addContainer(data, header, color, chaptersData) {
    const containerWrapper = document.createElement("div");
    containerWrapper.classList.add("course-container");
    const newContainer = document.createElement("div");
    newContainer.classList.add(
      "container-element",
      "w-2/3",
      "bg-gray-200",
      "mx-auto",
      "mt-10",
      "rounded-tl-md",
      "rounded-br-md",
      "border-black",
      "border-2",
      "my-2"
    );
    newContainer.id = `${Date.now()}-course-container`;

    const chapterName = document.createElement("input");
    chapterName.id = `${Date.now()}-course-name`;
    chapterName.value = header || "";
    chapterName.classList.add(
      "header-input",
      "w-1/2",
      "bg-transparent",
      "text-xs",
      "p-2"
    );
    chapterName.placeholder = "Here the Header name...";
    newContainer.appendChild(chapterName);

    const containerColorInput = document.createElement("input");
    containerColorInput.type = "color";
    containerColorInput.value = color || "";
    containerColorInput.className = "color-input";
    containerColorInput.style.display = "none";

    newContainer.appendChild(containerColorInput);

    const colorPalette = document.createElement("button");
    const colorImage = `
      <svg height="14px" width="14px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
        viewBox="0 0 512 512" xml:space="preserve">
      <path style="fill:#D8D8DA;" d="M256,0C114.615,0,0,114.615,0,256s114.615,256,256,256s256-114.615,256-256S397.385,0,256,0z
        M256,336.842c-44.648,0-80.842-36.194-80.842-80.842s36.194-80.842,80.842-80.842s80.842,36.194,80.842,80.842
        S300.648,336.842,256,336.842z"/>
      <path style="fill:#D4B6E6;" d="M282.947,188.632h220.076C485.09,122.726,441.507,67.394,383.64,34.044L229.053,188.632H282.947z"/>
      <path style="fill:#EBAFD1;" d="M229.053,188.632L383.639,34.044C346.068,12.39,302.482,0,256,0c-23.319,0-45.899,3.135-67.368,8.978
        v220.075L229.053,188.632z"/>
      <path style="fill:#E07188;" d="M188.632,229.053V8.978C122.726,26.91,67.394,70.493,34.045,128.36l154.586,154.588V229.053z"/>
      <g>
        <polygon style="fill:#D8D8DA;" points="188.632,229.053 229.053,188.633 282.947,188.633 282.947,188.632 229.053,188.632 	"/>
        <polygon style="fill:#D8D8DA;" points="229.053,323.367 188.632,282.947 229.053,323.368 282.947,323.368 323.368,282.947 
          282.947,323.367 	"/>
      </g>
      <path style="fill:#B4D8F1;" d="M503.024,188.632H282.947v0.001h0.958l39.463,40.42L477.955,383.64
        C499.611,346.068,512,302.482,512,256C512,232.681,508.865,210.099,503.024,188.632z"/>
      <path style="fill:#ACFFF4;" d="M323.368,282.947v220.075c65.905-17.932,121.238-61.517,154.586-119.382L323.368,229.053V282.947z"/>
      <path style="fill:#95D5A7;" d="M282.947,323.368L128.361,477.956C165.932,499.61,209.518,512,256,512
        c23.319,0,45.899-3.135,67.368-8.977V282.947L282.947,323.368z"/>
      <path style="fill:#F8E99B;" d="M229.053,323.368H8.976C26.91,389.274,70.493,444.606,128.36,477.956l154.588-154.588H229.053z"/>
      <path style="fill:#EFC27B;" d="M188.632,282.947L34.045,128.36C12.389,165.932,0,209.518,0,256c0,23.319,3.135,45.901,8.976,67.368
        h220.076L188.632,282.947z"/>
      <polygon style="fill:#D8D8DA;" points="283.905,188.633 282.947,188.633 323.368,229.053 "/>
      <path style="fill:#B681D5;" d="M503.024,188.632C485.09,122.726,441.507,67.394,383.64,34.044L256,161.684v26.947h26.947H503.024z"
        />
      <path style="fill:#E592BF;" d="M383.639,34.044C346.068,12.39,302.482,0,256,0v161.684L383.639,34.044z"/>
      <path style="fill:#80CB93;" d="M256,350.316V512c23.319,0,45.899-3.135,67.368-8.977V282.947l-40.421,40.421L256,350.316z"/>
      <polygon style="fill:#F6E27D;" points="282.947,323.368 256,323.368 256,350.316 "/>
      </svg>`;
    colorPalette.innerHTML = colorImage;
    colorPalette.classList.add(
      "colorPickerButton",
      "color-image",
      "w-4",
      "h-4",
      "z-1",
      "relative"
    );
    colorPalette.draggable = "false";
    colorPalette.id = "colorPickerButton";
    colorPalette.type = "color";
    colorPalette.title = "Choose backgroundcolor";
    newContainer.appendChild(colorPalette);
    colorPalette.addEventListener("click", function () {
      console.log("Triggered...");
      containerColorInput.click();
    });

    containerColorInput.addEventListener("input", function () {
      newContainer.style.backgroundColor = this.value;
    });

    if (color) {
      newContainer.style.backgroundColor = color;
    }

    const deleteButton = document.createElement("button");
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4 text-red-500">
    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
  `;
    deleteButton.innerHTML = svgContent;
    deleteButton.classList.add("float-right", "p-2");
    deleteButton.title = "Delete chapter";
    deleteButton.id = "delete-button";
    deleteButton.draggable = "false";
    newContainer.appendChild(deleteButton);

    deleteButton.addEventListener("click", function () {
      const isConfirmed = confirm(
        "Bist du sicher, dass du diesen Kapitel löschen möchtest?"
      );
      if (isConfirmed) {
        newContainer.remove();
      }
    });

    if (chaptersData && chaptersData.length > 0) {
      chaptersData.forEach((chapter) => {
        const chapterItem = new CourseItem(
          `section-${Date.now()}`,
          chapter.image || "",
          chapter.text || chapter.java || "",
          newContainer
        );
        newContainer.appendChild(chapterItem.getElement());
      });
    } else if (!chaptersData) {
      const newChapterElement = new CourseItem(
        `section-${Date.now()}`,
        "Placeholder",
        "Placeholder",
        newContainer
      );
      newContainer.appendChild(newChapterElement.getElement());
    }

    // Button zum verschieben nach oben
    const moveUpButton = document.createElement("button");
    const moveUpImage = `
    <?xml version="1.0" encoding="utf-8"?>
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
    <svg viewBox="-3 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="icomoon-ignore">
    </g>
    <circle cx="13" cy="16" r="12" fill="white"/>
    <path d="M26.221 16c0-7.243-5.871-13.113-13.113-13.113s-13.113 5.87-13.113 13.113c0 7.242 5.871 13.113 13.113 13.113s13.113-5.871 13.113-13.113zM1.045 16c0-6.652 5.412-12.064 12.064-12.064s12.064 5.412 12.064 12.064c0 6.652-5.411 12.064-12.064 12.064-6.652 0-12.064-5.412-12.064-12.064z" fill="black">
    </path>
    <path d="M18.746 15.204l0.742-0.742-6.379-6.379-6.378 6.379 0.742 0.742 5.112-5.112v12.727h1.049v-12.727z" fill="black">
    </path>
    </svg>`;
    moveUpButton.innerHTML = moveUpImage;
    moveUpButton.classList.add("move-up-button", "h-4", "w-4", "ml-1");
    moveUpButton.draggable = "false";
    moveUpButton.title = "Chapter up";
    newContainer.appendChild(moveUpButton);
    moveUpButton.addEventListener("click", () => {
      const currentContainer = moveUpButton.closest(".course-container");
      if (currentContainer.previousElementSibling) {
        currentContainer.parentNode.insertBefore(
          currentContainer,
          currentContainer.previousElementSibling
        );
      }
    });

    // Button zum Verschieben nach unten
    const moveDownButton = document.createElement("button");
    const moveDownImage = `<svg viewBox="-3 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" transform="rotate(180)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="icomoon-ignore"> </g> <circle cx="13" cy="16" r="12" fill="white"/> <path d="M26.221 16c0-7.243-5.871-13.113-13.113-13.113s-13.113 5.87-13.113 13.113c0 7.242 5.871 13.113 13.113 13.113s13.113-5.871 13.113-13.113zM1.045 16c0-6.652 5.412-12.064 12.064-12.064s12.064 5.412 12.064 12.064c0 6.652-5.411 12.064-12.064 12.064-6.652 0-12.064-5.412-12.064-12.064z" fill="#000000"> </path> <path d="M18.746 15.204l0.742-0.742-6.379-6.379-6.378 6.379 0.742 0.742 5.112-5.112v12.727h1.049v-12.727z" fill="#000000"> </path> </g></svg>`;
    moveDownButton.innerHTML = moveDownImage;
    moveDownButton.classList.add("move-down-button", "h-4", "w-4", "ml-1");
    moveDownButton.draggable = "false";
    moveDownButton.title = "Chapter down";
    newContainer.appendChild(moveDownButton);
    moveDownButton.addEventListener("click", () => {
      const currentContainer = moveDownButton.closest(".course-container");
      if (currentContainer.nextElementSibling) {
        currentContainer.parentNode.insertBefore(
          currentContainer.nextElementSibling,
          currentContainer
        );
      }
    });

    const containerPlaceholderWrapper = document.createElement("div");
    containerPlaceholderWrapper.classList.add(
      "container-placeholder-wrapper",
      "flex",
      "items-center",
      "mx-auto",
      "h-0",
      "w-4/5",
      "opacity-0",
      "bg-transparent"
    );
    const containerPlaceholder = document.createElement("section");
    containerPlaceholder.classList.add(
      "container-placeholder",
      "text-sm",
      "mx-auto",
      "flex",
      "items-center"
    );

    const addContainerIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-8 top-0 text-yellow-400 mx-auto">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`;

    const addContainerButton = document.createElement("button");
    addContainerButton.classList.add("ml-2");
    addContainerButton.className = "new-chapter-container";
    addContainerButton.innerHTML = addContainerIcon;
    addContainerButton.id = "new-chapter-container";
    addContainerButton.addEventListener(
      "click",
      function (event) {
        const contPlaceholder = event.target.closest(
          ".container-placeholder-wrapper"
        );
        if (!contPlaceholder) {
          console.error("Placeholder element not found.");
          return;
        }
        const parentElement = contPlaceholder.parentNode;
        if (parentElement) {
          const newContainer = this.addContainer();
          parentElement.insertBefore(
            newContainer,
            contPlaceholder.nextElementSibling
          );
        }
      }.bind(this)
    );
    containerPlaceholder.appendChild(addContainerButton);

    containerPlaceholderWrapper.appendChild(containerPlaceholder);

    newContainer.appendChild(containerPlaceholderWrapper);

    containerPlaceholderWrapper.addEventListener("mouseover", (event) => {
      containerPlaceholderWrapper.classList.remove("opacity-0");
      containerPlaceholderWrapper.classList.add("h-8");
    });

    containerPlaceholderWrapper.addEventListener("mouseout", (event) => {
      containerPlaceholderWrapper.classList.add("opacity-0");
      containerPlaceholderWrapper.classList.remove("h-8");
    });

    containerWrapper.appendChild(newContainer);
    containerWrapper.appendChild(containerPlaceholderWrapper);

    this.wrapper.appendChild(containerWrapper);

    this.initSortable(containerWrapper);
    return containerWrapper;
  }

  initSortable(container) {
    if (typeof Sortable !== "undefined") {
      new Sortable(container, {
        animation: 150,
        group: {
          name: "shared",
          pull: true,
          put: true,
        },
        direction: "vertical",
        sort: true,
        invertSwap: true,
      });
    } else {
      console.error("Sortable is not defined.");
    }
  }
}



const DataSaver = {
  saveJSON: function (storageObj, filename) {
    if (!storageObj) {
      console.error("Keine Daten vorhanden");
      return;
    }

    if (typeof storageObj !== "object") {
      console.error("Daten sind kein Objekt");
      return;
    }

    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(storageObj));
    var dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", filename || "daten.json");
    dlAnchorElem.style.display = "none";
    document.body.appendChild(dlAnchorElem);
    dlAnchorElem.click();
    document.body.removeChild(dlAnchorElem);
  },

  saveData: function () {
    const chapters = [];

    const containerElements = document.querySelectorAll(".course-container");
    containerElements.forEach((containerElement) => {
      const containerData = {
        header: containerElement.querySelector(".header-input").value,
        color: containerElement.querySelector(".color-input").value || "",
        chapters: [],
      };

      const courseItems = containerElement.querySelectorAll(".section-wrapper");
      courseItems.forEach((courseItem) => {
        const courseItemData = {
          image: courseItem.querySelector(".image-input").textContent,
          text: courseItem.querySelector(".text-input").textContent,
        };
        containerData.chapters.push(courseItemData);
      });

      chapters.push(containerData);
    });

    this.saveJSON(chapters, "aktualisierteKursDaten.json", function () {
      console.log("JSON-Daten erfolgreich gespeichert");
    });
  },
};

export { CourseContainer, DataSaver };
