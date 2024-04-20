import Sortable from "/node_modules/sortablejs/modular/sortable.core.esm.js";

export class CourseItem {
  constructor(id, image, text, java, container) {
    this.id = id;
    this.text = text;
    this.java = java;
    this.image = image;
    this.container = container;
    this.element = this.createItemElement();
  }

  createItemElement() {
    const sectionElement = document.createElement("div");
    sectionElement.classList.add("course-section");
    sectionElement.id = `section-${Date.now()}`;
    const containerElement = document.createElement("div");
    containerElement.classList.add("course-element");

    const placeholderWrapper = document.createElement("div");
    placeholderWrapper.classList.add("placeholder-wrapper");
    const sectionPlaceholder = document.createElement("section");
    sectionPlaceholder.classList.add(
      "placeholder",
      "flex",
      "items-center",
      "mx-auto",
      "h-0",
      "opacity-0",
      "w-4/5",
      "bg-transparent",
      "drei-seiten-border-dashed"
    );

    const addIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" class="h-4 top-0 text-blue-500">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" fill="#FFFFFF" />
</svg>`;

    const addSectionButton = document.createElement("button");
    addSectionButton.classList.add("add-btn");
    addSectionButton.innerHTML = addIcon;
    addSectionButton.addEventListener("click", () => this.addSection(event));
    sectionPlaceholder.appendChild(addSectionButton);

    addSectionButton.addEventListener("mouseover", () => {
      sectionPlaceholder.classList.remove("opacity-0");
      sectionPlaceholder.classList.add("h-4");
    });

    addSectionButton.addEventListener("mouseout", () => {
      sectionPlaceholder.classList.add("opacity-0");
      sectionPlaceholder.classList.remove("h-4");
    });

    placeholderWrapper.appendChild(sectionPlaceholder);

    containerElement.appendChild(placeholderWrapper);

    const sectionWrapper = document.createElement("div");
    sectionWrapper.classList.add(
      "section-wrapper",
      "bg-white",
      "w-4/5",
      "h-auto",
      "mx-auto",
      "flex",
      "items-center",
      "border",
      "border-1",
      "border-black",
      "relative"
    );
    const sectionContainer = document.createElement("section");
    sectionContainer.className = "course-chapter";

    if (this.image) {
      const imageName = this.image.split("/").pop();
      const imageInput = document.createElement("p");
      imageInput.className = "image-input";
      imageInput.id = `${this.id}-image-${Date.now()}`;
      imageInput.textContent = imageName || "";
      imageInput.contentEditable = true;
      imageInput.classList.add(
        "bg-transparent",
        "text-xs",
        "p-2",
        "focus:ring-2",
        "focus:ring-red-500"
      );
      sectionContainer.appendChild(imageInput);
    }

    const sectionDivide = document.createElement("hr");
    sectionDivide.classList.add("h-1", "w-full", "border-black", "absolute");
    sectionContainer.appendChild(sectionDivide);

    if (this.text || this.java) {
      let textName = "";
      let javaName = "";
      if (this.text && typeof this.text === "string") {
        textName = this.text.split("/").pop();
      }
      if (this.java && typeof this.java === "string") {
        javaName = this.java.split("/").pop();
      }
      const textInput = document.createElement("p");
      textInput.className = "text-input";
      textInput.id = `${this.id}-text-${Date.now()}`;
      textInput.textContent = textName || javaName || "";
      textInput.contentEditable = true;
      textInput.classList.add(
        "bg-transparent",
        "text-xs",
        "p-2",
        "focus:ring-2",
        "focus:ring-red-500"
      );
      sectionContainer.appendChild(textInput);
    }

    sectionWrapper.appendChild(sectionContainer);

    const iconContainer = document.createElement("div");
    iconContainer.classList.add(
      "absolute",
      "top-0",
      "right-0",
      "p-1",
      "flex",
      "items-center"
    );

    const deleteImage = document.createElement("img");
    deleteImage.className = "delete-image";
    deleteImage.src = "/dist/images/delete.png";
    deleteImage.classList.add("h-2", "mr-1");
    deleteImage.title = "Delete section";
    deleteImage.draggable = "false";
    deleteImage.alt = "delete-image";
    deleteImage.id = `${this.id}-delete-image`;
    deleteImage.addEventListener("click", (event) => {
      this.deleteSection(null, event);
    });

    iconContainer.appendChild(deleteImage);

    sectionContainer.appendChild(iconContainer);

    containerElement.appendChild(sectionWrapper);

    sectionElement.appendChild(containerElement);

    this.initSortable(sectionElement);
    return sectionElement;
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

  addSection(event) {
    if (!event) {
      console.error("Event not provided.");
      return;
    }

    const addButton = event.target.closest(".add-btn");
    if (!addButton) {
      console.error("Add button not found.");
      return;
    }

    const placeholderWrapper = addButton.closest(".course-section");
    console.log(placeholderWrapper);
    if (!placeholderWrapper) {
      console.error("Placeholder wrapper not found.");
      return;
    }

    const courseSection = placeholderWrapper.closest(".container-element");
    console.log(courseSection);
    if (!courseSection) {
      console.error("Course section container not found.");
      return;
    }

    const newSection = new CourseItem(
      `section-${Date.now()}`,
      "Neuer Abschnitt",
      "Neuer Inhalt"
    ).getElement();

    if (placeholderWrapper.nextElementSibling) {
      // Einfügen des neuen Elements vor dem folgenden Geschwister
      courseSection.insertBefore(
        newSection,
        placeholderWrapper.nextElementSibling
      );
    } else {
      // Ansonsten wird das neue Element am Ende angefügt
      courseSection.appendChild(newSection);
    }
  }

  deleteSection(sectionId, event = null) {
    let clickedElement;
    if (event) {
      clickedElement = event.target;
    } else {
      clickedElement = this.getElement().querySelector(
        `[data-section-id="${sectionId}"] .delete-image`
      );
    }

    if (clickedElement && clickedElement.classList.contains("delete-image")) {
      const isConfirmed = confirm(
        "Bist du sicher, dass du diesen Abschnitt löschen möchtest?"
      );
      if (isConfirmed) {
        const parentSection = clickedElement.closest(".course-section");
        if (parentSection) {
          parentSection.remove();
        } else {
          console.error("Die Section wurde nicht gefunden.");
        }
      }
    }
  }

  getElement() {
    return this.element;
  }

  getContainer() {
    return this.container;
  }
}
