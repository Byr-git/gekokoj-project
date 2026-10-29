import { useState } from 'react'
import { formatearPrecio } from '../api.js'
import { useCarrito } from '../CarritoContext.jsx'

export default function ProductoCard({ producto }) {
	const { cantidadDe, agregar, disminuir, notificar } = useCarrito()
	const [imagenFallida, setImagenFallida] = useState(false)

	const id = String(producto._id)
	const stock = Math.max(0, Number(producto.stock) || 0)
	const agotado = stock === 0
	const cantidad = cantidadDe(id)
	const esHuevo = String(producto.categoria || '').toLowerCase().includes('huevo')
	const unidad = String(producto.unidadVenta || 'unidad').toLowerCase()

	const alSumar = () => {
		const resultado = agregar(id)

		if (resultado.ok) {
			return
		}

		if (resultado.motivo === 'stock') {
			notificar(`Solo hay ${stock} unidades de ${producto.nombre}.`, 'aviso')
		} else if (resultado.motivo === 'agotado') {
			notificar(`${producto.nombre} está agotado.`, 'aviso')
		}
	}

	const alRestar = () => {
		const resultado = disminuir(id)

		if (resultado.ok && resultado.cantidad === 0) {
			notificar(`${producto.nombre} se quitó del carrito.`)
		}
	}

	return (
		<article className={agotado ? 'tarjeta tarjeta--agotada' : 'tarjeta'} data-id={id}>
			<img
				className={imagenFallida ? 'tarjeta__img tarjeta__img--respaldo' : 'tarjeta__img'}
				src={imagenFallida ? '/assets/logo.svg' : (producto.imagen || '/assets/logo.svg')}
				alt={producto.nombre}
				loading="lazy"
				onError={() => setImagenFallida(true)}
			/>

			<div className="tarjeta__contenido">
				<h3 className={`tarjeta__titulo ${esHuevo ? 'tarjeta__titulo--huevo' : 'tarjeta__titulo--pluma'}`}>
					{producto.nombre}
				</h3>
				<span className="tarjeta__subtitulo">Venta por {unidad}</span>
				<p className="tarjeta__descripcion">{producto.descripcion}</p>
				<span className={agotado ? 'tarjeta__stock tarjeta__stock--agotado' : 'tarjeta__stock'}>
					{agotado ? 'Agotado por el momento' : `${stock} disponibles`}
				</span>
			</div>

			<div className="tarjeta__acciones-contenedor">
				<span className="tarjeta__precio">{formatearPrecio(producto.precio)}</span>

				<div className="tarjeta__acciones">
					<button
						className="tarjeta__boton"
						type="button"
						data-accion="disminuir"
						aria-label={`Quitar una unidad de ${producto.nombre}`}
						disabled={cantidad <= 0}
						onClick={alRestar}
					>
						−
					</button>

					<span className="tarjeta__cantidad" data-cantidad={id} aria-live="polite">{cantidad}</span>

					<button
						className="tarjeta__boton"
						type="button"
						data-accion="aumentar"
						aria-label={`Agregar una unidad de ${producto.nombre}`}
						disabled={agotado || cantidad >= stock}
						onClick={alSumar}
					>
						+
					</button>
				</div>
			</div>
		</article>
	)
}
