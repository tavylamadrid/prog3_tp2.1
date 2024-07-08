class Card {
	constructor(name, img) {
		this.name = name;
		this.img = img;
		this.isFlipped = false;
		this.element = this.#createCardElement();
	}

	#createCardElement() {
		const cardElement = document.createElement("div");
		cardElement.classList.add("cell");
		cardElement.innerHTML = `
		  <div class="card" data-name="${this.name}">
			  <div class="card-inner">
				  <div class="card-front"></div>
				  <div class="card-back">
					  <img src="${this.img}" alt="${this.name}">
				  </div>
			  </div>
		  </div>
	  `;
		return cardElement;
	}

	toggleFlip() {
		this.isFlipped = !this.isFlipped;
		if (this.isFlipped) {
			this.#flip();
		} else {
			this.#unflip();
		}
	}

	matches(otherCard) {
		return this.name === otherCard.name;
	}

	#flip() {
		const cardElement = this.element.querySelector(".card");
		cardElement.classList.add("flipped");
	}

	#unflip() {
		const cardElement = this.element.querySelector(".card");
		cardElement.classList.remove("flipped");
	}
}

class Board {
	constructor(cards) {
		this.cards = cards;
		this.fixedGridElement = document.querySelector(".fixed-grid");
		this.gameBoardElement = document.getElementById("game-board");
	}

	#calculateColumns() {
		const numCards = this.cards.length;
		let columns = Math.floor(numCards / 2);

		columns = Math.max(2, Math.min(columns, 12));

		if (columns % 2 !== 0) {
			columns = columns === 11 ? 12 : columns - 1;
		}

		return columns;
	}

	#setGridColumns() {
		const columns = this.#calculateColumns();
		this.fixedGridElement.className = `fixed-grid has-${columns}-cols`;
	}

	render() {
		this.#setGridColumns();
		this.gameBoardElement.innerHTML = "";
		this.cards.forEach((card) => {
			card.element
				.querySelector(".card")
				.addEventListener("click", () => this.onCardClicked(card));
			this.gameBoardElement.appendChild(card.element);
		});
	}

	onCardClicked(card) {
		if (this.onCardClick) {
			this.onCardClick(card);
		}
	}

	shuffleCards() {
		this.cards.sort(() => Math.random() - 0.5);
	}

	flipDownAllCards() {
		this.cards.forEach(card => {
			if (card.isFlipped) {
				card.toggleFlip();
			}
		});
	}

	reset() {
		this.shuffleCards();
		this.flipDownAllCards();
		this.render();
	}
}

class MemoryGame {
	constructor(board, flipDuration = 500) {
		this.board = board;
		this.flippedCards = [];
		this.matchedCards = [];
		this.moves = 0;
		if (flipDuration < 350 || isNaN(flipDuration) || flipDuration > 3000) {
			flipDuration = 350;
			alert(
				"Duracion 350 ms"
			);
		}
		this.flipDuration = flipDuration;
		this.board.onCardClick = this.#handleCardClick.bind(this);
		this.board.reset();
	}

	#handleCardClick(card) {
		if (this.flippedCards.length < 2 && !card.isFlipped) {
			card.toggleFlip();
			this.flippedCards.push(card);

			if (this.flippedCards.length === 2) {
				setTimeout(() => this.checkForMatch(), this.flipDuration);
			}
		}
	}

	checkForMatch() {
		const [card1, card2] = this.flippedCards;
		if (card1.matches(card2)) {
			this.matchedCards.push(card1, card2);
		} else {
			card1.toggleFlip();
			card2.toggleFlip();
		}
		this.flippedCards = [];
		this.moves++;
		this.updateMoveCounter();
	}

	updateMoveCounter() {
		const moveCounter = document.getElementById("move-counter");
		moveCounter.textContent = `Movimientos: ${this.moves}`;
	}

	resetGame() {
		this.flippedCards = [];
		this.matchedCards = [];
		this.moves = 0;
		this.updateMoveCounter();
		this.board.reset();
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const cardsData = [
		{ name: "Python", img: "./img/Python.svg" },
		{ name: "JavaScript", img: "./img/JS.svg" },
		{ name: "Java", img: "./img/Java.svg" },
		{ name: "CSharp", img: "./img/CSharp.svg" },
		{ name: "Go", img: "./img/Go.svg" },
		{ name: "Ruby", img: "./img/Ruby.svg" },
	];

	const cards = cardsData.flatMap((data) => [
		new Card(data.name, data.img),
		new Card(data.name, data.img),
	]);
	const board = new Board(cards);
	const memoryGame = new MemoryGame(board, 1000);

	document.getElementById("restart-button").addEventListener("click", () => {
		memoryGame.resetGame();
	});

	const moveCounter = document.createElement("div");
	moveCounter.id = "move-counter";
	moveCounter.textContent = "Movimientos: 0";
	document.querySelector(".container").appendChild(moveCounter);
});
