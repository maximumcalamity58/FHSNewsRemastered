document.addEventListener('DOMContentLoaded', () => {
    // Initialization
    const themeButtons = document.querySelectorAll('.theme-button');
    initializeThemes(themeButtons);
    incrementDailyVisits(); // Increment the visit count if it's a new day
    updateVisitCounterDisplay(); // Update the display on page load
    checkConsecutiveVisits(); // Check and update consecutive visits for the dark theme
    updateConsecutiveVisitCounterDisplay(); // Update the display on page load
    initialize2048();
    // initializeMinesweeper();

    // Event Listeners
    attachEventListenersToThemeButtons(themeButtons);
    attachEventListenerToModal();
    // Setup event listener for each Check Answer button
    setupPuzzleAnswerCheckers();

    // Event listener for the "Check Answer" button for the purple theme
    document.getElementById('check-answer-purple').addEventListener('click', () => {
        checkVisitsAndUnlockTheme('purple');
    });

    // Event listener for the "Check Answer" button for the dark theme
    document.getElementById('check-answer-dark').addEventListener('click', () => {
        checkConsecutiveVisitsAndUnlockTheme('dark');
    });

    // Event listener for the "Check Answer" button for the dark theme
    document.getElementById('check-answer-snow').addEventListener('click', () => {
        checkSnowThemeUnlock('snow');
    });

    // Event listener to submit on pressing the "Enter" key
    document.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            // Check which puzzle is currently open
            const openedPuzzle = document.querySelector('.puzzle[style="display: block;"]');
            if (openedPuzzle && openedPuzzle.getAttribute('data-theme') === 'blue') {
                checkAnswer('blue');
            }
            if (openedPuzzle && openedPuzzle.getAttribute('data-theme') === 'purple') {
                checkVisitsAndUnlockTheme('purple');
            }
            if (openedPuzzle && openedPuzzle.getAttribute('data-theme') === 'dark') {
                checkConsecutiveVisitsAndUnlockTheme('dark');
            }
            if (openedPuzzle && openedPuzzle.getAttribute('data-theme') === 'snow') {
                checkSnowThemeUnlock();
            }
            if (openedPuzzle && openedPuzzle.getAttribute('data-theme') === 'forest') {
                checkAnswer('forest');
            }
            if (openedPuzzle && openedPuzzle.getAttribute('data-theme') === 'ocean') {
                if (document.getElementById('part-1-ocean').style.display !== 'none') {
                    checkAnswer('ocean')
                } else if (document.getElementById('part-2-ocean').style.display !== 'none') {
                    checkAnswer('ocean', 1)
                }
            }
            if (openedPuzzle && openedPuzzle.getAttribute('data-theme') === 'library') {
                checkAnswer('library');
            }
            if (openedPuzzle && openedPuzzle.getAttribute('data-theme') === 'hartley') {
                checkAnswer('hartley');
            }
            if (openedPuzzle && openedPuzzle.getAttribute('data-theme') === 'vaporwave') {
                checkAnswer('vaporwave');
            }
            if (openedPuzzle && openedPuzzle.getAttribute('data-theme') === 'mountain') {
                if (document.getElementById('part-1-mountain').style.display !== 'none') {
                    checkAnswer('mountain')
                } else if (document.getElementById('part-2-mountain').style.display !== 'none') {
                    checkAnswer('mountain', 1)
                } else if (document.getElementById('part-3-mountain').style.display !== 'none') {
                    checkAnswer('mountain', 2)
                }
            }
        }
    });
});

function initializeThemes(themeButtons) {
    const savedTheme = localStorage.getItem('selectedTheme') || 'default';
    localStorage.setItem('themeUnlocked-default', true); // Ensure default theme is always unlocked

    themeButtons.forEach(button => {
        const theme = button.getAttribute('data-theme');
        if (localStorage.getItem(`themeUnlocked-${theme}`)) {
            button.classList.add('unlocked');
        } else {
            button.classList.add('locked-theme');
        }
    });

    switchTheme(savedTheme); // Switch to the saved theme
    setActiveButton(savedTheme); // Set the active button
}

