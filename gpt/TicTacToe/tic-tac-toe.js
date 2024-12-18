// Initialize game variables
var player = "X";
var gameover = false;
var board = ["", "", "", "", "", "", "", "", ""];

// Get all table cells
var cells = document.querySelectorAll("td");

// Add click event listener to each cell
cells.forEach(function(cell) {
	cell.addEventListener("click", function() {
		// If the cell is not empty, exit function
		if (cell.textContent !== "" || gameover) {
			return;
		}

		// Update the board array and display the player's move
		board[cell.id] = player;
		cell.textContent = player;

		// Check for a winner
		if (checkWinner()) {
			gameover = true;
			alert(player + " wins!");
			return;
		}

		// Check for a tie
		if (checkTie()) {
			gameover = true;
			alert("Tie game!");
			return;
		}

		// Switch to the other player
		player = player === "X" ? "O" : "X";
	});
});

// Function to check for a winner
function checkWinner() {
	var winStates = [
		// Rows
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		// Columns
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		// Diagonals
		[0, 4, 8],
		[2, 4, 6]
	];

	for (var i = 0; i < winStates.length; i++) {
		var state = winStates[i];
		if (
			board[state[0]] !== "" &&
			board[state[0]] === board[state[1]] &&
			board[state[1]] === board[state[2]]
		) {
			return true;
		}
	}

	return false;
}

// Function to check for a tie
function checkTie() {
	for (var i = 0; i < board.length; i++) {
		if (board[i] === "") {
			return false;
		}
	}

	return true;
}
