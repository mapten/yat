import { combineReducers } from 'redux';

import { taskReducer } from './task.reducer';

export const rootReducer = combineReducers({
  task: taskReducer,
});