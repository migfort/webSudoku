module.exports = { SudokuGrid, getHint };

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
    constructor(cells) {
        this.cells = cells;
    }

    isValid() {
        for (let i = 0; i < this.cells.length; i++) {
            const cellIsValid = cellIsValid(i);
            if (cellIsValid) {
                continue;
            }
        }

        return true;
    }

    cellIsValid(id, value = this.cells[id]) {
        const result = checkGroup(getAllInteractingCells(cellId), value);
        if (result === true) return true;
        console.log("Cell", id, "is not valid with value", value);
        return false;
    }

    checkGroup(otherIds = [], newValue) {
        for (let i = 0; i < otherIds.length; i++) {
            if (this.cells[otherIds[i]].value === newValue) {
                return otherIds[i];
            }
        }
        return true;
    }
    getAllInteractingCells(cellId) {
        const col = this.getColumnCells(cellId);
        const row = this.getLineCells(cellId);
        const block = this.getBlockCells(cellId);

        return Array.prototype.concat(col, row, block).unique();
    }
    getColumnCells(cellId) {
        return this.getIdsInGroup(
            SudokuGrid.getColumn(cellId),
            (num, index) => this.columnSelector(num, index),
            cellId
        );
    }
    getLineCells(cellId) {
        return this.getIdsInGroup(
            SudokuGrid.getRow(cellId),
            (num, index) => this.rowSelector(num, index),
            cellId
        );
    }
    getBlockCells(cellId) {
        return this.getIdsInGroup(
            SudokuGrid.getBlock(cellId),
            (num, index) => this.blockSelector(num, index),
            cellId
        );
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

function getHint(gridCells) {}
