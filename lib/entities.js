const Config = require('../config.json')

const Types = {
	PLAYER: 'player',
	MONSTER: 'monster',
	NPC: 'npc'
}

const PlayableRaces = {
	HUMAN: 'human',
	ELF: 'elf',
	ORC: 'orc',
	DWARF: 'dwarf'
}

const MonsterRaces = {
	DRAGON: 'dragon',
	IMP: 'imp',
	SLIME: 'slime'
}

const NPCRaces = {
	GOBLIN: 'goblin',
	FAIRY: 'fairy'
}

const Propensities = {
	NEUTRAL: 'neutral',
	LAWFUL: 'lawful',
	CHAOTIC: 'chaotic'
}

/**
 * @constructor
 * @abstract
 */
class Character {
	constructor(type, race, options) {
		if (!Types?.[type.toUpperCase()]) {
			throw new Error('Invalid Character Type')
		}
		this.type = type

		if (race && !PlayableRaces?.[race.toUpperCase()]) {
			throw new Error('Invalid Character Race')
		}
		const playableRaceValues = Object.values(PlayableRaces)
		this.race = race || playableRaceValues[Math.floor(Math.random() * playableRaceValues.length)]
		this.level = 1

		const raceConfig = Config?.races?.[this.race] || {}
		this.baseHealth = raceConfig?.baseHealth
		this.baseAttack = raceConfig?.baseAttack
		this.totalHealth = this.baseHealth
		this.totalAttack = this.baseAttack
		this.title = options?.title
		this.resources = {}
		this.inventory = {}
		this.propensity = Propensities.NEUTRAL
		this.equipped = {}
	}

	getCurrentPosition(cb) {
		let currentMap, currentCell
		try {
			currentMap = Config?.world?.[this.currentMapPosition[1]][this.currentMapPosition[0]]
			currentCell = currentMap?.cells?.[this.currentPosition[1]][this.currentPosition[0]]
		}
		catch (error) {
			return cb(`invalid coordinates, err: ${error}`)
		}
		return cb(null, currentCell, currentMap)
	}

	getCell(x, y, mapX, mapY, cb) {
		if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0) {
			return cb('invalid coordinates')
		}

		if (!Number.isInteger(mapX) || !Number.isInteger(mapY) || mapX < 0 || mapY < 0) {
			return cb('invalid map coordinates')
		}

		let targetMap, targetCell
		try {
			targetMap = Config?.world?.[mapY][mapX]
			targetCell = targetMap?.cells?.[y][x]
		}
		catch (error) {
			return cb(`invalid coordinates, err: ${error}`)
		}
		return cb(null, targetCell, targetMap)
	}

	moveTo(x, y, mapX, mapY, cb) {
		this.getCell(x, y, mapX, mapY, (err, targetCell, targetMap) => {
			if (err) {
				return cb(err)
			}
			this.currentPosition = [y, x]
			this.currentMapPosition = [mapY, mapX]
			const msg = {
				mapName: targetMap.mapName,
				cellDesc: targetCell.desc
			}
			return cb(null, msg)
		})
	}

	spawn(cb) {
		this.currentPosition = [1, 1]
		this.currentMapPosition = [0, 0]
		const currentMap = Config?.world?.[0][0]
		const currentPositionInTheMap = currentMap?.cells?.[1][1]
		const msg = {
			mapName: currentMap.mapName,
			cellDesc: currentPositionInTheMap.desc
		}
		return cb(null, msg)
	}
}

class Player extends Character {
	constructor(name) {
		super(Types.PLAYER)
		this.uid = Date.now()
		this.created = Date.now()
		this.name = name
		this.exp = 0
		this.questPoints = {}
		this.titles = {}
	}
}

class Monster extends Character {
	constructor(race, passive, reactive, options) {
		super(Types.MONSTER, race)
		this.name = options?.name
		this.passive = passive
		this.reactive = reactive
	}
}

class NPC extends Character {
	constructor(race) {
		super(Types.NPC, race)
	}
}

module.exports = {
	Character,
	Player,
	Monster,
	NPC,
	Types,
	PlayableRaces
}