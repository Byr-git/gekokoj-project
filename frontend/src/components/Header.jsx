import { useEffect, useRef, useState } from 'react'
import { pluralizar } from '../api.js'
import { useCarrito } from '../CarritoContext.jsx'

const ENFOCABLES = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

const enlaces = [
	{ href: '#inicio', texto: 'Inicio', icono: 'house.svg' },
	{ href: '#productos', texto: 'Productos', icono: 'store.svg' },
	{ href: '#nosotros', texto: 'Nosotros', icono: 'heart.svg' },
	{ href: '#contacto', texto: 'Contacto', icono: 'message-circle.svg' }
]

export default function Header({ onAbrirCarrito }) {
	const { cantidadTotal } = useCarrito()
	const [menuAbierto, setMenuAbierto] = useState(false)
	const navRef = useRef(null)

	const cerrarMenu = () => setMenuAbierto(false)

	useEffect(() => {
		if (!menuAbierto) {
			return undefined
		}

		const focoPrevio = document.activeElement
		document.body.classList.add('sin-scroll')
		navRef.current?.focus()

		const manejarTeclado = (evento) => {
			if (evento.key === 'Escape') {
				evento.preventDefault()
				setMenuAbierto(false)
				return
			}

			if (evento.key !== 'Tab') {
				return
			}

			const nav = navRef.current

			if (!nav) {
				return
			}

			const enfocables = Array.from(nav.querySelectorAll(ENFOCABLES))
				.filter((elemento) => elemento.offsetParent !== null)

			if (enfocables.length === 0) {
				return
			}

			const primero = enfocables[0]
			const ultimo = enfocables[enfocables.length - 1]

			if (evento.shiftKey && (document.activeElement === primero || document.activeElement === nav)) {
				evento.preventDefault()
				ultimo.focus()
			} else if (!evento.shiftKey && document.activeElement === ultimo) {
				evento.preventDefault()
				primero.focus()
			}
		}

		document.addEventListener('keydown', manejarTeclado)

		return () => {
			document.body.classList.remove('sin-scroll')
			document.removeEventListener('keydown', manejarTeclado)

			if (focoPrevio && typeof focoPrevio.focus === 'function') {
				focoPrevio.focus()
			}
		}
	}, [menuAbierto])

	const etiquetaCarrito = cantidadTotal === 0
		? 'Abrir carrito de compras'
		: `Abrir carrito de compras, ${pluralizar(cantidadTotal, 'producto', 'productos')}`

	return (
		<header className="header">
			<div className="header__contenido section-container">
				<a href="#inicio" className="marca">
					<img className="marca__logo" src="/assets/logo.svg" alt="Gekokoj" />
					<div className="marca__info">
						<span className="marca__nombre">Gekokoj</span>
						<span className="marca__slogan">Cuidando nace la calidad</span>
					</div>
				</a>

				<nav
					className={menuAbierto ? 'nav visible' : 'nav'}
					id="nav"
					aria-label="Navegación principal"
					tabIndex={-1}
					ref={navRef}
				>
					<ul className="nav__lista">
						{enlaces.map(({ href, texto, icono }) => (
							<li className="nav__item" key={href}>
								<a className="nav__link" href={href} onClick={cerrarMenu}>
									<img className="nav__icono icon-light" src={`/assets/icons/${icono}`} alt="" />
									<span>{texto}</span>
								</a>
							</li>
						))}
					</ul>
				</nav>

				<div className="header__acciones">
					<button
						className="carrito-boton"
						id="carrito-abrir"
						type="button"
						aria-label={etiquetaCarrito}
						aria-haspopup="dialog"
						aria-controls="carrito"
						onClick={onAbrirCarrito}
					>
						<img className="icon-light" src="/assets/icons/shopping-cart.svg" alt="" />
						<span className="carrito-boton__badge" id="carrito-badge" hidden={cantidadTotal === 0} aria-hidden="true">
							{cantidadTotal}
						</span>
					</button>

					<button
						className="nav__open"
						id="nav-open"
						type="button"
						aria-label="Abrir menú"
						aria-expanded={menuAbierto}
						aria-controls="nav"
						onClick={() => setMenuAbierto(true)}
					>
						<img className="icon-light" src="/assets/icons/menu.svg" alt="" />
					</button>
				</div>

				<div
					className={menuAbierto ? 'nav__fondo nav__fondo--visible' : 'nav__fondo'}
					onClick={cerrarMenu}
					aria-hidden="true"
				/>
			</div>
		</header>
	)
}
