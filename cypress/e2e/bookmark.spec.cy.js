describe('Bookmark Functionality', () => {
  const testJob = {
    id: 'test-job-1',
    title: 'Test Developer Position',
    description: 'This is a test job description',
    location: ['Remote'],
    opType: 'Full-time',
    categories: ['Frontend', 'React'],
    logoUrl: 'https://example.com/logo.png',
    orgName: 'Test Company',
    datePosted: '2023-01-01',
    isBookmarked: false
  };

  beforeEach(() => {
  
    cy.intercept('POST', 'https://akil-backend.onrender.com/bookmarks/test-job-1', {
      statusCode: 200,
      body: {}
    }).as('addBookmark');

    cy.intercept('DELETE', 'https://akil-backend.onrender.com/bookmarks/test-job-1', {
      statusCode: 200,
      body: {}
    }).as('removeBookmark');

  
    cy.session('logged-in-user', () => {
      
    });

 
    cy.visit('/test-page', {
      onBeforeLoad(win) {
        win.localStorage.setItem('session', JSON.stringify({
          user: { name: 'Test User' },
          accessToken: 'test-token'
        }));
      }
    });
  });

  it('should show the bookmark button on job cards', () => {
    cy.get('[data-cy="job-card"]').within(() => {
      cy.get('[data-cy="bookmark-button"]').should('exist');
      cy.get('[data-cy="bookmark-button"] svg').should('exist');
    });
  });

  it('should show login prompt when clicking bookmark while unauthenticated', () => {

 cy.window().then((win) => {
    win.localStorage.clear();
    win.sessionStorage.clear();
  });
  cy.clearCookies();
  

  cy.intercept('GET', '/api/auth/session', {
    statusCode: 200,
    body: { user: null }
  }).as('getSession');


  cy.visit('/test-page', {
    onBeforeLoad(win) {
      win.localStorage.clear();
    }
  });

  
  cy.get('[data-cy="bookmark-button"]').first().click();
  

  cy.contains('Please login to bookmark jobs', { timeout: 10000 })
    .should('be.visible');
  });

it('should toggle bookmark state when clicked', () => {
 
  cy.intercept('GET', '/api/auth/session', {
    statusCode: 200,
    body: {
      user: { name: 'Test User' },
      accessToken: 'test-token',
      expires: '2025-08-15T09:41:17.000Z'
    }
  }).as('getSession');


  cy.intercept('POST', 'https://akil-backend.onrender.com/bookmarks/*', {
    statusCode: 200,
    body: {},
    delay: 1000 
  }).as('addBookmark');


  cy.visit('/test-page');
  cy.wait('@getSession'); 
  cy.get('[data-cy="bookmark-button"]')
    .should('be.visible')
    .and('have.attr', 'data-loading', 'false');
  
 
  cy.get('[data-cy="bookmark-button"]')
    .click()
    .should('have.attr', 'data-loading', 'true'); 
  cy.wait('@addBookmark');

 
  cy.get('[data-cy="bookmark-button"]')
    .should('have.attr', 'data-bookmarked', 'true')
    .and('have.attr', 'data-loading', 'false')
    .and('not.have.attr', 'disabled');
});
  it('should show loading state during API request', () => {
  
  cy.intercept('GET', '/api/auth/session', {
    statusCode: 200,
    body: {
      user: { name: 'Test User' },
      accessToken: 'test-token',
      expires: '2025-08-15T09:41:17.000Z'
    }
  }).as('getSession');

  
  cy.intercept('POST', 'https://akil-backend.onrender.com/bookmarks/test-job-1', (req) => {
    req.reply({
      delay: 1000,
      statusCode: 200,
      body: {}
    });
  }).as('delayedAddBookmark');
  
  
  cy.visit('/test-page');
  cy.wait('@getSession');
  cy.get('[data-cy="bookmark-button"]')
    .first()
    .click()
    .should('be.disabled'); //
  cy.wait('@delayedAddBookmark');

  
  cy.get('[data-cy="bookmark-button"]').should('not.be.disabled');
});
it('should handle bookmark errors gracefully', () => {
  
  cy.intercept('POST', 'https://akil-backend.onrender.com/bookmarks/test-job-1', {
    statusCode: 500,
    body: { message: 'Server error' }
  }).as('failedBookmark');

  
  cy.intercept('GET', '/api/auth/session', {
    statusCode: 200,
    body: { user: { name: 'Test User' } }
  }).as('getSession');
  cy.visit('/test-page');
  cy.wait('@getSession');


  cy.get('[data-cy="bookmark-button"]').first().click();

  
  cy.wait('@failedBookmark');

 
  cy.contains('Server error').should('be.visible');
}); it('should show already bookmarked message when appropriate', () => {

  cy.intercept('GET', '/api/auth/session', {
    statusCode: 200,
    body: {
      user: { name: 'Test User' },
      accessToken: 'test-token',
    }
  }).as('getSession');

  cy.intercept('POST', 'https://akil-backend.onrender.com/bookmarks/test-job-1', {
    statusCode: 409,
    body: { message: 'Already bookmarked' }
  }).as('conflictBookmark');
  

  cy.visit('/test-page');
  cy.wait('@getSession'); 
  cy.get('[data-cy="bookmark-button"]').first().click();
  
 
  cy.wait('@conflictBookmark');

 
  cy.contains('Already bookmarked').should('be.visible');
});
});