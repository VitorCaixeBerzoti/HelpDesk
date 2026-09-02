import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'


function Dashboard() {
  const navigate = useNavigate()
  const [chamados, setChamados] = useState([
    
    useEffect(() => {

      async function buscarChamados() {

        const token = localStorage.getItem('token')
        
        const response = await fetch('http://localhost:3000/chamados', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = await response.json()
          setChamados(data.chamados)

      }

      buscarChamados()

  }, [])
])
  
  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/login')
  }
    
    return (
    <div>
      <h1>Dashboard</h1>
      <p>Bem-vindo ao HelpDesk</p>

      <button onClick={handleLogout}>Sair</button>
    </div>
  )
}


export default Dashboard