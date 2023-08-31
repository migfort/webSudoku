const express = require("express");
const app = express();
const path = require("path");
const api = require(path.join(__dirname, "/src/sudoku/sudokuApi.js"));
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "/public")));

app.get("/", function (req, res) {
    res.render("main.ejs");
});

app.get("/api/newgame", function (req, res) {
    //const data = require(path.join(__dirname, "/games/default.json"));
    api.getNewGame().then((newGame) => {
        res.json(newGame);
    });
});

app.listen(PORT);
