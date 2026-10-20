
const express = require('express')

const aplicacion = express()
const puerto = 3000

// Permite recibir datos en formato JSON
aplicacion.use(express.json())

// Datos temporales
let productos = [
	{"id": 1, "nombre": "Gallo","categoria": "Aves de corral", "stock": 20, "precio": 10, "unidadVenta": "Unidad"},
	{"id": 2, "nombre": "Gallina","categoria": "Aves de corral", "stock": 20, "precio": 12, "unidadVenta": "Unidad"},
	{"id": 3, "nombre": "Pollito","categoria": "Aves de corral", "stock": 20, "precio": 3, "unidadVenta": "Unidad"},
	{"id": 4, "nombre": "Huevo Gallina","categoria": "Huevos", "stock": 20, "precio": 3.80, "unidadVenta": "Cubeta de 30 unidades"},
	{"id": 5, "nombre": "Codorniz Macho","categoria": "Aves de corral", "stock": 20, "precio": 8, "unidadVenta": "Unidad"},
	{"id": 6, "nombre": "Codorniz Hembra","categoria": "Aves de corral", "stock": 20, "precio": 10, "unidadVenta": "Unidad"},
	{"id": 7, "nombre": "Pollito Codorniz","categoria": "Aves de corral", "stock": 20, "precio": 5, "unidadVenta": "Unidad"},
	{"id": 8, "nombre": "Huevo Codorniz","categoria": "Huevos", "stock": 20, "precio": 5, "unidadVenta": "Cubeta de 30 unidades"},
]
let siguienteId = Math.max(0, ...productos.map(producto => producto.id)) + 1

function validarProducto({ nombre, categoria, stock, precio, unidadVenta }) {
	return (
		typeof nombre === 'string' &&
		nombre.trim() !== '' &&
		typeof categoria === 'string' &&
		categoria.trim() !== '' &&
		typeof unidadVenta === 'string' &&
		unidadVenta.trim() !== '' &&
		stock !== undefined &&
		stock !== null &&
		stock !== '' &&
		Number.isFinite(Number(stock)) &&
		Number(stock) >= 0 &&
		precio !== undefined &&
		precio !== null &&
		precio !== '' &&
		Number.isFinite(Number(precio)) &&
		Number(precio) >= 0
	)
}

// GET: obtener todos los productos
aplicacion.get('/api/productos', (req, res) => {
	res.json(productos)
})

// GET: obtener un producto por su ID
aplicacion.get('/api/productos/:id', (req, res) => {
	const id = Number(req.params.id)

	const producto = productos.find(producto => producto.id === id)

	if (!producto) {
		return res.status(404).json({
			error: 'Producto no encontrado'
		})
	}

	res.json(producto)
})

// POST: crear un producto
aplicacion.post('/api/productos', (req, res) => {
	const { nombre, categoria, stock, precio, unidadVenta } = req.body

	if (!validarProducto(req.body)) {
		return res.status(400).json({
			error: 'Debes proporcionar nombre, categoría, stock, unidad de venta y un precio válidos'
		})
	}

	const nuevoProducto = {
		id: siguienteId++,
		nombre: nombre.trim(),
		categoria: categoria.trim(),
		stock: Number(stock),
		precio: Number(precio),
		unidadVenta: unidadVenta.trim()
	}

	productos.push(nuevoProducto)

	res.status(201).json(nuevoProducto)
})

// PUT: actualizar un producto
aplicacion.put('/api/productos/:id', (req, res) => {
	const id = Number(req.params.id)

	const producto = productos.find(producto => producto.id === id)

	if (!producto) {
		return res.status(404).json({
			error: 'Producto no encontrado'
		})
	}

	const { nombre, categoria, stock, precio, unidadVenta } = req.body

	if (!validarProducto(req.body)) {
		return res.status(400).json({
			error: 'Debes proporcionar nombre, categoría, stock, unidad de venta y un precio válidos'
		})
	}
	
	producto.nombre = nombre.trim()
	producto.categoria = categoria.trim()
	producto.stock = Number(stock)
	producto.precio = Number(precio)
	producto.unidadVenta = unidadVenta.trim()

	res.json(producto)
})

// DELETE: eliminar un producto
aplicacion.delete('/api/productos/:id', (req, res) => {
	const id = Number(req.params.id)

	const indice = productos.findIndex(producto => producto.id === id)

	if (indice === -1) {
		return res.status(404).json({
			error: 'Producto no encontrado'
		})
	}

	const [productoEliminado] = productos.splice(indice, 1)

	res.json({
		mensaje: 'Producto eliminado correctamente',
		producto: productoEliminado
	})
})

// Iniciar el servidor
aplicacion.listen(puerto, () => {
	console.log(`Servidor de Gekokoj en http://localhost:${puerto}`)
})
