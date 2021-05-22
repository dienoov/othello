const start = (player) => {
    const table = document.querySelector("table");
    const modal = document.querySelector(".modal");
    const score = {
        black: document.querySelector(".left span"),
        white: document.querySelector(".right span"),
    };
    const highScore = document.querySelector(".high-score span");

    modal.style.display = "none";

    new Othello({
        player,
        table,
        score,
        highScore,
    });
};