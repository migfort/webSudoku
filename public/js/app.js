//  ==============================  Constants  ==============================
const SUDOKU_BASE = 3;
const BASE_URI = document.baseURI;
const GET_NEW_GAME_URI = BASE_URI + "api/newGame";

//  ===============================  Classes  ===============================

class Cell {
    constructor(element) {
        this.element = element;
        this.isSelected = false;
    }
    select(value = true) {
        if (value) {
            newSelection();
            this.element.classList.add("selected");
        } else {
            this.element.classList.remove("selected");
        }
        this.isSelected = value;
    }
    update(value, isClue) {
        this.element.innerText = value;
        if (typeof isClue !== "undefined") {
            this.setClue(isClue);
        }
    }
    setClue(value) {
        if (value) {
            this.element.classList.add("isClue");
            return;
        }
        this.element.classList.remove("isClue");
    }
}

class NumSelection {
    constructor(value) {
        this.value = value;
        init();
    }

    init() {
        this.selected = false;
        this.disabled = false;
    }
}

//  ===============================  Functions  ===============================
function newSelection(id) {
    for (let i = 0; i < gridCells.length; i++) {
        if (i == id) {
            gridCells[i].select(true);
            continue;
        }
        gridCells[i].select(false);
    }
}

function setValue(value) {
    for (let cellIndex = 0; cellIndex < SudokuGrid.cellCnt; cellIndex++) {
        if (gridCells[cellIndex].isSelected) {
            if (grid.setValue(cellIndex, value)) {
                gridCells[cellIndex].update(value);
            }
        }
    }
}

function refreshGrid() {
    for (let i = 0; i < gridCells.length; i++) {
        gridCells[i].update(grid.cells[i].value, grid.cells[i].isClue);
    }
    updateDifficulty(grid.difficulty);
}

function newGame() {
    getNewGame().then((newGame) => {
        grid.startNewGame(newGame);
        refreshGrid();
    });
}

async function getNewGame() {
    try {
        let response = await fetch(GET_NEW_GAME_URI);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        let data = await response.json();
        //const cells = data.cells;
        return ({ cells, difficulty } = data);
    } catch (error) {
        console.error(error);
    }
}

function updateDifficulty(difficulty) {
    const difficultyEl = document.querySelector(".difficulty span");
    if (difficultyEl === undefined) {
        difficultyEl.innerText = " - ";
        return;
    }
    difficultyEl.innerText = difficulty;
}

//  ==================================  UI  ==================================
const gridElement = document.querySelector("#grid1");
const grid = new SudokuGrid(SUDOKU_BASE);
const gridCells = [];
const cellIndex = 0;
for (let cellIndex = 0; cellIndex < grid.cells.length; cellIndex++) {
    const cellElement = document.querySelector(`#cell-${cellIndex}`);
    gridCells[cellIndex] = new Cell(cellElement);
    cellElement.addEventListener("click", () => {
        newSelection(cellIndex);
    });
}

const numButtons = [];
for (let i = 1; i <= grid.maxNum; i++) {
    numButtons[i] = document.querySelector(`.btn-${i}`);
    numButtons[i].addEventListener("click", () => {
        setValue(i);
    });
}
numButtons[0] = document.querySelector(`.btn-${0}`);
numButtons[0].addEventListener("click", () => {
    setValue(null);
});

newGame();
