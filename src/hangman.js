function Hangman(word, copy, mistakes, lastLetter) {
    //Initialize again, no assignments here ;)
    if (!copy) {
        return Hangman(word, '_'.repeat(word.length), 0);
    }

    //Exposed Functions
    function guess() {
        return function guess(letter) {
            if (!done(won(word, copy), lost(mistakes))) {
                //An assignment, it was unavoidable I think
                mistakes = updateMistakes(mistakes, copy, copy = applyGuess(word, copy, letter));
            }
            lastLetter = letter
            return this;
        };
    }

    //Return object, kind pointless now that there is only 1 function :/
    return {
        guess: guess(),
        display: display()
    }

    //Not entirely pure function, not cacheable

    function display() {
        return function display() {
            return {
                won: won(word, copy),
                lost: lost(mistakes),
                try: lastLetter,
                progress: copy,
                mistakes: mistakes
            }
        }
    }

    //Pure functions!!
    function applyGuess(word, copy, letter) {
        return word.split('').map((c, i) => letter == c ? c : copy[i]).join('');
    }

    function updateMistakes(mistakes, oldCopy, newCopy) {
        return mistakes + (oldCopy == newCopy ? 1 : 0);
    }

    function done(won, lost) {
        return won || lost;
    }

    function won(word, copy) {
        return word == copy;
    }

    function lost(mistakes) {
        return mistakes > 5;
    }
}

module.exports = Hangman
