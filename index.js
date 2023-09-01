const express = require("express");
const app = express();
const path = require("path");
const PORT = 3000;

async function getNewGame() {
    const responce = await fetch("https://sudoku-api.vercel.app/api/dosuku");
    let data = await responce.json();
    const game = parseGameData(data);
    return game;
}

function parseGameData(data) {
    return {
        cells: Array.prototype.concat(
            data.newboard.grids[0].value[0],
            data.newboard.grids[0].value[1],
            data.newboard.grids[0].value[2],
            data.newboard.grids[0].value[3],
            data.newboard.grids[0].value[4],
            data.newboard.grids[0].value[5],
            data.newboard.grids[0].value[6],
            data.newboard.grids[0].value[7],
            data.newboard.grids[0].value[8]
        ),
        difficulty: data.newboard.grids[0].difficulty,
    };
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "/public")));

app.get("/", function (req, res) {
    res.render("main.ejs");
});

app.get("/api/newgame", function (req, res) {
    getNewGame().then((newGame) => {
        res.json(({ cells, difficulty } = newGame));
    });
});

app.listen(PORT);
