const API_URL = import.meta.env.VITE_API_URL || '/api'

export const WHATSAPP_NUMERO = '593993232228'
export const CLAVE_CARRITO = 'gekokoj:carrito:v1'

const formatoMoneda = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD'
})

export function formatearPrecio(valor) {
	const numero = Number(valor)
	return formatoMoneda.format(Number.isFinite(numero) ? numero : 0)
}

export function pluralizar(cantidad, singular, plural) {
	return `${cantidad} ${cantidad === 1 ? singular : plural}`
}

export async function obtenerProductos() {
	const controlador = new AbortController()
	const temporizador = setTimeout(() => controlador.abort(), 10000)

	try {
		const respuesta = await fetch(`${API_URL}/productos`, {
			headers: { Accept: 'application/json' },
			signal: controlador.signal
		})

		if (!respuesta.ok) {
			throw new Error(`El servidor respondió con estado ${respuesta.status}`)
		}

		const productos = await respuesta.json()

		if (!Array.isArray(productos)) {
			throw new Error('La respuesta del servidor no es válida')
		}

		return productos
	} finally {
		clearTimeout(temporizador)
	}
}

export function construirEnlaceWhatsApp(mensaje) {
	return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`
}


export function abrirEnlaceWhatsApp(url) {
	const ventana = window.open(url, '_blank')

	if (ventana) {
		// Con _blank sin "noopener" hay que limpiar opener manualmente.
		ventana.opener = null
		return true
	}

	// Solo si el navegador bloqueó la pestaña nueva, navega en la misma.
	window.location.href = url
	return false
}

export function generarUrlWhatsApp(lineas, total) {
	const detalle = lineas.map(({ producto, cantidad, subtotal }) => (
		`• ${cantidad} x ${producto.nombre} — ${formatearPrecio(subtotal)}`
	))

	const mensaje = [
		'Hola Gekokoj, quiero realizar este pedido:',
		'',
		...detalle,
		'',
		`Total: ${formatearPrecio(total)}`,
		'',
		'Pedido generado desde el sitio web.'
	].join('\n')

	return construirEnlaceWhatsApp(mensaje)
}

/*
 Funciones de petición para el panel de administración

 Todas usan credentials: 'include' para que la cookie de sesión del
 administrador viaje con la solicitud.
*/

async function leerError(respuesta, mensajePorDefecto) {
	try {
		const datos = await respuesta.json()
		return datos?.error || mensajePorDefecto
	} catch {
		return mensajePorDefecto
	}
}

async function peticionJson(ruta, opciones = {}, mensajePorDefecto = 'Ocurrió un error inesperado') {
	const controlador = new AbortController()
	const temporizador = setTimeout(() => controlador.abort(), 10000)

	try {
		const respuesta = await fetch(`${API_URL}${ruta}`, {
			credentials: 'include',
			...opciones,
			headers: {
				Accept: 'application/json',
				...(opciones.body ? { 'Content-Type': 'application/json' } : {}),
				...(opciones.headers || {})
			},
			signal: controlador.signal
		})

		if (!respuesta.ok) {
			throw new Error(await leerError(respuesta, mensajePorDefecto))
		}

		return await respuesta.json()
	} finally {
		clearTimeout(temporizador)
	}
}

export async function iniciarSesion({ usuario, contrasenia }) {
	await peticionJson(
		'/auth/login',
		{ method: 'POST', body: JSON.stringify({ usuario, contrasenia }) },
		'No pudimos iniciar sesión. Inténtalo de nuevo.'
	)
	return true
}

export async function cerrarSesion() {
	await peticionJson(
		'/auth/logout',
		{ method: 'POST' },
		'No pudimos cerrar la sesión.'
	)
	return true
}

// Devuelve true si hay una sesión de administrador activa.
export async function consultarSesion() {
	try {
		const datos = await peticionJson('/auth/sesion')
		return datos?.autenticado === true
	} catch {
		return false
	}
}

export async function obtenerCatalogoCompleto() {
	const datos = await peticionJson(
		'/productos?todos=true',
		{},
		'No pudimos cargar el catálogo completo.'
	)

	if (!Array.isArray(datos)) {
		throw new Error('La respuesta del servidor no es válida')
	}

	return datos
}

export async function crearProducto(datos) {
	return peticionJson(
		'/productos',
		{ method: 'POST', body: JSON.stringify(datos) },
		'No pudimos crear el producto.'
	)
}

export async function actualizarProducto(id, datos) {
	return peticionJson(
		`/productos/${id}`,
		{ method: 'PUT', body: JSON.stringify(datos) },
		'No pudimos actualizar el producto.'
	)
}

export async function eliminarProducto(id) {
	return peticionJson(
		`/productos/${id}`,
		{ method: 'DELETE' },
		'No pudimos eliminar el producto.'
	)
}

