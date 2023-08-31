(function () {
    module.exports.getNewGame = async function getNewGame() {
        const responce = await fetch(
            "https://sudoku-api.vercel.app/api/dosuku"
        );
        const game = await responce.json();
    };
});
