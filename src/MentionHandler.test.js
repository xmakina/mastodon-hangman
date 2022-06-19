const HtmlToText = require('html-to-text')

const testLine = "<p><span class=\"h-card\"><a href=\"https://botsin.space/@hangman_game\" class=\"u-url mention\" rel=\"nofollow noopener noreferrer\" target=\"_blank\">@<span>hangman_game</span></a></span> hello?</p>";

test('converts text', () => {
    const result = HtmlToText.convert(testLine, {ignoreHref:true})
    expect(result).toBe("@hangman_game hello?")
})