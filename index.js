const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

const PORT = 3000;

const sudokuGame = require("./src/models/sudokuGame");

async function getNewGames(qty = 1) {
    try {
        const response = await fetch(
            `https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:${qty}){grids{value,solution,difficulty}}}`
        );
        const data = await response.json();
        let games = [];
        for (const grid of data.newboard.grids) {
            games.push(parseApiGameData(grid));
        }
        return games;
    } catch (error) {
        console.log("Failed downloading new games");
        console.log(error);
        throw error;
    }
}

async function downloadAndSaveNewGames(qty = 1) {
    const newGames = await getNewGames(qty);
    let games = [];
    newGames.forEach(async (newGame) => {
        const game = new sudokuGame({
            value: newGame.value,
            solution: newGame.solution,
            difficulty: newGame.difficulty,
        });
        games.push(game.toObject());
        game.save();
    });
    return games;
}

async function getRandomGame(difficulty) {
    const difficulties = ["Easy", "Medium", "Hard"];
    if (difficulty == "undefined") {
        difficulty = difficulties[getRandomNum(difficulties.length - 1)];
    }
    if (!difficulties.includes(difficulty)) {
        console.log("no game found with difficulty:", difficulty);
        return;
    }
    const filter = { difficulty: difficulty };
    const ids = await sudokuGame.find(filter).select("_id");
    const rand = getRandomNum(ids.length - 1);
    let game = await getGameById(ids[rand]);
    return game;
}

function getRandomNum(max) {
    return Math.floor(Math.random() * (max + 1));
}

async function getGameById(id) {
    return await sudokuGame.findById(id);
}

function parseApiGameData(grid) {
    return {
        value: Array.prototype.concat(
            grid.value[0],
            grid.value[1],
            grid.value[2],
            grid.value[3],
            grid.value[4],
            grid.value[5],
            grid.value[6],
            grid.value[7],
            grid.value[8]
        ),
        solution: Array.prototype.concat(
            grid.solution[0],
            grid.solution[1],
            grid.solution[2],
            grid.solution[3],
            grid.solution[4],
            grid.solution[5],
            grid.solution[6],
            grid.solution[7],
            grid.solution[8]
        ),
        difficulty: grid.difficulty,
    };
}

async function saveGame(game) {
    await new sudokuGame(game).save();
}

mongoose
    .connect("mongodb://localhost:27017/Sudoku")
    .then(() => {
        console.log("Connected to database");
    })
    .catch((e) => {
        console.log("Database connection error:", e);
    });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "/public")));

app.get("/", function (req, res) {
    res.render("main.ejs");
});
app.get("/play", function (req, res) {
    res.render("play.ejs");
});

app.get("/api/newgame", async (req, res) => {
    console.log("GET new game");
    try {
        ({ difficulty, id } = req.query);
        let newGame;
        if (id != "undefined") {
            newGame = await getGameById(id);
        } else {
            newGame = await getRandomGame(difficulty);
        }
        const data = {
            id: newGame._id,
            cells: newGame.value,
            difficulty: newGame.difficulty,
        };
        res.json(data);
    } catch (error) {
        console.log("Failed to get new game...");
        console.log(error);
    }
});

app.listen(PORT);
mongoose.listen;
