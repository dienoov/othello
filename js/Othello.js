const BLACK = "black";
const WHITE = "white";
const STEP = "step";

const TOP = "top";
const TOP_RIGHT = "top-right";
const RIGHT = "right";
const BOTTOM_RIGHT = "bottom-right";
const BOTTOM = "bottom";
const BOTTOM_LEFT = "bottom-left";
const LEFT = "left";
const TOP_LEFT = "top-left";

class Othello {
    constructor({player, table, score, highScore}) {
        this.player = player;
        this.bot = player === BLACK ? WHITE : BLACK;
        this.turn = BLACK;

        this.score = score;
        this.highScore = highScore;

        this.highScore.innerText = localStorage.getItem("high-score") ?? 0;

        this.board = [
            [null, null, null, null, null, null, null, null,],
            [null, null, null, null, null, null, null, null,],
            [null, null, null, null, null, null, null, null,],
            [null, null, null, WHITE, BLACK, null, null, null,],
            [null, null, null, BLACK, WHITE, null, null, null,],
            [null, null, null, null, null, null, null, null,],
            [null, null, null, null, null, null, null, null,],
            [null, null, null, null, null, null, null, null,],
        ];

        this.table = table;

        this.flanked = [];

        this.step();
        this.stepOnClick();
    }

    draw() {
        this.table.innerHTML = '';
        this.board.forEach((row, r) => {
            const tr = this.table.insertRow(r);
            row.forEach((col, c) => {
                const td = tr.insertCell(c);

                if (col === null)
                    return;

                const pawn = document.createElement("div");
                pawn.classList.add(this.pawnClass(col));
                pawn.dataset.r = `${r}`;
                pawn.dataset.c = `${c}`;
                td.append(pawn);
            });
        });
        this.score.black.innerText = document.querySelectorAll("table .pawn-black").length;
        this.score.white.innerText = document.querySelectorAll("table .pawn-white").length;
    }

    pawnClass(color) {
        switch (color) {
            case BLACK:
                return "pawn-black";
            case WHITE:
                return "pawn-white";
            case STEP:
                return "pawn-step";
        }
    }

    step() {
        this.board.forEach((row, r) => {
            row.forEach((col, c) => {
                if (this.board[r][c] !== this.turn)
                    return;

                this.checkAllDir(r, c);
            });
        });

        this.draw();

        if (this.turn === this.bot)
            this.botTurn();
    }

    stepOnClick() {
        this.table.addEventListener("click", (ev) => {
            if (!ev.target.classList.contains(this.pawnClass(STEP)))
                return;

            const r = parseInt(ev.target.dataset.r);
            const c = parseInt(ev.target.dataset.c);

            this.checkAllDir(r, c, true);

            this.board.forEach((row, r) => {
                row.forEach((col, c) => {
                    if (col === STEP)
                        this.board[r][c] = null;
                });
            });

            this.turn = this.opponentPawn();
            this.step();

            if (document.querySelectorAll(".pawn-step").length === 0)
                this.gameOver();
        });
    }

    check(row, col, dir, flip = false, recursive = false) {
        let nextRow = row;
        let nextCol = col;

        if (dir === TOP || dir === TOP_RIGHT || dir === TOP_LEFT)
            nextRow += -1;

        if (dir === RIGHT || dir === TOP_RIGHT || dir === BOTTOM_RIGHT)
            nextCol += 1;

        if (dir === BOTTOM || dir === BOTTOM_RIGHT || dir === BOTTOM_LEFT)
            nextRow += 1;

        if (dir === LEFT || dir === TOP_LEFT || dir === BOTTOM_LEFT)
            nextCol += -1;

        if (flip && !recursive)
            this.flanked = [[row, col]];

        if (nextRow < 0 || nextRow > 7 || nextCol < 0 || nextCol > 7)
            return;

        const nextPawn = this.board[nextRow][nextCol];

        if (!flip && !recursive && nextPawn === null)
            return;

        if (!flip && nextPawn === this.turn)
            return;

        if (nextPawn === this.opponentPawn()) {
            this.flanked.push([nextRow, nextCol]);
            return this.check(nextRow, nextCol, dir, flip, true);
        }

        if (!flip && nextPawn === null)
            return this.board[nextRow][nextCol] = STEP;

        if (flip && nextPawn === this.turn) {
            this.flanked.forEach((item) => this.board[item[0]][item[1]] = this.turn);
            return this.flanked = [];
        }
    }

    checkAllDir(r, c, flip = false) {
        [TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT,]
            .forEach((dir) => this.check(r, c, dir, flip));
    }

    opponentPawn() {
        return this.turn === BLACK ? WHITE : BLACK;
    }

    botTurn() {
        const steps = document.querySelectorAll(".pawn-step");
        setTimeout(() => steps[Math.floor(steps.length * Math.random())].click(), 500);
    }

    gameOver() {
        const blackCount = document.querySelectorAll("table .pawn-black").length;
        const whiteCount = document.querySelectorAll("table .pawn-white").length;

        const localHighScore = parseInt(localStorage.getItem("high-score") ?? 0);
        const highScore = this.player === BLACK ? blackCount : whiteCount;

        highScore > localHighScore && localStorage.setItem("high-score", `${highScore}`);
        this.highScore.innerText = localStorage.getItem("high-score");

        if (blackCount === whiteCount)
            return alert("Draw");

        if (blackCount > whiteCount) {
            if (this.player === BLACK)
                return alert("You Win!");
            return alert("You Lose!");
        }

        if (blackCount < whiteCount) {
            if (this.player === BLACK)
                return alert("You Lose!");
            return alert("You Win!");
        }
    }
}