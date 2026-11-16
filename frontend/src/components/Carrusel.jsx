import { Children, useCallback, useEffect, useRef, useState } from 'react'

export default function Carrusel({ children, ariaLabel = 'Carrusel', claveContenido = '' }) {
	const pistaRef = useRef(null)
	const [puedeRetroceder, setPuedeRetroceder] = useState(false)
	const [puedeAvanzar, setPuedeAvanzar] = useState(false)
	const [desborda, setDesborda] = useState(false)

	const actualizarBotones = useCallback(() => {
		const pista = pistaRef.current

		if (!pista) {
			return
		}

		const { scrollLeft, scrollWidth, clientWidth } = pista
		setDesborda(scrollWidth > clientWidth + 1)
		setPuedeRetroceder(scrollLeft > 1)
		setPuedeAvanzar(scrollLeft < scrollWidth - clientWidth - 1)
	}, [])

	useEffect(() => {
		const pista = pistaRef.current

		if (!pista) {
			return
		}

		actualizarBotones()

		pista.addEventListener('scroll', actualizarBotones, { passive: true })

		const observador = new ResizeObserver(actualizarBotones)
		observador.observe(pista)

		return () => {
			pista.removeEventListener('scroll', actualizarBotones)
			observador.disconnect()
		}
	}, [actualizarBotones])

	// Vuelve al inicio solo cuando cambia el contenido (p. ej. al recargar productos),
	// no en cada re-render del padre
	useEffect(() => {
		const pista = pistaRef.current

		if (!pista) {
			return
		}

		pista.scrollTo({ left: 0 })
		actualizarBotones()
	}, [claveContenido, actualizarBotones])

	const desplazar = (direccion) => {
		const pista = pistaRef.current

		if (!pista) {
			return
		}

		const primeraTarjeta = pista.firstElementChild
		const estilo = getComputedStyle(pista)
		const brecha = parseFloat(estilo.columnGap || estilo.gap) || 0
		const paso = primeraTarjeta
			? primeraTarjeta.getBoundingClientRect().width + brecha
			: pista.clientWidth

		pista.scrollBy({
			left: direccion * paso,
			behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
				? 'auto'
				: 'smooth',
		})
	}

	if (Children.count(children) === 0) {
		return null
	}

	return (
		<div className="carrusel" role="region" aria-label={ariaLabel}>
			<div className="carrusel__pista" ref={pistaRef}>
				{children}
			</div>

			{desborda && (
				<div className="carrusel__controles">
					<button
						className="carrusel__boton carrusel__boton--anterior"
						type="button"
						aria-label="Productos anteriores"
						disabled={!puedeRetroceder}
						onClick={() => desplazar(-1)}
					>
						‹
					</button>

					<button
						className="carrusel__boton carrusel__boton--siguiente"
						type="button"
						aria-label="Productos siguientes"
						disabled={!puedeAvanzar}
						onClick={() => desplazar(1)}
					>
						›
					</button>
				</div>
			)}
		</div>
	)
}
