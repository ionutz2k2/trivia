(function () {
    var exports = (window == null) ? global : window;

    exports.Game = function () {
        var MAX_PLAYERS = 6,
            MIN_PLAYERS = 2,
            WIN_GOLD = 6,
            PLACES_COUNT = 12,
            QUESTIONS_COUNT = 50;

        var players = [],
            places = [],
            purses = [],
            inPenaltyBox = [],
            currentPlayer = 0,
            playersCount = 0,
            isGettingOutOfPenaltyBox = false,
            categories = ['Pop', 'Science', 'Sports', 'Rock'],
            questions = [];

        initQuestions();

        /**
         * Initializes the question set of the game
         */
        function initQuestions() {
            for (var categoryId = 0, categoriesCount = categories.length; categoryId < categoriesCount; categoryId++) {
                questions[categoryId] = [];
                for (var i = 0; i < QUESTIONS_COUNT; i++) {
                    questions[categoryId].push(categories[categoryId] + ' Question ' + i);
                }
            }
        }

        /**
         * Checks the win condition and returns true if the current
         * player has won or false otherwise
         *
         * @returns {boolean}
         */
        function didPlayerWin() {
            return purses[currentPlayer] == WIN_GOLD;
        }

        /**
         * Returns the current category name
         *
         * @returns {string}
         */
        function currentCategory() {
            return categories[getCurrentCategoryId()];
        };

        /**
         * Returns the category id corresponding to the current player's position
         *
         * @returns {number}
         */
        function getCurrentCategoryId() {
            return places[currentPlayer] % categories.length;
        }

        /**
         * Retrieves the next question from the game's question set.
         */
        function askNextQuestion() {
            logMessage(questions[getCurrentCategoryId()].shift());
        }

        /**
         * Moves the location of the current player by diceValue positions.
         *
         * @param diceValue
         */
        function moveCurrentPlayer(diceValue) {
            places[currentPlayer] = (places[currentPlayer] + diceValue) % PLACES_COUNT;
        }

        /**
         * Gives the current player 1 gold coin
         */
        function rewardCurrentPlayer() {
            purses[currentPlayer] += 1;
            logMessage(players[currentPlayer] + ' now has ' +
                purses[currentPlayer] + ' Gold Coins.');
        }

        /**
         * Initializes the state data for a new player
         *
         * @param playerName
         */
        function initNewPlayer(playerName) {
            players.push(playerName);
            places.push(0);
            purses.push(0);
            inPenaltyBox.push(false);
        }

        /**
         * Logs received message
         *
         * @param message
         */
        function logMessage(message) {
            console.log(message);
        }

        /**
         * Checks if the prerequisites for playing a game are met
         *
         * @returns {boolean}
         */
        this.isPlayable = function () {
            return playersCount >= MIN_PLAYERS;
        }

        /**
         * Adds a new player to the game and returns true
         * if the operation is successful or false otherwise
         *
         * @param playerName
         * @returns {boolean}
         */
        this.addPlayer = function (playerName) {
            if (playersCount >= MAX_PLAYERS) {
                logMessage('Cannot add player ' + playerName + '. Maximum number of players reached.');
                return false;
            }

            initNewPlayer(playerName);
            playersCount++;

            logMessage(playerName + ' was added');
            logMessage((playersCount == 1) ? 'There is 1 player' : ('There are ' + playersCount + ' players'));

            return true;
        }

        /**
         * Passes the turn to the next player
         */
        this.nextPlayer = function() {
            currentPlayer = (currentPlayer + 1) % playersCount;
        }

        /**
         * Performs all actions associated with a dice roll
         *
         * @param diceValue
         */
        this.rollDice = function (diceValue) {
            if (!this.isPlayable()) {
                logMessage('Cannot start game. Not enough players.');
                return;
            }

            logMessage(players[currentPlayer] + ' is the current player');
            logMessage('He/She has rolled a ' + diceValue);

            isGettingOutOfPenaltyBox = (diceValue % 2) != 0;
            if (inPenaltyBox[currentPlayer] && !isGettingOutOfPenaltyBox) {
                logMessage(players[currentPlayer] + ' is not getting out of the penalty box');
                return;
            }

            if (inPenaltyBox[currentPlayer] && isGettingOutOfPenaltyBox) {
                logMessage(players[currentPlayer] + ' is getting out of the penalty box');
            }

            moveCurrentPlayer(diceValue);
            logMessage(players[currentPlayer] + '\'s new location is ' + places[currentPlayer]);

            logMessage('The category is ' + currentCategory());
            askNextQuestion();
        }

        /**
         * Performs the required actions for a correct answer
         *
         * @returns {boolean}
         */
        this.wasCorrectlyAnswered = function () {
            if (inPenaltyBox[currentPlayer] && !isGettingOutOfPenaltyBox) {
                return false;
            }

            logMessage('Answer was correct!!!!');
            rewardCurrentPlayer();

            return didPlayerWin();
        }

        /**
         * Performs the required actions for a wrong answer
         *
         * @returns {boolean}
         */
        this.wrongAnswer = function () {
            logMessage('Question was incorrectly answered');
            logMessage(players[currentPlayer] + ' was sent to the penalty box');
            inPenaltyBox[currentPlayer] = true;

            return false;
        }
    }

    var gameEnded = false;
    var game = new Game();

    game.addPlayer('Chet');
    game.addPlayer('Pat');
    game.addPlayer('Sue');

    do {
        game.rollDice(Math.floor(Math.random() * 6) + 1);

        gameEnded = (Math.floor(Math.random() * 10) == 7) ? game.wrongAnswer() : game.wasCorrectlyAnswered();

        if (!gameEnded) game.nextPlayer();
    } while (!gameEnded);
})();
