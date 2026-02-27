# MUDdy

A text-based Multi-User Dungeon (MUD) game server built with Node.js and Express. MUDdy provides a RESTful API that lets players join a fantasy world, explore a grid-based map, and interact with the environment -- all through HTTP endpoints.

## Features

- **Player creation** with randomly assigned fantasy races (Human, Elf, Dwarf, Orc), each with unique base stats and level-up multipliers
- **Grid-based world exploration** -- navigate north and south through named map areas with descriptive cells
- **Character system** supporting Players, Monsters, and NPCs with health, attack, inventory, equipment, and alignment (propensity) attributes
- **In-memory datastore** for fast, zero-dependency game state management
- **Configurable world and races** via a single `config.json` file

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 4.x
- **Data Storage:** In-memory (JavaScript `Map`)
- **License:** MIT

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- npm (included with Node.js)

## Installation

```bash
# Clone the repository
git clone https://github.com/simstre/MUDdy.git
cd MUDdy

# Install dependencies
npm install
```

## Usage

### Starting the Server

```bash
node app.js
```

The server starts on **port 3000** by default. You should see:

```
MUD server running, listening to port 3000
```

### API Endpoints

#### Root

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Welcome message |

#### Players

| Method | Endpoint | Query Params | Description |
|--------|----------|--------------|-------------|
| GET | `/players/join` | `name` (required) | Create a new player and spawn into the world |
| GET | `/players/players` | `name` (required) | Get a specific player's full data as JSON |
| GET | `/players/players/position` | `name` (required) | Get a player's current map and coordinates |
| GET | `/players/players/all` | -- | List all players currently in the game |
| GET | `/players/move_north` | `name` (required) | Move the named player one cell north |
| GET | `/players/move_south` | `name` (required) | Move the named player one cell south |

#### Example

```bash
# Join the game as "Gandalf"
curl "http://localhost:3000/players/join?name=Gandalf"

# Check your position
curl "http://localhost:3000/players/players/position?name=Gandalf"

# Move north
curl "http://localhost:3000/players/move_north?name=Gandalf"

# View all players
curl "http://localhost:3000/players/players/all"
```

#### Reserved Route Groups

The following route groups are mounted but not yet implemented:

| Prefix | Description |
|--------|-------------|
| `/map` | Map exploration endpoints (planned) |
| `/quests` | Quest system endpoints (planned) |
| `/redeemers` | Redeemer system endpoints (planned) |

## Project Structure

```
MUDdy/
├── app.js                  # Express application entry point; mounts all route groups
├── config.json             # Game configuration: race stats and world/map definitions
├── package.json            # Project metadata and dependencies
│
├── controllers/
│   ├── datastore.js        # In-memory data store (singleton) for player persistence
│   └── entities.js         # Game logic controller: player creation, movement, lookups
│
├── lib/
│   ├── entities.js         # Core domain models: Character, Player, Monster, NPC
│   ├── map.js              # Map module (placeholder)
│   ├── objectives.js       # Objectives module (placeholder)
│   ├── quests.js           # Quests module (placeholder)
│   └── redeemers.js        # Redeemers module (placeholder)
│
└── routes/
    ├── players.js          # Player-related HTTP routes (join, move, query)
    ├── map.js              # Map routes (placeholder)
    ├── quests.js           # Quest routes (placeholder)
    └── redeemers.js        # Redeemer routes (placeholder)
```

## Configuration

The `config.json` file defines two main sections:

### Races

Each playable race has base stats and level-up multipliers:

| Race  | Base Health | Base Attack | Health Multiplier | Attack Multiplier |
|-------|-------------|-------------|-------------------|-------------------|
| Human | 80          | 5           | 0.10              | 0.10              |
| Elf   | 70          | 6           | 0.09              | 0.11              |
| Dwarf | 90          | 4           | 0.13              | 0.09              |
| Orc   | 120         | 7           | 0.08              | 0.07              |

### World

The world is a 2D grid of map areas. Each map area contains a grid of cells, where each cell can have a description that is shown to the player upon entry. Players spawn at position `[1, 1]` in the first map area ("Valley of the Frogs").

## Architecture

MUDdy follows a layered architecture:

1. **Routes** (`routes/`) -- Define HTTP endpoints and handle request/response formatting
2. **Controllers** (`controllers/`) -- Contain game logic and orchestrate operations between the data layer and domain models
3. **Lib / Domain Models** (`lib/`) -- Define core entities (`Character`, `Player`, `Monster`, `NPC`) with their attributes and behaviors (movement, spawning, position tracking)

The `DatastoreController` acts as a singleton in-memory store using a JavaScript `Map`, meaning all game state is lost when the server restarts.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
