import { combineReducers } from 'redux';
import UserReducer from './reducers/UserReducer';

const rootReducer = combineReducers({
  // Add your reducers here
  UserReducer: UserReducer,
});

export default rootReducer;
