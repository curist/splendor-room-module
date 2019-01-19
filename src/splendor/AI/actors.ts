import AIs from './index'

export function getActor(db, i) {
  const player = db.get(['game', 'players', i])
  const actorName = player.actor
  if(actorName == 'human') {
    return 'human'
  }
  const winGameScore = db.get(['game-settings', 'win-game-score'])
  const playerCount = db.get(['game-settings', 'player-actors']).length
  // name = 'ai:somename'
  const aiName = actorName.split(':')[1]
  const AI = AIs[aiName]
  if(!AI) {
    return actorName
  }
  const store = db.select('actor-stores', i);
  const ai = new AI(store, i, playerCount, winGameScore)
  ai.isAI = true
  return ai
}

export interface Actor {
  turn(state): object;
  dropResources(state, resources): object;
  pickNoble(state, noble): object;
}
