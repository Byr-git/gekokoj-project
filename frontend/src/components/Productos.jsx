import { useCarrito } from '../CarritoContext.jsx'
import ProductoCard from './ProductoCard.jsx'

export default function Productos() {
	const { productos, cargando, error, recargar } = useCarrito()

	return (
		<section id="productos" className="productos section-container">
			<div className="seccion-cabecera">
				<h2 className="seccion-titulo">NUESTROS PRODUCTOS</h2>
				<p className="seccion-descripcion">Conoce las aves y productos que tenemos disponibles para ti</p>
			</div>

			<div className="productos__contenedor" aria-live="polite" aria-busy={cargando}>
				{cargando && <p className="productos__estado">Cargando productos…</p>}

				{!cargando && error && (
					<div className="productos__estado productos__estado--error">
						<p>No pudimos cargar los productos. Revisa tu conexión e inténtalo de nuevo.</p>
						<button className="button button--secondary" type="button" onClick={recargar}>
							Reintentar
						</button>
					</div>
				)}

				{!cargando && !error && productos.length === 0 && (
					<p className="productos__estado">Todavía no hay productos disponibles. Vuelve pronto.</p>
				)}

				{!cargando && !error && productos.map((producto) => (
					<ProductoCard key={producto._id} producto={producto} />
				))}
			</div>
		</section>
	)
}
