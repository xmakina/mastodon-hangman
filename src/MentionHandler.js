const HtmlToText = require('html-to-text')
const HangmanHandler = require('./HangmanHandler')
const Mongo = require('mongodb')

const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME
} = process.env;

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}/?authSource=admin`;

const client = new Mongo.MongoClient(url);

async function HandleMention(message) {
    const content = HtmlToText.convert(message.data.status.content, { ignoreHref: true }).replace(/\s+/g, ' ').trim()
    const tokens = content.split(' ')
    const acct = message.data.account.acct;

    var gameQuery = { acct };

    try {
        await client.connect();
        const database = client.db("hangman");
        const games = database.collection("games");
        const game = await games.findOne(gameQuery)

        const handler = HangmanHandler(game)

        const response = handler.Handle(acct, tokens[1])

        // this option instructs the method to create a document if no documents match the filter
        const options = { upsert: true };
        // create a document that sets the plot of the movie
        const updateDoc = {
            $set: response.gameState
        };
        if (response.gameState === null) {
            await games.deleteOne(gameQuery)
        } else {
            await games.updateOne(gameQuery, updateDoc, options);
        }

        console.log(
            `game for ${acct} updated`,
        );

        return {
            status: response.status,
            in_reply_to_id: message.data.status.id,
            in_reply_to_account_id: message.data.status.account.id
        }
    } finally {
        client.close();
    }
}

module.exports = HandleMention
