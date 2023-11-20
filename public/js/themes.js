document.addEventListener('DOMContentLoaded', () => {
    // Initialization
    const themeButtons = document.querySelectorAll('.theme-button');
    initializeThemes(themeButtons);
    incrementDailyVisits(); // Increment the visit count if it's a new day
    updateVisitCounterDisplay(); // Update the display on page load
    checkConsecutiveVisits(); // Check and update consecutive visits for the dark theme
    updateConsecutiveVisitCounterDisplay(); // Update the display on page load

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

    // Event listener for the "Check Answer" button for the dark theme
    document.getElementById('check-answer-space').addEventListener('click', () => {
        checkSpaceThemeUnlock();
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
            if (openedPuzzle && openedPuzzle.getAttribute('data-theme') === 'space') {
                checkSpaceThemeUnlock();
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
    }
    // Add more themes and parts as needed
};

function getCorrectAnswerForThemePart(theme, partIndex) {
    // Retrieve the correct answer for a theme's specific part
    // The partIndex is expected to start from 0 for the first part
    const themeInfo = themeAnswers[theme];
    if (themeInfo && themeInfo.parts[partIndex] !== undefined) {
    return themeInfo.parts[partIndex];
    } else {
    console.error('No answer found for the specified theme and part index.');
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
    const newThemePath = `themes/${themeName}.css`;
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
        modalContent.classList.add('shake');
        setTimeout(() => modalContent.classList.remove('shake'), 500); // Remove class after animation

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
        modalContent.classList.add('shake');
        setTimeout(() => modalContent.classList.remove('shake'), 500); // Remove class after animation

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
        modalContent.classList.add('shake'); // Add shake class to the modal content
        setTimeout(() => modalContent.classList.remove('shake'), 500); // Remove shake class after 500ms

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
        modalContent.classList.add('shake');
        // Provide feedback
        if (feedbackElement) feedbackElement.textContent = 'Not enough days visited consecutively.';

        // Remove the shake class after the animation completes
        setTimeout(() => {
            modalContent.classList.remove('shake');
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
        modalContent.classList.add('shake'); // Add shake class to the modal content
        setTimeout(() => modalContent.classList.remove('shake'), 500); // Remove shake class after 500ms

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
            window.setTimeout(makeRandomMove, 250);
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

    function makeRandomMove() {
        let possibleMoves = game.moves();

        // Exit if the game is over
        if (game.game_over() || possibleMoves.length === 0) return;

        let randomIdx = Math.floor(Math.random() * possibleMoves.length);
        game.move(possibleMoves[randomIdx]);
        board.position(game.fen());
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
        window.setTimeout(makeRandomMove, 250);
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