function setupPuzzleAnswerCheckers() {
    document.querySelectorAll('.puzzle-answer-button').forEach(button => {
        button.addEventListener('click', function() {
            const theme = button.getAttribute('data-theme');
            const part = button.getAttribute('data-part');
            const partIndex = part ? parseInt(part, 10) - 1 : 0; // Default to 0 if no part is provided
            checkAnswer(theme, partIndex);
        });
    });
}

// Object to hold the correct answers for each theme and part
const themeAnswers = {
    blue: {
        parts: ['brightness'] // Only one part for the blue theme
    },
    forest: {
        parts: ['tree'] // Only one part for the forest theme
    },
    ocean: {
        parts: ['waved', 'tuvalu'] // Two parts for the ocean theme
    },
    vaporwave: {
        parts: ['a bird in the hand is messy']
    },
    library: {
        parts: ['8']
    },
    mountain: {
        parts: ['china', 'sweden', 'spain']
    },
    hartley: {
        parts: ['bitcoin']
    }
};

function getCorrectAnswerForThemePart(theme, partIndex) {
    // Retrieve the correct answer for a theme's specific part
    // The partIndex is expected to start from 0 for the first part
    const themeInfo = themeAnswers[theme];
    if (themeInfo && themeInfo.parts[partIndex] !== undefined) {
        return themeInfo.parts[partIndex];
    } else {
        console.error('No answer found for the specified theme and part index.' + theme + partIndex);
        return null; // No answer found for this theme and part
    }
}
function attachEventListenersToThemeButtons(themeButtons) {
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.getAttribute('data-theme');
            if (button.classList.contains('locked-theme')) {
                openPuzzle(theme);
            } else {
                switchTheme(theme);
                setActiveButton(theme);
            }
        });
    });

    document.getElementById('reset-themes-button').addEventListener('click', resetUnlockedThemes);
}

function switchTheme(themeName) {
    const themeLink = document.getElementById('theme-style');
    const newThemePath = `${window.staticURL}themes/${themeName}.css`;

    // theme name
    if (themeLink.getAttribute('href') !== newThemePath) {
        themeLink.setAttribute('href', newThemePath);
    }
    localStorage.setItem('selectedTheme', themeName);
}

