const fs = require('fs')
const Mastodon = require('mastodon-api')
const Mongo = require('mongodb')
const MentionHandler = require('./MentionHandler')

const {
    CLIENT_KEY,
    CLIENT_SECRET,
    ACCESS_TOKEN,
    API_URL,
    LOG_MESSAGES
} = process.env

const M = new Mastodon({
    client_key: CLIENT_KEY,
    client_secret: CLIENT_SECRET,
    access_token: ACCESS_TOKEN,
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
    api_url: API_URL, // optional, defaults to https://mastodon.social/api/v1/
})

async function CheckConnection() {
    const {
        MONGO_USERNAME,
        MONGO_PASSWORD,
        MONGO_HOSTNAME
    } = process.env;

    const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}/?authSource=admin`;

    const client = new Mongo.MongoClient(url);
    console.log(`Connecting to ${url}`)

    try {
        // Connect the client to the server
        await client.connect();
        // Establish and verify connection
        await client.db("admin").command({ ping: 1 });
        console.log("Connected successfully to server");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

CheckConnection().then(() =>
    console.log("Mastodon Bot starting..."))

const listener = M.stream('streaming/user')
listener.on('message', msg => HandleMessage(msg))
listener.on('error', err => console.log(err))

function LogMessage(msg) {
    if (LOG_MESSAGES) {
        fs.writeFileSync(`./log/data${new Date().getTime()}.json`, JSON.stringify(msg, null, 2));
        console.log('message logged')
    }
}

async function RespondToMessage(message) {
    if (message.event === 'notification' && message.data.type === 'mention') {
        console.log('mention recieved')
        M.post('statuses', await MentionHandler(message), (error, data) => {
            if (error) {
                console.error(error)
            } else {
                console.log('replied')
            }
        })
    }
}

function HandleMessage(message) {
    LogMessage(message)
    RespondToMessage(message)
}
