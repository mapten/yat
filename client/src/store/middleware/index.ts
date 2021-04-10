/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { takeLatest } from 'redux-saga/effects';

// Store
import * as actionTypes from '../../constants/redux-action-types.constants';
import * as taskSaga from './task.saga';

export function* watchTask() {
  yield takeLatest(actionTypes.TASK_FETCH, taskSaga.fetchTasksSaga);
}