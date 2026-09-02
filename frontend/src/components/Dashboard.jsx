import { useNavigate } from 'react-router-dom'

function Dashboard() {
    const navigate = useNavigate()
    
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