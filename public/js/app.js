const findGameByIdForm = document.querySelector("#findByIdForm");
const idInput = document.querySelector("#IdInput");

findGameByIdForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await getGameById(idInput.value);
});

async function getGameById(id) {
    url = new URL(location);
    console.log(`${url.origin}/play?id=${id}`);
    location.href = `${url.origin}/play?id=${id}`;
}
