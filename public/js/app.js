//  ==============================  Constants  ==============================
const SUDOKU_BASE = 3;
const SUDOKU_MAX_NUM = SUDOKU_BASE * SUDOKU_BASE;
const SUDOKU_CELL_NB = SUDOKU_MAX_NUM * SUDOKU_MAX_NUM;

//  ===============================  Classes  ===============================


class Cell {
    constructor(element) {
        this.element = element;
        this.isSelected = false;
    }
    select(value = true){
        if(value){
            newSelection();
            this.element.classList.add("selected");
        }else{
            this.element.classList.remove("selected");
        }
        this.isSelected = value;
    }
    update(value){
        this.element.innerText = value;
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
function newSelection(id){
    for(let i=0;i < gridCells.length; i++){
        if(i == id){
            gridCells[i].select(true);
            continue;
        }
        gridCells[i].select(false);
    }
}

function setValue(value){
    for(let cellIndex = 0; cellIndex < SUDOKU_CELL_NB; cellIndex++){
        if(gridCells[cellIndex].isSelected){
            if(grid.setValue(cellIndex,value)){
                gridCells[cellIndex].update(value);
            }
        }
    }
}

//  ==================================  UI  ==================================
const gridElement = document.querySelector("#grid1");
const grid = new SudokuGrid(SUDOKU_BASE);
const gridCells = [];
const cellIndex = 0;
for (let cellIndex = 0; cellIndex < grid.cells.length; cellIndex++) {
    const cellElement = document.querySelector(`#cell-${cellIndex}`);
    gridCells[cellIndex] = new Cell(cellElement);
    cellElement.addEventListener("click", () => {newSelection(cellIndex)});
}

const numButtons = [];
for (let i = 1; i <= grid.maxNum; i++) {
    numButtons[i] = document.querySelector(`.btn-${i}`);
    numButtons[i].addEventListener("click", () => {setValue(i)});
}
numButtons[0] = document.querySelector(`.btn-${0}`);
numButtons[0].addEventListener("click", () => {setValue(null)});
