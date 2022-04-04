const express = require('express')
const app = express.Router()

const {entitiesController} = require('../controllers/entities')
const {datastoreController} = require('../controllers/datastore')

const paramNotFoundErrMsg = `required query param not found`
const defaultErrMsg = `I can see your dubious plan...You're not welcome here`

app.get('/join', (req, res) => {
	if (!req.query.name) {
		res.send(paramNotFoundErrMsg)
	}
	entitiesController.createPlayer(req.query.name, (err, player, msg) => {
		if (err || !player) {
			return res.send(defaultErrMsg)
		}
		res.send(`<p>Welcome ${player.name}, a furious warrior of ${player.race} race.<br/><span style="color: #a63333">You're starting in ${msg?.mapName}</span><br/><span style="color: #2ea3c7">"${msg?.cellDesc}"</span></p>`)
	})
})

app.get('/move_north', (req, res) => {
	if (!req.query.name) {
		res.send(paramNotFoundErrMsg)
	}
	entitiesController.moveNorth(req.query.name, (err, msg) => {
		if (err) {
			return res.send(defaultErrMsg)
		}
		res.send(`<p>Moved North. <br/><span style="color: #2ea3c7">"${msg?.cellDesc}"</span></p>`)
	})
})

app.get('/move_south', (req, res) => {
	if (!req.query.name) {
		res.send(paramNotFoundErrMsg)
	}
	entitiesController.moveSouth(req.query.name, (err, msg) => {
		if (err) {
			return res.send(defaultErrMsg)
		}
		res.send(`<p>Moved South. <br/><span style="color: #2ea3c7">"${msg?.cellDesc}"</span></p>`)
	})
})

app.get('/players', (req, res) => {
	if (!req.query.name) {
		res.send(paramNotFoundErrMsg)
	}
	entitiesController.getPlayer(req.query.name, (err, player) => {
		if (err) {
			res.send(err)
		}
		res.send(JSON.stringify(player))
	})
})

app.get('/players/position', (req, res) => {
	if (!req.query.name) {
		res.send(paramNotFoundErrMsg)
	}
	entitiesController.getPlayerPosition(req.query.name, (err, positionData) => {
		if (err || !positionData) {
			res.send(err || 'position not found')
		}
		res.send(`<p>Currently in ${positionData?.currentMap?.mapName} - at ${positionData?.currentCoordinates}</p>`)
	})
})

app.get('/players/all', (req, res) => {
	const allPlayers = []
	datastoreController.getAllPlayers((err, players) => {
		if (err) {
			res.send(err)
		}
		players.forEach((v) => {
			allPlayers.push(v)
		})
		res.send(JSON.stringify(allPlayers))
	})
})

module.exports = app