const express = require('express')
const playersRoutes = require('./routes/players')
const mapRoutes = require('./routes/map')
const questsRoutes = require('./routes/quests')
const redeemersRoutes = require('./routes/redeemers')

const app = express()
const port = 3000

app.use('/players', playersRoutes)
app.use('/map', mapRoutes)
app.use('/quests', questsRoutes)
app.use('/redeemers', redeemersRoutes)

app.get('/', (req, res) => {
	res.send('Welcome to MUDdy')
})

app.listen(port, () => {
	console.log(`MUD server running, listening to port ${port}`)
})