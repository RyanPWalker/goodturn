import { combineReducers } from 'redux';
import * as user from './user.js';
import * as firebase from './firebase.js'

const reducers = { user, firebase }

const transformed = Object.keys(reducers)
  .map(reducerKey => ({
    key: reducerKey,
    item: (state, action) =>
      state === undefined
        ? reducers[reducerKey].initialState
        : typeof reducers[reducerKey][action.type] === 'function'
          ? reducers[reducerKey][action.type](state, action.payload)
          : state
  }))
  .reduce((obj, { key, item }) => Object.assign(obj, { [key]: item }), {})

export default combineReducers(transformed)
