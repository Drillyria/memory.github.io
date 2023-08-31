let isGameOver = false;

const difficulties = {
  easy: { cardCount: 12, timer: 25 },
  medium: { cardCount: 16, timer: 40 },
  hard: { cardCount: 20, timer: 70 }
};

const restartButton = document.getElementById('restart-button');
let timerInterval;
let currentDifficulty = 'easy';

restartButton.addEventListener('click', () => {
  clearInterval(timerInterval);
  const selectedDifficulty = difficultySelector.value;
  currentDifficulty = selectedDifficulty;
  generateCards(selectedDifficulty);
  hideMessages();
  resetTimer(selectedDifficulty);
  isGameOver = false;
});

function hideMessages() {
  const congratulationsMessage = document.querySelector('.congratulations-message');
  const lostMessage = document.querySelector('.lost-message');
  congratulationsMessage.style.display = 'none';
  lostMessage.style.display = 'none';
}

function resetTimer(difficulty) {
  clearInterval(timerInterval);
  const timerValueElement = document.getElementById('timer-value');
  timerValueElement.textContent = '';
  startTimer(difficulties[difficulty].timer);
}



function startTimer(seconds) {
  clearInterval(timerInterval); // Clear previous interval if it exists

  const timerValueElement = document.getElementById('timer-value');
  let timeRemaining = seconds;
  let colorChangeThreshold = 10;
  let isRedBackground = false;

  timerInterval = setInterval(() => {
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      showLostMessage();
      isGameOver = true;
    } else {
      timerValueElement.textContent = timeRemaining;
      timeRemaining--;

      if (timeRemaining <= colorChangeThreshold) {
        if (!isRedBackground) {
          document.body.classList.add('red-background');
          isRedBackground = true;
        }
      } else if (isRedBackground) {
        document.body.classList.remove('red-background');
        isRedBackground = false;
      }
    }
  }, 1000);
}



function resetTimer() {
  clearInterval(timerInterval);
  const timerValueElement = document.getElementById('timer-value');
  timerValueElement.textContent = '';
}

const imageList = [
  "Alea_Quintus.jpg", "Alik'r.jpg", "Alvor.jpg", "Anise.jpg", "Arnbjorn.jpg",
  "Arngeir.jpg", "Arvel.jpg", "Astrid.jpg", "Aventus_Aretino.jpg", "Beggar.jpg",
  "Bergritte_Battle-Born.jpg", "Brynjolf.jpg", "Calcelmo.jpg", "Captive.jpg",
  "Carlotta_Valentia.jpg", "Clavicus_Vile.jpg", "Colette_Marence.jpg", "Corpse.jpg",
  "Courier.jpg", "Delphine.jpg", "Elisif_Jarl.jpg", "Esbern.jpg", "Faendal.jpg",
  "Farengar.jpg", "General_Tullius.jpg", "Grelod.jpg", "Hadvar.jpg", "Headsman.jpg",
  "Hilde.jpg", "Igmund-Jarl.jpg", "Irileth.jpg", "Lord_Harkon.jpg", "Mage.jpg",
  "Night_Mother.jpg", "Olava_the_Feeble.jpg", "Ralof.jpg", "Saadia.jpg", "Septimus_Signus.jpg",
  "Serana.jpg", "Sheogorath.jpg", "Spectral_Assassin.jpg", "Thalmor-Lorcalin.jpg",
  "Tsun.jpg", "Valkyn_Gatanas.jpg"
];

const memoryGame = document.querySelector('.memory-game');

function createCardElement(framework) {
  const card = document.createElement('div');
  card.classList.add('memory-card');
  card.dataset.framework = framework;

  const frontFace = document.createElement('img');
  frontFace.classList.add('front-face');
  frontFace.src = `./img/${framework}.jpg`;
  frontFace.alt = framework;

  const backFace = document.createElement('img');
  backFace.classList.add('back-face');
  backFace.src = './img/card-back.png';
  backFace.alt = 'Skyrim';

  card.appendChild(frontFace);
  card.appendChild(backFace);

  card.addEventListener('click', flipCard);

  return card;
}

function generateCards(difficulty) {
  const { cardCount, timer } = difficulties[difficulty];
  const selectedImages = imageList.slice(0, cardCount / 2);

  const allImages = selectedImages.concat(selectedImages); // Duplicate for pairs
  
  shuffleArray(allImages); // Shuffle the array
  
  memoryGame.innerHTML = ''; // Clear existing cards

  resetTimer();
  startTimer(timer);

  const congratulationsMessage = document.querySelector('.congratulations-message');
  congratulationsMessage.style.display = 'none';

  allImages.forEach(image => {
    const framework = image.split('.')[0].toLowerCase();
    const card = createCardElement(framework);
    memoryGame.appendChild(card);
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const difficultySelector = document.getElementById('difficulty-selector');

difficultySelector.addEventListener('change', function() {
  const selectedDifficulty = difficultySelector.value;
  generateCards(selectedDifficulty);
});


generateCards('easy');


const cards = document.querySelectorAll('.memory-card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() {
  if (lockBoard || isGameOver) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;

    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  if (isMatch) {
    disableCards();
    const unmatchedCards = document.querySelectorAll('.memory-card:not(.matched)');
    
    if (unmatchedCards.length === 0) {
      clearInterval(timerInterval);
      showCongratulationsMessage();
    }
  } else {
    unflipCards();
  }
}

function showCongratulationsMessage() {
  const congratulationsMessage = document.querySelector('.congratulations-message');
  congratulationsMessage.style.display = 'block';
  clearInterval(timerInterval);
  isGameOver = true;
}

function showLostMessage() {
  const lostMessage = document.querySelector('.lost-message');
  lostMessage.style.display = 'block';
  isGameOver = true;
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  firstCard.classList.add('matched');
  secondCard.classList.add('matched');

  resetBoard();
}


function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard, isGameOver] = [false, false, false];
  [firstCard, secondCard] = [null, null];
}

(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

cards.forEach(card => card.addEventListener('click', flipCard));