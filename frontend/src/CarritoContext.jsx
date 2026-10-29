import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { CLAVE_CARRITO, obtenerProductos } from './api.js'

const CarritoContext = createContext(null)

function normalizarItems(datos) {
	if (!Array.isArray(datos)) {
		return []
	}

	const vistos = new Set()

	return datos.reduce((resultado, item) => {
		const id = item && typeof item.id === 'string' ? item.id : ''
		const cantidad = Number(item && item.cantidad)

		if (!id || !Number.isInteger(cantidad) || cantidad <= 0 || vistos.has(id)) {
			return resultado
		}

		vistos.add(id)
		resultado.push({ id, cantidad })
		return resultado
	}, [])
}

function leerCarrito() {
	try {
		const guardado = localStorage.getItem(CLAVE_CARRITO)
		return guardado ? normalizarItems(JSON.parse(guardado)) : []
	} catch (error) {
		console.warn('El carrito guardado no es válido, se reinicia:', error)
		return []
	}
}

function guardarCarrito(items) {
	try {
		localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items))
	} catch (error) {
		console.warn('No se pudo guardar el carrito en el navegador:', error)
	}
}

// Ajusta el carrito guardado al catálogo real de la base de datos.
function reconciliar(items, productos) {
	const mapa = new Map(productos.map((producto) => [String(producto._id), producto]))
	const mensajes = []
	const siguientes = []

	for (const item of items) {
		const producto = mapa.get(item.id)

		if (!producto) {
			mensajes.push('Quitamos un producto del carrito porque ya no está disponible.')
			continue
		}

		const stock = Math.max(0, Number(producto.stock) || 0)

		if (stock === 0) {
			mensajes.push(`"${producto.nombre}" está agotado y se quitó del carrito.`)
			continue
		}

		if (item.cantidad > stock) {
			mensajes.push(`Ajustamos "${producto.nombre}" a ${stock} unidades disponibles.`)
			siguientes.push({ id: item.id, cantidad: stock })
			continue
		}

		siguientes.push(item)
	}

	return { siguientes, mensajes }
}

