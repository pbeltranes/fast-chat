# Fast Chat



Haremos una aplicación de chat con una base de datos relación que se respaldará las conversaciónes que vayan siendo suministradas a las distintas salas de chat.

Live demo:

Source code:

##  General

Crearemos una aplicación que cuenta con tres partes una base de datos relacional, una servidor y un cliente. A la base de datos se accederá directamente mediante consultas no existe un ORM o ODM que sea intermediario, en tanto en el lado del cliente se levantará una aplicación haciendo uso de React, Material-ui y Socket.io

## Fichero


```
├── api-fast-chat
│   ├── app.js
│   ├── init.sql
│   ├── package.json
│   └── src
│       ├── controllers
│       │   └── chat.js
│       ├── helpers
│       │   └── queries.js
│       ├── routes
│       │   └── index.js
│       └── services
│           └── connect.js
└── front-fast-chat
    ├── package.json
    ├── public
    │   ├── index.html
    │   ├── manifest.json
    │   └── robots.txt
    └── src
        ├── App.css
        ├── App.js
        ├── App.test.js
        ├── components
        │   ├── Home.js
        │   ├── MessageInput.js
        │   ├── MessageList.js
        │   └── Room.js
        ├── index.css
        ├── index.js
        ├── logo.svg
        ├── reportWebVitals.js
        └── setupTests.js
```


## Backend 

Iniciando el proyecto en el backend, necesitamos generar nuestro `package.json`:

```
npm init -y  
```

Luego instalaremos `express`, `cors` ,`socket.io` y `http`.

```
npm install express cors socket.io http  --save
```

En el backend levantaremos una aplicación con express, la aplicación pdrá ocuparse tanto con protocolos http como por websocket. Elegimos además declarar el puerto por el cual se realiza la comunicación de nuestra app. puerto 8001.

```javascript
const express = require('express')
const cors = require('cors')
const app = express()
const port = 8001
```

También haremos llamada a nuestro controllador  `chat.js` que funciona vía socket, el controlador lo tendremos creado en la ruta `/src/controllers/`.  la aplicación creada con `express` llamada `app` la montaremos sobre el protocolo http y generando el server que requerimos. Posteriormente generamos ciertas configuraciones como manejar express.json() y aceptar cors.

Si no sabes que significa  express.urlencoded()  o express.json(). [Aquí una ayudita]( 
https://www.it-swarm-es.com/es/javascript/que-son-express.json-y-express.urlencoded/1045862988/).


Posteriormente reclararemos socket.io con nuestro server previamente creado, luego haremos que el server escuche desde el puerto 8001 mediante protocolo http, finalmente pero no menos importante declaramos nuestro controlador y le entregamos nuestro socket `io`.

```javascript
// app.js
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


```

### Controladador 

Nuestro controlador recibe como parametro 

* `io.on ('connection', (socket) => {})`
* `socket.join(roomId)`
* `socket.on('SEND_LAST_10_FROM_CLIENT', () => {})`
* `socket.on('NEW_MESSAGE_FROM_CLIENT', () => {})`



```javascript 
// src/controllers/chat.js
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
```



```javascript 
// src/helpers/queries.js
const pool = require('../services/connect')
const moment = require('moment')


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
```

```javascript
// src/services/connect.js
const credentials = {
    user: 'docker',
    host: 'db', // on docker is db - localhost run server
    password: 'docker',
    database: 'docker',
    port: 5432,
}
const pool = new Pool(credentials)

module.exports = pool
```

```sql
CREATE USER docker;
CREATE DATABASE docker;
GRANT ALL PRIVILEGES ON DATABASE docker TO docker;
DROP TABLE IF EXISTS "public"."messages";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS messages_id_seq;

GRANT ALL PRIVILEGES ON SEQUENCE messages_id_seq TO docker;
-- Table Definition
CREATE TABLE "messages" (
    "id" int4 NOT NULL DEFAULT nextval('messages_id_seq'::regclass),
    "text" varchar(255) NOT NULL,
    "username" varchar(255) NOT NULL,
    "created_at" timestamp NOT NULL DEFAULT now(),
    "room" varchar(255),
    PRIMARY KEY ("id")
);

GRANT ALL PRIVILEGES ON TABLE messages TO docker;
```
## Frontend

```Javascript
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import socketIOClient from "socket.io-client";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

const SOCKET_SERVER_URL = "http://localhost:8001";
function Room(username) {
  const { roomId } = useParams();
  const [messageList, setMessageList] = useState(); // Sent and received messages
  const socketRef = useRef();
  useEffect(() => {
    // Creates a WebSocket connection
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { roomId },
    });
    if (typeof messages === "undefined") {
      // Request last 10 records
      socketRef.current.emit("SEND_LAST_10_FROM_CLIENT", { roomId });
      // Waiting Records
      socketRef.current.on("SEND_LAST_10_FROM_SERVER", (messageList) => {
        setMessageList(messageList);
      });
    }
    socketRef.current.on("NEW_MESSAGE_FROM_SERVER", (incomingMessage) => {
      setMessageList((messages) => [...messages, incomingMessage]);
    });

    // Destroys the socket reference
    // when the connection is closed
    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  const sendMessage = (text) => {
    socketRef.current.emit("NEW_MESSAGE_FROM_CLIENT", {
      text,
      ...username,
      room: roomId,
    });
  };
  return (
    <div className="App">
      <MessageList messageList={messageList} username={username} />
      <MessageInput onClick={sendMessage} />
    </div>
  );
}

export default Room;

```

### Acknowledgment

https://medium.com/swlh/build-a-real-time-chat-app-with-react-hooks-and-socket-io-4859c9afecb0

