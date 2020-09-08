import merchant from "../fixtures/merchant";
import ticket from "../fixtures/ticket"

class TicketsPage {


    getButtonCreateNewTicket() {
        return cy.get ('[class="mat-focus-indicator create-ticket-button mat-raised-button mat-button-base mat-primary"]');
    }

    getInputMerchantID(){
        return cy.get('#mat-input-5').click();
    }

    getInputRequestName() {
        return cy.get ('#mat-input-3').click();
    }

    selectTopic() {
        cy.get ('#mat-select-3 > .mat-select-trigger > .mat-select-arrow-wrapper').click()
        return cy.get ('#mat-option-13 > .mat-option-text').click();
    }

    getInputQuestion() {
        return cy.get ('[class="ql-editor ql-blank"]').click();
    }

    getButtonSelectFile() {
        return cy.get ('.content-wrap > .mat-focus-indicator > .mat-button-wrapper')
    }

    getButtonSendTicket() {
        return cy.get ('.mat-dialog-actions > .mat-focus-indicator')
    }

    checkCreateTicket() {
        cy.get('[class="alert__title ng-tns-c270-0"]').invoke('text').should((text) => {
            expect(text).to.eq('Success')
        })
    }


    closeAllert() {
        return cy.get ('[class="close-alert ng-tns-c270-0"]');
    }

    getInputRequestNameFin() {
        return cy.get ('#mat-input-4').click();
    }

    selectTopicFin() {
        cy.get ('#mat-select-23 > .mat-select-trigger > .mat-select-arrow-wrapper').click()
        return cy.get ('#mat-option-133 > .mat-option-text').click();
    }

    closeAllertFin() {
        return cy.get ('.close-alert');
    }

    checkCreateTicketFin() {
        cy.get('.alert__title').invoke('text').should((text) => {
            expect(text).to.eq('Success')
        })

    }

}

export default new TicketsPage();