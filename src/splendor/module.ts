import Boabab from 'baobab'
import B from './broker'
import './actions/index'
import { RoomModuleReducer as Reducer, RoomModuleValidator as Validator } from 'room-module-types'
import { RoomReducerModule, RoomModuleType } from 'room-module-types'

import { Action as ReducerAction, actionStrings } from './types'

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
  return db.get()
}

function isReducerAction(s: string): s is ReducerAction {
  return actionStrings[s] === 1
}

const validate: Validator<State, Action> = (state, action, {
  userId,
  ownerId,
  context: { players: { players, playerIdMapping } }
}) => {
  const validActionType = isReducerAction(action.type)
  if(!validActionType) {
    return new Error(`Invalid action type: ${action.type}`)
  }
  const actionType: ReducerAction = action.type
  const playerIndex = playerIdMapping[userId]
  const db = new Boabab(state)
  let currentPlayerIndex = db.get(['game', 'current-player'])
  if(currentPlayerIndex === undefined) {
    currentPlayerIndex = -1
  }
  const currentAITurn = db.get(['game-settings', 'player-actors', currentPlayerIndex]) !== 'human'
  if(currentAITurn) {
    return null
  }
  switch(actionType) {
    case 'game/init': {
      if(userId !== ownerId) {
        return new Error('Only owner can init a game')
      } else if(currentPlayerIndex !== -1) {
        return new Error('Game already started')
      } else {
        return null
      }
    }
    case 'game/exit': {
      if(db.get(['game', 'show-summary'])) {
        return null
      }
    }
  }
  if(playerIndex !== currentPlayerIndex) {
    return new Error(`Current active player is ${currentPlayerIndex}`)
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
