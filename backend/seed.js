require('dotenv').config()

const mongoose = require('mongoose')
const { Producto } = require('./productos')

// Datos base del catálogo. El stock y el precio solo se usan al crear
// un producto nuevo: si ya existe, se conservan los valores de la base de datos.
const productos = [
	{
		nombre: 'Gallo',
		categoria: 'Aves de corral',
		descripcion: 'Gallos destinados a reproducción y crianza, seleccionados según disponibilidad.',
		imagen: '/assets/images/gallo.jpg',
		precio: 10,
		stock: 20,
		unidadVenta: 'Unidad'
	},
	{
		nombre: 'Gallina',
		categoria: 'Aves de corral',
		descripcion: 'Gallinas para crianza y producción de huevos, disponibles según edad y características.',
		imagen: '/assets/images/gallina.jpg',
		precio: 12,
		stock: 20,
		unidadVenta: 'Unidad'
	},
	{
		nombre: 'Pollito',
		categoria: 'Aves de corral',
		descripcion: 'Pollitos para quienes desean comenzar o ampliar su crianza de aves.',
		imagen: '/assets/images/pollito.jpg',
		precio: 3,
		stock: 20,
		unidadVenta: 'Unidad'
	},
	{
		nombre: 'Huevo Gallina',
		categoria: 'Huevos',
		descripcion: 'Huevos seleccionados para ofrecer frescura y calidad, disponibles según producción.',
		imagen: '/assets/images/huevos-pollo.jpg',
		precio: 3.8,
		stock: 20,
		unidadVenta: 'Cubeta de 30 unidades'
	},
	{
		nombre: 'Codorniz Macho',
		categoria: 'Aves de corral',
		descripcion: 'Codorniz destinada a reproducción y crianza, seleccionada según disponibilidad.',
		imagen: '/assets/images/codorniz-macho.jpg',
		precio: 8,
		stock: 20,
		unidadVenta: 'Unidad'
	},
	{
		nombre: 'Codorniz Hembra',
		categoria: 'Aves de corral',
		descripcion: 'Codorniz para crianza y producción de huevos, disponible según edad y características.',
		imagen: '/assets/images/codorniz-hembra.jpg',
		precio: 10,
		stock: 20,
		unidadVenta: 'Unidad'
	},
	{
		nombre: 'Pollito Codorniz',
		categoria: 'Aves de corral',
		descripcion: 'Pollitos para quienes desean comenzar o ampliar su crianza de aves.',
		imagen: '/assets/images/codorniz-pollito.jpg',
		precio: 5,
		stock: 20,
		unidadVenta: 'Unidad'
	},
	{
		nombre: 'Huevo Codorniz',
		categoria: 'Huevos',
		descripcion: 'Huevos seleccionados para ofrecer frescura y calidad, disponibles según producción.',
		imagen: '/assets/images/huevos-cordorniz.jpg',
		precio: 5,
		stock: 20,
		unidadVenta: 'Cubeta de 30 unidades'
	}
]

async function cargarProductos() {
	try {
		await mongoose.connect(process.env.MONGODB_URI)
		console.log('Conexión con MongoDB establecida')
	} catch (error) {
		console.error('Error al conectar con MongoDB:', error.message)
		process.exit(1)
	}

	let creados = 0
	let actualizados = 0

	for (const producto of productos) {
		const resultado = await Producto.updateOne(
			{ nombre: producto.nombre },
			{
				$set: {
					categoria: producto.categoria,
					descripcion: producto.descripcion,
					imagen: producto.imagen,
					unidadVenta: producto.unidadVenta
				},
				$setOnInsert: {
					precio: producto.precio,
					stock: producto.stock,
					activo: true
				}
			},
			{ upsert: true }
		)

		if (resultado.upsertedCount > 0) {
			creados += 1
		} else if (resultado.modifiedCount > 0) {
			actualizados += 1
		}
	}

	console.log(`Catálogo cargado: ${creados} creados, ${actualizados} actualizados`)
	await mongoose.disconnect()
}

cargarProductos().catch(async (error) => {
	console.error('Error al cargar el catálogo:', error.message)
	await mongoose.disconnect()
	process.exit(1)
})
