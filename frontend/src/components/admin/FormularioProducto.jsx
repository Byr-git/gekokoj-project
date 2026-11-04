import { useState } from 'react'
import { crearProducto, actualizarProducto } from '../../api.js'

const VALORES_INICIALES = {
	nombre: '',
	categoria: '',
	descripcion: '',
	imagen: '',
	stock: '',
	precio: '',
	unidadVenta: '',
	activo: true
}

function construirValores(producto) {
	if (!producto) {
		return { ...VALORES_INICIALES }
	}

	return {
		nombre: producto.nombre || '',
		categoria: producto.categoria || '',
		descripcion: producto.descripcion || '',
		imagen: producto.imagen || '',
		stock: String(producto.stock ?? ''),
		precio: String(producto.precio ?? ''),
		unidadVenta: producto.unidadVenta || '',
		activo: producto.activo !== false
	}
}

function validar(valores) {
	const errores = {}

	if (!valores.nombre.trim()) {
		errores.nombre = 'El nombre es obligatorio'
	}

	if (!valores.categoria.trim()) {
		errores.categoria = 'La categoría es obligatoria'
	}

	if (!valores.unidadVenta.trim()) {
		errores.unidadVenta = 'La unidad de venta es obligatoria'
	}

	const stock = Number(valores.stock)

	if (valores.stock === '' || !Number.isFinite(stock) || stock < 0) {
		errores.stock = 'Ingresa un stock mayor o igual a 0'
	}

	const precio = Number(valores.precio)

	if (valores.precio === '' || !Number.isFinite(precio) || precio < 0) {
		errores.precio = 'Ingresa un precio mayor o igual a 0'
	}

	return errores
}

export default function FormularioProducto({ producto, onExito, onCancelar }) {
	const enEdicion = Boolean(producto)
	const [valores, setValores] = useState(() => construirValores(producto))
	const [errores, setErrores] = useState({})
	const [enviando, setEnviando] = useState(false)
	const [errorServidor, setErrorServidor] = useState(null)

	const cambiar = (campo, valor) => {
		setValores((previos) => ({ ...previos, [campo]: valor }))
		setErrores((previos) => ({ ...previos, [campo]: undefined }))
	}

	const enviar = async (evento) => {
		evento.preventDefault()

		if (enviando) {
			return
		}

		const erroresDetectados = validar(valores)

		if (Object.keys(erroresDetectados).length > 0) {
			setErrores(erroresDetectados)
			return
		}

		setEnviando(true)
		setErrorServidor(null)

		const datos = {
			nombre: valores.nombre.trim(),
			categoria: valores.categoria.trim(),
			descripcion: valores.descripcion.trim(),
			imagen: valores.imagen.trim(),
			stock: Number(valores.stock),
			precio: Number(valores.precio),
			unidadVenta: valores.unidadVenta.trim(),
			activo: valores.activo
		}

		try {
			const guardado = enEdicion
				? await actualizarProducto(producto._id, datos)
				: await crearProducto(datos)

			onExito(guardado)
		} catch (fallo) {
			setErrorServidor(fallo.message)
			setEnviando(false)
		}
	}

	return (
		<div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="titulo-producto">
			<div className="admin-modal__tarjeta">
				<section className="formulario admin-modal__contenido" aria-labelledby="titulo-producto">
					<div className="formulario__cabecera">
						<h2 id="titulo-producto" className="formulario__titulo">
							{enEdicion ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO'}
						</h2>
					</div>

					<form className="admin-formulario" onSubmit={enviar} noValidate>
						<div className="formulario__grupo">
							<label className="formulario__etiqueta" htmlFor="campo-nombre">Nombre</label>
							<input
								id="campo-nombre"
								className="formulario__input"
								type="text"
								value={valores.nombre}
								onChange={(evento) => cambiar('nombre', evento.target.value)}
								disabled={enviando}
							/>
							{errores.nombre && <p className="admin-formulario__error">{errores.nombre}</p>}
						</div>

						<div className="admin-formulario__fila">
							<div className="formulario__grupo">
								<label className="formulario__etiqueta" htmlFor="campo-categoria">Categoría</label>
								<input
									id="campo-categoria"
									className="formulario__input"
									type="text"
									value={valores.categoria}
									onChange={(evento) => cambiar('categoria', evento.target.value)}
									disabled={enviando}
								/>
								{errores.categoria && <p className="admin-formulario__error">{errores.categoria}</p>}
							</div>

							<div className="formulario__grupo">
								<label className="formulario__etiqueta" htmlFor="campo-unidad">Unidad de venta</label>
								<input
									id="campo-unidad"
									className="formulario__input"
									type="text"
									placeholder="Ej.: unidad, caja, docena"
									value={valores.unidadVenta}
									onChange={(evento) => cambiar('unidadVenta', evento.target.value)}
									disabled={enviando}
								/>
								{errores.unidadVenta && <p className="admin-formulario__error">{errores.unidadVenta}</p>}
							</div>
						</div>

						<div className="admin-formulario__fila">
							<div className="formulario__grupo">
								<label className="formulario__etiqueta" htmlFor="campo-stock">Stock</label>
								<input
									id="campo-stock"
									className="formulario__input"
									type="number"
									min="0"
									step="1"
									value={valores.stock}
									onChange={(evento) => cambiar('stock', evento.target.value)}
									disabled={enviando}
								/>
								{errores.stock && <p className="admin-formulario__error">{errores.stock}</p>}
							</div>

							<div className="formulario__grupo">
								<label className="formulario__etiqueta" htmlFor="campo-precio">Precio (USD)</label>
								<input
									id="campo-precio"
									className="formulario__input"
									type="number"
									min="0"
									step="0.01"
									value={valores.precio}
									onChange={(evento) => cambiar('precio', evento.target.value)}
									disabled={enviando}
								/>
								{errores.precio && <p className="admin-formulario__error">{errores.precio}</p>}
							</div>
						</div>

						<div className="formulario__grupo">
							<label className="formulario__etiqueta" htmlFor="campo-imagen">URL de imagen</label>
							<input
								id="campo-imagen"
								className="formulario__input"
								type="text"
								placeholder="https://…"
								value={valores.imagen}
								onChange={(evento) => cambiar('imagen', evento.target.value)}
								disabled={enviando}
							/>
						</div>

						<div className="formulario__grupo">
							<label className="formulario__etiqueta" htmlFor="campo-descripcion">Descripción</label>
							<textarea
								id="campo-descripcion"
								className="formulario__textarea"
								value={valores.descripcion}
								onChange={(evento) => cambiar('descripcion', evento.target.value)}
								disabled={enviando}
							/>
						</div>

						<div className="formulario__grupo admin-formulario__interruptor">
							<label className="formulario__etiqueta" htmlFor="campo-activo">
								<input
									id="campo-activo"
									type="checkbox"
									checked={valores.activo}
									onChange={(evento) => cambiar('activo', evento.target.checked)}
									disabled={enviando}
								/>
								Producto visible en la tienda
							</label>
						</div>

						{errorServidor && <p className="admin-formulario__error" role="alert">{errorServidor}</p>}

						<div className="admin-formulario__acciones">
							<button
								className="button button--primary admin-formulario__boton"
								type="submit"
								disabled={enviando}
							>
								{enviando ? 'Guardando…' : (enEdicion ? 'Guardar cambios' : 'Crear producto')}
							</button>

							<button
								className="button button--secondary admin-formulario__boton"
								type="button"
								onClick={onCancelar}
								disabled={enviando}
							>
								Cancelar
							</button>
						</div>
					</form>
				</section>
			</div>
		</div>
	)
}
