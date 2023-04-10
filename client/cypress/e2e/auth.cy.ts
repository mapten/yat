describe('Auth', () => {
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

    cy.intercept('POST', 'auth/signin', {
      statusCode: 201,
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

    cy.visit('http://localhost:3000');
  });

  it('should login and then logout', () => {
    cy.contains('Hi, Anonymous').trigger('mouseover');
    cy.contains('Login').click();
  
    cy.get('input[type="email"]').eq(0).focus().type('a@a.a');
    cy.get('input[type="password"]').eq(0).focus().type('11111111');
  
    cy.get('button').contains('Login').click();

    cy.get('header').should('contain.text', 'Hi, user');

    cy.get('Hi, user').trigger('mouseover');
    cy.contains('Logout').click();

    cy.get('header').should('contain.text', 'Hi, Anonymous');
  });

  it.only('should register an user', () => {
    cy.contains('Hi, Anonymous').trigger('mouseover');
    cy.contains('Login').click();

    cy.contains('Create an account').click();
  
    cy.get('input[type="text"]').eq(0).focus().type('user');
    cy.get('input[type="email"]').eq(0).focus().type('a@a.a');
    cy.get('input[type="password"]').eq(0).focus().type('11111111');

    cy.contains('Create Account').click();

    cy.get('header').should('contain.text', 'Hi, user');
  });
});