import { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import io from 'socket.io-client'
const socket = io(import.meta.env.VITE_API_URL) 

export default function Chat() {
  const [messages, setMessages] = useState([])
  const joinMessageAdded = useRef(false); 

  useEffect(() => {
    // 로컬 스토리지에서 초기 데이터를 비동기로 불러옵니다.
    const classroom = localStorage.getItem('selectedClassroom')
    socket.emit('joinRoom', classroom)
    
    if (!joinMessageAdded.current) {
      const joinMessage = { id: Date.now(), text: `${classroom}에 접속을 했습니다.`, expire: Date.now() + 10000 };
      setMessages((prevMessages) => [...prevMessages, joinMessage]);
      joinMessageAdded.current = true; 
    }
    socket.on('message', (message) => {
      const expireTime = Date.now() + 10000
      // 서버로부터 받은 메시지가 객체 형태인 경우 message.text를 사용
      // 문자열인 경우 바로 message를 사용
      const text = message.text ? message.text : message
      const newMessage = { id: Date.now(), text: text, expire: expireTime }
      setMessages((prevMessages) => [...prevMessages, newMessage])
    })

    // 1초마다 만료된 메시지 제거
    const interval = setInterval(() => {
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.expire > Date.now()))
    }, 1000)

    return () => {
      clearInterval(interval) // 컴포넌트 언마운트 시 인터벌 정리
      socket.off('message')
    }
  }, [])
  useEffect(() => {
    const handleClearLocalStorage = () => {
      localStorage.removeItem('selectedClassroom');
    };
    window.electronAPI.onClearLocalStorage(handleClearLocalStorage);
  }, []);
  return (
    <Container>
      {messages.map((msg) => (
        <MessageBubble key={msg.id}>{msg.text}</MessageBubble>
      ))}
    </Container>
  )
}

const Container = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 2rem;
  display: flex;
  flex-direction: column; // 메시지를 아래에서 위로 쌓도록 설정
  align-items: flex-end;
`

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
`

const MessageBubble = styled.div`
  max-width: 600px;
  margin-bottom: 10px;
  padding: 5px 10px;
  background-color: #0164d8;
  border: 1px solid #202c39;
  color: #fff;
  font-family: 'Noto Sans KR';
  font-weight: bold;
  border-radius: 10px;
  font-size: 1.5rem;
  word-wrap: break-word;
  animation: ${slideInAndUp} 10s forwards; // 총 애니메이션 시간을 10초로 설정
`
