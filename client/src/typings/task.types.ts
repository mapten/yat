import * as actionTypes from '../constants/redux-action-types.constants';

type TaskActionTypeKeys = keyof typeof actionTypes;
export type TaskActionType = typeof actionTypes[TaskActionTypeKeys];