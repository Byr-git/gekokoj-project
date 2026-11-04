import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { consultarSesion, iniciarSesion } from '../../api.js'

export default function AdminLogin() {
	const navegar = useNavigate()
	const [usuario, setUsuario] = useState('')
	const [contrasenia, setContrasenia] = useState('')
	const [enviando, setEnviando] = useState(false)
	const [error, setError] = useState(null)
	const [verificado, setVerificado] = useState(false)
	const [sesionActiva, setSesionActiva] = useState(false)

	// Si ya hay una sesión activa, se salta el formulario directamente.
	const verificarSesionExistente = async () => {
		const activa = await consultarSesion()

		if (activa) {
			setSesionActiva(true)
		}

		setVerificado(true)
	}

	useEffect(() => {
		verificarSesionExistente()
	}, [])

	if (!verificado) {
		return (
			<main className="admin__carga">
				<p>Comprobando sesión…</p>
			</main>
		)
	}

	if (sesionActiva) {
		return <Navigate to="/admin" replace />
	}

	const enviar = async (evento) => {
		evento.preventDefault()

		if (enviando) {
			return
		}

		if (!usuario.trim() || !contrasenia) {
			setError('Completa el usuario y la contraseña')
			return
		}

		setEnviando(true)
		setError(null)

		try {
			await iniciarSesion({ usuario: usuario.trim(), contrasenia })
			navegar('/admin', { replace: true })
		} catch (fallo) {
			setError(fallo.message)
			setEnviando(false)
		}
	}

	return (
		<main className="admin admin__inicio">
			<section className="admin-login" aria-labelledby="titulo-sesion">
				<h1 id="titulo-sesion" className="admin-login__titulo">PANEL DE ADMINISTRADOR</h1>
				<p className="admin-login__descripcion">Ingresa tus credenciales para gestionar los productos de la tienda.</p>

				<form className="admin-login__formulario" onSubmit={enviar} noValidate>
					<div className="formulario__grupo">
						<label className="formulario__etiqueta" htmlFor="campo-usuario">Usuario</label>
						<input
							id="campo-usuario"
							className="formulario__input formulario__input--dark"
							type="text"
							autoComplete="username"
							value={usuario}
							onChange={(evento) => setUsuario(evento.target.value)}
							disabled={enviando}
						/>
					</div>

					<div className="formulario__grupo">
						<label className="formulario__etiqueta" htmlFor="campo-contrasenia">Contraseña</label>
						<input
							id="campo-contrasenia"
							className="formulario__input formulario__input--dark"
							type="password"
							autoComplete="current-password"
							value={contrasenia}
							onChange={(evento) => setContrasenia(evento.target.value)}
							disabled={enviando}
						/>
					</div>

					{error && (
						<p className="admin-login__error" role="alert">{error}</p>
					)}

					<button
						className="button button--primary admin-login__boton"
						type="submit"
						disabled={enviando}
					>
						{enviando ? 'Ingresando…' : 'Iniciar sesión'}
					</button>
				</form>

				<a href="/" className="admin-login__regreso">Volver a la tienda</a>
			</section>
		</main>
	)
}
