import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { obtenerCatalogoCompleto, eliminarProducto, actualizarProducto, cerrarSesion, formatearPrecio } from '../../api.js'
import FormularioProducto from './FormularioProducto.jsx'

export default function PanelAdmin() {
	const navegar = useNavigate()
	const [productos, setProductos] = useState([])
	const [cargando, setCargando] = useState(true)
	const [error, setError] = useState(null)
	const [busqueda, setBusqueda] = useState('')
	const [productoEditando, setProductoEditando] = useState(null) // null | producto | 'nuevo'
	const [trabajandoEn, setTrabajandoEn] = useState(null) // id en operación
	const [aviso, setAviso] = useState(null)

	const cargar = useCallback(async () => {
		setCargando(true)
		setError(null)

		try {
			const datos = await obtenerCatalogoCompleto()
			setProductos(datos)
		} catch (fallo) {
			console.error('Error al cargar el catálogo del panel:', fallo)
			setError(fallo)
		} finally {
			setCargando(false)
		}
	}, [])

	useEffect(() => {
		cargar()
	}, [cargar])

	const filtrados = useMemo(() => {
		const texto = busqueda.trim().toLowerCase()

		if (!texto) {
			return productos
		}

		return productos.filter((producto) => (
			producto.nombre?.toLowerCase().includes(texto) ||
			producto.categoria?.toLowerCase().includes(texto)
		))
	}, [productos, busqueda])

	const notificar = useCallback((mensaje) => {
		setAviso(mensaje)
	}, [])

	useEffect(() => {
		if (!aviso) {
			return undefined
		}

		const temporizador = setTimeout(() => setAviso(null), 4000)
		return () => clearTimeout(temporizador)
	}, [aviso])

	const cambiarVisibilidad = async (producto) => {
		if (trabajandoEn) {
			return
		}

		setTrabajandoEn(producto._id)

		try {
			const actualizado = await actualizarProducto(producto._id, {
				nombre: producto.nombre,
				categoria: producto.categoria,
				descripcion: producto.descripcion,
				imagen: producto.imagen,
				stock: producto.stock,
				precio: producto.precio,
				unidadVenta: producto.unidadVenta,
				activo: !producto.activo
			})

			setProductos((previos) => previos.map((elemento) => (
				elemento._id === actualizado._id ? { ...elemento, ...actualizado } : elemento
			)))
			notificar(actualizado.activo
				? `"${actualizado.nombre}" ahora es visible en la tienda`
				: `"${actualizado.nombre}" quedó oculto para los clientes`)
		} catch (fallo) {
			setError(fallo)
		} finally {
			setTrabajandoEn(null)
		}
	}

	const eliminar = async (producto) => {
		if (trabajandoEn) {
			return
		}

		if (!window.confirm(`¿Eliminar "${producto.nombre}" definitivamente? Esta acción no se puede deshacer.`)) {
			return
		}

		setTrabajandoEn(producto._id)

		try {
			await eliminarProducto(producto._id)
			setProductos((previos) => previos.filter((elemento) => elemento._id !== producto._id))
			notificar(`"${producto.nombre}" fue eliminado`)
		} catch (fallo) {
			setError(fallo)
		} finally {
			setTrabajandoEn(null)
		}
	}

	const guardarProducto = async (guardado) => {
		setProductoEditando(null)
		await cargar()

		notificar(productoEditando === 'nuevo'
			? `"${guardado.nombre}" fue creado correctamente`
			: `"${guardado.nombre}" fue actualizado correctamente`)
	}

	const cerrarSesionAdmin = async () => {
		try {
			await cerrarSesion()
		} finally {
			navegar('/admin/login', { replace: true })
		}
	}

	const activo = !cargando && !error && productos.length > 0

	return (
		<main className="admin">
			<header className="admin__cabecera">
				<div>
					<h1 className="admin__titulo">PANEL DE ADMINISTRADOR</h1>
					<p className="admin__descripcion">Gestiona el catálogo de productos de la tienda</p>
				</div>

				<div className="admin__cabecera-acciones">
					<button
						className="button button--primary admin__boton"
						type="button"
						onClick={() => setProductoEditando('nuevo')}
					>
						Nuevo producto
					</button>

					<button
						className="button button--secondary admin__boton"
						type="button"
						onClick={cerrarSesionAdmin}
					>
						Cerrar sesión
					</button>

					<Link to="/" className="admin__enlace">Ver tienda</Link>
				</div>
			</header>

			{aviso && <p className="admin__aviso" role="status">{aviso}</p>}

			<div className="admin__controles">
				<input
					className="formulario__input admin__busqueda"
					type="search"
					placeholder="Buscar por nombre o categoría…"
					value={busqueda}
					onChange={(evento) => setBusqueda(evento.target.value)}
					aria-label="Buscar productos"
				/>
				<span className="admin__conteo">
					{filtrados.length} {filtrados.length === 1 ? 'producto' : 'productos'}
				</span>
			</div>

			<div className="admin__tabla-contenedor" aria-live="polite" aria-busy={cargando}>
				{cargando && <p className="admin__estado">Cargando productos…</p>}

				{!cargando && error && (
					<div className="admin__estado admin__estado--error">
						<p>{error.message}</p>
						<button className="button button--secondary admin__boton" type="button" onClick={cargar}>
							Reintentar
						</button>
					</div>
				)}

				{!cargando && !error && productos.length === 0 && (
					<p className="admin__estado">Todavía no hay productos. Crea el primero con "Nuevo producto".</p>
				)}

				{!cargando && !error && productos.length > 0 && filtrados.length === 0 && (
					<p className="admin__estado">Ningún producto coincide con la búsqueda.</p>
				)}

				{activo && filtrados.length > 0 && (
					<table className="admin-tabla">
						<thead>
							<tr>
								<th scope="col">Nombre</th>
								<th scope="col">Categoría</th>
								<th scope="col">Precio</th>
								<th scope="col">Stock</th>
								<th scope="col">Unidad</th>
								<th scope="col">Estado</th>
								<th scope="col">Acciones</th>
							</tr>
						</thead>
						<tbody>
							{filtrados.map((producto) => (
								<tr key={producto._id} data-visible={producto.activo !== false}>
									<td data-titulo="Nombre">{producto.nombre}</td>
									<td data-titulo="Categoría">{producto.categoria}</td>
									<td data-titulo="Precio">{formatearPrecio(producto.precio)}</td>
									<td data-titulo="Stock">{producto.stock}</td>
									<td data-titulo="Unidad">{producto.unidadVenta}</td>
									<td data-titulo="Estado">
										<span className={producto.activo !== false ? 'admin-tabla__estado admin-tabla__estado--activo' : 'admin-tabla__estado'}>
											{producto.activo !== false ? 'Visible' : 'Oculto'}
										</span>
									</td>
									<td data-titulo="Acciones">
										<div className="admin-tabla__acciones">
											<button
												className="admin-tabla__accion"
												type="button"
												onClick={() => setProductoEditando(producto)}
												disabled={trabajandoEn === producto._id}
											>
												Editar
											</button>

											<button
												className="admin-tabla__accion"
												type="button"
												onClick={() => cambiarVisibilidad(producto)}
												disabled={trabajandoEn === producto._id}
											>
												{producto.activo !== false ? 'Ocultar' : 'Mostrar'}
											</button>

											<button
												className="admin-tabla__accion admin-tabla__accion--peligro"
												type="button"
												onClick={() => eliminar(producto)}
												disabled={trabajandoEn === producto._id}
											>
												Eliminar
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>

			{productoEditando && (
				<FormularioProducto
					producto={productoEditando === 'nuevo' ? null : productoEditando}
					onExito={guardarProducto}
					onCancelar={() => setProductoEditando(null)}
				/>
			)}
		</main>
	)
}
