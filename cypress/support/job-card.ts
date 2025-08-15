interface TestJob {
  id: string;
  title: string;
  description: string;
  location: string[];
  opType: string;
  categories: string[];
  logoUrl: string;
  orgName: string;
  datePosted: string;
  isBookmarked?: boolean;
}

export const verifyJobCard = (job: TestJob) => {
  cy.get('[data-cy="job-card"]').should('exist');
  cy.get('[data-cy="job-title"]').should('contain', job.title);
  cy.get('[data-cy="job-company-location"]').should('contain', job.orgName);
  cy.get('[data-cy="job-description"]').should('contain', job.description);
  cy.get('[data-cy="job-type"]').should('contain', job.opType);
  job.categories.forEach((category, index) => {
    cy.get(`[data-cy="job-category-${index}"]`).should('contain', category);
  });
};