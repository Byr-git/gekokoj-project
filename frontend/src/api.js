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

	return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`
}
