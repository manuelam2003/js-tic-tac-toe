"use strict";

const Player = (sign, name) => {
    this.sign = sign;
    this.name = name;

    const getSign = () => {
        return sign;
    };

    const getName = () => {
        return name;
    }

    const setName = (newName) => {
        this.name = newName;
    }

    return { getSign, getName, setName };
};

const gameBoard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];

    const setField = (index, sign) => {
        if (index > board.length) return;
        board[index] = sign;
    };

    const getField = (index) => {
        if (index > board.length) return;
        return board[index];
    };

    const reset = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    };

    return { setField, getField, reset };
})();

const displayController = (() => {
    const fieldElements = document.querySelectorAll(".field");
    const messageElement = document.getElementById("message");
    const restartButton = document.getElementById("restart-button");
    const player1Text = document.getElementById("player1");
    const player2Text = document.getElementById("player2");

    fieldElements.forEach((field) =>
        field.addEventListener("click", (e) => {
            if (gameController.getIsOver() || e.target.textContent !== "") return;
            gameController.playRound(parseInt(e.target.dataset.index));
            updateGameboard();
        })
    );

    restartButton.addEventListener("click", (e) => {
        gameBoard.reset();
        gameController.reset();
        updateGameboard();
        setMessageElement("Player X's turn");
    });

    player1Text.addEventListener("change", (e)=>{
        console.log(player1Text.value);
    });

    
    player2Text.addEventListener("change", (e)=>{
        console.log(player2Text.value);
    });

    const updateGameboard = () => {
        for (let i = 0; i < fieldElements.length; i++) {
            fieldElements[i].textContent = gameBoard.getField(i);
        }
    };

    const setResultMessage = (winner) => {
        if (winner === "Draw") {
            setMessageElement("It's a draw!");
        } else {
            setMessageElement(`${winner} has won!`);
        }
    };

    const setMessageElement = (message) => {
        messageElement.textContent = message;
    };

    const getPlayerNames = () => {
        return [player1Text.textContent,player2Text.textContent];
    };

    return { setResultMessage, setMessageElement,getPlayerNames};
})();

const gameController = (() => {
    const playerX = Player("X",displayController.getPlayerNames()[0]);
    const playerO = Player("O", displayController.getPlayerNames()[1]);
    let round = 1;
    let isOver = false;

    const playRound = (fieldIndex) => {
        gameBoard.setField(fieldIndex, getCurrentPlayerSign());
        if (checkWinner(fieldIndex)) {
            displayController.setResultMessage(getCurrentPlayerSign());
            isOver = true;
            return;
        }

        if (round === 9) {
            displayController.setResultMessage("Draw");
            isOver = true;
            return;
        }
        round++;
        displayController.setMessageElement(`Player ${getCurrentPlayerSign()}'s turn`);
    };

    const getCurrentPlayerSign = () => {
        return round % 2 === 1 ? playerX.getSign() : playerO.getSign();
    };

    const checkWinner = (fieldIndex) => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        return winConditions
            .filter((combination) => combination.includes(fieldIndex))
            .some((possibleCombination) =>
                possibleCombination.every(
                    (index) => gameBoard.getField(index) === getCurrentPlayerSign()
                )
            );
    };

    const getIsOver = () => {
        return isOver;
    };

    const reset = () => {
        round = 1;
        isOver = false;
    };

    return { playRound, getIsOver, reset };
})();