function setActiveButton(activeTheme) {
    const themeButtons = document.querySelectorAll('.theme-button');
    themeButtons.forEach(button => {
        if (button.getAttribute('data-theme') === activeTheme) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function openPuzzle(theme) {
    const puzzles = document.querySelectorAll('.puzzle');
    puzzles.forEach(puzzle => puzzle.style.display = 'none'); // Hide all puzzles

    const modal = document.getElementById('puzzleModal');
    const puzzle = document.querySelector(`.puzzle[data-theme="${theme}"]`);
    if (puzzle) {
        puzzle.style.display = 'block'; // Show the right puzzle
    }
    document.body.classList.add('modal-open'); // Prevent scrolling on the background
    modal.style.display = 'block';
}

function closePuzzle() {
    document.body.classList.remove('modal-open'); // Prevent scrolling on the background
    document.getElementById('puzzleModal').style.display = 'none';
}

function checkAnswer(theme, partIndex = 0) {
    // Determine if the puzzle is a single-part or multi-part puzzle
    const isMultiPartPuzzle = themeAnswers[theme] && themeAnswers[theme].parts.length > 1;
    const answerBoxId = isMultiPartPuzzle ? `answer-${theme}-part-${partIndex + 1}` : `answer-${theme}`;
    const feedbackElementId = isMultiPartPuzzle ? `feedback-message-${theme}-part-${partIndex + 1}` : `feedback-message-${theme}`;

    const answerBox = document.getElementById(answerBoxId);
    if (!answerBox) {
        console.error(`No input box found for ID: ${answerBoxId}`);
        return;
    }

    const userAnswer = answerBox.value.trim().toLowerCase();
    const feedbackElement = document.getElementById(feedbackElementId);

    if (feedbackElement) feedbackElement.textContent = '';

    const correctAnswer = getCorrectAnswerForThemePart(theme, partIndex);

    if (userAnswer === correctAnswer) {
        if (themeAnswers[theme].parts.length > partIndex + 1) {
            // If there's a next part, show it
            const currentPartId = `part-${partIndex + 1}-${theme}`;
            const nextPartId = `part-${partIndex + 2}-${theme}`;
            document.getElementById(currentPartId).style.display = 'none';
            document.getElementById(nextPartId).style.display = 'block';
        } else {
            // Last part answered correctly, or it's a single-part puzzle, unlock the theme
            unlockTheme(theme);
            runConfetti();

            if (currentPartId > 0) {
                const currentPartId = `part-${partIndex + 1}-${theme}`;
                const startingPartId = `part-1-${theme}`;
                document.getElementById(currentPartId).style.display = 'none';
                document.getElementById(startingPartId).style.display = 'block';
            }
        }
    } else {
        // Shake the modal and clear the input
        const modalContent = document.querySelector('.modal-content');
        modalContent.classList.add('shakeThemes');
        setTimeout(() => modalContent.classList.remove('shakeThemes'), 500); // Remove class after animation

        if (feedbackElement) feedbackElement.textContent = 'Incorrect answer. Try again.';
    }
}

function runConfetti() {
    // Make sure the confetti script is loaded before calling this function
    if (typeof confetti === "function") {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    } else {
        console.error('Confetti function is not defined. Ensure confetti library is loaded.');
    }
}

function incrementDailyVisits() {
    const visitKey = 'dailyVisits';
    const lastVisitDateKey = 'lastVisitDate';
    const currentDate = new Date().toDateString();

    // Retrieve the last visit date and daily visits count from localStorage
    const lastVisitDate = localStorage.getItem(lastVisitDateKey);
    let dailyVisits = parseInt(localStorage.getItem(visitKey), 10) || 0;

    // Check if today's date is different from the last visit date
    if (currentDate !== lastVisitDate) {
        localStorage.setItem(lastVisitDateKey, currentDate); // Update the last visit date
        localStorage.setItem(visitKey, dailyVisits + 1); // Increment the daily visits count
    }
}

function updateVisitCounterDisplay() {
    const visitKey = 'dailyVisits';
    let dailyVisits = parseInt(localStorage.getItem(visitKey), 10) || 0;
    const visitCounterElement = document.getElementById('visit-counter-purple');

    // Update the visit counter display
    if (visitCounterElement) {
        visitCounterElement.textContent = `${dailyVisits}/5`;
    }
}

function checkVisitsAndUnlockTheme(theme) {
    const visitKey = 'dailyVisits';
    const themeUnlockedKey = `themeUnlocked-${theme}`;
    let dailyVisits = parseInt(localStorage.getItem(visitKey), 10) || 0;
    const feedbackElement = document.getElementById(`feedback-message-${theme}`); // Ensure you have a unique feedback element for each theme

    // If the user has visited the site on 5 different days
    if (dailyVisits >= 5) {
        localStorage.setItem(themeUnlockedKey, 'true'); // Unlock the theme
        unlockTheme(theme); // Update the UI to reflect the unlocked theme
        runConfetti();
    } else {
        // Shake the modal and clear the input
        const modalContent = document.querySelector('.modal-content');
        modalContent.classList.add('shakeThemes');
        setTimeout(() => modalContent.classList.remove('shakeThemes'), 500); // Remove class after animation

        // Clear the input box and show feedback
        if (feedbackElement) feedbackElement.textContent = 'Not enough total visits.';
    }
}

function checkSnowThemeUnlock() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // Note: January is 0, December is 11
    const feedbackElement = document.getElementById('feedback-message-snow'); // Get the feedback element for snow theme

    // Check if the current month is December
    if (currentMonth === 11) { // 11 represents December
        unlockTheme('snow'); // Unlock the snow theme
        runConfetti(); // Run the confetti effect
    } else {
        const modalContent = document.querySelector('.modal-content'); // Assuming this is the modal you want to shake
        modalContent.classList.add('shakeThemes'); // Add shake class to the modal content
        setTimeout(() => modalContent.classList.remove('shakeThemes'), 500); // Remove shake class after 500ms

        if (feedbackElement) feedbackElement.textContent = 'The Snow theme can only be unlocked in December.';
    }
}

function getYesterdayDateString() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toDateString();
}

function checkConsecutiveVisits() {
    const visitKey = 'consecutiveVisits';
    const lastVisitDateKey = 'lastVisitDateDark';
    const currentDate = new Date().toDateString();

    // Retrieve the last visit date and consecutive visits count from localStorage
    const lastVisitDate = localStorage.getItem(lastVisitDateKey);
    let consecutiveVisits = parseInt(localStorage.getItem(visitKey), 10) || 0;

    if (currentDate === lastVisitDate) {
        // If the user has already visited today, do nothing
        return;
    }

    if (getYesterdayDateString() === lastVisitDate) {
        // If the user visited yesterday, increment the consecutive visits count
        consecutiveVisits++;
    } else {
        // If not, reset the consecutive visits count
        consecutiveVisits = 1;
    }

    // Save the current date and the updated consecutive visits count
    localStorage.setItem(lastVisitDateKey, currentDate);
    localStorage.setItem(visitKey, consecutiveVisits);
}

function updateConsecutiveVisitCounterDisplay() {
    const visitKey = 'consecutiveVisits';
    const consecutiveVisits = parseInt(localStorage.getItem(visitKey), 10) || 1;
    const visitCounterElement = document.getElementById('consecutive-visit-counter-dark');

    // Update the visit counter display
    if (visitCounterElement) {
        visitCounterElement.textContent = `Consecutive visits: ${consecutiveVisits}/2`;
    }
}

function checkConsecutiveVisitsAndUnlockTheme(theme) {
    const visitKey = 'consecutiveVisits';
    const themeUnlockedKey = `themeUnlocked-${theme}`;
    let consecutiveVisits = parseInt(localStorage.getItem(visitKey), 10) || 0;
    const feedbackElement = document.getElementById(`feedback-message-${theme}`); // Ensure you have a unique feedback element for each theme

    // If the user has visited the site on 2 consecutive days
    if (consecutiveVisits >= 2) {
        localStorage.setItem(themeUnlockedKey, 'true'); // Unlock the theme
        unlockTheme(theme); // Update the UI to reflect the unlocked theme
        runConfetti(); // Run the confetti effect
    } else {
        // Shake the modal and clear the input
        const modalContent = document.querySelector('.modal-content');
        modalContent.classList.add('shakeThemes');
        // Provide feedback
        if (feedbackElement) feedbackElement.textContent = 'Not enough days visited consecutively.';

        // Remove the shake class after the animation completes
        setTimeout(() => {
            modalContent.classList.remove('shakeThemes');
        }, 500);
    }
}

function unlockTheme(theme) {
    localStorage.setItem(`themeUnlocked-${theme}`, true);
    document.querySelector(`.theme-button[data-theme="${theme}"]`).classList.remove('locked-theme');
    closePuzzle();
    switchTheme(theme); // Switch to the newly unlocked theme
    setActiveButton(theme); // Set the newly unlocked theme button as active
}

function resetUnlockedThemes() {
    const themeButtons = document.querySelectorAll('.theme-button:not([data-theme="default"])');
    themeButtons.forEach(button => {
        const theme = button.getAttribute('data-theme');
        localStorage.removeItem(`themeUnlocked-${theme}`);
        button.classList.add('locked-theme');
        button.classList.remove('unlocked');
    });
    switchTheme('default'); // Reset to default theme
    setActiveButton('default'); // Set default theme button as active
}

function attachEventListenerToModal() {
    window.onclick = function(event) {
        if (event.target === document.getElementById('puzzleModal')) {
            closePuzzle();
        }
    };

    const closeButton = document.getElementById('puzzleModal').querySelector('.close');
    closeButton.addEventListener('click', closePuzzle);
}

// Define the game variable in a higher scope
var game;

function checkSpaceThemeUnlock() {
    const feedbackElement = document.getElementById('feedback-message-space'); // Get the feedback element for snow theme

    if (game.in_checkmate() && game.turn() === 'b') {
        localStorage.setItem('space', 'true'); // Unlock the theme
        unlockTheme('space'); // Update the UI to reflect the unlocked theme
        runConfetti(); // Run the confetti effect
    } else {
        const modalContent = document.querySelector('.modal-content'); // Assuming this is the modal you want to shake
        modalContent.classList.add('shakeThemes'); // Add shake class to the modal content
        setTimeout(() => modalContent.classList.remove('shakeThemes'), 500); // Remove shake class after 500ms

        if (feedbackElement) feedbackElement.textContent = 'You must checkmate your opponent to unlock this theme.';

    }
}

$(document).ready(function() {

    game = new Chess();
    var board= new Chess();

    function onSquareClick(square) {
        // If user clicked a square with a piece, we set it as the source
        if (game.get(square) && !sourceSquare) {
            sourceSquare = square;
            return;
        }

        // If the user clicked a destination square, we try to make the move
        if (sourceSquare) {
            var move = game.move({
                from: sourceSquare,
                to: square,
                promotion: 'q' // Always promote to a queen for simplicity
            });

            // If the move is illegal, reset the source square
            if (move === null) {
                sourceSquare = undefined;
                return;
            }

            // If the move is legal, update the board and reset the source square
            board.position(game.fen());
            sourceSquare = undefined;

            // Make the best move for black
            window.setTimeout(makeBestMove, 250);
        }
    }

    board = Chessboard('chessboard', config);

    // Initialize an empty variable to store the source square
    var sourceSquare;


    function onDragStart(source, piece) {
        // Do not pick up pieces if the game is over or if it's not that side's turn
        if (game.game_over() || (game.turn() === 'b' && piece.search(/^w/) !== -1) ||
            (game.turn() === 'w' && piece.search(/^b/) !== -1)) {
            return false;
        }
    }

    function evaluateBoard(game) {
        var totalEvaluation = 0;

        game.SQUARES.forEach(function(square) {
            var piece = game.get(square);
            totalEvaluation += getPieceValue(piece);
        });

        return totalEvaluation;
    }

    function getPieceValue(piece) {
        if (piece === null) {
            return 0;
        }

        var getAbsoluteValue = function (piece) {
            if (piece.type === 'p') {
                return 10;
            } else if (piece.type === 'r') {
                return 50;
            } else if (piece.type === 'n') {
                return 30;
            } else if (piece.type === 'b') {
                return 30;
            } else if (piece.type === 'q') {
                return 90;
            } else if (piece.type === 'k') {
                return 2000;
            }
            throw "Unknown piece type: " + piece.type;
        };

        var absoluteValue = getAbsoluteValue(piece);
        return piece.color === 'w' ? absoluteValue : -absoluteValue;
    }


    function minimax(game, depth, alpha, beta, isMaximisingPlayer) {
        if (depth === 0) {
            return -evaluateBoard(game);
        }

        var newGameMoves = game.moves();

        if (isMaximisingPlayer) {
            let bestMove = -9999;
            for (var i = 0; i < newGameMoves.length; i++) {
                game.move(newGameMoves[i]);
                bestMove = Math.max(bestMove, minimax(game, depth - 1, alpha, beta, !isMaximisingPlayer));
                game.undo();
                alpha = Math.max(alpha, bestMove);
                if (beta <= alpha) {
                    return bestMove;
                }
            }
            return bestMove;
        } else {
            let bestMove = 9999;
            for (var i = 0; i < newGameMoves.length; i++) {
                game.move(newGameMoves[i]);
                bestMove = Math.min(bestMove, minimax(game, depth - 1, alpha, beta, !isMaximisingPlayer));
                game.undo();
                beta = Math.min(beta, bestMove);
                if (beta <= alpha) {
                    return bestMove;
                }
            }
            return bestMove;
        }
    }

    function makeBestMove() {
        var bestMove = getBestMove(game);
        game.move(bestMove);
        board.position(game.fen());
        updateStatus();
    }

    function getBestMove(game) {
        let newGameMoves = game.moves();
        let bestMove = null;
        let bestValue = -9999;

        newGameMoves.forEach(function(move) {
            game.move(move);
            let boardValue = minimax(game, 1, -10000, 10000, false);
            game.undo();
            if (boardValue > bestValue) {
                bestValue = boardValue;
                bestMove = move;
            }
        });

        return bestMove;
    }

    function onDrop(source, target) {
        // Attempt to move
        let move = game.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: Always promote to a queen for simplicity
        });

        // Illegal move
        if (move === null) return 'snapback';

        // Make the best move for black
        window.setTimeout(makeBestMove, 250);
    }

    function onSnapEnd() {
        board.position(game.fen());
    }

    function updateStatus() {
        if (game.in_checkmate()) {
            // The player is in checkmate
            if (game.turn() === 'b') {
                checkSpaceThemeUnlock();
            }
        } else if (game.in_draw()) {
            // The game is a draw
        }
    }

    var config = {
        draggable: true,
        position: 'start',
        pieceTheme: `${window.staticURL}img/chesspieces/wikipedia/{piece}.png`,
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd,
        onSquareClick: onSquareClick
    };

    board = Chessboard('chessboard', config);

    document.getElementById('startBtn').addEventListener('click', function () {
        game.reset();
        board.start();
    });
});

