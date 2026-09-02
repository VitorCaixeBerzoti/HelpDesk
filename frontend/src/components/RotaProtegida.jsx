import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function RotaProtegida({ children }) {
    const [autenticado, setAutenticado] = useState(null)
    
    
    useEffect(() => {
        async function verificarToken() {
            const token = localStorage.getItem('token')
            
            if (!token) {
                return <Navigate to="/login" replace />
            }

            const response = await fetch('http://localhost:3000/perfil', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
                
            })
            if(response.ok) {
                setAutenticado(true)
            }else {
                localStorage.removeItem('token')
                setAutenticado(false)
            }
            
        }
        
        verificarToken()
    }, [])

    if(autenticado === null) {
        return <p>Carregando...</p>
    }

    if (!autenticado) {
        return <Navigate to="/login" replace />
    }

    return children
}


export default RotaProtegida