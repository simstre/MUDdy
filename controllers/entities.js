const {Player} = require('../lib/entities')
const {datastoreController} = require('./datastore')

class EntitiesController {
	createPlayer(name, cb) {
		this.getPlayer(name, (err, existingPlayer) => {
			if (err) {
				return cb(err)
			}
			// if (existingPlayer) {
			// 	return cb('player already exist under that name')
			// }
			const player = new Player(name)
			player.spawn((err, msg) => {
				if (err) {
					return cb(err)
				}
				datastoreController.savePlayer(player, (err) => {
					if (err) {
						return cb(err)
					}
					return cb(null, player, msg)
				})
			})
		})
	}

	getPlayer(playerName, cb) {
		return datastoreController.getPlayer(playerName, cb)
	}

	getPlayerPosition(playerName, cb) {
		this.getPlayer(playerName, (err, player) => {
			if (err || !player) {
				return cb(err || 'player not found')
			}
			player.getCurrentPosition((err, currentCell, currentMap) => {
				if (err) {
					return cb(err)
				}
				const positionData = {
					currentCoordinates: player.currentPosition,
					currentMapCoordinates: player.currentMapPosition,
					currentCell,
					currentMap
				}
				return cb(null, positionData)
			})
		})
	}

	moveNorth(playerName, cb) {
		this.getPlayer(playerName, (err, player) => {
			if (err) {
				return cb(err)
			}
			const curPos = player.currentPosition
			const curMapPos = player.currentMapPosition
			if (curPos[0] - 1 >= 0) {
				return player.moveTo(curPos[1], curPos[0] - 1, curMapPos[0], curMapPos[1], cb)
			}
			// TODO: handle out of bound - move to the map above
		})
	}

	moveSouth(playerName, cb) {
		this.getPlayer(playerName, (err, player) => {
			if (err) {
				return cb(err)
			}

			player.getCurrentPosition((err, currentCell, currentMap) => {
				if (err) {
					return cb(err)
				}

				const curPos = player.currentPosition
				const curMapPos = player.currentMapPosition
				let targetCell
				try {
					targetCell = currentMap.cells[curPos[0]+1][curPos[1]]
				}
				catch (error) {
					// TODO: handle out of bound - move to the map below if there is one
					return cb(`invalid coordinates, err: ${error}`)
				}

				return player.moveTo(curPos[1], curPos[0] + 1, curMapPos[0], curMapPos[1], cb)
			})
		})
	}
}

let entitiesController
if (!entitiesController) {
	entitiesController = new EntitiesController()
}
module.exports = {entitiesController}