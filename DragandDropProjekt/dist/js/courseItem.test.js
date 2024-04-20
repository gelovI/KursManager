import { CourseItem } from "./courseItem.js";

jest.mock("sortablejs", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    option: jest.fn(),
    toArray: jest.fn(),
    destroy: jest.fn(),
  })),
}));

describe("CourseItem", () => {
  let container;
  let courseItem;

  beforeEach(() => {
    container = document.createElement("div");
    container.classList.add("course-container");
    document.body.appendChild(container);

    courseItem = new CourseItem("1", "testImage.jpg", "Testtext", "TestJava", container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test("CourseItem Instanz wird korrekt erstellt", () => {
    expect(courseItem.id).toBe("1");
    expect(courseItem.image).toBe("testImage.jpg");
    expect(courseItem.text).toBe("Testtext");
    expect(courseItem.java).toBe("TestJava");
    expect(courseItem.container).toBe(container);
  });

  test("createItemElement erstellt das erwartete DOM-Element", () => {
    const element = courseItem.createItemElement();
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.classList.contains("course-section")).toBe(true);
  });

  test("addSection fügt eine neue Sektion hinzu", () => {
    // Erstelle eine .course-element und .placeholder-wrapper Struktur im Container
    const placeholderWrapper = document.createElement("div");
    placeholderWrapper.classList.add("placeholder-wrapper");
    const courseElement = document.createElement("div");
    courseElement.classList.add("course-element");
    courseElement.appendChild(placeholderWrapper);
    container.appendChild(courseElement);

    // Erstelle ein Mock-Event, das eine Simulation von event.target.closest beinhaltet
    const mockEvent = {
      target: {
        closest: jest.fn().mockImplementation((selector) => {
          if (selector === ".placeholder-wrapper") {
            return placeholderWrapper;
          }
          return null;
        }),
      },
    };

    // Führe addSection mit dem Mock-Event aus
    courseItem.addSection(mockEvent);

    // Überprüfe, ob eine neue Sektion hinzugefügt wurde
    const sections = container.querySelectorAll(".course-section");
    expect(sections.length).toBeGreaterThan(0);
  });

  const mockEventMitPlaceholder = {
    target: {
      closest: jest.fn(() => {
        const placeholderWrapper = document.createElement("div");
        placeholderWrapper.classList.add("placeholder-wrapper");
        return placeholderWrapper;
      }),
    },
    preventDefault: jest.fn(),
  };

  test("deleteSection entfernt die angegebene Sektion", () => {
    // Stellen Sie sicher, dass eine Sektion vorhanden ist, die gelöscht werden kann
    courseItem.addSection(mockEventMitPlaceholder); // Angenommen, dies fügt erfolgreich eine Sektion hinzu

    // Finden Sie den "Löschen"-Button der hinzugefügten Sektion
    const deleteButton = document.querySelector(".delete-image"); // Angenommen, Ihre Sektion hat einen Löschbutton mit dieser Klasse

    // Simulieren Sie ein Klick-Event auf den "Löschen"-Button
    const mockDeleteEvent = { target: deleteButton };
    courseItem.deleteSection(mockDeleteEvent);

    // Überprüfen Sie, ob die Sektion entfernt wurde
    expect(document.querySelector(".course-section")).toBeNull();
  });
});
