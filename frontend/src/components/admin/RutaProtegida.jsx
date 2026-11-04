import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { consultarSesion } from '../../api.js'

// Protege las rutas del panel: sin sesión activa redirige al inicio de sesión.
export default function RutaProtegida({ children }) {
	const [estado, setEstado] = useState('comprobando') // comprobando | permitido | bloqueado

	useEffect(() => {
		let vivo = true

		const comprobar = async () => {
			const activa = await consultarSesion()

			if (vivo) {
				setEstado(activa ? 'permitido' : 'bloqueado')
			}
		}

		comprobar()

		return () => {
			vivo = false
		}
	}, [])

	if (estado === 'comprobando') {
		return (
			<main className="admin__carga">
				<p>Verificando sesión…</p>
			</main>
		)
	}

	if (estado === 'bloqueado') {
		return <Navigate to="/admin/login" replace />
	}

	return children
}
