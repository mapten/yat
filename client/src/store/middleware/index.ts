/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { takeEvery, takeLatest } from 'redux-saga/effects';

// Store
import * as actionTypes from '../../constants/redux-action-types.constants';
import * as taskSaga from './task.Saga';

export function* watchTask() {
  yield takeLatest(actionTypes.TASK_FETCH, taskSaga.fetchTasksSaga);
  yield takeEvery(actionTypes.TASK_CREATE, taskSaga.createTaskSaga);
  yield takeEvery(actionTypes.TASK_CHANGE_STATUS, taskSaga.changeStatusSaga);
}