import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import styled from "styled-components";

const buildings = [
  "AI관",
  "비전타워",
  "반도체대학",
  "가천관",
  "한의과대학",
  "교육대학원",
  "공과대학2",
  "글로벌센터",
  "예술대학2",
  "바이오나노대학",
  "법과대학",
  "공과대학1",
];

function generateClassrooms(building) {
  let classrooms = [];
  for (let floor = 1; floor <= 10; floor++) {
    for (let room = 1; room <= 30; room++) {
      classrooms.push(`${building}-${floor * 100 + room}`);
    }
  }
  return classrooms;
}

export default function Settings() {
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const temporaryClassroom = localStorage.getItem("temporaryClassroom");
  const navigate = useNavigate();

  useEffect(() => {
    if (temporaryClassroom) {
      const building = temporaryClassroom.split("-")[0];
      setSelectedBuilding(building);
      setSelectedClassroom(temporaryClassroom);
      setClassrooms(generateClassrooms(building));
    }
  }, [temporaryClassroom]);


  const handleAuthentication = async () => {
    if (!password) {
      alert("비밀번호를 입력해주세요.");
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/adminLogin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        const error = await response.json();
        alert(
          error.message +
            "\n다시 입력하려면 다른 곳을 클릭했다가 다시 클릭해주세요."
        );
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다.");
    }
  };

  const handleRegistration = () => {
    if (
      temporaryClassroom &&
      (selectedClassroom !== temporaryClassroom || selectedBuilding !== temporaryClassroom.split("-")[0]) &&
      !isAuthenticated
    ) {
      alert("먼저 비밀번호를 인증해주세요.");
      return;
    }
    const classroomToStore = `${selectedBuilding}-${selectedClassroom.split("-")[1]}`;
    localStorage.setItem("selectedClassroom", classroomToStore);
    localStorage.setItem("temporaryClassroom", classroomToStore);
  
   
    window.electronAPI.setIgnoreMouseEvents(true);
    navigate("/chat");
  };

  useEffect(() => {
    const storedClassroom = localStorage.getItem("selectedClassroom");
    if (storedClassroom) {
      window.electronAPI.setIgnoreMouseEvents(true);
      navigate("/chat");
    }
  }, [navigate]);

  useEffect(() => {
    if (selectedBuilding) {
      setClassrooms(generateClassrooms(selectedBuilding));
    } else {
      setClassrooms([]);
    }
  }, [selectedBuilding]);

  useEffect(() => {
    if (
      (selectedClassroom === temporaryClassroom &&
        selectedBuilding === temporaryClassroom.split("-")[0]) ||
      !temporaryClassroom
    ) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [selectedClassroom, temporaryClassroom, selectedBuilding]);

  return (
    <Container>
      <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
        {!temporaryClassroom
          ? "강의실을 선택해주세요"
          : `현재 강의실 : ${temporaryClassroom}`}
      </div>
      {!isAuthenticated && (
        <p>다른 강의실로 변경하려면 비밀번호 인증이 필요합니다.</p>
      )}
      <div>
        <Select
          options={buildings.map((building) => ({
            value: building,
            label: building,
          }))}
          onChange={({ value }) => setSelectedBuilding(value)}
          placeholder="건물을 선택해주세요."
          value={
            selectedBuilding
              ? { value: selectedBuilding, label: selectedBuilding }
              : null
          }
        />
        <Select
          options={classrooms.map((classroom) => ({
            value: classroom,
            label: classroom.split("-")[1],
          }))}
          onChange={({ value }) => setSelectedClassroom(value)}
          placeholder="호수를 선택해주세요."
          isDisabled={!selectedBuilding}
          value={
            selectedClassroom
              ? {
                  value: selectedClassroom,
                  label: selectedClassroom.split("-")[1],
                }
              : null
          }
        />
      </div>
      {(temporaryClassroom && (selectedClassroom !== temporaryClassroom || selectedBuilding !== temporaryClassroom.split("-")[0])) && (
        <>
          <PasswordInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요."
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAuthentication();
            }}
          />
          <Button onClick={handleAuthentication} disabled={isAuthenticated}>
            인증하기
          </Button>
        </>
      )}
      <Button
        onClick={handleRegistration}
        disabled={!isAuthenticated && (selectedClassroom !== temporaryClassroom || selectedBuilding !== temporaryClassroom.split("-")[0])}
      >
        {temporaryClassroom !== selectedClassroom ? "등록하기" : "저장하기"}
      </Button>
    </Container>
  );
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "Noto Sans KR";
  background-color: grey;
  gap: 0.5rem;
  color: black;
  height: 95vh;
`;

const PasswordInput = styled.input`
  margin-top: 0.5rem;
  padding: 0.5rem;
  font-size: 1rem;
  font-family: "Noto Sans KR";
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #0164d8;
  color: white;
  font-family: "Noto Sans KR";
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.8;
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    &:hover {
      opacity: 1;
    }
  }
`;
