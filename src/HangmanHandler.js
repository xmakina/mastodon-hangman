const hangman = require('./hangman')

function HangmanHandler(gameState) {
    function Handle(acct, guess) {
        if (gameState !== null && gameState !== undefined) {
            if (guess.length !== 1) {
                return {
                    gameState,
                    status: `@${acct} you can only guess one letter at a time!`
                }
            }

            if (gameState.guesses.includes(guess)) {
                return {
                    gameState,
                    status: `@${acct} you already guessed ${guess}`
                }
            }

            gameState.guesses.push(guess)

            let game = hangman(gameState.word);

            for (let i = 0; i < gameState.guesses.length; i++) {
                game = game.guess(gameState.guesses[i])
            }

            const result = game.display()

            const word = gameState.word
            if (result.won) {
                gameState = null
                return {
                    gameState,
                    status: `@${acct} you won! The word was ${word}`
                }
            }

            if (result.lost) {
                gameState = null
                return {
                    gameState,
                    status: `@${acct} you lost! The word was ${word}`
                }
            }

            const mistakes = 6 - result.mistakes !== 6 ? `(${6 - result.mistakes} mistakes left)` : ''
            return {
                gameState,
                status: `@${acct} ${result.progress} ${mistakes}`.trim()
            }
        } else {
            gameState = {
                word: 'test',
                guesses: []
            }

            const result = hangman('test').display()

            return {
                gameState,
                status: `@${acct} let's go! Your word is ${result.progress}`
            }
        }
    }

    return {
        Handle
    }
}

module.exports = HangmanHandler
