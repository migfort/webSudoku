Array.prototype.unique = function () {
    var a = this.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j]) a.splice(j--, 1);
        }
    }

    return a;
};

class SudokuGrid {
    constructor(base) {
        this.base = base;
        this.maxNum = Math.pow(this.base, 2);
        this.cells = [];
        this.init();
    }
    init() {
        for (let i = 0; i < Math.pow(this.maxNum, 2); i++) {
            this.cells[i] = new SudokuCell();
        }
    }
    startNewGame(cellsValues) {
        this.init();
        for (let i = 0; i < cellsValues.length; i++) {
            if (typeof cellsValues[i] !== "number") {
                return;
            }
            if (cellsValues[i] === 0) {
                this.cells[i].init(null, false);
                continue;
            }
            this.cells[i].init(cellsValues[i], true);
        }
    }
    setValue(cellId, value) {
        const check = this.checkGroup(
            this.getAllInteractingCells(cellId),
            value
        );
        if (check !== true) {
            console.error(
                "Can not set value",
                value,
                "for cell",
                cellId,
                "because of cell",
                check
            );
            return false;
        }
        return this.cells[cellId].setValue(value);
    }
    //Check in group of cell if any other have the value. returns cell id of confilting cell or true if ok.
    checkGroup(otherIds = [], newValue) {
        for (let i = 0; i < otherIds.length; i++) {
            if (this.cells[otherIds[i]].value === newValue) {
                return otherIds[i];
            }
        }
        return true;
    }
    getAllInteractingCells(cellId) {
        const col = this.getIdsInGroup(
            SudokuGrid.getColumn(cellId),
            (num, index) => this.columnSelector(num, index),
            cellId
        );
        const row = this.getIdsInGroup(
            SudokuGrid.getRow(cellId),
            (num, index) => this.rowSelector(num, index),
            cellId
        );
        const block = this.getIdsInGroup(
            SudokuGrid.getBlock(cellId),
            (num, index) => this.blockSelector(num, index),
            cellId
        );
        console.log(SudokuGrid.getBlock(cellId), block);
        return Array.prototype.concat(col, row, block).unique();
    }
    getIdsInGroup(num, groupSelectFunc, idToIgnore) {
        const ids = [];
        let index = 0;
        for (let i = 0; i < this.maxNum; i++) {
            const cellId = groupSelectFunc(num, i);
            if (!this.cells[cellId].value || cellId === idToIgnore) {
                continue;
            }
            ids[index++] = cellId;
        }
        return ids;
    }
    columnSelector(num, index) {
        return num + index * this.maxNum;
    }
    rowSelector(num, index) {
        return num * this.maxNum + index;
    }
    blockSelector(num, index) {
        return (
            Math.floor(index / this.base) * this.maxNum +
            Math.floor(num / this.base) * (this.base * this.maxNum) +
            (index % this.base) +
            (num % this.base) * this.base
        );
    }
    getValidValues(cellId) {}
    static parseNewGame(data) {
        const newValues = [];
        for (let i = 0; i < this.maxNum; i++) {
            newValues[i] = data[i].value;
        }
        return newValues;
    }
    static getColumn(id) {
        if (typeof id !== "number" || id < 0) {
            return null;
        }
        return Math.max(
            0,
            Math.min(SudokuGrid.maxNum, Math.floor(id % SudokuGrid.maxNum))
        );
    }
    static getRow(id) {
        if (typeof id !== "number" || id < 0) {
            return null;
        }
        return Math.max(
            0,
            Math.min(SudokuGrid.maxNum, Math.floor(id / SudokuGrid.maxNum))
        );
    }
    static getBlock(id) {
        if (typeof id !== "number" || id < 0) {
            return null;
        }
        return (
            Math.floor((id % SudokuGrid.maxNum) / SudokuGrid.base) +
            Math.floor(id / (SudokuGrid.maxNum * SudokuGrid.base)) *
                SudokuGrid.base
        );
    }
    static base = 3;
    static maxNum = Math.pow(this.base, 2);
    static cellCnt = Math.pow(this.maxNum, 2);
}

class SudokuCell {
    constructor(value, isClue, valueChanged = () => {}) {
        this.value = value;
        this.valueChanged = valueChanged;
        this.init(value, isClue);
    }

    setValue(value) {
        if (this.isClue) {
            console.error("Cannot change the value of a clue cell.");
            return false;
        }

        if (value === null || (value >= 1 && value <= 9)) {
            this.value = value;
            this.valueChanged(this.value);
            return true;
        } else {
            console.error(
                "Invalid cell value. Please enter a number between 1 and 9."
            );
            return false;
        }
    }

    init(value = null, isClue = false) {
        this.value = value;
        this.isClue = isClue;
        this.valueChanged(this.value);
    }
}
