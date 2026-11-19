const mongoose = require('mongoose')

let conexionMongo

async function conectarMongo() {
	if (!process.env.MONGODB_URI) {
		throw new Error('Falta configurar MONGODB_URI')
	}

	if (!conexionMongo) {
		conexionMongo = mongoose.connect(process.env.MONGODB_URI).catch((error) => {
			conexionMongo = null
			throw error
		})
	}

	return conexionMongo
}

module.exports = { conectarMongo }
