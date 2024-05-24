import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import styled from 'styled-components'

const buildings = [
  'AI관',
  '비전타워',
  '반도체대학',
  '가천관',
  '한의과대학',
  '교육대학원',
  '공과대학2',
  '글로벌센터',
  '예술대학2',
  '바이오나노대학',
  '법과대학',
  '공과대학1'
]

function generateClassrooms(building) {
  let classrooms = []
  for (let floor = 1; floor <= 10; floor++) {
    for (let room = 1; room <= 30; room++) {
      classrooms.push(`${building}-${floor * 100 + room}`)
    }
  }
  return classrooms
}

export default function Settings() {
  const [selectedBuilding, setSelectedBuilding] = useState('')
  const [classrooms, setClassrooms] = useState([])
  const [selectedClassroom, setSelectedClassroom] = useState('')
  const navigate = useNavigate()
  
  window.electronAPI.setIgnoreMouseEvents(false) //login에서 setting 올 때 mouseEventTrue 되는 것 방지

  const handleRegistration = () => {
    localStorage.setItem('selectedClassroom', selectedClassroom)
    navigate('/chat')
  }
  useEffect(() => {
    const storedClassroom = localStorage.getItem('selectedClassroom');
    if (storedClassroom) {
      navigate('/chat');
    }
  }, [navigate]);

  useEffect(() => {
    if (selectedBuilding) {
      setClassrooms(generateClassrooms(selectedBuilding))
    } else {
      setClassrooms([])
    }
  }, [selectedBuilding])


  return (
    <Container>
      <Select
        options={buildings.map((building) => ({ value: building, label: building }))}
        onChange={({ value }) => setSelectedBuilding(value)}
        placeholder="건물을 선택해주세요."
      />
      <Select
        options={classrooms.map((classroom) => ({
          value: classroom,
          label: classroom.split('-')[1]
        }))}
        onChange={({ value }) => setSelectedClassroom(value)}
        placeholder="호수를 선택해주세요."
        isDisabled={!selectedBuilding}
      />
      <Button onClick={handleRegistration}>등록하기</Button>
    </Container>
  )
}

const Container = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;  
  justify-content: center;
  height: 100vh;

  font-family: 'Noto Sans KR';
`

const Button = styled.button`
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #0164d8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.8;
  }
`
