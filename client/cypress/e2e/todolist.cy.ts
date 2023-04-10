describe('TodoList', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.iconify.design/*', {
      statusCode: 200,
      fixture: 'fakeIcon.json'
    });

    cy.intercept('POST', 'auth/login', {
      statusCode: 200,
      body: {
        id: '1',
        name: 'user',
        email: 'a@a.a',
        token: 'token',
      }
    });

    cy.intercept('GET', '/token/csrf-token', {
      statusCode: 200,
      body: {
        csrfToken: 'csrftoken'
      }
    });

    cy.intercept('GET', '/task/**', {
      statusCode: 200,
      fixture: 'apiTasks.json'
    });

    cy.intercept('POST', '/task', {
      statusCode: 200,
      body: 'success'
    });

    cy.intercept('PUT', '/task', {
      statusCode: 200,
      body: 'success'
    });

    cy.intercept('DELETE', '/task/**', {
      statusCode: 200,
      body: 'success'
    });

    cy.intercept('PATCH', '/task/**', {
      statusCode: 200,
      body: 'success'
    });

    cy.visit('http://localhost:3000');

    login();

    // As we intercepted the requests to iconify, no icons are displayed, so we need to set the values for icon buttons
    // in order to make them clickable
    cy.dataTestId('todoItemDisplay').get('button[title="Edit"]').invoke('text', 'Edit');
    cy.dataTestId('todoItemDisplay').get('button[title="Delete"]').invoke('text', 'Delete');
  });

  it('displays data from server', () => {
    cy.dataTestId('todoItemDisplay').its('length').should('eq', 3);

    cy.contains('Completed').click();

    cy.dataTestId('todoItemDisplay').its('length').should('eq', 6);
  });

  it('adds a new task', () => {
    cy.dataTestId('todoItemDisplay').its('length').should('eq', 3);
    cy.get('div[role="progressbar"]').should('have.text', '50 %');

    cy.dataTestId('todoItemEdit_InputName').focus().clear().type('new task').trigger('keydown', { keyCode: 13, which: 13 });

    cy.dataTestId('todoItemDisplay').its('length').should('eq', 4);

    cy.get('div[role="progressbar"]').should('have.text', '43 %');
  });

  
  it('edits a task', () => {
    cy.dataTestId('todoItemDisplay').get('button[title="Edit"]').eq(2).click(); // paint the wall task

    cy.dataTestId('todoItemEdit').eq(1).as('editingTask');

    cy.get('@editingTask').find('input').clear().type('paint the entire room');

    cy.get('@editingTask').find('div[role="combobox"]').click();
    cy.get('@editingTask').find('div[role="option"]').eq(0).click();

    cy.get('@editingTask').find('button').contains('Save').click();

    // We edited the third task, and we changed the priority, so now it is the first one
    cy.dataTestId('todoItemDisplay').eq(0).should('have.text', 'paint the entire room');
  });

  it('deletes a task', () => {
    cy.dataTestId('todoItemDisplay').its('length').should('eq', 3);
    cy.get('div[role="progressbar"]').should('have.text', '50 %');
    cy.contains('Paint the wall').should('exist');

    cy.dataTestId('todoItemDisplay').get('button[title="Delete"]').eq(2).click();

    cy.dataTestId('todoItemDisplay').its('length').should('eq', 2);
    cy.get('div[role="progressbar"]').should('have.text', '60 %');
    cy.contains('Paint the wall').should('not.exist');
  });

  it('completes a task', () => {
    cy.dataTestId('todoItemDisplay').its('length').should('eq', 3);
    cy.get('div[role="progressbar"]').should('have.text', '50 %');

    cy.dataTestId('todoItemDisplay').get('div[role="checkbox"]').eq(2).click();
    cy.contains('Paint the wall').should('not.exist');

    cy.dataTestId('todoItemDisplay').its('length').should('eq', 2);
    cy.get('div[role="progressbar"]').should('have.text', '60 %');

    cy.contains('Completed').click();
    cy.contains('Paint the wall').should('exist');
  });
});

const login = () => {
  cy.contains('Hi, Anonymous').trigger('mouseover');
  cy.contains('Login').click();

  cy.get('input[type="email"]').eq(0).focus().type('a@a.a');
  cy.get('input[type="password"]').eq(0).focus().type('11111111');

  cy.get('button').contains('Login').click();
};

const logout = () => {
  cy.contains('Hi, user').trigger('mouseover');
  cy.contains('Logout').click();
};