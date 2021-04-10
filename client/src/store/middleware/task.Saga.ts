/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { put } from 'redux-saga/effects';

// Store
import * as actions from '../actions';

// Models
import { Task } from '../../models/task.model';

/**
 * Fetch the tasks from the API
 */
export function* fetchTasksSaga() {
  yield put(actions.task.taskFetchStart());

  try {
    // TODO: set API endpoint
  
    const taskList: Task[] = [];

    yield put(actions.task.taskFetchSuccess(taskList));
  } catch (error) {
    yield put(actions.task.taskFetchError());
    // TODO: log error
  }
}