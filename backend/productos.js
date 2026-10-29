const express = require('express')
const mongoose = require('mongoose')

const esquemaProducto = new mongoose.Schema({
	nombre: {
		type: String,
		required: [true, 'El nombre es obligatorio'],
		trim: true
	},
	categoria: {
		type: String,
		required: [true, 'La categoría es obligatoria'],
		trim: true
	},
	descripcion: {
		type: String,
		default: '',
		trim: true
	},
	imagen: {
		type: String,
		default: '',
		trim: true
	},
	stock: {
		type: Number,
		required: [true, 'El stock es obligatorio'],
		min: [0, 'El stock no puede ser negativo']
	},
	precio: {
		type: Number,
		required: [true, 'El precio es obligatorio'],
		min: [0, 'El precio no puede ser negativo']
	},
	unidadVenta: {
		type: String,
		required: [true, 'La unidad de venta es obligatoria'],
		trim: true
	},
	activo: {
		type: Boolean,
		default: true
	}
}, {
	timestamps: true
})

const Producto = mongoose.model('Producto', esquemaProducto)

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

function validarId(id) {
	return mongoose.isValidObjectId(id)
}

function construirDatosProducto({ nombre, categoria, descripcion, imagen, stock, precio, unidadVenta, activo }) {
	const datos = {
		nombre: nombre.trim(),
		categoria: categoria.trim(),
		descripcion: typeof descripcion === 'string' ? descripcion.trim() : '',
		imagen: typeof imagen === 'string' ? imagen.trim() : '',
		stock: Number(stock),
		precio: Number(precio),
		unidadVenta: unidadVenta.trim()
	}

	if (activo !== undefined) {
		datos.activo = activo === true || activo === 'true'
	}

	return datos
}

const router = express.Router()

// GET: todos los productos (incluye inactivos con ?todos=true)
router.get('/', async (req, res) => {
	const filtro = req.query.todos === 'true' ? {} : { activo: { $ne: false } }
	const productos = await Producto.find(filtro).sort({ createdAt: 1 })
	res.json(productos)
})

// GET: un producto por ID
router.get('/:id', async (req, res) => {
	const { id } = req.params

	if (!validarId(id)) {
		return res.status(400).json({ error: 'El ID del producto no es válido' })
	}

	const producto = await Producto.findById(id)

	if (!producto) {
		return res.status(404).json({ error: 'Producto no encontrado' })
	}

	res.json(producto)
})

// POST: crear producto
router.post('/', async (req, res) => {
	if (!validarProducto(req.body)) {
		return res.status(400).json({
			error: 'Debes proporcionar nombre, categoría, stock, unidad de venta y un precio válidos'
		})
	}

	const nuevoProducto = await Producto.create(construirDatosProducto(req.body))
	res.status(201).json(nuevoProducto)
})

// PUT: actualizar producto
router.put('/:id', async (req, res) => {
	const { id } = req.params

	if (!validarId(id)) {
		return res.status(400).json({ error: 'El ID del producto no es válido' })
	}

	if (!validarProducto(req.body)) {
		return res.status(400).json({
			error: 'Debes proporcionar nombre, categoría, stock, unidad de venta y un precio válidos'
		})
	}

	const producto = await Producto.findById(id)

	if (!producto) {
		return res.status(404).json({ error: 'Producto no encontrado' })
	}

	const datos = construirDatosProducto(req.body)

	producto.set({
		...datos,
		descripcion: req.body.descripcion === undefined ? producto.descripcion : datos.descripcion,
		imagen: req.body.imagen === undefined ? producto.imagen : datos.imagen,
		activo: req.body.activo === undefined ? producto.activo : datos.activo
	})

	await producto.save()
	res.json(producto)
})

// DELETE: eliminar producto
router.delete('/:id', async (req, res) => {
	const { id } = req.params

	if (!validarId(id)) {
		return res.status(400).json({ error: 'El ID del producto no es válido' })
	}

	const producto = await Producto.findByIdAndDelete(id)

	if (!producto) {
		return res.status(404).json({ error: 'Producto no encontrado' })
	}

	res.json({
		mensaje: 'Producto eliminado correctamente',
		producto
	})
})

module.exports = { Producto, router }
