class DatastoreController {
	constructor() {
		this.players = new Map()
	}

	getPlayer(playerName, cb) {
		const player = this.players.get(playerName)
		return cb(null, player)
	}

	getAllPlayers(cb) {
		return cb(null, this.players)
	}

	savePlayer(player, cb) {
		this.players.set(player.name, player)
		return cb()
	}

	removePlayer(playerName, cb) {
		this.players.delete(playerName)
		return cb()
	}
}

let datastoreController
if (!datastoreController) {
	datastoreController = new DatastoreController()
}
module.exports = {datastoreController}