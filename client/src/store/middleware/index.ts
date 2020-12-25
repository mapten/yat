import { takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../../constants/redux-action-types.constants';
import * as taskSaga from './task.Saga';

export function* watchTask() {
  yield takeLatest(actionTypes.TASK_FETCH, taskSaga.fetchTasksSaga);
}