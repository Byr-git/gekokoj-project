import { useEffect, useRef } from 'react'
import { formatearPrecio, generarUrlWhatsApp, pluralizar } from '../api.js'
import { useCarrito } from '../CarritoContext.jsx'
import CarritoItem from './CarritoItem.jsx'

const ENFOCABLES = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

export default function Carrito({ abierto, onCerrar }) {
	const { lineas, total, cantidadTotal, vacio, vaciar, notificar } = useCarrito()
	const panelRef = useRef(null)
	const focoPrevio = useRef(null)

	useEffect(() => {
		if (!abierto) {
			return undefined
		}

		focoPrevio.current = document.activeElement
		document.body.classList.add('sin-scroll')
		panelRef.current?.focus()

		const manejarTeclado = (evento) => {
			if (evento.key === 'Escape') {
				evento.preventDefault()
				onCerrar()
				return
			}

			if (evento.key !== 'Tab') {
				return
			}

			const panel = panelRef.current

			if (!panel) {
				return
			}

			const enfocables = Array.from(panel.querySelectorAll(ENFOCABLES))
				.filter((elemento) => elemento.offsetParent !== null)

			if (enfocables.length === 0) {
				return
			}

			const primero = enfocables[0]
			const ultimo = enfocables[enfocables.length - 1]

			if (evento.shiftKey && (document.activeElement === primero || document.activeElement === panel)) {
				evento.preventDefault()
				ultimo.focus()
			} else if (!evento.shiftKey && document.activeElement === ultimo) {
				evento.preventDefault()
				primero.focus()
			}
		}

		document.addEventListener('keydown', manejarTeclado)

		return () => {
			document.removeEventListener('keydown', manejarTeclado)
			document.body.classList.remove('sin-scroll')

			if (focoPrevio.current && typeof focoPrevio.current.focus === 'function') {
				focoPrevio.current.focus()
			}
		}
	}, [abierto, onCerrar])

	const finalizarPedido = () => {
		if (vacio) {
			notificar('Tu carrito está vacío.', 'aviso')
			return
		}

		const sinStock = lineas.find(({ producto, cantidad }) => (
			cantidad > Math.max(0, Number(producto.stock) || 0)
		))

		if (sinStock) {
			notificar(`Revisa la cantidad de ${sinStock.producto.nombre}: el stock cambió.`, 'aviso')
			return
		}

		const url = generarUrlWhatsApp(lineas, total)
		const ventana = window.open(url, '_blank', 'noopener,noreferrer')

		if (!ventana) {
			window.location.href = url
			return
		}

		notificar('Pedido preparado en WhatsApp. Envíalo para confirmarlo.')
	}

	const vaciarCarrito = () => {
		vaciar()
		notificar('Carrito vaciado.')
	}

	return (
		<div className={abierto ? 'carrito carrito--abierto' : 'carrito'} id="carrito">
			<div className="carrito__fondo" onClick={onCerrar} />

			<aside
				className="carrito__panel"
				role="dialog"
				aria-modal="true"
				aria-labelledby="carrito-titulo"
				tabIndex={-1}
				ref={panelRef}
			>
				<header className="carrito__cabecera">
					<div className="carrito__cabecera-texto">
						<h2 className="carrito__titulo" id="carrito-titulo">Tu carrito</h2>
						<p className="carrito__contador" id="carrito-contador">
							{pluralizar(cantidadTotal, 'producto', 'productos')}
						</p>
					</div>
					<button
						className="carrito__cerrar"
						id="carrito-cerrar"
						type="button"
						aria-label="Cerrar carrito"
						onClick={onCerrar}
					>
						×
					</button>
				</header>

				<div className="carrito__cuerpo">
					{vacio ? (
						<div className="carrito__vacio" id="carrito-vacio">
							<img className="carrito__vacio-img" src="/assets/logo.svg" alt="" />
							<p className="carrito__vacio-titulo">Tu carrito está vacío</p>
							<p className="carrito__vacio-texto">Agrega productos para preparar tu pedido.</p>
							<a className="button button--primary" href="#productos" onClick={onCerrar}>
								Ver productos
							</a>
						</div>
					) : (
						<ul className="carrito__lista" id="carrito-lista">
							{lineas.map((linea) => (
								<CarritoItem key={String(linea.producto._id)} linea={linea} />
							))}
						</ul>
					)}
				</div>

				{!vacio && (
					<footer className="carrito__pie" id="carrito-pie">
						<div className="carrito__totales">
							<span className="carrito__totales-etiqueta">Total</span>
							<strong className="carrito__total" id="carrito-total">{formatearPrecio(total)}</strong>
						</div>

						<button
							className="button button--primary carrito__finalizar"
							id="carrito-finalizar"
							type="button"
							onClick={finalizarPedido}
						>
							Finalizar pedido
							<img className="icon-dark" src="/assets/icons/send-horizontal.svg" alt="" />
						</button>

						<button
							className="carrito__vaciar"
							id="carrito-vaciar"
							type="button"
							onClick={vaciarCarrito}
						>
							Vaciar carrito
						</button>
					</footer>
				)}
			</aside>
		</div>
	)
}
