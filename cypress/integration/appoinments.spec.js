describe("Appointments", () => {
  beforeEach(() => {
    cy.request("GET", "http://localhost:8001/api/debug/reset");

    cy.visit("/");

    cy.contains("Monday");
  });

  xit("should book an interview", () => {
    cy.contains("Monday").click();
    cy.get("[alt=Add]").click();
    cy.get("[cy-testid='student-name-input']").type("Lydia Miller-Jones");
    cy.get("[alt='Sylvia Palmer']").click();
    cy.get("[cy-testid='save']").click();
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  });

  it("should edit an interview", () => {
    cy.contains(".appointment__card--show", "Archie Cohen");
    cy.get("[alt=Edit]").click({ force: true });
    cy.get("[alt='Tori Malcolm']").click();
    cy.get("[cy-testid='save']").click();
    cy.contains(".appointment__card--show", "Archie Cohen");
    cy.contains(".appointment__card--show", "Tori Malcolm");
  });
  it("should cancel an appointment", () => {
    cy.contains(".appointment__card--show", "Archie Cohen");
    cy.get("[alt=Delete]").click({ force: true });
    cy.get("[cy-testid='button-confirm']").click();
    cy.contains("[cy-testid='loading']", "Deleting");
    cy.contains("[cy-testid='loading']", "Deleting").should("not.exist");
    cy.contains(".appointment__card--show", "Archie Cohen").should("not.exist");
  });
});
