import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { API_URL } from '../config/api.js'

function RotaProtegida({ children }) {
    const [autenticado, setAutenticado] = useState(null)
    
    
    useEffect(() => {
        async function verificarToken() {
            const token = localStorage.getItem('token')
            
            if (!token) {
                return <Navigate to="/login" replace />
            }

            const response = await fetch(`${API_URL}/perfil`, {
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