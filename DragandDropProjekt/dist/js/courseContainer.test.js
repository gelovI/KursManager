import { CourseContainer } from "./courseContainer";

describe("CourseContainer", () => {
  let container; 

  beforeEach(() => {
    const testWrapper = document.createElement('div');
    testWrapper.classList.add('course-container');
    document.body.appendChild(testWrapper);
  
    // Initialisiere `container` mit der neuen Instanz von `CourseContainer`
    container = new CourseContainer(testWrapper); // Verwendung der korrekten Variable
  });

  it("Sollte mit einem leeren Array von Elementen initialisiert werden", () => {
    expect(container.items).toEqual([]); // Verwendung von `container`
  });

  it("Sollte ein Container-Umgebungselement erstellen", () => {
    expect(container.wrapper).toBeDefined();
    expect(container.wrapper.classList.contains("course-container")).toBe(true);
  });

  // Testing addContainer method
  it("Sollte einen neuen Container hinzufügen", () => {
    const mockData = {
      header: "Test Header",
      color: "#FFFFFF",
      chaptersData: [],
    };
    const result = container.addContainer(
      mockData,
      mockData.header,
      mockData.color,
      mockData.chaptersData
    );

    expect(result).toBeDefined();
    expect(result.classList.contains("course-container")).toBe(true);
    expect(container.wrapper.children.length).toBeGreaterThan(0);
  });

  
});