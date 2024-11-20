var gameCards = [];
var flippedCards = [];
var matchedCards = [];
var timer;
var timeElapsed = 0;
var lockBoard = false;

function startGame() {
    document.getElementById("oyun").style = "display: block;";
    document.getElementById("tz").innerHTML = "Yeni bir rekora hazır mısın?"
    document.getElementById("acilis").style = "display: none;";
    prepareGameCards();
    shuffle(gameCards);
    createBoard();
    resetGame();
    startTimer();
    // document.getElementById('win-screen').style.display = 'none';
    adjustCardHeight()
}

function prepareGameCards() {
    // Shuffle the cards array
    shuffle(cards);

    // Select the first 6 cards
    var selectedCards = cards.slice(0, 6);

    // Clear the gameCards array
    gameCards = [];

    // Prepare gameCards with the selected cards
    selectedCards.forEach(function(card) {
        gameCards.push({ type: 'word', content: card.word });
        gameCards.push({ type: 'meaning', content: card.meaning });
    });
}

function createBoard() {
    var board = document.getElementById('game-board');
    board.innerHTML = '';
    for (var i = 0; i < gameCards.length; i++) {
        var card = document.createElement('div');
        card.className = 'card';
        card.dataset.type = gameCards[i].type;
        card.dataset.content = gameCards[i].content;
        card.innerHTML = gameCards[i].content;
        card.onclick = flipCard;
        board.appendChild(card);
    }
}

function flipCard() {
    if (lockBoard || this.className.includes('matched') || flippedCards.length === 2) {
        return;
    }

    if (flippedCards.includes(this)) {
        this.classList.remove('selected');
        flippedCards = flippedCards.filter(card => card !== this);
        return;
    }

    this.classList.add('selected');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    var card1 = flippedCards[0];
    var card2 = flippedCards[1];

    if ((card1.dataset.type === 'word' && card2.dataset.type === 'meaning' && cards.find(c => c.word === card1.dataset.content && c.meaning === card2.dataset.content)) ||
        (card1.dataset.type === 'meaning' && card2.dataset.type === 'word' && cards.find(c => c.meaning === card1.dataset.content && c.word === card2.dataset.content))) {
        matchedCards.push(card1, card2);
        $(card1).animate({
            opacity: 0.0
          }, 500);
        $(card2).animate({
            opacity: 0.0
        }, 500);
        card1.style="background-color:green;";
        card2.style="background-color:green;";


        setTimeout(function(){

        card1.className = card1.className + ' matched';
        card2.className = card2.className + ' matched';
        },300)

        flippedCards = [];
        if (matchedCards.length === gameCards.length) {
            showWinScreen();
            clearInterval(timer);
        }
    } else {
        card1.classList.add('wrong');
        card2.classList.add('wrong');
        timeElapsed += 10; // Yanlış bilindiğinde süreye 10 saniye ekle
        lockBoard = true;
                
        $(card2).addClass("shake");
        $(card1).addClass("shake");

        setTimeout(function() {
            card1.className = 'card';
            card2.className = 'card';
            card1.style.backgroundColor = '#fff';
            card2.style.backgroundColor = '#fff';
            flippedCards = [];
            lockBoard = false;
            $(card1).removeClass("shake");
            $(card2).removeClass("shake");
        }, 500);
    }
}

function showWinScreen() {
    document.getElementById('acilis').style.display = 'block';
    document.getElementById("oyun").style = "display: none;";
    // document.getElementById('saniye').innerText = document.getElementById("timer").innerText + " saniye"
}

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function startTimer() {
    timeElapsed = 0;
    document.getElementById('timer').innerText = (timeElapsed / 10).toFixed(1);
    timer = setInterval(function() {
        timeElapsed++;
        document.getElementById('timer').innerText = (timeElapsed / 10).toFixed(1);
    }, 100);
}

function resetGame() {
    flippedCards = [];
    matchedCards = [];
    clearInterval(timer);
    timeElapsed = 0;
    document.getElementById('timer').innerText = '0.0';
}