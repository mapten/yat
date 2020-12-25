import { put } from "redux-saga/effects";
import { Task } from "../../models/task.model";
import * as actions from '../actions';

/**
 * Fetch the tasks from the API
 */
export function* fetchTasksSaga() {
  yield put(actions.task.taskFetchStart());

  try {
    // TODO: set API real endpoint
    const apiEndpoint = ``;
  
    const taskList: Task[] = [];

    yield put(actions.task.taskFetchSuccess(taskList));
  } catch (error) {
    yield put(actions.task.taskFetchError());
    // TODO: log error
  }
}