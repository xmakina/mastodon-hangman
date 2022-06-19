const Hangman = require('./hangman')

test('handles state', () => {
    const game = Hangman('test');
    const result = game.guess('t').guess('s').display()

    expect(result.won).toBe(false)
    expect(result.lost).toBe(false)
    expect(result.try).toBe('s')
})

test('loops ok', () => {
    let game = Hangman('test')
    const guesses = ['a', 't', 's']

    for(let i = 0; i < guesses.length; i++){
        game = game.guess(guesses[i])
    }

    const result = game.display()
    expect(result.won).toBe(false)
    expect(result.lost).toBe(false)
    expect(result.try).toBe('s')
    expect(result.progress).toBe('t_st')
    expect(result.mistakes).toBe(1)
})

test('winnable', () => {
    const result = Hangman('test').guess('t').guess('s').guess('e').display()

    expect(result.won).toBe(true)
    expect(result.lost).toBe(false)
    expect(result.try).toBe('e')
})

test('losable', () => {
    const result = Hangman('test')
        .guess('q')
        .guess('w')
        .guess('r')
        .guess('y')
        .guess('u')
        .guess('i')
        .display()

    expect(result.won).toBe(false)
    expect(result.lost).toBe(true)
    expect(result.try).toBe('i')
})