import parentPage from "../pages/ParentPage";

class TicketsPage {


    checkUrl(Url) {
        parentPage.checkUrl(Url)
    }

    checkPageTitle(title) {
        parentPage.isPageTitleExist();
        parentPage.checkText(title)
    }

    clickButtonCreateNewTicket() {
        parentPage.clickButton( 'Create new ticket');
    }

    enterTextInToInputUserID(text){
        parentPage.getInput('userIdentifier').eq(1).type(text);
    }

    enterTextInToInputRequestName(text) {
        parentPage.getInput('title').eq(1).type(text);
    }

    selectTopic(text) {
        cy.contains('span', 'Sales department').click();
        return cy.contains('span', text).click();
    }

    enterTextInToInputQuestion(text) {
        cy.get ('[class="ql-editor ql-blank"]').clear().type(text);
    }

    attachFile(name) {
        parentPage.attachFile(name);
    }

    clickButtonSendTicket() {
        parentPage.clickButton(' Send ticket ');
    }

    checkCreateTicket() {
        cy.contains('div', 'Success').invoke('text').should((text) => {
            expect(text).to.eq('Success')
        });
    }

    closeAlert() {
        parentPage.closeAlert();
    }

    getInputRequestNameFin() {
        return cy.get ('#mat-input-4').click();
    }

    selectTopicFin(text) {
        cy.get ('.ng-invalid.ng-dirty > .mat-form-field-type-mat-select > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix').click();
        return cy.contains('span', text).click();
    }

    checkCreateTicketFin() {
        cy.get('.alert__title').invoke('text').should((text) => {
            expect(text).to.eq('Success');
        })
    }

    selectTopicMan(text) {
        cy.get('.ng-invalid.ng-dirty > .mat-form-field-type-mat-select > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix').click();
        return cy.contains('span', text).click();
    }

    getButtonFilterTicket() {
        return cy.contains('span', ' Filter ');
    }
}

export default new TicketsPage();