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
