const HangmanHandler = require('./HangmanHandler')

test('returns new game', () => {
    const db = null
    const handler = HangmanHandler(db)
    const result = handler.Handle("some-account", "begin")

    expect(result.status).toBe(`@some-account let's go! Your word is ____`)
    expect(result.gameState).not.toBe(null)
})

test('continues existing game', () => {
    const db = { word: 'test', guesses: [] }
    const handler = HangmanHandler(db)
    const result = handler.Handle("some-account", "t")

    expect(result.status).toBe(`@some-account t__t`)
    expect(result.gameState.guesses.length).toBe(1)
})

test('continues existing game', () => {
    const db = { word: 'test', guesses: [] }
    const handler = HangmanHandler(db)
    const result = handler.Handle("some-account", "t")

    expect(result.status).toBe(`@some-account t__t`)
    expect(result.gameState.guesses.length).toBe(1)
})

test('tracks mistakes', () => {
    const db = { word: 'test', guesses: ['t'] }
    const handler = HangmanHandler(db)
    const result = handler.Handle("some-account", "q")

    expect(result.status).toBe(`@some-account t__t (5 mistakes left)`)
    expect(result.gameState.guesses.length).toBe(2)
})

test('reports victory', () => {
    const db = { word: 'test', guesses: ['t', 'e'] }
    const handler = HangmanHandler(db)
    const result = handler.Handle("some-account", "s")

    expect(result.status).toBe(`@some-account you won! The word was test`)
    expect(result.gameState).toBe(null)
})

test('reports loss', () => {
    const db = { word: 'test', guesses: ['q', 'd', 'f', 'g', 'r'] }
    const handler = HangmanHandler(db)
    const result = handler.Handle("some-account", "y")

    expect(result.status).toBe(`@some-account you lost! The word was test`)
    expect(result.gameState).toBe(null)
})

test('ignores duplicates', () => {
    const db = { word: 'test', guesses: ['t', 'q'] }
    const handler = HangmanHandler(db)
    const result = handler.Handle("some-account", "q")

    expect(result.status).toBe(`@some-account you already guessed q`)
    expect(result.gameState.guesses.length).toBe(2)
})

test('ignores long guesses', () => {
    const db = { word: 'test', guesses: ['t', 'q'] }
    const handler = HangmanHandler(db)
    const result = handler.Handle("some-account", "some")

    expect(result.status).toBe(`@some-account you can only guess one letter at a time!`)
    expect(result.gameState.guesses.length).toBe(2)
})


test('does not report mistakes if still at 6', () => {
    const db = { word: 'test', guesses: ['t'] }
    const handler = HangmanHandler(db)
    const result = handler.Handle("some-account", "e")

    expect(result.status).toBe(`@some-account te_t`)
    expect(result.gameState.guesses.length).toBe(2)
})