function initialize2048() {
    const container = document.getElementById('game2048-container-magma');
    let board = generateEmptyBoard();
    let tileCounter = 1; // Unique ID for each tile
    let tileSize = 90;
    let tileGap = 10;

    function generateEmptyBoard() {
        let newBoard = [];
        for (let i = 0; i < 4; i++) {
            newBoard.push([0, 0, 0, 0]);
        }
        return newBoard;
    }

    function addRandomTile() {
        let availableSpaces = [];
        board.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                if (cell === 0) availableSpaces.push({ rowIndex, cellIndex });
            });
        });

        if (availableSpaces.length > 0) {
            let randomSpace = availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
            let newTile = {
                id: tileCounter++,
                value: Math.random() < 0.9 ? 2 : 4,
                x: randomSpace.cellIndex,
                y: randomSpace.rowIndex,
                mergedFrom: null
            };
            board[randomSpace.rowIndex][randomSpace.cellIndex] = newTile.value;
            document.querySelector(`#cell-${randomSpace.rowIndex}-${randomSpace.cellIndex}`).appendChild(createTileElement(newTile));
        }
    }

    function createTileElement(tile) {
        let tileElement = document.createElement('div');
        tileElement.classList.add('game-tile');
        tileElement.setAttribute('id', `tile-${tile.id}`);
        tileElement.textContent = tile.value;
        tileElement.style.top = `${tile.y * 100}px`;
        tileElement.style.left = `${tile.x * 100}px`;
        return tileElement;
    }

    function setupEventListeners() {
        document.addEventListener('keydown', handleKeyPress);
    }

    function handleKeyPress(e) {
        let boardChanged = false;
        let originalBoard = JSON.parse(JSON.stringify(board)); // Deep copy of the board for comparison

        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                board = transposeBoard(board); // Transpose for vertical movements
            }

            board.forEach((row, index) => {
                let originalRow = [...row]; // Copy the original row/column for comparison

                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    board[index] = moveTilesLeft(row);
                } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    board[index] = moveTilesRight(row);
                }

                if (!originalRow.every((val, idx) => val === board[index][idx])) {
                    boardChanged = true; // The row/column changed
                }
            });

            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                board = transposeBoard(board); // Transpose back after vertical movements
            }

            if (boardChanged) {
                addRandomTile(board);
                drawBoard();
                if (checkWinCondition()) {
                    unlockTheme('magma')
                }
            }
        }
    }

    function moveTilesLeft(row) {
        let newRow = row.filter(val => val !== 0); // Remove zeros
        for (let i = 0; i < newRow.length - 1; i++) { // Combine tiles
            if (newRow[i] === newRow[i + 1]) {
                newRow[i] *= 2;
                newRow.splice(i + 1, 1); // Remove combined tile
                newRow.push(0); // Add zero at the end
            }
        }
        while (newRow.length < 4) { // Ensure row length is 4
            newRow.push(0);
        }
        return newRow;
    }

    function moveTilesRight(row) {
        row.reverse(); // Reverse to use the moveTilesLeft logic
        let newRow = moveTilesLeft(row);
        newRow.reverse(); // Reverse back to original order
        return newRow;
    }

    function addRandomTile(board) {
        let emptyTiles = [];
        board.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                if (cell === 0) emptyTiles.push([rowIndex, cellIndex]);
            });
        });
        if (emptyTiles.length > 0) {
            let [row, col] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            board[row][col] = Math.random() > 0.9 ? 4 : 2;
        }
    }

    function drawBoard() {
        container.innerHTML = ''; // Clear previous tiles to prepare for updated drawing
        board.forEach((row, rowIndex) => {
            row.forEach((cellValue, colIndex) => {
                if (cellValue !== 0) {
                    const tile = document.createElement('div');
                    tile.className = 'game-tile';
                    tile.textContent = cellValue;
                    tile.style.transform = `translate(${colIndex * (tileSize + tileGap)}px, ${rowIndex * (tileSize + tileGap)}px)`;
                    tile.style.transition = 'transform 0.2s ease-out';
                    container.appendChild(tile);
                }
            });
        });
    }

    // Example CSS for the tile to include transitions
    // .game-tile {
    //     width: 90px;
    //     height: 90px;
    //     position: absolute; // Position tiles absolutely within the container
    //     transition: transform 0.2s ease-out; // Smooth transition for movement
    // }


    function getTileColor(value) {
        const colorMap = {
            2: '#eee4da', 4: '#ede0c8', 8: '#f2b179', 16: '#f59563',
            32: '#f67c5f', 64: '#f65e3b', 128: '#edcf72', 256: '#edcc61',
            512: '#edc850'
        };
        return colorMap[value] || '#cdc1b4';
    }

    function checkWinCondition() {
        return board.some(row => row.some(cell => cell === 1024));
    }

    function transposeBoard(board) {
        return board[0].map((_, colIndex) => board.map(row => row[colIndex]));
    }


    document.addEventListener('keydown', handleKeyPress);


    // Initialization
    addRandomTile(board);
    addRandomTile(board);
    drawBoard();
}

