import Boabab from 'baobab'
import B from './broker'
import './actions/index'
import { RoomModuleReducer as Reducer, RoomModuleValidator as Validator } from 'room-module-types'
import { RoomReducerModule, RoomModuleType } from 'room-module-types'

import { Action as ReducerAction } from './types'

const dependencies = [ RoomModuleType.Players ]

type State = any

interface Action {
  type: ReducerAction;
  [k: string]: any;
}

const defaultState: State = {}

const reducer: Reducer<State, Action> = (state, action, {
  userId,
  ownerId,
  context: { players: { players, playerIdMapping } }
}) => {
  const db = new Boabab(state, { immutable: false })
  B.transit(db, action.type, action)
  db.set('game-states', [])
  return db.get()
}

function isReducerAction(s: string): s is ReducerAction {
  return s in isReducerAction
}

const validate: Validator<State, Action> = (state, action, {
  userId,
  ownerId,
  context: { players: { players, playerIdMapping } }
}) => {
  const validActionType = isReducerAction(state.type)
  if(!validActionType) {
    return new Error(`Invalid action type: ${state.type}`)
  }
  const actionType: ReducerAction = action.type
  const playerIndex = playerIdMapping[userId]
  const db = new Boabab(state)
  const currentPlayerIndex = db.get(['game', 'current-player']) || -1
  if(playerIndex !== currentPlayerIndex) {
    return new Error(`Current active player is ${currentPlayerIndex}`)
  }
  switch(actionType) {
    case 'game/init': {
      if(userId !== ownerId) {
        return new Error('Only owner can init a game')
      }
      break;
    }
  }
  return null
}

const transformState = (state: State, { userId }) => {
  if(!state || !state.game || !state.game.deck1) {
    return state
  }
  state.game.deck1 = state.game.deck1.length
  state.game.deck2 = state.game.deck2.length
  state.game.deck3 = state.game.deck3.length
  delete state.game['game-states']
  return state
}

const roomModule: RoomReducerModule = {
  defaultState,
  dependencies,
  reducer,
  validate,
  transformState,
}
export default roomModule
