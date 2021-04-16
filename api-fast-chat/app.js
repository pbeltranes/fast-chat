const express = require('express')
const cors = require('cors')
const app = express()
const port = 8001
const chatController = require('./src/controllers/chat')
const server = require('http').createServer(app)
app.use(express.json())
app.use(cors())
app.use(
    express.urlencoded({
        extended: false,
    })
)
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    },
})
server.listen(port, () => {
    console.log(`listening on *:${port}`)
})
chatController(io)
