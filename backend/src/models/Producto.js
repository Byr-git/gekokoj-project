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

module.exports = { Producto }
