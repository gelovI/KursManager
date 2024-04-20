import { CourseControlPanel } from "./courseControlPanel";
import { DataSaver } from "./courseContainer";

jest.mock("./courseContainer", () => ({
  DataSaver: {
    saveData: jest.fn(),
  },
}));

describe("CourseControlPanel", () => {
  let controlPanel;

  beforeEach(() => {
    jest.useFakeTimers();
    document.body.innerHTML = `
    <div>
      <input class="search-field" />
    </div>
  `;
    controlPanel = new CourseControlPanel();
    document.body.innerHTML = '<div id="root"></div>';
    document.getElementById("root").appendChild(controlPanel.element);
  });

  test("createHeader erstellt ein Header-Element", () => {
    expect(document.querySelector("header")).not.toBeNull();
    expect(document.querySelector(".search-field")).not.toBeNull();
    expect(document.querySelector(".search-icon")).not.toBeNull();
    expect(document.querySelector("button")).not.toBeNull();
  });

  test("toggleSearchMode wechselt den Suchmodus um", () => {
    // Anfangszustand prüfen
    expect(controlPanel.searchMode).toBe("chapter");

    // Search-Mode umschalten
    controlPanel.toggleSearchMode();
    expect(controlPanel.searchMode).toBe("content");

    // Und wieder zurück umschalten
    controlPanel.toggleSearchMode();
    expect(controlPanel.searchMode).toBe("chapter");
  });

  test("handleDebouncedInput verarbeitet die Eingabe nach einer Verzögerung", () => {
    const searchField = document.querySelector(".search-field");
    searchField.value = "test"; // Setze einen Wert für das Suchfeld
    const inputEvent = new Event("input"); // Erstelle ein Input-Event
    searchField.dispatchEvent(inputEvent); // Löse das Event aus

    jest.runAllTimers(); // Führe alle Timers aus
  });

  afterEach(() => {
    jest.useRealTimers(); // Setze die Timer zurück
  });

  test("handleInput startet die Suche mit nicht-leerer Eingabe", () => {
    jest.useFakeTimers();
    document.body.innerHTML = `<input class="search-field" />`;
    const controlPanel = new CourseControlPanel();
    const inputEvent = new Event("input");

    // Überwache die searchContent Methode
    const searchContentSpy = jest.spyOn(controlPanel, "searchContent");

    // Setze einen expliziten Wert für das Suchfeld vor dem Auslösen des Events
    controlPanel.searchField.value = "test";
    controlPanel.searchField.dispatchEvent(inputEvent);

    // Beschleunige alle Timers, um die Debounce-Logik zu überspringen
    jest.runAllTimers();

    // Überprüfe, ob searchContent mit dem erwarteten Wert aufgerufen wurde
    expect(controlPanel.searchField.value).not.toBe("");
    expect(searchContentSpy).toHaveBeenCalledWith("test");

    jest.useRealTimers();

    // Setze die Überwachung zurück
    searchContentSpy.mockRestore();
  });

  test("searchContent markiert Kapitel oder Inhalte basierend auf dem Suchmodus", () => {
    // Vorbereitung: Fügen Sie Beispieldaten und Mock-Funktionen hinzu
    controlPanel.chaptersData = [
      { header: "Chapter 1", chapters: [{ text: "Introduction" }] },
    ];
    controlPanel.highlightChapter = jest.fn();
    controlPanel.highlightContent = jest.fn();

    // Ausführen: Suchmodus auf "chapter" setzen und Suche starten
    controlPanel.searchMode = "chapter";
    controlPanel.searchContent("Chapter 1");

    // Überprüfen: highlightChapter sollte aufgerufen worden sein
    expect(controlPanel.highlightChapter).toHaveBeenCalledWith("Chapter 1");

    // Suchmodus wechseln und erneut testen
    controlPanel.searchMode = "content";
    controlPanel.searchContent("Introduction");

    // highlightContent sollte aufgerufen worden sein
    expect(controlPanel.highlightContent).toHaveBeenCalledWith("Introduction");
  });

  test("clearSearch entfernt alle Hervorhebungen aus den Suchergebnissen", () => {
    // Vorbereitung: Erstelle Mock-Hervorhebungen
    const highlightedElement = document.createElement("div");
    highlightedElement.classList.add("highlight");
    document.body.appendChild(highlightedElement);

    // Stelle sicher, dass die Vorbereitung korrekt ist
    expect(document.querySelectorAll(".highlight").length).toBeGreaterThan(0);

    // Ausführen
    controlPanel.clearSearch();

    // Überprüfen
    expect(document.querySelectorAll(".highlight").length).toBe(0);
  });
});
