import { should } from 'chai';
import { Task } from '../../src/models/task.model';

describe('Results', () => {
  it('should display a panel with a message when there are no tasks to display', () => {
    cy.intercept('GET', '/api/task', {
      statusCode: 200,
      body: []
    });

    cy.visit('http://localhost:3000');

    cy.dataTestId('noTaskMessage').should('exist');
    cy.dataTestId('taskList').should('not.exist');
  });


  it('should display the task list from server', () => {
    cy.intercept('GET', '/api/task', {
      statusCode: 200,
      fixture: 'apiTasks.json'
    });

    cy.visit('http://localhost:3000');

    cy.dataTestId('noTaskMessage').should('not.exist');
    cy.dataTestId('todoItemDisplay').its('length').should('eq', 6);

    // check that the tasks are rendered correctly

    // pending task
    cy.dataTestId('todoItemDisplay').eq(0).should('have.css', 'border-left-color', 'rgb(250, 104, 0)');
    cy.dataTestId('todoItemDisplay').eq(0).find('input').should('not.to.be.checked');
    cy.dataTestId('todoItemDisplay').eq(0).find('span').should('contain.text', 'Learn to play ukelele');
    cy.dataTestId('todoItemDisplay').eq(0).find('span').should(($span) => {
      expect($span[0].className).not.to.match(/crossed/);
    });

    // finished task
    cy.dataTestId('todoItemDisplay').eq(4).should('have.css', 'border-left-color', 'rgb(250, 0, 0)');
    cy.dataTestId('todoItemDisplay').eq(4).find('input').should('be.checked');
    cy.dataTestId('todoItemDisplay').eq(4).find('span').should('contain.text', 'Buy an ukelele');
    cy.dataTestId('todoItemDisplay').eq(4).find('span').should(($span) => {
      expect($span[0].className).to.match(/crossed/);
    });
  });

  it('should create a new Task and display in the task list', () => {
    cy.intercept('GET', '/api/task', {
      statusCode: 200,
      fixture: 'apiTasks.json'
    });

    cy.intercept('POST', '/api/task', (req) => {
      const taskToUpdate = req.body as Task;
      req.reply({...taskToUpdate, id: '7'});
    });

    cy.visit('http://localhost:3000');

    cy.get('header button').click();

    // check that if the form is not correctly filled, if does not save it
    cy.dataTestId('createTask_inputName').focus().clear();

    cy.get('button').contains('Save').click();

    cy.dataTestId('createTask_inputName').eq(0).should(($input) => {
      expect($input[0].className).to.match(/danger/);
    });

    cy.url().should('include', '/create');

    cy.dataTestId('createTask_inputName').focus().clear().type('new task');
    cy.dataTestId('createTask_prioritySelect').select('3');

    cy.get('button').contains('Save').click();

    cy.wait(6000);

    cy.url().should('include', '/todolist');

    cy.dataTestId('todoItemDisplay').its('length').should('eq', 7);
  });

  it('should edit a Task and display the modified values', () => {
    cy.intercept('GET', '/api/task', {
      statusCode: 200,
      fixture: 'apiTasks.json'
    });

    cy.intercept('PATCH', '/api/task/**', {
      statusCode: 200,
    });

    cy.visit('http://localhost:3000');

    // edit the first item in the list
    cy.dataTestId('todoItemDisplay').eq(0).trigger('mouseover');
    cy.dataTestId('todoItemDisplay').eq(0).find('button').eq(0).click();

    // cancel button
    cy.dataTestId('todoItemEdit').eq(0).find('button').eq(0).click();
    cy.dataTestId('todoItemEdit').should('not.exist');

    // edit again
    cy.dataTestId('todoItemDisplay').eq(0).trigger('mouseover');
    cy.dataTestId('todoItemDisplay').eq(0).find('button').eq(0).click();

    // check that if the form is not correctly filled, id does not save it
    cy.dataTestId('todoItemEdit').eq(0).find('[data-testid="todoItemEdit_InputName"]').focus().clear();

    cy.dataTestId('todoItemEdit').eq(0).find('button').eq(1).click();

    cy.dataTestId('todoItemEdit').eq(0).find('[data-testid="todoItemEdit_InputName"]').eq(0).should(($input) => {
      expect($input[0].className).to.match(/danger/);
    });

    // input some values
    cy.dataTestId('todoItemEdit').eq(0).find('[data-testid="todoItemEdit_InputName"]').focus().clear().type('updated task');
    cy.dataTestId('todoItemEdit').eq(0).dataTestId('todoItemEdit_PrioritySelect').select('1');

    // save the changes
    cy.dataTestId('todoItemEdit').eq(0).find('button').eq(1).click();

    cy.dataTestId('todoItemDisplay').eq(0).find('span').should('contain.text', 'updated task');
    cy.dataTestId('todoItemDisplay').eq(0).should('have.css', 'border-left-color', 'rgb(250, 104, 0)');
  });

  it('should delete a Task', () => {
    cy.intercept('GET', '/api/task', {
      statusCode: 200,
      fixture: 'apiTasks.json'
    });

    cy.intercept('DELETE', '/api/task/**', {
      statusCode: 200,
    });

    cy.visit('http://localhost:3000');

    cy.contains('Paint the wall').should('exist');

    // delete the first item in the list
    cy.dataTestId('todoItemDisplay').eq(2).trigger('mouseover');
    cy.dataTestId('todoItemDisplay').eq(2).find('button').eq(1).click();

    cy.dataTestId('todoItemDisplay').its('length').should('eq', 5);

    cy.contains('Paint the wall').should('not.exist');
  });

  it('should mark a Task as done when clicking on the check', () => {
    cy.intercept('GET', '/api/task', {
      statusCode: 200,
      fixture: 'apiTasks.json'
    });

    cy.intercept('PATCH', '/api/task/**', {
      statusCode: 200,
    });

    cy.visit('http://localhost:3000');

    cy.dataTestId('todoItemDisplay').eq(2).find('input').should('not.to.be.checked');
    cy.dataTestId('todoItemDisplay').eq(2).find('span').should('contain.text', 'Paint the wall');
    cy.dataTestId('todoItemDisplay').eq(2).find('span').should(($span) => {
      expect($span[0].className).not.to.match(/crossed/);
    });

    cy.dataTestId('todoItemDisplay').eq(2).find('input').click({force: true});

    cy.dataTestId('todoItemDisplay').eq(5).find('input').should('be.checked');
    cy.dataTestId('todoItemDisplay').eq(5).find('span').should('contain.text', 'Paint the wall');
    cy.dataTestId('todoItemDisplay').eq(5).find('span').should(($span) => {
      expect($span[0].className).to.match(/crossed/);
    });
  });
});