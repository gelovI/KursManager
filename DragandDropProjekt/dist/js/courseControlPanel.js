import { DataSaver } from "./courseContainer.js";

export class CourseControlPanel {
  constructor() {
    this.searchMode = "chapter";
    this.element = this.createHeader();
    this.chaptersData = [];
    this.debounceTimer = null;
    this.searchField = this.element.querySelector(".search-field");
    if (this.searchField) {
      this.searchField.addEventListener(
        "input",
        this.handleDebouncedInput.bind(this)
      );
    } else {
      console.error("Search field not found.");
    }
  }

  createHeader() {
    const header = document.createElement("header");
    header.classList.add(
      "header",
      "h-8",
      "flex",
      "justify-between",
      "items-center",
      "p-4",
      "fixed",
      "top-0",
      "w-full",
      "z-10",
      "bg-opacity-50",
      "bg-gray-800",
      "backdrop-filter",
      "backdrop-blur-md"
    );
    header.id = "header";

    const searchContainer = document.createElement("div");
    searchContainer.classList.add("flex", "items-center");

    const searchField = document.createElement("input");
    searchField.type = "text";
    searchField.placeholder = "Quick search...";
    searchField.id = "search-field";
    searchField.classList.add(
      "search-field",
      "h-5",
      "px-4",
      "text-sm",
      "rounded-l-xl",
      "bg-gray-200",
      "outline-none"
    );

    const searchIcon = document.createElement("span");
    searchIcon.classList.add(
      "search-icon",
      "px-3",
      "bg-yellow-400",
      "rounded-r-xl",
      "h-5",
      "text-white",
      "text-sm"
    );
    searchIcon.id = "search-icon";
    searchIcon.style.cursor = "pointer";
    searchIcon.textContent = "Chapter";
    searchIcon.addEventListener("click", () => {
      this.toggleSearchMode();
    });

    searchContainer.appendChild(searchField);
    searchContainer.appendChild(searchIcon);
    
    header.appendChild(searchContainer);

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.classList.add(
      "text-white",
      "bg-blue-500",
      "px-4",
      "rounded-xl",
      "text-xs",
      "h-5"
    );
    saveButton.addEventListener("click", () => {
      DataSaver.saveData();
    });
    header.appendChild(saveButton);

    return header;
  }

  toggleSearchMode() {
    const searchIcon = document.getElementById("search-icon");

    if (this.searchMode === "chapter") {
      this.searchMode = "content";
      searchIcon.textContent = "Content";
      searchIcon.classList.remove("bg-yellow-400");
      searchIcon.classList.add("bg-blue-400");
    } else {
      this.searchMode = "chapter";
      searchIcon.textContent = "Chapter";
      searchIcon.classList.remove("bg-blue-400");
      searchIcon.classList.add("bg-yellow-400");
    }
  }

  setData(chaptersData) {
    this.chaptersData = chaptersData;
  }

  handleDebouncedInput() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.handleInput();
    }, 300);
  }

  handleInput() {
    const keyword = this.searchField.value.trim();

    if (keyword !== "") {
      this.clearSearch();
      this.searchContent(keyword);
    } else {
      this.clearSearch();
    }
  }

  prepareTextForSearch(text) {
    let separatedText = text.replace(/([a-z])([A-Z])/g, "$1 $2");
    separatedText = separatedText.replace(
      /[0-9\.,-\/#!$%\^&\*;:{}=\-_`~()]+/g,
      " "
    );
    return separatedText.toLowerCase().replace(/\s\s+/g, " ").trim();
  }

  searchContent(keyword) {
    // Vorbereitung des Suchbegriffs für die Suche
    const preparedKeyword = this.prepareTextForSearch(keyword);

    // Durchlaufen aller Kapitel
    this.chaptersData.forEach((chapter) => {
      // Vorbereitung des Kapiteltitels
      const preparedChapterTitle = this.prepareTextForSearch(chapter.header);

      // Überprüfung auf Übereinstimmung im Modus "chapter"
      if (this.searchMode === "chapter") {
        if (preparedChapterTitle.includes(preparedKeyword)) {
          this.highlightChapter(chapter.header);
        }
      } else if (this.searchMode === "content" && chapter.chapters) {
        // Durchlaufen aller Unterkapitel oder Inhalte eines Kapitels
        chapter.chapters.forEach((item) => {
          // Zusammenführen von Text, Bild und Videoinhalten und deren Vorbereitung
          const itemContent = [item.text, item.image, item.movie]
            .filter(Boolean)
            .map((text) => this.prepareTextForSearch(text))
            .join(" ");

          // Überprüfung auf Übereinstimmung im Inhalt
          if (itemContent.includes(preparedKeyword)) {
            this.highlightContent(keyword);
          }
        });
      }
    });
  }

  highlightChapter(preparedChapterTitle) {
    // Hervorhebung des Kapitels
    const chapterElements = document.querySelectorAll(".header-input");
    for (const chapterElement of chapterElements) {
      // Überprüfen, ob das Element der Kapitelüberschrift entspricht
      if (
        chapterElement.value
          .toLowerCase()
          .includes(preparedChapterTitle.toLowerCase())
      ) {
        chapterElement.classList.add(
          "highlight",
          "bg-yellow-200",
          "text-black"
        );
        chapterElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }

  highlightContent(searchText) {
    const preparedSearchText = this.prepareTextForSearch(searchText);

    // Selektiere alle relevanten Inhalts-Elemente
    const contentElements = document.querySelectorAll(
      ".image-input, .text-input"
    );

    contentElements.forEach((element) => {
      const contentText = this.prepareTextForSearch(element.textContent);
      if (contentText.includes(preparedSearchText)) {
        console.log("Hinzufügen der Hervorhebung zu:", element);
        element.classList.add("highlight", "bg-yellow-200", "text-black");
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  clearSearch() {
    // Entfernt die Hervorhebung der zuvor gefundenen Inhalte
    const highlightedItems = document.querySelectorAll(".highlight");
    highlightedItems.forEach((item) => {
      item.classList.remove("highlight", "bg-yellow-200", "text-yellow-800");
    });
  }
}
