import { CourseContainer } from "./courseContainer.js";
import { CourseItem } from "./courseItem.js";
import { CourseControlPanel } from "./courseControlPanel.js";

const container = new CourseContainer("container-wrapper");

document.addEventListener("DOMContentLoaded", function () {
  // Dynamische auslesen der Datei
  const plusButton = document.getElementById("load-course");
  const courseTitle = document.getElementById("course-title");
  if (plusButton && courseTitle) {
    plusButton.addEventListener("click", function () {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".json";
      fileInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            const contents = e.target.result;
            const jsonData = JSON.parse(contents);
            const searchField = document.getElementById("search-field");
            const keyword = searchField ? searchField.value.trim() : null;
            handleJSONData(jsonData, keyword);

            courseTitle.style.display = "none";
            plusButton.style.display = "none";
          };
          reader.readAsText(file);
        } else {
          console.error("No file selected.");
        }
      });
      fileInput.click();
    });
  }

  function handleJSONData(data, keyword) {
    if (data) {
      data.forEach((chapter) => {
        if (Array.isArray(chapter.chapters)) {
          container.addContainer(
            data,
            chapter.header,
            chapter.color,
            chapter.chapters
          );
        }
      });
      const courseControlPanel = new CourseControlPanel();
      courseControlPanel.setData(data);
      document.body.prepend(courseControlPanel.element);
      if (keyword) {
        courseControlPanel.searchContent(keyword);
      }
    } else {
      console.error(
        "Invalid data format: chaptersData not found or not an array."
      );
    }
  }
});
