import { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import io from "socket.io-client";

const socket = io(`${import.meta.env.VITE_API_URL}`, {
  query: {
    token: localStorage.getItem("token"), // JWT 토큰을 query에 포함
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
        expire: Date.now() + 10000,
      };
      setMessages((prevMessages) => [...prevMessages, joinMessage]);
      joinMessageAdded.current = true;
    }

    socket.on("message", (message) => {
      const expireTime = Date.now() + 10000;
      const text = message.text ? message.text : message;
      const newMessage = { id: Date.now(), text: text, expire: expireTime };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    // 사운드 재생 이벤트 처리
    window.electronAPI.onNewChatMessage((message) => {
      const audio = new Audio('assets/notification.mp3');
      audio.play();
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    const handleClearLocalStorage = () => {
      localStorage.removeItem("selectedClassroom");
    };
    window.electronAPI.onClearLocalStorage(handleClearLocalStorage);
  }, []);
  
  return (
    <Container>
      {messages.map((msg, index) => (
        <MessageBubble
          key={msg.id}
          style={{
            opacity: 1 - index * 0.1 > 0 ? 1 - index * 0.1 : 0.1, // opacity를 점진적으로 줄임
          }}
        >
          {msg.text}
        </MessageBubble>
      ))}
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  opacity: 0.8;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const slideInAndUp = keyframes`
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  10% {
    transform: translateY(0);
    opacity: 1;
  }
  90% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

const MessageBubble = styled.div`
  max-width: 600px;
  margin-bottom: 10px;
  padding: 5px 10px;
  background-color: #0164d8;
  border: 1px solid #202c39;
  color: #fff;
  font-family: "Noto Sans KR";
  font-weight: bold;
  border-radius: 10px;
  font-size: 1.5rem;
  word-wrap: break-word;
  animation: ${slideInAndUp} 30s forwards;
`;