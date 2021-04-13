const pool = require('../services/connect')
const moment = require('moment')

exports.getMessages = (request, response) => {
    pool.query(
        `SELECT * FROM messages WHERE room = ${request.body.room} ORDER BY id DESC LIMIT 10`,
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        }
    )
}

exports.createMessage = (request, response) => {
    const { text, username } = request.body
    pool.query(
        'INSERT INTO messages (text, username) VALUES ($1, $2) RETURNING text, username, created_at',
        [text, username],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(201).send(results.rows)
        }
    )
}

exports.getSocketMessages = (roomId) => {
    return new Promise((resolve) => {
        pool.query(
            `SELECT * FROM messages WHERE messages.room = '${roomId}' ORDER BY created_at ASC LIMIT 10`,
            (error, results) => {
                if (error) {
                    console.log(error)
                    throw error
                }
                const response = results.rows.map((row) => {
                    return {
                        text: row.text,
                        username: row.username,
                        hour: moment(row.created_at).format('hh:mm'),
                    }
                })
                resolve(response)
            }
        )
    })
}

exports.createSocketMessage = async (input) => {
    const { text, username, room } = input
    return new Promise((resolve) => {
        pool.query(
            'INSERT INTO messages (text, username, room) VALUES ($1, $2, $3)  RETURNING text, username, created_at',
            [text, username, room],
            (error, result) => {
                if (error) {
                    throw error
                }
                resolve({
                    text: result.rows[0].text,
                    username: result.rows[0].username,
                    hour: moment(result.created_at).format('hh:mm'),
                })
            }
        )
    })
}
