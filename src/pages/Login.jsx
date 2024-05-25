import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function Login() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const verifyToken = useCallback(async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/verifyToken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        navigate("/settings");
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("토큰 검증 실패:", error);
      localStorage.removeItem("token");
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      verifyToken(token);
    }
  }, [verifyToken]);

  const handleLogin = async (event) => {
    event.preventDefault(); // 폼 제출 기본 동작 막기

    if (!password) {
      alert("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.accessToken);
        navigate("/settings");
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다.");
    }
  };

  return (
    <LoginContainer>
      <Form onSubmit={handleLogin}>
        <Title>클라톡 채팅용 로그인</Title>
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Login</Button>
      </Form>
    </LoginContainer>
  );
}

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Noto Sans KR";
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  text-align: center;
`;

const Input = styled.input`
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  font-family: "Noto Sans KR";
`;

const Button = styled.button`
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  font-family: "Noto Sans KR";

  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: #0056b3;
  }
`;
