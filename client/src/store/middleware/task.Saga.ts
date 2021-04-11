/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { call, put, select } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

// Store
import * as actions from '../actions';
import { RootState } from '../models/rootState.model';

// Models
import { Task } from '../../models/task.model';

// Constants
import { API_ENDPOINT } from '../../constants/configuration';

// Services
import { getAxiosApiInstance } from '../../services/axios.service';
import { getTaskList, TaskAction } from '../reducers/task.reducer';

/**
 * Fetch the tasks from the API
 */
export function* fetchTasksSaga() {
  yield put(actions.task.taskFetchStart());

  try {
    const apiEndpoint = `${API_ENDPOINT}/task`;

    const response: AxiosResponse<Task[]> =
      yield call(getAxiosApiInstance(apiEndpoint).get, '');

    yield put(actions.task.taskFetchSuccess(response.data));
  } catch (error) {
    yield put(actions.task.taskFetchError());
    toast.error('Error loading tasks from server');
    console.log(error);
  }
}

export function* createTaskSaga(action: TaskAction) {
  yield put(actions.task.taskCreateStart());

  try {
    const apiEndpoint = `${API_ENDPOINT}/task`;

    const response: AxiosResponse<Task> =
      yield call(getAxiosApiInstance(apiEndpoint).post, '', action.newTask);

    yield put(actions.task.taskCreateSuccess(response.data));
    toast.success('Task created successfully');
  } catch (error) {
    yield put(actions.task.taskCreateError());
    toast.error('Error creating a task');
    console.log(error);
  }
}

export function* changeStatusSaga(action: TaskAction) {
  yield put(actions.task.taskChangeStatusStart());

  try {
    const apiEndpoint = `${API_ENDPOINT}/task`;

    yield call(getAxiosApiInstance(apiEndpoint).patch, `/${action.taskId}`, {done: action.done});

    const allTaskSelector = (state: RootState) => getTaskList(state.task);
    const allTasks: Task[] = yield select(allTaskSelector);
    const selectedTaskName = allTasks.find((task) => task.id === action.taskId)?.displayName;

    yield put(actions.task.taskChangeStatusSuccess(action.taskId, action.done));
    toast.success(`Changed task '${selectedTaskName}' status to${!action.done ? ' not' : ''} done`);
  } catch (error) {
    yield put(actions.task.taskChangeStatusError());
    toast.error('Error changing the task status');
    console.log(error);
  }
}