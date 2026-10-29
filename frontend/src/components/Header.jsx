import { useState } from 'react'
import { pluralizar } from '../api.js'
import { useCarrito } from '../CarritoContext.jsx'

const enlaces = [
	{ href: '#inicio', texto: 'Inicio', icono: 'house.svg' },
	{ href: '#productos', texto: 'Productos', icono: 'store.svg' },
	{ href: '#nosotros', texto: 'Nosotros', icono: 'heart.svg' },
	{ href: '#contacto', texto: 'Contacto', icono: 'message-circle.svg' }
]

export default function Header({ onAbrirCarrito }) {
	const { cantidadTotal } = useCarrito()
	const [menuAbierto, setMenuAbierto] = useState(false)

	const cerrarMenu = () => setMenuAbierto(false)

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

				<nav className={menuAbierto ? 'nav visible' : 'nav'} id="nav">
					<ul className="nav__lista">
						<button className="nav__close" id="nav-close" type="button" aria-label="Cerrar menú" onClick={cerrarMenu}>
							<img className="icon-light" src="/assets/icons/menu.svg" alt="" />
						</button>

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
			</div>
		</header>
	)
}