// function initializeMinesweeper() {
//     const container = document.getElementById('minesweeper-container');
//     let board = [];
//     let firstClick = true;
//     const boardSize = 8;
//     const mineCount = 10;
//     const tileSize = 40; // Size of each tile in pixels
//     const tileGap = 2; // Gap between tiles in pixels
//
//     function generateBoard() {
//         board = Array(boardSize).fill().map(() => Array(boardSize).fill(0));
//         // Mines will be added after the first click to ensure first click is not on a mine
//     }
//
//     function addMines(exceptRow, exceptCol) {
//         let minesAdded = 0;
//         while (minesAdded < mineCount) {
//             let row = Math.floor(Math.random() * boardSize);
//             let col = Math.floor(Math.random() * boardSize);
//             if (board[row][col] === 0 && row !== exceptRow && col !== exceptCol) {
//                 board[row][col] = 'M'; // M for mine
//                 minesAdded++;
//             }
//         }
//         calculateNumbers();
//     }
//
//     function calculateNumbers() {
//         for (let row = 0; row < boardSize; row++) {
//             for (let col = 0; col < boardSize; col++) {
//                 if (board[row][col] === 'M') continue;
//                 let mines = 0;
//                 for (let dr = -1; dr <= 1; dr++) {
//                     for (let dc = -1; dc <= 1; dc++) {
//                         if (dr === 0 && dc === 0) continue;
//                         let r = row + dr, c = col + dc;
//                         if (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] === 'M') {
//                             mines++;
//                         }
//                     }
//                 }
//                 board[row][col] = mines;
//             }
//         }
//     }
//
//     function setupEventListeners() {
//         container.addEventListener('click', handleCellClick);
//     }
//
//     function handleCellClick(e) {
//         if (!e.target.classList.contains('game-cell')) return;
//         let row = parseInt(e.target.dataset.row);
//         let col = parseInt(e.target.dataset.col);
//
//         if (firstClick) {
//             addMines(row, col);
//             firstClick = false;
//         }
//
//         if (board[row][col] === 'M') {
//             // Game over logic
//             alert('Game Over');
//             return;
//         }
//
//         revealCell(row, col);
//         checkWinCondition() && unlockTheme('grotto');
//     }
//
//     function revealCell(row, col) {
//         const cell = document.querySelector(`#cell-${row}-${col}`);
//         if (board[row][col] === 'M') {
//             cell.textContent = '💣';
//             cell.classList.add('mine');
//         } else {
//             cell.textContent = board[row][col] > 0 ? board[row][col] : '';
//             cell.classList.add('revealed');
//             if (board[row][col] === 0) {
//                 for (let dr = -1; dr <= 1; dr++) {
//                     for (let dc = -1; dc <= 1; dc++) {
//                         let r = row + dr, c = col + dc;
//                         if (r >= 0 && r < boardSize && c >= 0 && c < boardSize && !cell.classList.contains('revealed')) {
//                             revealCell(r, c);
//                         }
//                     }
//                 }
//             }
//         }
//     }
//
//     function checkWinCondition() {
//         for (let row = 0; row < boardSize; row++) {
//             for (let col = 0; col < boardSize; col++) {
//                 let cell = document.querySelector(`#cell-${row}-${col}`);
//                 if (board[row][col] !== 'M' && !cell.classList.contains('revealed')) {
//                     return false; // Not all non-mine cells are revealed
//                 }
//             }
//         }
//         unlockTheme('grotto'); // Unlock the theme as all non-mine cells are revealed
//         return true;
//     }
//
//     function drawBoard() {
//         container.innerHTML = ''; // Clear the container before drawing the board
//         for (let row = 0; row < boardSize; row++) {
//             for (let col = 0; col < boardSize; col++) {
//                 const cell = document.createElement('div');
//                 cell.id = `cell-${row}-${col}`;
//                 cell.dataset.row = row;
//                 cell.dataset.col = col;
//                 cell.classList.add('game-cell');
//                 cell.style.width = `${tileSize}px`;
//                 cell.style.height = `${tileSize}px`;
//                 cell.style.border = '1px solid #ddd';
//                 cell.style.display = 'inline-block';
//                 cell.style.marginRight = '-1px';
//                 cell.style.marginBottom = '-1px';
//                 cell.style.float = 'left';
//                 container.appendChild(cell);
//             }
//         }
//     }
//
//     function toggleFlag(cellElement) {
//         const row = parseInt(cellElement.dataset.row);
//         const col = parseInt(cellElement.dataset.col);
//         // Assuming you have a way to track flagged state in your board data structure
//         // Toggle flag state here and update UI accordingly
//         if (cellElement.classList.contains('flagged')) {
//             cellElement.classList.remove('flagged');
//             cellElement.style.backgroundImage = ''; // Remove flag image
//         } else {
//             cellElement.classList.add('flagged');
//             cellElement.style.backgroundImage = `${window.staticURL}img/flag.png`;
//         }
//     }
//
//     container.addEventListener('contextmenu', function(e) {
//         e.preventDefault(); // Prevents the default right-click menu
//         if (e.target.classList.contains('game-cell')) {
//             toggleFlag(e.target);
//         }
//         return false; // To prevent the event from further propagation
//     }, false);
//
//     // Initialization
//     generateBoard();
//     setupEventListeners();
//     drawBoard();
// }
//
