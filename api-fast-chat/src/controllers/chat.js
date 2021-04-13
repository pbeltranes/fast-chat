const db = require('../helpers/queries')

const chatController = (io) => {
    try {
        io.on('connection', (socket) => {
            const { roomId } = socket.handshake.query
            socket.join(roomId)
            socket.on('SEND_LAST_10_FROM_CLIENT', async ({ roomId }) => {
                const messageList = await db.getSocketMessages(roomId)
                io.to(socket.id).emit('SEND_LAST_10_FROM_SERVER', messageList)
            })
            socket.on('NEW_MESSAGE_FROM_CLIENT', async (input) => {
                const response = await db.createSocketMessage(input)
                io.in(roomId).emit('NEW_MESSAGE_FROM_SERVER', response)
            })
            socket.on('disconnect', () => {})
        })
    } catch (err) {
        console.log(err)
    }
}
module.exports = chatController
