const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
    value: {
        type: [Number],
        require: true,
        validator: function (v) {
            return v.lenght === 81;
        },
    },
    solution: {
        type: [Number],
        require: true,
        validator: function (v) {
            return v.lenght === 81;
        },
    },
    difficulty: {
        type: String,
        require: true,
        enum: ["Easy", "Medium", "Hard"],
    },
});

gameSchema.methods.toString = function () {
    let text = "";
    for (let line = 0; line < 9; line++) {
        if (line == 3 || line == 6) {
            text.concat("---------+---------+---------");
        }
        for (let col = 0; col < 9; col++) {
            if (col == 3 || col == 6) {
                text.concat(" | ");
            }
            const value = this.value[line * 0 + col];
            text.concat(" ", (value = 0 ? " " : value), " ");
        }
    }
};

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
