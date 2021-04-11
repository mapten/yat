import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { toast } from 'react-toastify';

// Store
import * as taskReducer from '../../../../store/reducers/task.reducer';

// Constants
import { NEW_TASK_ID } from '../../../../constants/common';
import { TASK_CREATE } from '../../../../constants/redux-action-types.constants';

// Models
import { Priority } from '../../../../models/priority.model';
import { Task } from '../../../../models/task.model';

// Components
import ConnectedCreate, { Create } from '../../../../components/containers/Create/Create';


const mockPriorityLevelsValueGetter = jest.fn();
jest.mock('../../../../constants/priorityLevels.constants', () => ({
  get PRIORITY_LEVELS() {
    return mockPriorityLevelsValueGetter();
  },
}));

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));


type Props = React.ComponentProps<typeof Create>;

describe('Create', () => {
  beforeEach(() => {
    const fakePriorityLevels: Priority[] = [
      {
        order: 0,
        displayText: 'First',
        displayColor: '#000000',
        isDefaultSelected: false,
      },
      {
        order: 1,
        displayText: 'Second',
        displayColor: '#111111',
        isDefaultSelected: true,
      },
    ];

    mockPriorityLevelsValueGetter.mockReturnValue(fakePriorityLevels);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    cleanup();
  });

  describe(`<Create/>`, () => {
    let baseProps: Props;

    beforeEach(() => {
      baseProps = {
        onSave: jest.fn(),
      };
    });

    const renderUI = (props: Partial<Props> = {}) => {
      return render(<Create {...baseProps} {...props} />);
    };

    it(`should load as many options in the select as items are in PRIORITY_LEVELS`, () => {
      // arrange
      // act
      const renderResult = renderUI();

      const options = renderResult.container.querySelectorAll('select option');

      // assert
      expect(options[0]).toHaveTextContent('First');
      expect(options[1]).toHaveTextContent('Second');
    });

    it(`should display a toast error and the input border in red when saving changes but the todo name is empty`, () => {
      // arrange
      const mockToastifyWarning = jest.spyOn(toast, 'warning');

      const renderResult = renderUI();

      const saveButton = renderResult.container.querySelector('button:nth-child(2)') as HTMLButtonElement;
      // act
      saveButton.click();

      const todoNameInput = renderResult.container.querySelector('input') as HTMLInputElement;

      // assert
      expect(todoNameInput).toHaveClass('danger');
      expect(mockToastifyWarning).toHaveBeenCalledTimes(1);
      expect(baseProps.onSave).not.toHaveBeenCalled();
    });

    it(`should call to save prop when clicking on save and the form is valid`, () => {
      // arrange
      const mockToastifyWarning = jest.spyOn(toast, 'warning');

      const renderResult = renderUI();

      const createTask: Task = {
        id: NEW_TASK_ID,
        displayName: 'foo',
        priority: 1,
        done: false,
      };

      const todoNameInput = renderResult.container.querySelector('input') as HTMLInputElement;
      fireEvent.change(todoNameInput, {target: {value: 'foo'}});

      const prioritySelect = renderResult.container.querySelector('select') as HTMLSelectElement;
      fireEvent.change(prioritySelect, {target: {value: 1}});

      const saveButton = renderResult.container.querySelector('button:nth-child(2)') as HTMLButtonElement;
      // act
      saveButton.click();

      // assert
      expect(todoNameInput).not.toHaveClass('danger');
      expect(mockToastifyWarning).not.toHaveBeenCalled();
      expect(baseProps.onSave).toHaveBeenCalledWith(createTask);
      expect(mockHistoryPush).toHaveBeenCalledWith('/todolist');
    });

    it(`should redirect to '/todolist' when click on 'Cancel'`, () => {
      // arrange
      const renderResult = renderUI();

      const cancelEditionButton = renderResult.container.querySelector('button:nth-child(1)') as HTMLButtonElement;
      // act
      cancelEditionButton.click();

      // assert
      expect(baseProps.onSave).not.toHaveBeenCalled();
      expect(mockHistoryPush).toHaveBeenCalledWith('/todolist');
    });
  });
  describe('<ConnectedCreate>', () => {
    let store: MockStoreEnhanced<unknown, unknown>;
    const middlewares = [createSagaMiddleware()];
    const mockStore = configureStore(middlewares);

    const renderUI = (partialState: Partial<taskReducer.TaskState> = {}) => {
      store = mockStore({
        task: {...taskReducer, ...partialState},
      });
      store.dispatch = jest.fn();

      const component = <Provider store={store}>
        <ConnectedCreate />
      </Provider>;

      return render(component);
    };

    it(`should call to onSave when the save button is clicked`, () => {
      // arrange
      const storeProps: Partial<taskReducer.TaskState> = {};

      const renderResult = renderUI(storeProps);

      const todoNameInput = renderResult.container.querySelector('input') as HTMLInputElement;
      fireEvent.change(todoNameInput, {target: {value: 'foo'}});

      const prioritySelect = renderResult.container.querySelector('select') as HTMLSelectElement;
      fireEvent.change(prioritySelect, {target: {value: 1}});

      const saveButton = renderResult.container.querySelector('button:nth-child(2)') as HTMLButtonElement;

      // act
      saveButton.click();

      const createdTask: Task = {
        id: NEW_TASK_ID,
        displayName: 'foo',
        priority: 1,
        done: false,
      };

      // assert
      expect(store.dispatch).toHaveBeenCalledWith({
        type: TASK_CREATE,
        newTask: createdTask,
      } as taskReducer.TaskActionPartial);
    });
  });
});