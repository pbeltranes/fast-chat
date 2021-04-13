const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const app = express()
const port = 8001
const chatController = require('./src/controllers/chat')
const pool = require('./src/services/connect')
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
pool.query('SELECT NOW()', (err, res) => {
  })
server.listen(port, () => {
    console.log(`listening on *:${port}`)
})
chatController(io)
app.get('/', (request, response) => {
    response.json({ info: 'Our app is up and running' })
})
