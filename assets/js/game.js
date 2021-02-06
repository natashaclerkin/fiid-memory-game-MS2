class AudioController {
  constructor() {
    this.bgMusic = new Audio('assets/audio/yummy.mp3');
    this.flipSound = new Audio('assets/audio/flip.wav');
    this.matchSound = new Audio('assets/audio/match.wav');
    this.winSound = new Audio('assets/audio/win.wav');
    this.gameOverSound = new Audio('assets/audio/gameover.wav');
    this.bgMusic.volume = 0.5;
    this.bgMusic.loop = true;
  }
  startMusic() {
    this.bgMusic.play();
  }
  stopMusic() {
    this.bgMusic.pause();
    this.bgMusic.currentTime = 0;
  }
  flip() {
    this.flipSound.play();
  }
  match() {
    this.matchSound.play();
  }
  win() {
    this.stopMusic();
    this.winSound.play();
  }
  gameOver() {
    this.stopMusic();
    this.gameOverSound.play();
  }
}

class MatchAndWin {
  constructor(totalTime, cards) {
    this.cardsArray = cards;
    this.totalTime = totalTime;
    this.timeRemaining = totalTime;
    this.timer = document.getElementById('time-remaining');
    this.ticker = document.getElementById('flips');
    this.audioController = new AudioController();
    this.addEventListener();
  }
  startGame() {
    this.cardToCheck = null;
    this.totalClicks = 0;
    this.timeRemaining = this.totalTime;
    this.matchedCards = [];
    this.busy = true;
    setTimeout(() => {
      this.audioController.startMusic();
      this.shuffleCards();
      this.countDown = this.startCountDown();
      this.busy = false;
    }, 500);
    this.hideCards();
    this.timer.innerText = this.timeRemaining;
    this.ticker.innerText = this.totalClicks;
  }
  hideCards() {
    this.cardsArray.forEach(card => {
      card.classList.remove('visible');
      card.classList.remove('matched');
    });
  }
  /**
   * 
   * @param {*} card 
   */
  flipCard(card) {
    if (this.canFlipCard(card)) {
      this.audioController.flip();
      this.totalClicks++;
      this.ticker.innerText = this.totalClicks;
      card.classList.add('visible');

      if (this.cardToCheck)
        this.checkForCardMatch(card);
      else
        this.cardToCheck = card;
    }
  }
  checkForCardMatch(card) {
    if (this.getCardType(card) === this.getCardType(this.cardToCheck))
      this.cardMatch(card, this.cardToCheck);
    else
      this.cardMisMatch(card, this.cardToCheck);

    this.cardToCheck = null;
  }
  cardMatch(card1, card2) {
    this.matchedCards.push(card1);
    this.matchedCards.push(card2);
    card1.classList.add('matched');
    card2.classList.add('matched');
    this.audioController.match();
    if (this.matchedCards.length === this.cardsArray.length)
      this.win();
  }
  cardMisMatch(card1, card2) {
    this.busy = true;
    setTimeout(() => {
      card1.classList.remove('visible');
      card2.classList.remove('visible');
      this.busy = false;
    }, 1000); //gives the user one second to comprehend what the mismatch cards are and where there are located to memorise for future moves.
  }
  getCardType(card) {
    return card.getElementsByClassName('card-value')[0].src;
  }
  startCountDown() {
    return setInterval(() => {
      this.timeRemaining--;
      this.timer.innerText = this.timeRemaining;
      if (this.timeRemaining === 0)
        this.gameOver();
    }, 1000);
  }
  gameOver() {
    clearInterval(this.countDown);
    this.audioController.gameOver();
    document.getElementById('game-over-text').classList.add('visible');
  }
  win() {
    clearInterval(this.countDown);
    this.audioController.win();
    $('#elegantModalForm').modal('show');
  }

  // Congrats modal which becomes hidden upon form submission and displays a confirmation message to the user. 5 second Bootstrap loading animation added for good UX: (Made custom changes to code credit: https://getbootstrap.com/docs/4.4/components/spinners
  addEventListener() {
    document.getElementById("subscribe-submit").addEventListener("click", () => {
        const subscribeEl = document.getElementById("dynamic-content-a");
        const messageSectionEl = document.getElementById("dynamic-content-b");

        const subscribeButton = document.getElementById("subscribe-submit");
        subscribeButton.firstElementChild.classList.remove("d-none");
        subscribeButton.setAttribute("disabled", "disabled");

        setTimeout(() => {
            subscribeEl.classList.add('d-none');
            messageSectionEl.classList.remove('d-none');
        }, 5000);

        return false;
    });
  }

  // Fisher–Yates shuffle implemented for most efficient shuffle method
  shuffleCards() {
    for (let i = this.cardsArray.length - 1; i > 0; i--) {
      let randIndex = Math.floor(Math.random() * (i + 1));
      this.cardsArray[randIndex].style.order = i;
      this.cardsArray[i].style.order = randIndex;
    }
  }

  // Card can only be flipped if it's not in the middle of an animation and hasn't been matched already and its not the card to check
  canFlipCard(card) {
    return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
  }
}

function ready() {
  let overlays = Array.from(document.getElementsByClassName('overlay-text'));
  let cards = Array.from(document.getElementsByClassName('card'));
  let game = new MatchAndWin(60, cards); // Total time that the player has to match all cards

  overlays.forEach(overlay => {
    overlay.addEventListener('click', () => {
      overlay.classList.remove('visible');
      game.startGame();
    });
  });
  cards.forEach(card => {
    card.addEventListener('click', () => {
      game.flipCard(card);
    });
  });

  // Prevents modal from closing when area is clicked outside of modal (Made custom changes to code credit: https://stackoverflow.com/questions/16152073/prevent-bootstrap-modal-from-disappearing-when-clicking-outside-or-pressing-esca
  $('#elegantModalForm').modal({ backdrop: 'static', keyboard: false, show: false });
}

$(document).ready(ready); 