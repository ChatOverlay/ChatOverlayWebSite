import { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

import io from "socket.io-client";

const socket = io(`${import.meta.env.VITE_API_URL}`, {
  query: {
    token: localStorage.getItem("token"),
  },
});

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const joinMessageAdded = useRef(false);

  useEffect(() => {
    const classroom = localStorage.getItem("selectedClassroom");
    socket.emit("joinRoom", classroom);

    if (!joinMessageAdded.current) {
      const joinMessage = {
        id: Date.now(),
        text: `${classroom}에 접속을 했습니다.`,
        expire: Date.now() + 100000,
      };
      setMessages((prevMessages) => [...prevMessages, joinMessage]);
      joinMessageAdded.current = true;
    }

    socket.on("message", (message) => {
      const expireTime =
        Date.now() + (message.messageType === "question" ? 120000 : 30000);
      const newMessage = {
        id: Date.now(),
        text: message.text,
        expire: expireTime,
        messageType: message.type,
        name: message.userName,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      window.electronAPI.playNotificationSound();
    });

    return () => {
      socket.off("message");
    };
  }, []);
  useEffect(() => {
    const handleClearLocalStorage = () => {
      localStorage.removeItem("selectedClassroom");
    };
    window.electronAPI.onClearLocalStorage(handleClearLocalStorage);
  }, []);
  return (
    <Container>
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          messageType={msg.messageType}
          style={{
            opacity:
              1 - messages.indexOf(msg) * 0.1 > 0
                ? 1 - messages.indexOf(msg) * 0.1
                : 0.1,
          }}
        >
          <MessageName>{msg.name}</MessageName> {/* 이름 표시 */}
          {msg.text}
        </MessageBubble>
      ))}
    </Container>
  );
}

// 스타일 정의

const Container = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  opacity: 0.8;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  
  max-width: 600px;
  align-items: flex-end;
`;

const slideInAndUp = keyframes`
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  2% {  // 빠르게 올라옵니다.
    transform: translateY(0);
    opacity: 1;
  }
  95% { // 지속 시간이 끝나기 직전까지 유지합니다.
    transform: translateY(0);
    opacity: 1;
  }
  100% { // 빠르게 사라집니다.
    transform: translateY(-100%);
    opacity: 0;
  }
`;

const MessageBubble = styled.div`
  margin-bottom: 10px;
  padding: 5px 10px;
  background-color: ${({ messageType }) =>
    messageType === "question" ? "#0f9d58" : "#0164d8"};
  border: 1px solid #202c39;
  color: #fff;
  font-family: "Noto Sans KR";
  font-weight: bold;
  border-radius: 10px;
  font-size: 1.5rem;
  word-wrap: break-word;
  animation: ${slideInAndUp}
    ${({ messageType }) => (messageType === "question" ? "90s" : "25s")}
    forwards; // 조절된 지속 시간
`;

const MessageName = styled.div`
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 5px;
  color: black;
`;
