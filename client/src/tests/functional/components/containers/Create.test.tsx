import React from 'react';
import { render, cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';

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

const mockPriorityLevelsValueGetter = vi.fn();
vi.mock('../../../../constants/priorityLevels.constants', () => ({
  get PRIORITY_LEVELS() {
    return mockPriorityLevelsValueGetter();
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
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
    vi.restoreAllMocks();
    cleanup();
  });

  describe(`<Create/>`, () => {
    let baseProps: Props;

    beforeEach(() => {
      baseProps = {
        onSave: vi.fn(),
      };
    });

    const renderUI = (props: Partial<Props> = {}) => {
      return render(
        <Create {...baseProps} {...props} />
      );
    };

    it(`should load as many options in the select as items are in PRIORITY_LEVELS`, () => {
      // arrange
      // act
      renderUI();

      const options = screen.getByRole('combobox').querySelectorAll('option');

      // assert
      expect(options[0].textContent).toBe('First');
      expect(options[1].textContent).toBe('Second');
    });

    it(`should call to save prop when clicking on save and the form is valid`, async () => {
      // arrange
      renderUI();

      const createTask: Task = {
        id: NEW_TASK_ID,
        displayName: 'foo',
        priority: 0,
        done: false,
      };

      const todoNameInput = screen.getByRole('textbox') as HTMLInputElement;
      fireEvent.change(todoNameInput, { target: { value: 'foo' } });

      const prioritySelect = screen.getByRole('combobox') as HTMLSelectElement;
      fireEvent.change(prioritySelect, { target: { value: 0 } });

      const saveButton = screen.getByRole('button', {name: /Save/i}) as HTMLButtonElement;
      // act
      saveButton.click();

      // assert
      expect(Array.from(todoNameInput.classList).find(f => f.includes('danger'))).toBeFalsy();
      expect(baseProps.onSave).toHaveBeenCalledWith(createTask);
      expect(mockNavigate).toHaveBeenCalledWith('/todolist');
    });

    it(`should redirect to '/todolist' when click on 'Cancel'`, () => {
      // arrange
      const renderResult = renderUI();

      const cancelEditionButton = renderResult.container.querySelector('button:nth-child(1)') as HTMLButtonElement;
      // act
      cancelEditionButton.click();

      // assert
      expect(baseProps.onSave).not.toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/todolist');
    });
  });

  describe('<ConnectedCreate>', () => {
    let store: MockStoreEnhanced<unknown, unknown>;
    const middlewares = [createSagaMiddleware()];
    const mockStore = configureStore(middlewares);

    const renderUI = (partialState: Partial<taskReducer.TaskState> = {}) => {
      store = mockStore({
        task: { ...taskReducer, ...partialState },
      });
      store.dispatch = vi.fn();

      const component = <Provider store={store}>
        <ConnectedCreate />
      </Provider>;

      return render(component);
    };

    it(`should call to onSave when the save button is clicked`, () => {
      // arrange
      const storeProps: Partial<taskReducer.TaskState> = {};

      renderUI(storeProps);

      const todoNameInput = screen.getByRole('textbox') as HTMLInputElement;
      fireEvent.change(todoNameInput, { target: { value: 'foo' } });

      const prioritySelect = screen.getByRole('combobox') as HTMLSelectElement;
      fireEvent.change(prioritySelect, { target: { value: 0 } });

      const saveButton = screen.getByRole('button', {name: /Save/i}) as HTMLButtonElement;

      // act
      fireEvent.click(saveButton);

      const createdTask: Task = {
        id: NEW_TASK_ID,
        displayName: 'foo',
        priority: 0,
        done: false,
      };

      // assert
      expect(store.dispatch).toHaveBeenCalledWith({
        type: TASK_CREATE,
        editTask: createdTask,
      } as taskReducer.TaskActionPartial);
    });
  });
});