export function CarritoProvider({ children }) {
	const [productos, setProductos] = useState([])
	const [cargando, setCargando] = useState(true)
	const [error, setError] = useState(null)
	const [items, setItems] = useState(leerCarrito)
	const [toast, setToast] = useState(null)

	const itemsRef = useRef(items)
	const cargaIniciada = useRef(false)

	useEffect(() => {
		itemsRef.current = items
		guardarCarrito(items)
	}, [items])

	useEffect(() => {
		if (!toast) {
			return undefined
		}

		const temporizador = setTimeout(() => setToast(null), 3200)
		return () => clearTimeout(temporizador)
	}, [toast])

	const mapa = useMemo(() => (
		new Map(productos.map((producto) => [String(producto._id), producto]))
	), [productos])

	const notificar = useCallback((mensaje, tipo = 'info') => {
		setToast({ mensaje, tipo, id: Date.now() })
	}, [])

	const cargar = useCallback(async () => {
		setCargando(true)
		setError(null)

		try {
			const datos = await obtenerProductos()
			const { siguientes, mensajes } = reconciliar(itemsRef.current, datos)

			setProductos(datos)
			setItems(siguientes)

			if (mensajes.length > 0) {
				notificar(mensajes[0], 'aviso')
			}
		} catch (fallo) {
			console.error('Error al cargar el catálogo:', fallo)
			setError(fallo)
		} finally {
			setCargando(false)
		}
	}, [notificar])

	useEffect(() => {
		if (cargaIniciada.current) {
			return
		}

		cargaIniciada.current = true
		cargar()
	}, [cargar])

	const cantidadDe = useCallback((id) => {
		const item = items.find((elemento) => elemento.id === String(id))
		return item ? item.cantidad : 0
	}, [items])

	const agregar = useCallback((id) => {
		const clave = String(id)
		const producto = mapa.get(clave)

		if (!producto) {
			return { ok: false, motivo: 'no-existe' }
		}

		const stock = Math.max(0, Number(producto.stock) || 0)

		if (stock === 0) {
			return { ok: false, motivo: 'agotado' }
		}

		const cantidadActual = items.find((item) => item.id === clave)?.cantidad || 0

		if (cantidadActual >= stock) {
			return { ok: false, motivo: 'stock', stock }
		}

		setItems((previos) => {
			const existente = previos.find((item) => item.id === clave)
			const cantidadActualizada = existente ? existente.cantidad : 0

			// Verificación dentro del actualizador: evita superar el stock
			// cuando llegan varios clics antes del siguiente render.
			if (cantidadActualizada >= stock) {
				return previos
			}

			if (existente) {
				return previos.map((item) => (
					item.id === clave ? { ...item, cantidad: item.cantidad + 1 } : item
				))
			}

			return [...previos, { id: clave, cantidad: 1 }]
		})

		return { ok: true, cantidad: cantidadActual + 1 }
	}, [items, mapa])

	const cambiarCantidad = useCallback((id, cantidad) => {
		const clave = String(id)
		const producto = mapa.get(clave)
		const numero = Math.floor(Number(cantidad))

		if (!producto || !Number.isFinite(numero)) {
			return { ok: false, motivo: 'no-existe' }
		}

		if (numero <= 0) {
			setItems((previos) => previos.filter((item) => item.id !== clave))
			return { ok: true, cantidad: 0 }
		}

		const stock = Math.max(0, Number(producto.stock) || 0)

		if (numero > stock) {
			return { ok: false, motivo: 'stock', stock }
		}

		setItems((previos) => {
			const existente = previos.find((item) => item.id === clave)

			if (existente) {
				return previos.map((item) => (item.id === clave ? { ...item, cantidad: numero } : item))
			}

			return [...previos, { id: clave, cantidad: numero }]
		})

		return { ok: true, cantidad: numero }
	}, [mapa])

	const disminuir = useCallback((id) => {
		const cantidadActual = cantidadDe(id)

		if (cantidadActual <= 0) {
			return { ok: false, motivo: 'vacio' }
		}

		return cambiarCantidad(id, cantidadActual - 1)
	}, [cambiarCantidad, cantidadDe])

	const quitar = useCallback((id) => {
		const clave = String(id)
		setItems((previos) => previos.filter((item) => item.id !== clave))
	}, [])

	const vaciar = useCallback(() => {
		setItems([])
	}, [])

	const lineas = useMemo(() => items.reduce((resultado, item) => {
		const producto = mapa.get(item.id)

		if (!producto) {
			return resultado
		}

		resultado.push({
			producto,
			cantidad: item.cantidad,
			subtotal: Number(producto.precio) * item.cantidad
		})

		return resultado
	}, []), [items, mapa])

	const total = useMemo(() => (
		lineas.reduce((suma, linea) => suma + linea.subtotal, 0)
	), [lineas])

	const cantidadTotal = useMemo(() => (
		lineas.reduce((suma, linea) => suma + linea.cantidad, 0)
	), [lineas])

	const valor = useMemo(() => ({
		productos,
		cargando,
		error,
		recargar: cargar,
		lineas,
		total,
		cantidadTotal,
		vacio: lineas.length === 0,
		toast,
		notificar,
		cantidadDe,
		agregar,
		disminuir,
		cambiarCantidad,
		quitar,
		vaciar
	}), [
		productos,
		cargando,
		error,
		cargar,
		lineas,
		total,
		cantidadTotal,
		toast,
		notificar,
		cantidadDe,
		agregar,
		disminuir,
		cambiarCantidad,
		quitar,
		vaciar
	])

	return (
		<CarritoContext.Provider value={valor}>
			{children}
		</CarritoContext.Provider>
	)
}

export function useCarrito() {
	const contexto = useContext(CarritoContext)

	if (!contexto) {
		throw new Error('useCarrito debe usarse dentro de CarritoProvider')
	}

	return contexto
}
