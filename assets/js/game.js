//Audio
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

//Game Object
class MixOrMatch {
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
    }, 1000);
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
    // document.getElementById('win-text').classList.add('visible');
    $('#elegantModalForm').modal('show');
  }

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

        //     let f = document.createElement("form");
        //     f.setAttribute('method',"post");
        //     f.setAttribute('action',"submit.php");
        //     let i = document.createElement("input");
        //     i.setAttribute('type',"text");
        //     i.setAttribute('name',"username");
        //    let s = document.createElement("input"); 
        //     s.setAttribute('type',"submit");
        //     s.setAttribute('value',"Submit");
        //     f.appendChild(i);
        //     f.appendChild(s);
        //     document.getElementById("form1").appendChild(f);
        //  document.getElementById("submit").addEventListener("click", function () {document.getElementById("form1").innerText ="Yay, you subscribed! Go check your email and get your discount!";


  //Fisher–Yates shuffle implemented
  shuffleCards() {
    for (let i = this.cardsArray.length - 1; i > 0; i--) {
      let randIndex = Math.floor(Math.random() * (i + 1));
      this.cardsArray[randIndex].style.order = i;
      this.cardsArray[i].style.order = randIndex;
    }
  }

  canFlipCard(card) {
    return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
  }
}

//Overlays
function ready() {
  let overlays = Array.from(document.getElementsByClassName('overlay-text'));
  let cards = Array.from(document.getElementsByClassName('card'));
  let game = new MixOrMatch(60, cards);

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

  $('#elegantModalForm').modal({ backdrop: 'static', keyboard: false, show: false });
}


//Page Loading
// if (document.readyState === 'loading') {
//   document.addEventListener('DOMContentLoaded', ready());
// } else {
//   ready();
// }

$(document).ready(ready);