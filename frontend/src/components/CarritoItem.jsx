import { useState } from 'react'
import { formatearPrecio } from '../api.js'
import { useCarrito } from '../CarritoContext.jsx'

export default function CarritoItem({ linea }) {
	const { cambiarCantidad, quitar, notificar } = useCarrito()
	const [imagenFallida, setImagenFallida] = useState(false)

	const { producto, cantidad, subtotal } = linea
	const stock = Math.max(0, Number(producto.stock) || 0)
	const id = String(producto._id)

	const sumar = () => {
		const resultado = cambiarCantidad(id, cantidad + 1)

		if (!resultado.ok && resultado.motivo === 'stock') {
			notificar(`Solo hay ${stock} unidades disponibles.`, 'aviso')
		}
	}

	const restar = () => {
		cambiarCantidad(id, cantidad - 1)
	}

	const eliminar = () => {
		quitar(id)
		notificar(`${producto.nombre} se quitó del carrito.`)
	}

	return (
		<li className="carrito__item" data-id={id}>
			<img
				className="carrito__item-img"
				src={imagenFallida ? '/assets/logo.svg' : (producto.imagen || '/assets/logo.svg')}
				alt=""
				loading="lazy"
				onError={() => setImagenFallida(true)}
			/>

			<div className="carrito__item-info">
				<h3 className="carrito__item-nombre">{producto.nombre}</h3>
				<p className="carrito__item-detalle">
					{formatearPrecio(producto.precio)} c/u · {producto.unidadVenta || 'Unidad'}
				</p>

				<div className="carrito__item-controles">
					<button
						className="carrito__item-boton"
						type="button"
						data-accion="restar"
						aria-label={`Quitar una unidad de ${producto.nombre}`}
						onClick={restar}
					>
						−
					</button>

					<span className="carrito__item-cantidad">{cantidad}</span>

					<button
						className="carrito__item-boton"
						type="button"
						data-accion="sumar"
						aria-label={`Agregar una unidad de ${producto.nombre}`}
						disabled={cantidad >= stock}
						onClick={sumar}
					>
						+
					</button>
				</div>
			</div>

			<div className="carrito__item-lado">
				<span className="carrito__item-subtotal">{formatearPrecio(subtotal)}</span>
				<button
					className="carrito__item-quitar"
					type="button"
					data-accion="quitar"
					aria-label={`Quitar ${producto.nombre} del carrito`}
					onClick={eliminar}
				>
					Quitar
				</button>
			</div>
		</li>
	)
}
