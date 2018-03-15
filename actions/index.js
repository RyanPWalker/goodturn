import { bindActionCreators } from 'redux'

import * as user from './user';
import * as firebase from './firebase';

let actions = {
  ...user,
  ...firebase
}

export default actions

export function bind(store) {
  Object.assign(actions, bindActionCreators(actions, store.dispatch))
}

